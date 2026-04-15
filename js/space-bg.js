import * as THREE from 'three';

/*
 * SpaceBackground — Layer 0
 *
 * Three layers of star particles at different depths, rendered with custom
 * ShaderMaterial for cinematic interstellar effects:
 *
 *   (A) Warp Streaks  — stars elongate into vertical streaks on scroll
 *   (B) Parallax Shift — layers translate at different speeds for depth
 *   (G) Supernova Flash — rare, brief stellar flare on a random far-layer star
 *
 * Subtle continuous twinkle on all particles keeps the field alive.
 */

const VERT = /* glsl */`
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uBaseSize;
  uniform float uPixelRatio;
  uniform float uStreakSensitivity;
  uniform float uFlareIndex;
  uniform float uFlareIntensity;

  attribute vec3 aColor;
  attribute float aFlarePhase;
  attribute float aIndex;

  varying vec3  vColor;
  varying float vStretch;
  varying float vFlare;

  void main() {
    vColor = aColor;

    // Continuous subtle twinkle (±15 % brightness variation)
    float twinkle = 0.85 + 0.15 * sin(uTime * (0.3 + aFlarePhase) + aFlarePhase * 62.83);

    // (G) Supernova — one chosen particle flares with JS-driven intensity
    float isFlaring = step(0.5, 1.0 - abs(aIndex - uFlareIndex));
    float flare = isFlaring * uFlareIntensity;
    vFlare = flare;

    // (A) Warp streak factor from scroll velocity
    float absVel = abs(uScrollVelocity);
    float streakAmount = min(absVel * uStreakSensitivity, 15.0);
    vStretch = streakAmount;

    // Size: base × twinkle × flare boost × streak elongation
    float flareBoost = 1.0 + flare * 3.0;
    float streakScale = 1.0 + streakAmount;
    gl_PointSize = uBaseSize * uPixelRatio * twinkle * flareBoost * streakScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */`
  uniform float uOpacity;

  varying vec3  vColor;
  varying float vStretch;
  varying float vFlare;

  void main() {
    vec2 p = gl_PointCoord - 0.5;

    // (A) Compress X → vertical ellipse when streaking
    float stretch = 1.0 + vStretch;
    p.x *= stretch;

    float dist = length(p);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.1, dist);

    // (G) Flare brightens toward white
    vec3  color      = mix(vColor, vec3(1.0), vFlare * 0.7);
    float finalAlpha = alpha * (uOpacity + vFlare * 0.5);

    gl_FragColor = vec4(color, finalAlpha);
  }
