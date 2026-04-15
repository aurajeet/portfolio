import * as THREE from 'three';

/*
 * HeroSphere — Three.js particle sphere for the hero section.
 *
 * 10,000 white particles (#E8EAF0) distributed using noise-based
 * vein rejection sampling — clusters along great-circle ridges,
 * producing an organic geological / brain-like surface texture.
 *
 * Reveal: sphere expands from a near-zero scale point of light
 * over 1.8 s (power3.out), with 3 gold ripple rings pulsing outward.
 * After reveal, callbacks fire the text animation sequence.
 *
 * Idle: continuous slow Y-axis rotation + per-particle breathing.
 * Mouse: tilt toward cursor + screen-space scatter.
 * Ripple: outward ring wave on click; auto-fires every 5–13 s.
 *
 * Canvas: #sphere-canvas, position:fixed, z-index:2 (above nebula,
 * below #particle-canvas at z:3 and .content at z:4).
 */

// ── Vein axes: 8 random unit vectors (deterministic seed) ───────────
// Each axis defines one family of great-circle "veins".
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

// ── Sphere radius in world units ─────────────────────────────────────
// Camera at z=4, FOV 45° → half-height at z=0 = 4·tan(22.5°) ≈ 1.657 wu
// R=1.45 → sphere diameter=2.9 wu → 2.9/3.314 ≈ 87.5% of viewport height
const SPHERE_R = 1.45;

// ── Vertex shader ─────────────────────────────────────────────────────
const VERT = /* glsl */`
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3  uRippleOrigin;
  uniform float uRippleTime;
  uniform vec2  uMouseNDC;
  uniform float uScatterRadius;
  uniform float uScatterStr;
  uniform float uDrainLevel;

  attribute float aSize;
  attribute float aPhase;

  varying float vDepth;
  varying float vNormY;   // 0 = south pole, 1 = north pole (pre-rotation)

  void main() {
    vec3 pos = position;

    vNormY = normalize(position).y * 0.5 + 0.5;

    float breathAmp = uDrainLevel >= 0.0 ? 0.013 * (1.0 - uDrainLevel * 0.6) : 0.013;
    float breathe = sin(uTime * 0.45 + aPhase) * breathAmp;
    pos *= (1.0 + breathe);

    if (uRippleTime >= 0.0) {
      float ang    = acos(clamp(dot(normalize(pos), uRippleOrigin), -1.0, 1.0));
      float wFront = uRippleTime * 2.0;
      float mask   = 1.0 - smoothstep(wFront - 0.05, wFront + 0.25, ang);
      float tDecay = max(0.0, 1.0 - uRippleTime * 0.5);
      float sFade  = max(0.0, 1.0 - ang * 0.6);
      float wave   = sin(ang * 10.0 - uRippleTime * 5.0) * 0.055;
      pos += normalize(pos) * wave * mask * tDecay * sFade;
    }

    float scatterStr = uDrainLevel >= 0.0 ? uScatterStr * (1.0 - uDrainLevel) : uScatterStr;
    vec4 refClip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vec2 refNDC  = refClip.xy / refClip.w;
    float sDist  = length(uMouseNDC - refNDC);
    if (sDist < uScatterRadius) {
      float force = pow(1.0 - sDist / uScatterRadius, 1.5) * scatterStr;
      pos += normalize(pos) * force;
    }

    vec3 wNormal = normalize(mat3(modelMatrix) * normalize(pos));
    vDepth = 0.5 + 0.5 * wNormal.z;

    vec4 mvPos  = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    gl_PointSize = aSize * uPixelRatio * (3.0 / -mvPos.z);
  }
`;

// ── Fragment shader ───────────────────────────────────────────────────
const FRAG = /* glsl */`
  uniform float uDrainLevel;

  varying float vDepth;
  varying float vNormY;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = dot(uv, uv);
    if (dist > 0.25) discard;

    float edge  = smoothstep(0.25, 0.10, dist);
    float alpha = edge * (0.50 + vDepth * 0.50);

    if (uDrainLevel >= 0.0) {
      // Leading edge at exactly uDrainLevel; 0.08-wide soft trail behind it.
      // At level 0 → drainFade=1 for all particles (no visible change).
      float drainFade = smoothstep(uDrainLevel - 0.08, uDrainLevel, vNormY);
      float globalFade = 1.0 - uDrainLevel * 0.25;
      alpha *= drainFade * globalFade;
    }

    if (alpha < 0.005) discard;
    gl_FragColor = vec4(0.910, 0.918, 0.941, alpha);
  }
`;

