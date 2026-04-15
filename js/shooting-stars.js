/*
 * ShootingStars — Layer 1 (F)
 *
 * Spawns a single shooting star every 10-25 seconds in peripheral viewport
 * zones. Each star is a bright head with a soft gradient trail, visible for
 * 0.6-1.2 s. Uses a lightweight 2D canvas — zero GPU cost when idle.
 *
 * Spawn edges are weighted toward the top of the screen. Paths travel
 * diagonally with a downward bias so they cross the periphery, not the
 * center where text lives.
 */

const SPAWN_MIN   = 10000;
const SPAWN_MAX   = 25000;
const FIRST_MIN   =  5000;
const FIRST_MAX   = 12000;

class ShootingStars {
  constructor() {
    this.canvas = null;
    this.ctx    = null;
    this.stars  = [];
    this._rafId        = null;
    this._spawnTimeout = null;
    this._animating    = false;
    this._lastFrame    = 0;
    this._reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    if (this._reducedMotion) return;
    this._createCanvas();
    this._scheduleNext(FIRST_MIN + Math.random() * (FIRST_MAX - FIRST_MIN));
  }

  /* ── Canvas setup ──────────────────────────────────────────── */

  _createCanvas() {
    this.canvas    = document.createElement('canvas');
    this.canvas.id = 'shooting-stars';
    this._updateSize();
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this._resizeHandler = () => this._updateSize();
    window.addEventListener('resize', this._resizeHandler);
  }

  _updateSize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.canvas.width  = window.innerWidth  * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── Spawn scheduling ──────────────────────────────────────── */

  _scheduleNext(delay) {
    const d = delay ?? SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN);
    this._spawnTimeout = setTimeout(() => {
      this._spawn();
      this._startAnimation();
      this._scheduleNext();
    }, d);
  }

  _spawn() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const edges = [0, 0, 0, 1, 1, 3, 3];
    const edge  = edges[Math.floor(Math.random() * edges.length)];

    let x, y, angle;
    switch (edge) {
      case 0:
        x = w * 0.1 + Math.random() * w * 0.8;
        y = -10;
        angle = Math.PI * (0.2 + Math.random() * 0.6);
        break;
      case 1:
        x = w + 10;
        y = Math.random() * h * 0.6;
        angle = Math.PI * (0.55 + Math.random() * 0.35);
        break;
      default:
        x = -10;
        y = Math.random() * h * 0.6;
        angle = Math.PI * (0.05 + Math.random() * 0.3);
    }

    const speed = 500 + Math.random() * 400;

    this.stars.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      speed,
      trail:      60 + Math.random() * 100,
      life:       0,
      maxLife:     0.6 + Math.random() * 0.6,
      brightness:  0.6 + Math.random() * 0.4,
    });
  }

  /* ── Render loop (only runs while stars are active) ────────── */

  _startAnimation() {
    if (this._animating) return;
    this._animating = true;
    this._lastFrame = performance.now();
    this._tick();
  }

  _tick() {
    const now = performance.now();
    const dt  = Math.min((now - this._lastFrame) / 1000, 0.1);
    this._lastFrame = now;

    const ctx = this.ctx;
    const w   = window.innerWidth;
    const h   = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    this.stars = this.stars.filter((s) => {
      s.life += dt;
      if (s.life >= s.maxLife) return false;

      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const p = s.life / s.maxLife;
      let alpha;
      if (p < 0.08)      alpha = p / 0.08;
      else if (p > 0.55) alpha = 1 - (p - 0.55) / 0.45;
      else                alpha = 1;
      alpha *= s.brightness;

      const dx = s.vx / s.speed;
      const dy = s.vy / s.speed;
      const tailX = s.x - dx * s.trail;
      const tailY = s.y - dy * s.trail;

      // Soft glow behind the trail
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = `rgba(150,180,255,${(alpha * 0.12).toFixed(3)})`;
      ctx.lineWidth   = 5;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // Main trail with gradient
      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0,   `rgba(180,200,240,0)`);
      grad.addColorStop(0.6, `rgba(210,220,245,${(alpha * 0.4).toFixed(3)})`);
      grad.addColorStop(1,   `rgba(240,245,255,${(alpha * 0.9).toFixed(3)})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.lineCap     = 'round';
      ctx.stroke();

      // Bright head
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fill();

      return true;
    });

    if (this.stars.length > 0) {
      this._rafId = requestAnimationFrame(() => this._tick());
    } else {
      ctx.clearRect(0, 0, w, h);
      this._animating = false;
    }
  }

  destroy() {
    clearTimeout(this._spawnTimeout);
    cancelAnimationFrame(this._rafId);
    window.removeEventListener('resize', this._resizeHandler);
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }
}

export const shootingStars = new ShootingStars();
