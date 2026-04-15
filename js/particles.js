/*
 * ParticleSystem — Layer 2 (white flow particles)
 *
 * Modes:
 *   'idle'    — canvas active but nothing drawn (waiting for drain spawns)
 *   'drain'   — particles spawned from sphere projection, tributary streams
 *   'flow'    — particles drift downward through full page height,
 *               respawn at top, render via scrollY offset
 *   'orbit'   — registered CTA buttons attract nearby particles into orbits
 *   'finale'  — contact section: spiral convergence → orbit contact buttons
 *   'drift'   — legacy free float fallback
 */

const WHITE     = { r: 232, g: 234, b: 240 };
const COUNT     = 450;
const BASE_SPEED = 0.25;
const WHITE_CSS = `rgb(${WHITE.r}, ${WHITE.g}, ${WHITE.b})`;

// Tributary channels — branching stream paths from sphere drain point
const TRIBUTARIES = [
  { angle: -0.40, gravity: 0.022, wind: -0.012, spread: 18 },
  { angle: -0.15, gravity: 0.028, wind: -0.005, spread: 12 },
  { angle:  0.00, gravity: 0.032, wind:  0.000, spread:  8 },
  { angle:  0.15, gravity: 0.028, wind:  0.005, spread: 12 },
  { angle:  0.40, gravity: 0.022, wind:  0.012, spread: 18 },
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class ParticleSystem {
  constructor() {
    this.canvas    = null;
    this.ctx       = null;
    this.particles = [];
    this.mode      = 'idle';
    this.width     = 0;
    this.height    = 0;
    this._raf      = null;

    // Drain state
    this._drainActive    = 0;  // number of active drain particles

    // Orbit targets
    this._orbitTargets = [];

    // Finale state
    this._finalePhase  = 0;
    this._finaleCx     = 0;
    this._finaleCy     = 0;
    this._finaleTimer  = 0;

    this._mouseX = -9999;
    this._mouseY = -9999;

    this._mouseMoveHandler = null;
    this._resizeHandler    = null;
  }

  // ── Public API ──────────────────────────────────────────────────────

  init() {
    this.canvas    = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.ctx       = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this._resize();
    this._spawn();

    this._resizeHandler = () => this._resize();
    window.addEventListener('resize', this._resizeHandler);

    this._mouseMoveHandler = (e) => {
      this._mouseX = e.clientX;
      this._mouseY = e.clientY;
    };
    window.addEventListener('mousemove', this._mouseMoveHandler);

    this._loop();
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;

    if (mode === 'drain')   this._initDrain();
    if (mode === 'flow')    this._initFlow();
    if (mode === 'orbit')   { /* orbit runs on top of flow; no full reinit */ }
    if (mode === 'finale')  { /* triggerFinale() drives this */ }
  }

  /**
   * Spawn canvas particles at screen positions projected from draining sphere.
   * Called by hero.js each scroll frame during the drain phase.
   * @param {Array<{x:number,y:number}>} positions — viewport-space coordinates
   */
  spawnDrainParticles(positions) {
    for (const pos of positions) {
      if (this._drainActive >= COUNT) break;

      const p = this.particles[this._drainActive];
      const trib = TRIBUTARIES[Math.floor(Math.random() * TRIBUTARIES.length)];

      p.x           = pos.x + (Math.random() - 0.5) * trib.spread;
      p.y           = pos.y + (Math.random() - 0.5) * 4;
      p.vx          = trib.angle * (0.8 + Math.random() * 0.6);
      p.vy          = 0.4 + Math.random() * 0.8;
      p._gravity    = trib.gravity + (Math.random() - 0.5) * 0.008;
      p._tributWind = trib.wind;
      p._windPhase  = Math.random() * Math.PI * 2;
      p._fadeIn     = 0;
      p.alpha       = 0;
      p.radius      = 0.8 + Math.random() * 1.6;
      p._active     = true;
      p._orbiting   = false;
      p._orbitTarget = null;

      this._drainActive++;
    }
  }

  /**
   * Transition from drain streams to full-page flow.
   * Active drain particles keep positions; remaining pool gets distributed.
   */
  transitionToFlow() {
    const pageH = document.body.scrollHeight;
    this.particles.forEach((p, i) => {
      if (i < this._drainActive && p._active) {
        if (!p.vy || p.vy <= 0) p.vy = 0.5 + Math.random() * 1.5;
        p._gravity    = 0.01 + Math.random() * 0.02;
        p._tributWind = 0;
        p._windPhase  = Math.random() * Math.PI * 2;
      } else {
        p.x           = Math.random() * this.width;
        p.y           = Math.random() * pageH;
        p.vx          = (Math.random() - 0.5) * 0.4;
        p.vy          = 0.5 + Math.random() * 1.5;
        p._gravity    = 0.01 + Math.random() * 0.02;
        p._tributWind = 0;
        p._windPhase  = Math.random() * Math.PI * 2;
        p.alpha       = 0.2 + Math.random() * 0.45;
        p._active     = true;
        p._orbiting   = false;
        p._orbitTarget = null;
      }
    });
    this.mode = 'flow';
  }

  /** Register a DOM element as an orbit attractor for nearby particles */
  addOrbitTarget(el) {
    if (!el) return;
    if (this._orbitTargets.find((t) => t.el === el)) return;
    const rect = el.getBoundingClientRect();
    this._orbitTargets.push({
      el,
      cx:    rect.left + rect.width  / 2,
      pageY: rect.top  + rect.height / 2 + window.scrollY, // page-space Y
      particles: new Set(),
      angle: 0,
      _active: true,
    });

    // Attach scroll/resize listeners on first target
    if (this._orbitTargets.length === 1) {
      this._orbitScrollHandler = () => this._refreshOrbitPositions();
      this._orbitResizeHandler = () => this._refreshOrbitPositions();
      window.addEventListener('scroll', this._orbitScrollHandler, { passive: true });
      window.addEventListener('resize', this._orbitResizeHandler);
    }
  }

  /** Remove a DOM element from orbit attractors; release its particles back to flow */
  removeOrbitTarget(el) {
    const idx = this._orbitTargets.findIndex((t) => t.el === el);
    if (idx === -1) return;
    const target = this._orbitTargets[idx];
    target._active = false; // Fix 3: flag inactive instead of O(n) includes check
    target.particles.forEach((p) => {
      p._orbiting = false;
      p._orbitTarget = null;
    });
    this._orbitTargets.splice(idx, 1);

    // Remove scroll/resize listeners when no targets remain
    if (this._orbitTargets.length === 0) {
      if (this._orbitScrollHandler) {
        window.removeEventListener('scroll', this._orbitScrollHandler);
        this._orbitScrollHandler = null;
      }
      if (this._orbitResizeHandler) {
        window.removeEventListener('resize', this._orbitResizeHandler);
        this._orbitResizeHandler = null;
      }
    }
  }

  /** Refresh cached orbit positions on scroll or resize */
  _refreshOrbitPositions() {
    this._orbitTargets.forEach((t) => {
      const rect = t.el.getBoundingClientRect();
      t.cx    = rect.left + rect.width  / 2;
      t.pageY = rect.top  + rect.height / 2 + window.scrollY;
    });
  }

  /**
   * Trigger contact section finale.
   * @param {number} cx  - page-space X of contact section centre
   * @param {number} cy  - page-space Y of contact section centre
   */
  triggerFinale(cx, cy) {
    this._finaleCx    = cx;
    this._finaleCy    = cy;
    this._finalePhase = 1;
    this._finaleTimer = 0;
    this.mode         = 'finale';
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize',    this._resizeHandler);
    window.removeEventListener('mousemove', this._mouseMoveHandler);
    if (this._orbitScrollHandler) window.removeEventListener('scroll', this._orbitScrollHandler);
    if (this._orbitResizeHandler) window.removeEventListener('resize', this._orbitResizeHandler);
    if (this.canvas) this.canvas.remove();
  }

  // ── Private: spawn ──────────────────────────────────────────────────

  _spawn() {
    for (let i = 0; i < COUNT; i++) {
      this.particles.push(this._newParticle());
    }
  }

  _newParticle() {
    return {
      x: 0, y: 0, vx: 0, vy: 0,
      radius:      0.8 + Math.random() * 1.6,
      alpha:       0,
      alphaMin:    0.15,
      alphaMax:    0.75,
      alphaDir:    Math.random() < 0.5 ? 1 : -1,
      alphaSpeed:  0.002 + Math.random() * 0.004,
      _gravity:    0,
      _tributWind: 0,
      _windPhase:  Math.random() * Math.PI * 2,
      _fadeIn:     0,
      _active:     false,
      _orbiting:   false,
      _orbitTarget: null,
    };
  }

  _resize() {
    this.width  = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
  }

  // ── Private: drain mode ─────────────────────────────────────────────

  _initDrain() {
    if (reducedMotion) {
      this._initFlow();
      this.mode = 'flow';
      return;
    }

    this._drainActive = 0;
    this.particles.forEach((p) => {
      p.x       = 0;
      p.y       = 0;
      p.vx      = 0;
      p.vy      = 0;
      p.alpha   = 0;
      p._fadeIn = 0;
      p._active = false;
      p._orbiting    = false;
      p._orbitTarget = null;
      p._tributWind  = 0;
    });
  }

  _updateDrain(ctx) {
    const now = Date.now();

    ctx.fillStyle = WHITE_CSS;

    for (let i = 0; i < this._drainActive; i++) {
      const p = this.particles[i];
      if (!p._active) continue;

      // Tributary stream physics
      p.vy += p._gravity;
      p.vx += p._tributWind + Math.sin(now * 0.0008 + p._windPhase) * 0.008;
      p.x  += p.vx;
      p.y  += p.vy;

      // Fade in over first 25 frames
      if (p._fadeIn < 25) {
        p._fadeIn++;
        p.alpha = Math.min((p._fadeIn / 25) * 0.65, 0.65);
      }

      // Drain particles render in viewport-space (fixed canvas)
      // but store page-space Y for flow transition
      if (p.alpha > 0.01 && p.y > -20 && p.y < this.height + 100) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ── Private: flow mode ──────────────────────────────────────────────

  _initFlow() {
    const pageH = document.body.scrollHeight;
    this.particles.forEach((p) => {
      p.x           = Math.random() * this.width;
      p.y           = Math.random() * pageH;
      p.vx          = (Math.random() - 0.5) * 0.4;
      p.vy          = 0.5 + Math.random() * 1.5;
      p._gravity    = 0.01 + Math.random() * 0.02;
      p._tributWind = 0;
      p._windPhase  = Math.random() * Math.PI * 2;
      p.alpha       = 0.2 + Math.random() * 0.45;
      p._active     = true;
      p._orbiting   = false;
      p._orbitTarget = null;
    });
  }

  _updateFlow(ctx) {
    const pageH   = document.body.scrollHeight;
    const scrollY = window.scrollY;
    const now     = Date.now();

    // Orbit target positions are kept up-to-date via scroll/resize listeners (_refreshOrbitPositions)

    ctx.fillStyle = WHITE_CSS;

    for (const p of this.particles) {
      if (p._orbiting) {
        this._updateOrbitingParticle(p, scrollY, ctx);
        continue;
      }

      // Check proximity to orbit targets (page-space comparison using cached positions)
      let attracted = false;
      for (const target of this._orbitTargets) {
        const dx = p.x - target.cx;
        const dy = p.y - target.pageY; // both page-space
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300 && target.particles.size < 25) {
          p._orbiting    = true;
          p._orbitTarget = target;
          p._orbitAngle  = Math.atan2(p.y - target.pageY, p.x - target.cx);
          p._orbitRadius = 60 + Math.random() * 60;
          p._orbitSpeed  = (0.01 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1);
          target.particles.add(p);
          attracted = true;
          break;
        }
      }
      if (attracted) continue;

      // Normal flow physics
      p.vy += p._gravity;
      p.vx += Math.sin(now * 0.001 + p._windPhase) * 0.015;
      p.x  += p.vx;
      p.y  += p.vy;

      // Respawn at top when fallen below page
      if (p.y > pageH + 100) {
        p.y  = -10;
        p.x  = Math.random() * this.width;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = 0.5 + Math.random() * 1.5;
        p._gravity = 0.01 + Math.random() * 0.02;
      }

      // Alpha: fade in near top of page, fade out near bottom
      const topFade    = Math.min(p.y / 200, 1);
      const bottomFade = Math.max(0, 1 - (p.y - (pageH - 200)) / 200);
      const targetAlpha = 0.55 * topFade * bottomFade;
      p.alpha += (targetAlpha - p.alpha) * 0.05;

      // Only draw if on screen
      const screenY = p.y - scrollY;
      if (screenY < -20 || screenY > this.height + 20) continue;

      if (p.alpha > 0.01) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  _updateOrbitingParticle(p, scrollY, ctx) {
    const target = p._orbitTarget;

    // Check if button is still active and roughly in view (page-space cached position)
    const screenTY = target.pageY - scrollY;
    const inView   = screenTY > -200 && screenTY < this.height + 200;

    if (!inView || !target._active) {
      // Release back to flow
      p._orbiting    = false;
      p._orbitTarget = null;
      target.particles.delete(p);
      // Give it a gentle downward nudge
      p.vy = 0.5 + Math.random();
      return;
    }

    // Circular orbit
    p._orbitAngle += p._orbitSpeed;
    p.x  = target.cx   + Math.cos(p._orbitAngle) * p._orbitRadius;
    p.y  = target.pageY + Math.sin(p._orbitAngle) * p._orbitRadius;
    p.alpha = 0.4 + Math.sin(p._orbitAngle * 3) * 0.15;

    const screenY = p.y - scrollY;
    if (screenY < -20 || screenY > this.height + 20) return;

    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = WHITE_CSS;
    ctx.beginPath();
    ctx.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── Private: finale mode ────────────────────────────────────────────

  _updateFinale(ctx) {
    const scrollY = window.scrollY;
    const now     = Date.now();

    if (this._finalePhase === 1) {
      // Act 1: Spiral convergence (~2 s)
      this._finaleTimer++;
      const progress = Math.min(this._finaleTimer / 120, 1); // 120 frames ≈ 2s
      const cx = this._finaleCx;
      const cy = this._finaleCy;

      ctx.fillStyle = WHITE_CSS;
      for (const p of this.particles) {
        // Spiral toward center
        const dx   = cx - p.x;
        const dy   = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const spd  = Math.min(dist * 0.04, 8);

        // Add tangential component for spiral effect
        const tang = progress * 0.3;
        p.vx = (dx / (dist || 1)) * spd - dy * tang * 0.02;
        p.vy = (dy / (dist || 1)) * spd + dx * tang * 0.02;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = 0.5 + progress * 0.3;

        const screenY = p.y - scrollY;
        if (screenY < -20 || screenY > this.height + 20) continue;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (progress >= 1) {
        this._finalePhase = 2;
        this._finaleTimer = 0;
      }
    } else if (this._finalePhase === 2) {
      // Act 2: Pause (~1.5 s)
      this._finaleTimer++;
      const cx = this._finaleCx;
      const cy = this._finaleCy;

      const pauseDuration  = 90; // frames (~1.5 s at 60fps)
      const jitterDecay    = 1 - this._finaleTimer / pauseDuration; // fades 1→0
      ctx.fillStyle = WHITE_CSS;
      for (const p of this.particles) {
        // Gentle drift in place; jitter magnitude decays to zero by end of pause
        p.x += (cx - p.x) * 0.05 + (Math.random() - 0.5) * 0.5 * jitterDecay;
        p.y += (cy - p.y) * 0.05 + (Math.random() - 0.5) * 0.5 * jitterDecay;
        const screenY = p.y - scrollY;
        if (screenY < -20 || screenY > this.height + 20) continue;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (this._finaleTimer > pauseDuration) { // ~1.5 s
        this._finalePhase = 3;
        this._finaleTimer = 0;
        this._initFinaleOrbit();
      }
    } else if (this._finalePhase === 3) {
      // Act 3: orbit contact buttons — same as flow+orbit
      this._updateFlow(ctx);
    }
  }

  _initFinaleOrbit() {
    // Redistribute particles across orbit targets
    // EMAIL ME gets ~40%, others ~20% each
    if (this._orbitTargets.length === 0) {
      this.transitionToFlow();
      return;
    }

    const weights  = this._orbitTargets.map((_, i) => (i === 0 ? 0.4 : 0.2));
    const total    = weights.reduce((a, b) => a + b, 0);
    let pIdx       = 0;

    this._orbitTargets.forEach((target, ti) => {
      const share = Math.round((weights[ti] / total) * COUNT);
      for (let i = 0; i < share && pIdx < COUNT; i++, pIdx++) {
        const p       = this.particles[pIdx];
        p._orbiting   = true;
        p._orbitTarget = target;
        p._orbitAngle  = Math.random() * Math.PI * 2;
        p._orbitRadius = 60 + Math.random() * 60;
        p._orbitSpeed  = (0.01 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1);
        target.particles.add(p);
      }
    });

    // Any remaining particles go to flow
    for (; pIdx < COUNT; pIdx++) {
      const p     = this.particles[pIdx];
      p._orbiting = false;
      p._orbitTarget = null;
      p.vy = 0.5 + Math.random() * 1.5;
    }

    // Switch to flow mode so _updateFlow handles both orbit + free particles
    this.mode = 'flow';
  }

  // ── Private: drift (legacy default) ────────────────────────────────

  _updateDrift(ctx) {
    ctx.fillStyle = WHITE_CSS;
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha >= p.alphaMax) { p.alpha = p.alphaMax; p.alphaDir = -1; }
      if (p.alpha <= p.alphaMin) { p.alpha = p.alphaMin; p.alphaDir =  1; }
      const buf = p.radius + 2;
      if (p.x < -buf)         p.x = this.width  + buf;
      if (p.x > this.width  + buf) p.x = -buf;
      if (p.y < -buf)         p.y = this.height + buf;
      if (p.y > this.height + buf) p.y = -buf;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── Main loop ───────────────────────────────────────────────────────

  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);

    switch (this.mode) {
      case 'drain':   this._updateDrain(ctx);   break;
      case 'flow':    this._updateFlow(ctx);     break;
      case 'finale':  this._updateFinale(ctx);   break;
      case 'idle':    break;
      case 'drift':
      default:        this._updateDrift(ctx);    break;
    }
  }
}

export const particleSystem = new ParticleSystem();