// ── HeroSphere ────────────────────────────────────────────────────────
class HeroSphere {
  constructor() {
    this.renderer = null;
    this.scene    = null;
    this.camera   = null;
    this.points   = null;
    this.material = null;
    this.clock    = new THREE.Clock();
    this._rings   = [];

    this._prevT      = 0;
    this._autoRotY   = 0;
    this._rotX       = 0;
    this._rotY       = 0;
    this._targetRotX = 0;
    this._targetRotY = 0;

    this._mouseNDCX = 9999;
    this._mouseNDCY = 9999;

    this._rippleTime = -1;
    this._nextRipple = 6;

    this._raf              = null;
    this._resizeHandler    = null;
    this._mouseMoveHandler = null;
    this._clickHandler     = null;

    // Drain state
    this._draining       = false;
    this._drainLevel     = -1;
    this._maxDrainLevel  = 0;
    this._prevSpawnLevel = 0;
    this._particleNormY  = null;  // precomputed per-particle [0,1] Y
    this._particleCount  = 0;
  }

  // ── Public ─────────────────────────────────────────────────────────

  init() {
    this._setupRenderer();
    this._setupScene();
    this._buildGeometry();
    this._createRings();
    this._setupListeners();
    // Sphere starts as a near-zero-scale point of light
    this.points.scale.set(0.001, 0.001, 0.001);
    this._animate();
  }

  /**
   * Cinematic reveal: sphere expands from point, gold rings pulse outward.
   * @param {function} [onComplete] — fires when sphere reaches full size
   */
  reveal(onComplete) {
    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      // Skip animation: jump straight to final state
      this.points.scale.set(1, 1, 1);
      if (onComplete) onComplete();
      return;
    }

    const maxRingScale = SPHERE_R * 1.2; // rings expand to 120% of sphere radius

    // ── Gold rings: 3 rings, each launching 400 ms apart ────────────
    this._rings.forEach(({ mesh, mat }, i) => {
      gsap.timeline({ delay: 0.3 + i * 0.4 })
        .set(mesh.scale, { x: 0.001, y: 0.001 })
        .set(mat,        { opacity: 0.3 })
        .to(mesh.scale,  { x: maxRingScale, y: maxRingScale,
                           duration: 1.2, ease: 'power2.out' })
        .to(mat,         { opacity: 0, duration: 1.2, ease: 'power1.in' }, '<');
    });

