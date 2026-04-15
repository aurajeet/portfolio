/*
 * Scroll Progress Bar — thin vertical gold line on the right edge.
 * Fills top-to-bottom as the user scrolls. Pulses briefly at 100%.
 */

class ProgressBar {
  constructor() {
    this._bar = null;
    this._fill = null;
    this._pulsed = false;
    this._scrollHandler = null;
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this._bar = document.createElement('div');
    this._bar.id = 'scroll-progress';

    this._fill = document.createElement('div');
    this._fill.id = 'scroll-progress-fill';

    this._bar.appendChild(this._fill);
    document.body.appendChild(this._bar);

    this._scrollHandler = () => this._update();
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    this._update();
  }

  _update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;

    this._fill.style.height = `${progress * 100}%`;

    if (progress >= 0.995 && !this._pulsed) {
      this._pulsed = true;
      this._fill.classList.add('pulse');
    } else if (progress < 0.99 && this._pulsed) {
      this._pulsed = false;
      this._fill.classList.remove('pulse');
    }
  }

  destroy() {
    if (this._scrollHandler) window.removeEventListener('scroll', this._scrollHandler);
    if (this._bar) this._bar.remove();
  }
}

export const progressBar = new ProgressBar();
