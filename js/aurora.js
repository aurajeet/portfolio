/*
 * Aurora — Volumetric aurora borealis for the Contact section.
 *
 * Each curtain band is rendered as 3 sub-layers (halo → glow → core)
 * producing wide, diffuse light that overlaps and blends additively.
 * Vertical rays within each band create the characteristic striation
 * texture of real aurora. 4-layer sine displacement with irrational
 * frequency ratios ensures motion never exactly repeats.
 *
 * Depth parameter per band drives parallax-like scaling of speed,
 * amplitude, opacity, and vertical reach — creating a 3D feel without
 * actual 3D math.
 *
 * Canvas has CSS filter:blur(3px) for natural softening. Additive
 * compositing (globalCompositeOperation:'lighter') makes overlapping
 * regions glow brighter, like real light.
 */

const BANDS_DESKTOP = [
  { depth: 0.25, baseX: 0.35, halfW: 0.34, color: [50, 160, 180], rays: 8,  peakY: 0.55,
    f1: 0.0019, s1: 0.10, a1: 95,  f2: 0.0047, s2: 0.06, a2: 45,
    f3: 0.0008, s3: 0.16, a3: 130, f4: 0.0073, s4: 0.035, a4: 18, alpha: 0.045 },

  { depth: 0.50, baseX: 0.55, halfW: 0.28, color: [30, 215, 115], rays: 14, peakY: 0.42,
    f1: 0.0027, s1: 0.13, a1: 75,  f2: 0.0053, s2: 0.08, a2: 36,
    f3: 0.0012, s3: 0.19, a3: 105, f4: 0.0067, s4: 0.045, a4: 14, alpha: 0.055 },

  { depth: 0.75, baseX: 0.18, halfW: 0.30, color: [35, 230, 125], rays: 16, peakY: 0.63,
    f1: 0.0031, s1: 0.16, a1: 65,  f2: 0.0043, s2: 0.11, a2: 30,
    f3: 0.0015, s3: 0.22, a3: 85,  f4: 0.0079, s4: 0.055, a4: 12, alpha: 0.065 },

  { depth: 1.00, baseX: 0.78, halfW: 0.26, color: [25, 205, 145], rays: 12, peakY: 0.35,
    f1: 0.0023, s1: 0.19, a1: 55,  f2: 0.0059, s2: 0.13, a2: 26,
    f3: 0.0010, s3: 0.25, a3: 75,  f4: 0.0083, s4: 0.065, a4: 9, alpha: 0.06 },
];

const BANDS_MOBILE = [
  { depth: 0.25, baseX: 0.45, halfW: 0.40, color: [50, 160, 180], rays: 6,  peakY: 0.55,
    f1: 0.0019, s1: 0.10, a1: 70,  f2: 0.0047, s2: 0.06, a2: 35,
    f3: 0.0008, s3: 0.16, a3: 95,  f4: 0.0073, s4: 0.035, a4: 14, alpha: 0.040 },

  { depth: 0.50, baseX: 0.50, halfW: 0.35, color: [30, 215, 115], rays: 10, peakY: 0.42,
    f1: 0.0027, s1: 0.13, a1: 55,  f2: 0.0053, s2: 0.08, a2: 28,
    f3: 0.0012, s3: 0.19, a3: 80,  f4: 0.0067, s4: 0.045, a4: 10, alpha: 0.050 },

  { depth: 0.75, baseX: 0.40, halfW: 0.36, color: [35, 230, 125], rays: 10, peakY: 0.63,
    f1: 0.0031, s1: 0.16, a1: 50,  f2: 0.0043, s2: 0.11, a2: 22,
    f3: 0.0015, s3: 0.22, a3: 65,  f4: 0.0079, s4: 0.055, a4: 9,  alpha: 0.055 },

  { depth: 1.00, baseX: 0.60, halfW: 0.32, color: [25, 205, 145], rays: 8,  peakY: 0.35,
    f1: 0.0023, s1: 0.19, a1: 42,  f2: 0.0059, s2: 0.13, a2: 20,
    f3: 0.0010, s3: 0.25, a3: 55,  f4: 0.0083, s4: 0.065, a4: 7,  alpha: 0.050 },
];

function _getBands() {
  return window.innerWidth <= 768 ? BANDS_MOBILE : BANDS_DESKTOP;
}

let BANDS = _getBands();

const SUB_LAYERS = [
  { wMul: 3.5, aMul: 0.15 },
  { wMul: 2.0, aMul: 0.40 },
  { wMul: 1.0, aMul: 1.00 },
];