    // ── Sphere expansion: 300 ms delay, 1800 ms ease-out ────────────
    gsap.to(this.points.scale, {
      x: 1, y: 1, z: 1,
      delay:    0.3,
      duration: 1.8,
      ease:     'power3.out',
      onComplete,
    });
  }

  /**
   * Begin the scroll-coupled drain. Reparents canvas to body as fixed,
   * kills reveal rings, enables uDrainLevel in the shader.
   */
  startDrain() {
    this._draining      = true;
    this._maxDrainLevel = 0;
    this._prevSpawnLevel = 0;

    // Kill ring tweens
    this._rings.forEach(({ mesh, mat }) => {
      gsap.killTweensOf(mesh.scale);
      gsap.killTweensOf(mat);
      mesh.visible = false;
    });

    // Reparent canvas from #hero (absolute) to body (fixed) for parallax
    const el = this.renderer.domElement;
    el.remove();
    document.body.appendChild(el);
    el.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'pointer-events:none;display:block;z-index:2;';

    // Resize to viewport
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    // Stop reacting to clicks (no more user ripples during drain)
    window.removeEventListener('click', this._clickHandler);

    // Update resize handler for viewport instead of hero
    window.removeEventListener('resize', this._resizeHandler);
    this._resizeHandler = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      this.camera.aspect = vw / vh;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(vw, vh);
      const dpr = Math.min(window.devicePixelRatio, 2);
      this.renderer.setPixelRatio(dpr);
      this.material.uniforms.uPixelRatio.value = dpr;
    };
    window.addEventListener('resize', this._resizeHandler);

    // Enable drain in shader
    this.material.uniforms.uDrainLevel.value = 0;
  }

  /**
   * Advance the drain. Called on each scroll frame by hero.js.
   * @param {number} level  — raw drain level [0, 1]
   * @returns {Array<{x:number,y:number}>} screen-space spawn positions for canvas particles
   */
  updateDrain(level) {
    if (!this._draining) return [];

    this._maxDrainLevel = Math.max(this._maxDrainLevel, level);
    const dl = this._maxDrainLevel;
    this._drainLevel = dl;

    this.material.uniforms.uDrainLevel.value = dl;

    // Parallax: sphere drifts upward. At dl=1, center ≈ top of viewport.
    const vhWorld = 2 * 4 * Math.tan(22.5 * Math.PI / 180); // ≈ 3.31
    this.points.position.y = dl * vhWorld * 0.45;

    return this._getDrainSpawnPositions(dl);
  }

  /**
   * Drain complete — fade out sphere canvas, dispose GPU.
   */
  completeDrain() {
    this._draining = false;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize',    this._resizeHandler);
    window.removeEventListener('mousemove', this._mouseMoveHandler);

    const el = this.renderer.domElement;
    if (typeof gsap !== 'undefined') {
      gsap.to(el, {
        opacity: 0, duration: 0.6, ease: 'power2.in',
        onComplete: () => { el.remove(); this._disposeGPU(); },
      });
    } else {
      el.remove();
      this._disposeGPU();
    }
  }

  /** Sample sphere particles crossing the drain edge, project to screen. */
  _getDrainSpawnPositions(currentLevel) {
    const prev = this._prevSpawnLevel;
    this._prevSpawnLevel = currentLevel;
    if (currentLevel <= prev) return [];

    const posArr = this.points.geometry.attributes.position.array;
    const count  = this._particleCount;

    // Collect indices in the newly drained band
    const candidates = [];
    for (let i = 0; i < count; i++) {
      const ny = this._particleNormY[i];
      if (ny >= prev && ny < currentLevel) candidates.push(i);
    }
    if (!candidates.length) return [];

    // Target: ~450 canvas particles over full drain → sample proportionally
    const TARGET_TOTAL = 450;
    const bandWidth = currentLevel - prev;
    const targetForBand = Math.max(1, Math.ceil(TARGET_TOTAL * bandWidth));
    const sampleCount = Math.min(targetForBand, candidates.length);

    // Fisher-Yates partial shuffle for sampling
    for (let i = candidates.length - 1; i > 0 && i >= candidates.length - sampleCount; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    this.points.updateMatrixWorld();
    const wm = this.points.matrixWorld;
    const cam = this.camera;
    const vw = this.renderer.domElement.width  / this.renderer.getPixelRatio();
    const vh = this.renderer.domElement.height / this.renderer.getPixelRatio();
    const tmp = new THREE.Vector3();

    const spawns = [];
    const startIdx = candidates.length - sampleCount;
    for (let k = startIdx; k < candidates.length; k++) {
      const i = candidates[k];
      tmp.set(posArr[i*3], posArr[i*3+1], posArr[i*3+2]);
      tmp.applyMatrix4(wm);
      tmp.project(cam);
      spawns.push({
        x: (tmp.x *  0.5 + 0.5) * vw,
        y: (tmp.y * -0.5 + 0.5) * vh,
      });
    }
    return spawns;
  }

  // ── Setup ───────────────────────────────────────────────────────────

  _setupRenderer() {
    const hero = document.getElementById('hero');
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.domElement.id = 'sphere-canvas';
    // position:absolute inside #hero (isolation:isolate stacking context).
    // z-index:-2 sits behind the ::before vignette (z:-1) and all text (z:auto).
    this.renderer.domElement.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;' +
      'pointer-events:none;display:block;z-index:-2;';
    hero.insertAdjacentElement('afterbegin', this.renderer.domElement);
  }

  _setupScene() {
    const hero = document.getElementById('hero');
    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45, hero.clientWidth / hero.clientHeight, 0.1, 100
    );
    this.camera.position.z = 4;
    // R=1.45, FOV=45°, camera at z=4 → sphere diameter ≈ 87.5% viewport height
  }

  // ── Geometry ────────────────────────────────────────────────────────

  _buildGeometry() {
    const COUNT  = 10000;
    const MAX_AT = COUNT * 30;

    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const phases    = new Float32Array(COUNT);

    let filled = 0, attempts = 0;

    while (filled < COUNT && attempts < MAX_AT) {
      attempts++;
      const cosφ  = Math.random() * 2 - 1;
      const θ     = Math.random() * Math.PI * 2;
      const sinφ  = Math.sqrt(Math.max(0, 1 - cosφ * cosφ));
      const x = sinφ * Math.cos(θ);
      const y = cosφ;
      const z = sinφ * Math.sin(θ);

      if (Math.random() < this._veinDensity(x, y, z)) {
        const jr = SPHERE_R * (1 + (Math.random() - 0.5) * 0.018);
        positions[filled * 3    ] = x * jr;
        positions[filled * 3 + 1] = y * jr;
        positions[filled * 3 + 2] = z * jr;
        sizes [filled] = 0.8 + Math.random() * 0.7;
        phases[filled] = Math.random() * Math.PI * 2;
        filled++;
      }
    }

    // Safety fill (rejection rate higher than expected)
    while (filled < COUNT) {
      const cosφ = Math.random() * 2 - 1;
      const θ    = Math.random() * Math.PI * 2;
      const sinφ = Math.sqrt(Math.max(0, 1 - cosφ * cosφ));
      positions[filled * 3    ] = sinφ * Math.cos(θ) * SPHERE_R;
      positions[filled * 3 + 1] = cosφ * SPHERE_R;
      positions[filled * 3 + 2] = sinφ * Math.sin(θ) * SPHERE_R;
      sizes [filled] = 0.8 + Math.random() * 0.7;
      phases[filled] = Math.random() * Math.PI * 2;
      filled++;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases,    1));

    // Precompute normalized Y for CPU-side drain calculations
    this._particleCount = COUNT;
    this._particleNormY = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const len = Math.sqrt(
        positions[i*3]**2 + positions[i*3+1]**2 + positions[i*3+2]**2
      );
      this._particleNormY[i] = (positions[i*3+1] / len) * 0.5 + 0.5;
    }

    this.material = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:          { value: 0 },
        uPixelRatio:    { value: Math.min(window.devicePixelRatio, 2) },
        uRippleOrigin:  { value: new THREE.Vector3(0, 1, 0) },
        uRippleTime:    { value: -1.0 },
        uMouseNDC:      { value: new THREE.Vector2(9999, 9999) },
        uScatterRadius: { value: 0.20 },
        uScatterStr:    { value: 0.07 },
        uDrainLevel:    { value: -1.0 },
      },
      transparent: true,
      depthWrite:  false,
    });

    this.points = new THREE.Points(geo, this.material);
    this.scene.add(this.points);
  }

  /**
   * Vein density function: returns acceptance probability [0,1].
   * Uses ridge noise — 1 − |sin(freq · dot(p, axis))| — per axis.
   * Zero-crossings of each sin term define great circles; power-sharpening
   * makes particles concentrate tightly on those lines.
   */
  _veinDensity(x, y, z) {
    let d = 0;
    for (const [ax, ay, az] of VEIN_AXES) {
      const dot   = ax * x + ay * y + az * z;
      const ridge = 1 - Math.abs(Math.sin(dot * 4.8));
      d += Math.pow(ridge, 5);
    }
    return (d / VEIN_AXES.length) * 0.92 + 0.08;
  }

  // ── Gold reveal rings ────────────────────────────────────────────────

  _createRings() {
    // Thin ring (inner 0.97, outer 1.0) in the XY plane — faces camera at z=4
    const geo = new THREE.RingGeometry(0.97, 1.0, 128);

    for (let i = 0; i < 3; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color:       0xc9a84c,  // rgba(201, 168, 76)
        transparent: true,
        opacity:     0,
        side:        THREE.DoubleSide,
        depthWrite:  false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.set(0.001, 0.001, 1); // start invisible; GSAP expands to SPHERE_R*1.2
      this.scene.add(mesh);
      this._rings.push({ mesh, mat });
    }
  }

  // ── Listeners ──────────────────────────────────────────────────────

  _setupListeners() {
    this._resizeHandler = () => {
      const hero = document.getElementById('hero');
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      const dpr = Math.min(window.devicePixelRatio, 2);
      this.renderer.setPixelRatio(dpr);
      this.material.uniforms.uPixelRatio.value = dpr;
    };
    window.addEventListener('resize', this._resizeHandler);

    this._mouseMoveHandler = (e) => {
      const hero = document.getElementById('hero');
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      this._targetRotY =  ((e.clientX - cx) / (rect.width  / 2)) * 0.45;
      this._targetRotX = -((e.clientY - cy) / (rect.height / 2)) * 0.30;
      this._mouseNDCX  =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      this._mouseNDCY  = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', this._mouseMoveHandler);

    this._clickHandler = (e) => this._fireRippleAtMouse(e.clientX, e.clientY);
    window.addEventListener('click', this._clickHandler);
  }

  // ── Ripple helpers ──────────────────────────────────────────────────

  _fireRippleAtMouse(cx, cy) {
    const hero = document.getElementById('hero');
    const rect = hero.getBoundingClientRect();
    const ndcX =  ((cx - rect.left) / rect.width)  * 2 - 1;
    const ndcY = -((cy - rect.top)  / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);

    const o  = raycaster.ray.origin;
    const d  = raycaster.ray.direction;
    const b2 = o.dot(d);
    const c  = o.dot(o) - SPHERE_R * SPHERE_R;
    const disc4 = b2 * b2 - c;
    if (disc4 < 0) return;

    const t = -b2 - Math.sqrt(disc4);
    if (t < 0) return;

    // World hit → local sphere space (undo Points rotation)
    const hit = o.clone().addScaledVector(d, t);
    const invRot = new THREE.Matrix4()
      .makeRotationFromEuler(this.points.rotation)
      .invert();
    hit.applyMatrix4(invRot).normalize();

    this.material.uniforms.uRippleOrigin.value.copy(hit);
    this._rippleTime = 0;
    this.material.uniforms.uRippleTime.value = 0;
  }

  _fireAutoRipple() {
    const cosφ = Math.random() * 2 - 1;
    const θ    = Math.random() * Math.PI * 2;
    const sinφ = Math.sqrt(Math.max(0, 1 - cosφ * cosφ));
    this.material.uniforms.uRippleOrigin.value.set(
      sinφ * Math.cos(θ), cosφ, sinφ * Math.sin(θ)
    );
    this._rippleTime = 0;
    this.material.uniforms.uRippleTime.value = 0;
  }

  // ── Animation loop ──────────────────────────────────────────────────

  _animate() {
    this._raf = requestAnimationFrame(() => this._animate());
    const t  = this.clock.getElapsedTime();
    const dt = t - this._prevT;
    this._prevT = t;

    // Rotation speed decays during drain
    const rotSpeed = this._draining
      ? 0.0018 * Math.max(0.15, 1 - this._drainLevel * 0.85)
      : 0.0018;
    this._autoRotY = (this._autoRotY + rotSpeed) % (Math.PI * 2);

    // Mouse tilt — reduced during drain
    const tiltLerp = this._draining ? 0.02 : 0.05;
    const tiltTarget = this._draining ? 0.3 : 1;
    this._rotX += (this._targetRotX * tiltTarget - this._rotX) * tiltLerp;
    this._rotY += (this._targetRotY * tiltTarget - this._rotY) * tiltLerp;

    this.points.rotation.x = this._rotX;
    this.points.rotation.y = this._rotY + this._autoRotY;

    const u = this.material.uniforms;
    u.uTime.value = t;
    u.uMouseNDC.value.set(this._mouseNDCX, this._mouseNDCY);

    // Ripple timing
    if (this._rippleTime >= 0) {
      this._rippleTime += dt;
      u.uRippleTime.value = this._rippleTime;
      if (this._rippleTime > 2.8) {
        this._rippleTime = -1;
        u.uRippleTime.value = -1.0;
      }
    }

    // Auto-ripple — disabled during drain
    if (!this._draining && t > this._nextRipple) {
      this._fireAutoRipple();
      this._nextRipple = t + 5 + Math.random() * 8;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // ── Cleanup ─────────────────────────────────────────────────────────

  _disposeGPU() {
    if (this.points) {
      this.points.geometry.dispose();
      this.material.dispose();
    }
    // Ring meshes share one geometry — dispose once, then dispose each material
    if (this._rings.length) this._rings[0].mesh.geometry.dispose();
    this._rings.forEach(({ mat }) => mat.dispose());
    this.renderer.dispose();
  }
}

export const heroSphere = new HeroSphere();
