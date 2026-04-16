import { heroSphere }    from './sphere.js';

/* ── Hero Section — Animation Orchestrator ──────────────────────
   Cinematic reveal sequence (all timings from page load):
     t = 0 ms   — page dark; only stars visible
     t = 150 ms — sphere begins expanding + gold ring 1
     t = 400 ms — gold ring 2
     t = 650 ms — gold ring 3
     t ≈ 1150ms — sphere at full size → role label fades in
     t ≈ 1250ms — name fades in letter by letter
     t ≈ 1650ms — positioning statement fades up
     t ≈ 1900ms — skill tags stagger in
     t ≈ 2200ms — metrics + context fade in, countup starts
     t ≈ 2700ms — scroll hint appears
   ──────────────────────────────────────────────────────────────── */

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHero() {
  gsap.set('#hero-name',        { opacity: 0 });
  gsap.set('.hero-role-label',  { opacity: 0 });
  gsap.set('.hero-positioning', { opacity: 0 });
  gsap.set('.hero-skill-tag',   { opacity: 0 });
  gsap.set('.hero-metrics',     { opacity: 0 });
  gsap.set('.metrics-context',  { opacity: 0 });

  heroSphere.init();
  heroSphere.reveal(_onSphereRevealed);

  _initSphereFade();
}

function _onSphereRevealed() {
  _animateRoleLabel();
  _animateName();
  _animatePositioning();
  _animateSkillTags();
  _revealMetrics();
  _initScrollHint();
}

// ── Role label: quick fade-in, first thing after sphere ─────────────
function _animateRoleLabel() {
  if (reducedMotion) {
    const el = document.querySelector('.hero-role-label');
    if (el) el.style.opacity = '1';
    return;
  }

  gsap.to('.hero-role-label', {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
}

// ── Name: letter-by-letter fade-up ──────────────────────────────────
function _animateName() {
  const nameEl = document.getElementById('hero-name');
  if (!nameEl) return;

  const text = nameEl.textContent.trim();
  nameEl.innerHTML = [...text]
    .map((c) =>
      c === ' '
        ? '<span class="char char--space" aria-hidden="true"> </span>'
        : `<span class="char" aria-hidden="true">${c}</span>`
    )
    .join('');

  gsap.set('#hero-name', { opacity: 1 });

  if (reducedMotion) return;

  gsap.from('#hero-name .char:not(.char--space)', {
    opacity: 0,
    y: 18,
    duration: 0.25,
    stagger: 0.02,
    ease: 'power2.out',
    delay: 0.1,
  });
}

// ── Positioning statement: fade-up ──────────────────────────────────
function _animatePositioning() {
  if (reducedMotion) {
    const el = document.querySelector('.hero-positioning');
    if (el) el.style.opacity = '1';
    return;
  }

  gsap.to('.hero-positioning', {
    opacity: 0.9,
    y: 0,
    duration: 0.35,
    delay: 0.5,
    ease: 'power2.out',
  });
  gsap.set('.hero-positioning', { y: 12 });
}

// ── Skill tags: left-to-right stagger ───────────────────────────────
function _animateSkillTags() {
  if (reducedMotion) {
    document.querySelectorAll('.hero-skill-tag')
      .forEach((el) => (el.style.opacity = '1'));
    return;
  }

  gsap.to('.hero-skill-tag', {
    opacity: 1,
    y: 0,
    duration: 0.3,
    stagger: 0.07,
    delay: 0.75,
    ease: 'power2.out',
  });
  gsap.set('.hero-skill-tag', { y: 8 });
}

// ── Metrics: fade in block + context line, then countup ─────────────
function _revealMetrics() {
  if (reducedMotion) {
    const m = document.querySelector('.hero-metrics');
    const c = document.querySelector('.metrics-context');
    if (m) m.style.opacity = '1';
    if (c) c.style.opacity = '0.7';
    _initMetrics();
    return;
  }

  gsap.to('.hero-metrics', {
    opacity: 1,
    duration: 0.35,
    delay: 1.0,
    ease: 'power2.out',
    onComplete: _initMetrics,
  });

  gsap.to('.metrics-context', {
    opacity: 0.7,
    duration: 0.3,
    delay: 1.05,
    ease: 'power2.out',
  });
}

// ── Metrics: IntersectionObserver countup ───────────────────────────
function _initMetrics() {
  const numbers = document.querySelectorAll('.metric-number');

  if (reducedMotion) {
    numbers.forEach((el) => {
      const target   = parseFloat(el.dataset.target);
      const suffix   = el.dataset.suffix   || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = decimals > 0
        ? target.toFixed(decimals) + suffix
        : target + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        _countUp(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  numbers.forEach((el) => observer.observe(el));
}

function _countUp(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix   || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const DURATION = 1000;
  let   startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / DURATION, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = eased * target;
    el.textContent = decimals > 0
      ? current.toFixed(decimals) + suffix
      : Math.floor(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// ── Scroll hint: fades in after full sequence ───────────────────────
function _initScrollHint() {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;

  if (reducedMotion) {
    hint.style.opacity = '0.6';
    return;
  }

  gsap.to(hint, {
    opacity: 0.75,
    duration: 0.6,
    delay: 1.5,
    ease: 'power1.out',
  });
}

// ── Sphere fade — gentle opacity fade as user scrolls past hero ─────
function _initSphereFade() {
  if (reducedMotion) return;

  const sphereCanvas = document.getElementById('sphere-canvas');
  if (!sphereCanvas) return;

  gsap.to(sphereCanvas, {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'center center',
      end:   'bottom top',
      scrub: 0.4,
    },
  });
}