`;

class SpaceBackground {
  constructor() {
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.layers   = [];
    this.clock    = new THREE.Clock();

    this._scrollY        = 0;
    this._prevScrollY    = 0;
    this._smoothVelocity = 0;
    this._lastFrameTime  = 0;

    this._flareProgress  = Infinity;
    this._flareDuration  = 2.9;
    this._nextFlareTime  = 0;

    this._warpOverride = false;
    this._warpTarget   = 0;

    this._reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    this._setupRenderer();
    this._setupScene();
    this._createStarLayers();

    if (!this._reducedMotion) {
      this._initScrollTracking();
      this._nextFlareTime = performance.now() + 15000 + Math.random() * 30000;
    }

    this._resizeHandler = () => this._onResize();
    window.addEventListener('resize', this._resizeHandler);
    this._lastFrameTime = performance.now();
    this._animate();
  }

  /* ── Renderer & scene ──────────────────────────────────────── */

  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x04050a, 1);
    this.renderer.domElement.id = 'space-bg';
    document.body.prepend(this.renderer.domElement);
  }

  _setupScene() {
    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 2000,
    );
    this.camera.position.z = 1;
  }

  /* ── Programmatic warp (page transitions) ─────────────────── */

  enterWarp() {
    if (this._reducedMotion) return;
    this._warpOverride = true;
    this._warpTarget   = 12;
  }

  exitWarp() {
    if (this._reducedMotion) return;
    this._warpOverride   = true;
    this._smoothVelocity = 12;
    this._warpTarget     = 0;
    setTimeout(() => { this._warpOverride = false; }, 900);
  }

  /* ── Scroll tracking (A, B) ────────────────────────────────── */

  _initScrollTracking() {
    this._scrollY = window.scrollY;
    this._prevScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      this._scrollY = window.scrollY;
    }, { passive: true });
  }

  /* ── Star layers ───────────────────────────────────────────── */

  _createStarLayers() {
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);

    const configs = [
      { count: 3000, spread: 1000, size: 0.8, opacity: 0.75, speed: 0.0003,
        cr: 220/255, cg: 225/255, cb: 235/255,
        streakSens: 0.2, parallax: 0.0015 },
      { count: 1500, spread: 600,  size: 1.2, opacity: 0.65, speed: 0.0006,
        cr: 235/255, cg: 230/255, cb: 220/255,
        streakSens: 0.5, parallax: 0.005 },
      { count:  600, spread: 350,  size: 1.6, opacity: 0.55, speed: 0.0010,
        cr: 200/255, cg: 195/255, cb: 185/255,
        streakSens: 1.0, parallax: 0.012 },
    ];

    configs.forEach((cfg, layerIdx) => {
      const geo       = new THREE.BufferGeometry();
      const positions  = new Float32Array(cfg.count * 3);
      const colors     = new Float32Array(cfg.count * 3);
      const phases     = new Float32Array(cfg.count);
      const indices    = new Float32Array(cfg.count);

      for (let i = 0; i < cfg.count; i++) {
        const i3 = i * 3;
        positions[i3]     = (Math.random() - 0.5) * cfg.spread;
        positions[i3 + 1] = (Math.random() - 0.5) * cfg.spread;
        positions[i3 + 2] = (Math.random() - 0.5) * cfg.spread;

        const b = 0.7 + Math.random() * 0.3;
        colors[i3]     = b * cfg.cr;
        colors[i3 + 1] = b * cfg.cg;
        colors[i3 + 2] = b * cfg.cb;

        phases[i]  = Math.random();
        indices[i] = i;
      }

      geo.setAttribute('position',    new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aColor',      new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('aFlarePhase', new THREE.BufferAttribute(phases, 1));
      geo.setAttribute('aIndex',      new THREE.BufferAttribute(indices, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime:              { value: 0 },
          uScrollVelocity:    { value: 0 },
          uBaseSize:          { value: cfg.size },
          uOpacity:           { value: cfg.opacity },
          uPixelRatio:        { value: pixelRatio },
          uStreakSensitivity: { value: cfg.streakSens },
          uFlareIndex:        { value: -1 },
          uFlareIntensity:    { value: 0 },
        },
        vertexShader:   VERT,
        fragmentShader: FRAG,
        transparent:    true,
        depthWrite:     false,
      });

      const points = new THREE.Points(geo, mat);
      points.userData = {
        speed:    cfg.speed,
        parallax: cfg.parallax,
        count:    cfg.count,
      };
      this.scene.add(points);
      this.layers.push(points);
    });
  }

  /* ── Animation loop ────────────────────────────────────────── */

  _animate() {
    this._rafId = requestAnimationFrame(() => this._animate());

    const now = performance.now();
    const dt  = Math.min((now - this._lastFrameTime) / 1000, 0.1);
    const t   = this.clock.getElapsedTime();
    this._lastFrameTime = now;

    if (!this._reducedMotion) {
      this._updateScrollVelocity(dt);
      this._updateFlare(now, dt);
    }

    this.layers.forEach((pts) => {
      const s = pts.userData.speed;
      pts.rotation.x = t * s * 0.4;
      pts.rotation.y = t * s;

      const u = pts.material.uniforms;

      if (!this._reducedMotion) {
        u.uTime.value            = t;
        u.uScrollVelocity.value  = this._smoothVelocity;
        pts.position.y           = this._scrollY * pts.userData.parallax;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  _updateScrollVelocity(dt) {
    if (dt <= 0) return;

    if (this._warpOverride) {
      const lerp = 1 - Math.exp(-dt * 3);
      this._smoothVelocity += (this._warpTarget - this._smoothVelocity) * lerp;
      if (this._warpTarget === 0 && Math.abs(this._smoothVelocity) < 0.05) {
        this._smoothVelocity = 0;
      }
      this._prevScrollY = this._scrollY;
      return;
    }

    const rawVel = (this._scrollY - this._prevScrollY) /
                   (window.innerHeight * dt);
    this._prevScrollY = this._scrollY;

    const smooth = 1 - Math.exp(-dt * 8);
    this._smoothVelocity += (rawVel - this._smoothVelocity) * smooth;

    if (Math.abs(this._smoothVelocity) < 0.3) this._smoothVelocity = 0;
  }

  /* ── Supernova flare (G) ───────────────────────────────────── */

  _updateFlare(now, dt) {
    const far = this.layers[0];
    if (!far) return;

    if (this._flareProgress < this._flareDuration) {
      this._flareProgress += dt;
      const p = this._flareProgress / this._flareDuration;
      const rise = 0.14;                       // 0.4 s rise  / 2.9 s total
      let intensity;
      if (p < rise) {
        intensity = p / rise;
      } else {
        intensity = 1 - (p - rise) / (1 - rise);
      }
      far.material.uniforms.uFlareIntensity.value = Math.max(0, intensity);
    } else {
      far.material.uniforms.uFlareIntensity.value = 0;
      far.material.uniforms.uFlareIndex.value     = -1;
    }

    if (now >= this._nextFlareTime) {
      this._flareProgress = 0;
      far.material.uniforms.uFlareIndex.value =
        Math.floor(Math.random() * far.userData.count);
      this._nextFlareTime = now + 30000 + Math.random() * 30000;
    }
  }

  /* ── Resize & cleanup ──────────────────────────────────────── */

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    const pr = Math.min(window.devicePixelRatio, 1.5);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.layers.forEach((pts) => {
      pts.material.uniforms.uPixelRatio.value = pr;
    });
  }

  destroy() {
    cancelAnimationFrame(this._rafId);
    window.removeEventListener('resize', this._resizeHandler);
    this.renderer.dispose();
  }
}

export const spaceBg = new SpaceBackground();
