import * as THREE from 'three';

/*
 * ExperienceSphere — massive particle sphere positioned as a planet
 * filling the bottom ~60% of the viewport for the experience page.
 *
 * 15,000 vein-sampled particles (same pattern as HeroSphere) at 2×
 * scale, pushed deep below the camera so only the top arc (horizon)
 * is visible — like standing on a planet surface.
 *
 * Scroll-driven dissolve: particles scatter outward per-particle
 * with staggered thresholds for an organic disintegration.
 */

const VEIN_AXES = [
  [ 0.4082,  0.7262,  0.5534],
  [-0.6847,  0.3143,  0.6576],
  [ 0.2714, -0.8932,  0.3612],
  [ 0.8913,  0.1287, -0.4361],
  [-0.1823, -0.4512,  0.8731],
  [ 0.6421, -0.5034, -0.5788],
  [-0.7123, -0.6812,  0.1673],
  [ 0.3341,  0.5523, -0.7632],
];

const SPHERE_R = 1.45;
const PARTICLE_COUNT = 15000;

const VERT = /* glsl */`
uniform float uTime;
uniform float uPixelRatio;
uniform float uDissolve;
uniform vec2  uMouseNDC;
uniform float uScatterRadius;
uniform float uScatterStr;

attribute float aSize;
attribute float aPhase;

varying float vDepth;
varying float vDissolveFade;

void main() {
  vec3 pos = position;

  float breathAmp = 0.013 * (1.0 - uDissolve * 0.5);
  float breathe = sin(uTime * 0.45 + aPhase) * breathAmp;
  pos *= (1.0 + breathe);

  if (uDissolve > 0.0) {
    float particleRand = fract(aPhase * 7.31);
    float scatter = smoothstep(max(0.0, particleRand - 0.3), particleRand + 0.1, uDissolve);
    pos += normalize(pos) * scatter * 2.0;
    pos.x += sin(aPhase * 3.17 + uTime * 0.4) * scatter * 0.4;
    pos.y += cos(aPhase * 2.23 + uTime * 0.3) * scatter * 0.5;
    vDissolveFade = scatter;
  } else {
    vDissolveFade = 0.0;
  }

  float scatterMul = 1.0 - uDissolve;
  vec4 refClip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec2 refNDC  = refClip.xy / refClip.w;
  float sDist  = length(uMouseNDC - refNDC);
  if (sDist < uScatterRadius) {
    float force = pow(1.0 - sDist / uScatterRadius, 1.5) * uScatterStr * scatterMul;
    pos += normalize(pos) * force;
  }

  vec3 wNormal = normalize(mat3(modelMatrix) * normalize(pos));
  vDepth = 0.5 + 0.5 * wNormal.z;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;
  gl_PointSize = aSize * uPixelRatio * (4.5 / -mvPos.z);
}
`;

const FRAG = /* glsl */`
varying float vDepth;
varying float vDissolveFade;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = dot(uv, uv);
  if (dist > 0.25) discard;

  float edge = smoothstep(0.25, 0.10, dist);
  float alpha = edge * (0.50 + vDepth * 0.50);
  alpha *= 1.0 - vDissolveFade;

  if (alpha < 0.005) discard;
  gl_FragColor = vec4(0.910, 0.918, 0.941, alpha);
}
`;

class ExperienceSphere {
  constructor() {
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.points   = null;
    this.material = null;
    this.clock    = new THREE.Clock();

    this._prevT      = 0;
    this._autoRotY   = 0;
    this._rotX       = 0;
    this._rotY       = 0;
    this._targetRotX = 0;
    this._targetRotY = 0;
    this._mouseNDCX  = 9999;
    this._mouseNDCY  = 9999;

    this._dissolve = 0;
    this._raf      = null;
    this._stopped  = false;
    this._container = null;
    this._resizeHandler    = null;
    this._mouseMoveHandler = null;
  }

  init(container) {
    this._container = container;
    this._setupRenderer(container);
    this._setupScene();
    this._buildGeometry();
    this._setupListeners();
    this._animate();
  }

  /**
   * Drive the dissolve from the scroll orchestrator.
   * Dissolve ramps from 0 → 1 over the configured scroll window.
   */
  setDissolve(value) {
    this._dissolve = Math.max(0, Math.min(1, value));
    if (this.material) {
      this.material.uniforms.uDissolve.value = this._dissolve;
    }
  }

  getDissolve() { return this._dissolve; }

  // ── Renderer ──────────────────────────────────────────────────────

  _setupRenderer(container) {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;';
    container.appendChild(this.renderer.domElement);
  }

