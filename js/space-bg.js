import * as THREE from 'three';

/*
 * SpaceBackground — Layer 0
 *
 * Three layers of star particles at different depths, rendered with custom
 * ShaderMaterial. Each layer rotates at its own speed with subtle continuous
 * twinkle on all particles to keep the field alive.
 */

const VERT = /* glsl */`
  uniform float uTime;
  uniform float uBaseSize;
  uniform float uPixelRatio;

  attribute vec3 aColor;
  attribute float aPhase;

  varying vec3 vColor;

  void main() {
    vColor = aColor;

    float twinkle = 0.85 + 0.15 * sin(uTime * (0.3 + aPhase) + aPhase * 62.83);

    gl_PointSize = uBaseSize * uPixelRatio * twinkle;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */`
  uniform float uOpacity;

  varying vec3 vColor;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float dist = length(p);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.1, dist);
    gl_FragColor = vec4(vColor, alpha * uOpacity);
  }
`;

class SpaceBackground {
  constructor() {
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.layers   = [];
    this.clock    = new THREE.Clock();

    this._reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    this._setupRenderer();
    this._setupScene();
    this._createStarLayers();

    this._resizeHandler = () => this._onResize();
    window.addEventListener('resize', this._resizeHandler);
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

  /* ── Star layers ───────────────────────────────────────────── */

  _createStarLayers() {
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);

    const configs = [
      { count: 3000, spread: 1000, size: 0.8, opacity: 0.75, speed: 0.0003,
        cr: 220/255, cg: 225/255, cb: 235/255 },
      { count: 1500, spread: 600,  size: 1.2, opacity: 0.65, speed: 0.0006,
        cr: 235/255, cg: 230/255, cb: 220/255 },
      { count:  600, spread: 350,  size: 1.6, opacity: 0.55, speed: 0.0010,
        cr: 200/255, cg: 195/255, cb: 185/255 },
    ];

    configs.forEach((cfg) => {
      const geo       = new THREE.BufferGeometry();
      const positions  = new Float32Array(cfg.count * 3);
      const colors     = new Float32Array(cfg.count * 3);
      const phases     = new Float32Array(cfg.count);

      for (let i = 0; i < cfg.count; i++) {
        const i3 = i * 3;
        positions[i3]     = (Math.random() - 0.5) * cfg.spread;
        positions[i3 + 1] = (Math.random() - 0.5) * cfg.spread;
        positions[i3 + 2] = (Math.random() - 0.5) * cfg.spread;

        const b = 0.7 + Math.random() * 0.3;
        colors[i3]     = b * cfg.cr;
        colors[i3 + 1] = b * cfg.cg;
        colors[i3 + 2] = b * cfg.cb;

        phases[i] = Math.random();
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTime:       { value: 0 },
          uBaseSize:   { value: cfg.size },
          uOpacity:    { value: cfg.opacity },
          uPixelRatio: { value: pixelRatio },
        },
        vertexShader:   VERT,
        fragmentShader: FRAG,
        transparent:    true,
        depthWrite:     false,
      });

      const points = new THREE.Points(geo, mat);
      points.userData = { speed: cfg.speed };
      this.scene.add(points);
      this.layers.push(points);
    });
  }

  /* ── Animation loop ────────────────────────────────────────── */

  _animate() {
    this._rafId = requestAnimationFrame(() => this._animate());

    const t = this.clock.getElapsedTime();

    this.layers.forEach((pts) => {
      const s = pts.userData.speed;
      pts.rotation.x = t * s * 0.4;
      pts.rotation.y = t * s;

      if (!this._reducedMotion) {
        pts.material.uniforms.uTime.value = t;
      }
    });

    this.renderer.render(this.scene, this.camera);
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