const VERT_COVERAGE = 0.82;
const MAX_OPACITY = 0.7;
const Y_STEP = 5;

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class Aurora {
  constructor() {
    this.canvas  = null;
    this.ctx     = null;
    this._raf    = null;
    this._active = false;
    this._opacity = 0;
    this._targetOpacity = 0;
    this._width  = 0;
    this._height = 0;
  }

  init() {
    if (reducedMotion) return;

    this.canvas    = document.createElement('canvas');
    this.canvas.id = 'aurora-canvas';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this._resize();

    this._resizeHandler = () => this._resize();
    window.addEventListener('resize', this._resizeHandler);

    this._initScrollTrigger();
    this._loop();
  }

  _resize() {
    this._width  = window.innerWidth;
    this._height = window.innerHeight;
    this.canvas.width  = this._width;
    this.canvas.height = this._height;
    BANDS = _getBands();
  }

  _initScrollTrigger() {
    const contact = document.getElementById('contact');
    if (!contact || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 130%',
      end:   'top 40%',
      onUpdate: (self) => {
        this._targetOpacity = self.progress * MAX_OPACITY;
        if (self.progress > 0.01) this._active = true;
      },
      onLeaveBack: () => { this._targetOpacity = 0; },
    });
  }

  /* ── Render loop ────────────────────────────────────────────── */

  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());

    this._opacity += (this._targetOpacity - this._opacity) * 0.025;

    if (this._opacity < 0.005) {
      if (this._active && this._targetOpacity === 0) this._active = false;
      return;
    }

    const { ctx, _width: w, _height: h } = this;
    const t  = performance.now() / 1000;
    const aH = h * VERT_COVERAGE;

    ctx.clearRect(0, 0, w, h);

    for (const band of BANDS) {
      this._drawBand(ctx, band, t, w, aH);
    }
  }

  /* ── Band: 3 sub-layers (halo/glow/core) + vertical rays ──── */

  _drawBand(ctx, b, t, w, aH) {
    const bandW = b.halfW * w;
    const [r, g, bl] = b.color;
    const pulse = 0.82 + 0.18 * Math.sin(t * 0.25 + b.depth * 4.7);

    for (const layer of SUB_LAYERS) {
      const lw = bandW * layer.wMul;
      const baseAlpha = b.alpha * layer.aMul * this._opacity * pulse;

      ctx.beginPath();

      for (let y = 0; y <= aH; y += Y_STEP) {
        const cx = b.baseX * w + this._displace(y, t, b);
        if (y === 0) ctx.moveTo(cx - lw, 0);
        else         ctx.lineTo(cx - lw, y);
      }

      const cxBot = b.baseX * w + this._displace(aH, t, b);
      ctx.lineTo(cxBot, aH);

      for (let y = aH; y >= 0; y -= Y_STEP) {
        const cx = b.baseX * w + this._displace(y, t, b);
        ctx.lineTo(cx + lw, y);
      }

      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, aH);
      const pk = b.peakY;
      grad.addColorStop(0,                                `rgba(${r},${g},${bl}, 0)`);
      grad.addColorStop(pk * 0.4,                         `rgba(${r},${g},${bl}, ${baseAlpha * 0.12})`);
      grad.addColorStop(pk * 0.7,                         `rgba(${r},${g},${bl}, ${baseAlpha * 0.35})`);
      grad.addColorStop(pk,                               `rgba(${r},${g},${bl}, ${baseAlpha})`);
      grad.addColorStop(Math.min(pk + 0.10, 0.95),        `rgba(${r},${g},${bl}, ${baseAlpha * 0.45})`);
      grad.addColorStop(Math.min(pk + (1 - pk) * 0.5, 0.98), `rgba(${r},${g},${bl}, ${baseAlpha * 0.12})`);
      grad.addColorStop(1,                                `rgba(${r},${g},${bl}, 0)`);

      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'lighter';
    this._drawRays(ctx, b, t, w, aH);
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ── Vertical rays (striations within band) ─────────────────── */

  _drawRays(ctx, b, t, w, aH) {
    const bandW = b.halfW * w;
    const cx0   = b.baseX * w;
    const [r, g, bl] = b.color;

    for (let i = 0; i < b.rays; i++) {
      const seed    = b.baseX * 1000 + i * 137.508;
      const xOff    = (this._hash(seed) - 0.5) * bandW * 1.8;
      const hMul    = 0.45 + this._hash(seed + 1) * 0.55;
      const rayA    = (0.03 + this._hash(seed + 2) * 0.055) * this._opacity;
      const rayW    = 1.2 + this._hash(seed + 3) * 3.0;
      const swayAmt = 0.15 + this._hash(seed + 4) * 0.35;
      const rayH    = aH * hMul;
      const phaseOff = this._hash(seed + 5) * 6.28;

      const grad = ctx.createLinearGradient(0, 0, 0, rayH);
      grad.addColorStop(0,    `rgba(${r},${g},${bl}, 0)`);
      grad.addColorStop(0.12, `rgba(${r},${g},${bl}, ${rayA * 0.3})`);
      grad.addColorStop(0.30, `rgba(${r},${g},${bl}, ${rayA})`);
      grad.addColorStop(0.60, `rgba(${r},${g},${bl}, ${rayA * 0.65})`);
      grad.addColorStop(1,    `rgba(${r},${g},${bl}, 0)`);
      ctx.fillStyle = grad;

      ctx.beginPath();
      for (let y = 0; y <= rayH; y += Y_STEP) {
        const dx = this._displace(y, t, b) + xOff
                 + Math.sin(y * 0.007 + t * 0.25 + phaseOff) * 10 * swayAmt;
        if (y === 0) ctx.moveTo(cx0 + dx, 0);
        else         ctx.lineTo(cx0 + dx, y);
      }
      for (let y = rayH; y >= 0; y -= Y_STEP) {
        const dx = this._displace(y, t, b) + xOff
                 + Math.sin(y * 0.007 + t * 0.25 + phaseOff) * 10 * swayAmt;
        ctx.lineTo(cx0 + dx + rayW, y);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  /* ── 4-layer sine displacement (organic, never repeats) ────── */

  _displace(y, t, b) {
    const d = 0.3 + b.depth * 0.7;
    return Math.sin(y * b.f1 + t * b.s1) * b.a1 * d
         + Math.sin(y * b.f2 + t * b.s2) * b.a2 * d
         + Math.sin(y * b.f3 + t * b.s3) * b.a3 * d
         + Math.sin(y * b.f4 + t * b.s4) * b.a4 * d;
  }

  /* ── Deterministic hash (consistent ray positions per frame) ── */

  _hash(n) {
    let x = Math.sin(n) * 43758.5453;
    return x - Math.floor(x);
  }

  destroy() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._resizeHandler);
    if (this.canvas) this.canvas.remove();
  }
}

export const aurora = new Aurora();
