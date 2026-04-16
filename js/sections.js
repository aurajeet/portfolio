/*
 * sections.js — Scroll-triggered animations for all main page sections.
 *
 * Handles:
 *   - Nav backdrop blur on scroll
 *   - Background atmosphere continuous blend (scroll-driven color grading)
 *   - Project card staggered reveal
 *   - AI Fluency heading scale-punch
 *   - About section fade-in
 *   - Contact section reveal
 *
 * Requires: GSAP + ScrollTrigger (loaded via CDN before this module).
 */

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initSections() {
  if (!reducedMotion) _setInitialStates();
  _initNav();
  _initAtmospheres();
  _initProjectCards();
  _initAIFluency();
  _initAbout();
  _initContact();
  _initContactHovers();
}

function _setInitialStates() {
  gsap.set('.ai-heading', { opacity: 0 });
  gsap.set('.ai-tool', { opacity: 0 });
  gsap.set('#contact .section-heading', { opacity: 0 });
  gsap.set('.contact-btn', { opacity: 0 });
}

// ── Nav: transparent → backdrop blur on scroll ──────────────────────

function _initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  try {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 80px',
      onEnterBack: () => nav.classList.remove('scrolled'),
      onLeave:     () => nav.classList.add('scrolled'),
    });
  } catch (_) { /* GSAP unavailable — degrade gracefully */ }

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  function _attachMobileNav() {
    let navShown = false;

    function _onScroll() {
      const scrolled = window.scrollY > 10;
      if (scrolled && !navShown) { nav.classList.add('nav-visible'); navShown = true; }
      else if (!scrolled && navShown) { nav.classList.remove('nav-visible'); navShown = false; }
    }

    window.addEventListener('scroll', _onScroll, { passive: true });

    if (window.scrollY > 10) { nav.classList.add('nav-visible'); navShown = true; }

    return _onScroll;
  }

  function _detachMobileNav(handler) {
    if (handler) window.removeEventListener('scroll', handler);
    nav.classList.remove('nav-visible');
  }

  let activeHandler = null;

  if (mobileQuery.matches) {
    activeHandler = _attachMobileNav();
  }

  mobileQuery.addEventListener('change', (e) => {
    if (e.matches) {
      activeHandler = _attachMobileNav();
    } else {
      _detachMobileNav(activeHandler);
      activeHandler = null;
    }
  });
}

// ── Background atmospheres: continuous scroll-driven blend ───────────
//
// Each atmosphere layer fades in as its section approaches the viewport
// center and fades out as the next section takes over. scrub: true ties
// opacity directly to scroll position — no animation playback, pure
// interpolation. The result is a continuous sunset-like blend.

function _initAtmospheres() {
  if (reducedMotion) return;

  const isMobile = window.innerWidth <= 768;

  // Bell-curve profile for mid-page sections:
  // fade in 35% → hold 30% → fade out 35%
  // On mobile, tighter start/end so glow doesn't stretch over tall sections
  [
    { id: 'atmo-projects', trigger: '#projects' },
    { id: 'atmo-ai',       trigger: '#ai-fluency' },
    { id: 'atmo-about',    trigger: '#about' },
  ].forEach(({ id, trigger }) => {
    const el = document.getElementById(id);
    if (!el || !document.querySelector(trigger)) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: isMobile ? 'top 90%'   : 'top 80%',
        end:   isMobile ? 'bottom 10%' : 'bottom 20%',
        scrub: 0.6,
      },
    });

    tl.fromTo(el,
      { opacity: 0 },
      { opacity: isMobile ? 0.7 : 0.6, duration: 0.35, ease: 'power1.in' }
    );
    tl.to(el,
      { opacity: 0, duration: 0.35, ease: 'power1.out' },
      0.65
    );
  });

  // Contact: fade in and sustain — the arrival destination keeps its glow
  const contactEl = document.getElementById('atmo-contact');
  if (contactEl && document.querySelector('#contact')) {
    gsap.fromTo(contactEl,
      { opacity: 0 },
      {
        opacity: isMobile ? 0.6 : 0.5,
        ease: 'power1.in',
        scrollTrigger: {
          trigger: '#contact',
          start: isMobile ? 'top 110%' : 'top 120%',
          end:   isMobile ? 'top 20%'  : 'top 30%',
          scrub: 0.8,
        },
      }
    );
  }
}

// ── Projects: staggered card reveal ─────────────────────────────────

function _initProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  if (reducedMotion) {
    cards.forEach((c) => { c.style.opacity = '1'; c.style.transform = 'none'; });
    return;
  }

  cards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

// ── AI Fluency: heading scale-punch ─────────────────────────────────

function _initAIFluency() {
  const heading = document.querySelector('.ai-heading');
  if (!heading) return;

  if (reducedMotion) return;

  gsap.fromTo(heading,
    { scale: 1.1, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        once: true,
      },
    }
  );

  const tools = document.querySelectorAll('.ai-tool');
  tools.forEach((tool, i) => {
    gsap.fromTo(tool,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.2 + i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#ai-fluency .ai-tools',
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}

// ── About: single-block fade-in ─────────────────────────────────────

function _initAbout() {
  const body = document.querySelector('.about-body');
  if (!body) return;

  if (reducedMotion) {
    body.style.opacity = '1';
    return;
  }

  gsap.to(body, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%',
      once: true,
    },
  });
}

// ── Contact: heading + buttons reveal ───────────────────────────────

function _initContact() {
  if (reducedMotion) return;

  const heading = document.querySelector('#contact .section-heading');
  if (heading) {
    gsap.fromTo(heading,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 75%',
          once: true,
        },
      }
    );
  }

  const buttons = document.querySelectorAll('.contact-btn');
  buttons.forEach((btn, i) => {
    gsap.fromTo(btn,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.3 + i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#contact .contact-buttons',
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
}

// ── Contact: button hover micro-animations ───────────────────────────

const HOVER_MAP = {
  'btn-email':    'btn-shake',
  'btn-linkedin': 'btn-pulse-glow',
  'btn-resume':   'btn-slide-open',
  'btn-phone':    'btn-vibrate',
};

function _initContactHovers() {
  if (reducedMotion) return;

  Object.entries(HOVER_MAP).forEach(([btnId, animName]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('mouseenter', () => {
      btn.style.animation = `${animName} 0.5s ease`;
    });
    btn.addEventListener('animationend', () => {
      btn.style.animation = '';
    });
  });
}
