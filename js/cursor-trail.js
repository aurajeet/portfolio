/*
 * Cursor Trail — 8 tiny gold dots that follow the mouse and
 * dissipate within 0.5s. Desktop only (hidden on touch devices).
 * Disabled when prefers-reduced-motion or perf.isLow is true.
 */

const DOT_COUNT = 8;
const FADE_MS = 500;

class CursorTrail {
  constructor() {
    this._dots = [];
    this._positions = [];
    this._raf = null;
    this._mouseX = -100;
    this._mouseY = -100;
    this._active = false;
    this._container = null;
    this._moveHandler = null;
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;

    this._container = document.createElement('div');
    this._container.id = 'cursor-trail';
    document.body.appendChild(this._container);

    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      this._container.appendChild(dot);
      this._dots.push(dot);
      this._positions.push({ x: -100, y: -100, t: 0 });
    }

    this._moveHandler = (e) => {
      this._mouseX = e.clientX;
      this._mouseY = e.clientY;
      if (!this._active) {
        this._active = true;
        this._tick();
      }
    };
    window.addEventListener('mousemove', this._moveHandler, { passive: true });
  }

  _tick() {
    if (!this._active) return;
    this._raf = requestAnimationFrame(() => this._tick());

    const now = performance.now();

    for (let i = DOT_COUNT - 1; i > 0; i--) {
      this._positions[i].x = this._positions[i - 1].x;
      this._positions[i].y = this._positions[i - 1].y;
      this._positions[i].t = this._positions[i - 1].t;
    }
    this._positions[0].x = this._mouseX;
    this._positions[0].y = this._mouseY;
    this._positions[0].t = now;

    let allHidden = true;
    for (let i = 0; i < DOT_COUNT; i++) {
      const p = this._positions[i];
      const age = now - p.t;
      const fade = Math.max(0, 1 - age / FADE_MS);

      if (fade > 0.01) {
        allHidden = false;
        const scale = 0.4 + fade * 0.6;
        const sizeFactor = 1 - i / DOT_COUNT;
        this._dots[i].style.transform =
          `translate(${p.x}px, ${p.y}px) scale(${scale * sizeFactor})`;
        this._dots[i].style.opacity = fade * sizeFactor * 0.7;
      } else {
        this._dots[i].style.opacity = '0';
      }
    }

    if (allHidden) this._active = false;
  }

  destroy() {
    this._active = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._moveHandler) window.removeEventListener('mousemove', this._moveHandler);
    if (this._container) this._container.remove();
  }
}

export const cursorTrail = new CursorTrail();