  _setupScene() {
    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 100
    );
    this.camera.position.set(0, 0, 4);
    this.camera.lookAt(0, -0.3, 0);
  }

  // ── Geometry (identical to HeroSphere vein sampling) ──────────────

  _buildGeometry() {
    const COUNT  = PARTICLE_COUNT;
    const MAX_AT = COUNT * 30;
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const phases    = new Float32Array(COUNT);

    let filled = 0, attempts = 0;
    while (filled < COUNT && attempts < MAX_AT) {
      attempts++;
      const cosP  = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const sinP  = Math.sqrt(Math.max(0, 1 - cosP * cosP));
      const x = sinP * Math.cos(theta);
      const y = cosP;
      const z = sinP * Math.sin(theta);

      if (Math.random() < this._veinDensity(x, y, z)) {
        const jr = SPHERE_R * (1 + (Math.random() - 0.5) * 0.018);
        positions[filled * 3    ] = x * jr;
        positions[filled * 3 + 1] = y * jr;
        positions[filled * 3 + 2] = z * jr;
        sizes [filled] = 1.0 + Math.random() * 0.8;
        phases[filled] = Math.random() * Math.PI * 2;
        filled++;
      }
    }

    while (filled < COUNT) {
      const cosP  = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const sinP  = Math.sqrt(Math.max(0, 1 - cosP * cosP));
      positions[filled * 3    ] = sinP * Math.cos(theta) * SPHERE_R;
      positions[filled * 3 + 1] = cosP * SPHERE_R;
      positions[filled * 3 + 2] = sinP * Math.sin(theta) * SPHERE_R;
      sizes [filled] = 1.0 + Math.random() * 0.8;
      phases[filled] = Math.random() * Math.PI * 2;
      filled++;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases,    1));

    this.material = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:          { value: 0 },
        uPixelRatio:    { value: Math.min(window.devicePixelRatio, 2) },
        uDissolve:      { value: 0 },
        uMouseNDC:      { value: new THREE.Vector2(9999, 9999) },
        uScatterRadius: { value: 0.18 },
        uScatterStr:    { value: 0.06 },
      },
      transparent: true,
      depthWrite:  false,
    });

    this.points = new THREE.Points(geo, this.material);
    this.points.position.y = -2.9;
    this.points.scale.set(2.0, 2.0, 2.0);
    this.scene.add(this.points);
  }

  _veinDensity(x, y, z) {
    let d = 0;
    for (const [ax, ay, az] of VEIN_AXES) {
      const dot = ax * x + ay * y + az * z;
      const ridge = 1 - Math.abs(Math.sin(dot * 4.8));
      d += Math.pow(ridge, 5);
    }
    return (d / VEIN_AXES.length) * 0.92 + 0.08;
  }

  // ── Listeners ─────────────────────────────────────────────────────

  _setupListeners() {
    this._resizeHandler = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      const dpr = Math.min(window.devicePixelRatio, 2);
      this.renderer.setPixelRatio(dpr);
      if (this.material) this.material.uniforms.uPixelRatio.value = dpr;
    };
    window.addEventListener('resize', this._resizeHandler);

    this._mouseMoveHandler = (e) => {
      const rect = this._container.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      this._targetRotY =  ((e.clientX - cx) / (rect.width  / 2)) * 0.25;
      this._targetRotX = -((e.clientY - cy) / (rect.height / 2)) * 0.15;
      this._mouseNDCX  =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      this._mouseNDCY  = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', this._mouseMoveHandler);
  }

  // ── Animation loop ────────────────────────────────────────────────

  _animate() {
    if (this._stopped) return;
    this._raf = requestAnimationFrame(() => this._animate());

    const t  = this.clock.getElapsedTime();
    this._prevT = t;

    const rotSpeed = 0.0015 * Math.max(0.1, 1 - this._dissolve * 0.9);
    this._autoRotY = (this._autoRotY + rotSpeed) % (Math.PI * 2);

    const tiltLerp = 0.04 * (1 - this._dissolve * 0.8);
    this._rotX += (this._targetRotX - this._rotX) * tiltLerp;
    this._rotY += (this._targetRotY - this._rotY) * tiltLerp;

    this.points.rotation.x = this._rotX;
    this.points.rotation.y = this._rotY + this._autoRotY;

    const u = this.material.uniforms;
    u.uTime.value = t;
    u.uMouseNDC.value.set(this._mouseNDCX, this._mouseNDCY);

    this.renderer.render(this.scene, this.camera);

    if (this._dissolve >= 1 && !this._stopped) {
      this._stopped = true;
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────────

  destroy() {
    this._stopped = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._resizeHandler)    window.removeEventListener('resize',    this._resizeHandler);
    if (this._mouseMoveHandler) window.removeEventListener('mousemove', this._mouseMoveHandler);
    if (this.points) {
      this.points.geometry.dispose();
      this.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}

export const experienceSphere = new ExperienceSphere();
