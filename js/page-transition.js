/*
 * PageTransition — Smooth transitions between pages.
 *
 * Exit:  fade content → overlay → navigate
 * Enter: overlay visible → overlay fades out
 *
 * Uses sessionStorage('warp-active') to coordinate the handoff between
 * the departing page and the arriving page.
 */

const STORAGE_KEY = 'warp-active';

class PageTransition {
  constructor() {
    this._isExiting = false;
    this._arriving = !!sessionStorage.getItem(STORAGE_KEY);

    this._reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._overlay = document.getElementById('page-transition-overlay');
    if (!this._overlay) {
      this._overlay = document.createElement('div');
      this._overlay.id = 'page-transition-overlay';
      document.body.appendChild(this._overlay);
    }

    this._interceptLinks();

    if (this._arriving) this._handleArrival();
  }

  get isArriving()    { return this._arriving; }
  get entranceDelay() { return this._arriving ? 0.5 : 0; }

  /* ── Exit: current page → overlay → navigate ──────────────────── */

  _interceptLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link || this._isExiting) return;

      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto:') || href.startsWith('tel:') ||
          href.endsWith('.pdf') || link.target === '_blank') return;

      const hrefPath = href.split('?')[0].split('#')[0];
      if (!hrefPath.endsWith('.html')) return;

      e.preventDefault();

      if (this._reducedMotion) {
        sessionStorage.setItem(STORAGE_KEY, '1');
        this._saveScroll();
        this._overlay.style.transition = 'opacity 150ms ease';
        this._overlay.style.opacity = '1';
        this._overlay.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = href; }, 180);
        return;
      }

      this._exit(href);
    });
  }

  _exit(href) {
    this._isExiting = true;
    sessionStorage.setItem(STORAGE_KEY, '1');
    this._saveScroll();

    const content  = document.querySelector('.content, .exp-content');
    const backLink = document.querySelector('.back-link');
    const nav      = document.getElementById('site-nav');

    if (content)  gsap.to(content,  { opacity: 0, duration: 0.25, ease: 'power2.in' });
    if (backLink) gsap.to(backLink, { opacity: 0, duration: 0.2 });
    if (nav)      gsap.to(nav,      { opacity: 0, duration: 0.2 });

    gsap.to(this._overlay, {
      opacity: 1,
      duration: 0.3,
      delay: 0.15,
      ease: 'power2.in',
      onStart:    () => { this._overlay.style.pointerEvents = 'all'; },
      onComplete: () => { window.location.href = href; },
    });
  }

  /* ── Arrival: overlay fade out ────────────────────────────────── */

  _handleArrival() {
    sessionStorage.removeItem(STORAGE_KEY);
    this._restoreScroll();

    if (this._reducedMotion) {
      this._overlay.style.transition = 'opacity 200ms ease';
      this._overlay.style.opacity = '0';
      this._overlay.addEventListener('transitionend', () => {
        this._overlay.style.pointerEvents = 'none';
        this._overlay.classList.remove('active');
      }, { once: true });
      return;
    }

    gsap.to(this._overlay, {
      opacity: 0,
      duration: 0.45,
      delay: 0.15,
      ease: 'power2.out',
      onComplete: () => {
        this._overlay.style.pointerEvents = 'none';
        this._overlay.classList.remove('active');
      },
    });
  }
  /* ── Scroll position persistence ──────────────────────────── */

  _saveScroll() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    sessionStorage.setItem('scroll-' + page, String(window.scrollY));
  }

  _restoreScroll() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const saved = sessionStorage.getItem('scroll-' + page);
    if (saved === null) return;

    sessionStorage.removeItem('scroll-' + page);
    window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }
}

export { PageTransition };
