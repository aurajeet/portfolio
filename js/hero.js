import { heroSphere }    from './sphere.js';

/* ── Hero Section — Animation Orchestrator ──────────────────────
   Cinematic reveal sequence (all timings from page load):
     t = 0 ms   — page dark; only stars visible
     t = 150 ms — sphere begins expanding + gold ring 1
     t = 400 ms — gold ring 2
     t = 650 ms — gold ring 3
     t ≈ 1150ms — sphere at full size → name fades in letter by letter
     t ≈ 1550ms — tagline fades in
     t ≈ 1850ms — metrics + labels fade in, countup starts
     t ≈ 2350ms — scroll hint appears
   ──────────────────────────────────────────────────────────────── */

const reducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHero() {
  // ── Dark initial state: only name + metrics need hiding ──────────
  // (taglines are already opacity:0 from hero.css)
  gsap.set('#hero-name',    { opacity: 0 });
  gsap.set('.hero-metrics', { opacity: 0 });

  heroSphere.init();
  heroSphere.reveal(_onSphereRevealed);

  _initSphereFade();
}

// ── Called when sphere reaches full size (~1.15 s after page load) ──
function _onSphereRevealed() {
  _animateName();
  _animateTagline();
  _revealMetrics();
  _initScrollHint();
}

// ── Name: letter-by-letter fade-up ──────────────────────────────────
function _animateName() {
  const nameEl = document.getElementById('hero-name');
  if (!nameEl) return;

  const text = nameEl.textContent.trim();
  // aria-label in HTML preserves screen-reader text after innerHTML swap
  nameEl.innerHTML = [...text]
    .map((c) =>
      c === ' '
        ? '<span class="char char--space" aria-hidden="true"> </span>'
        : `<span class="char" aria-hidden="true">${c}</span>`
    )
    .join('');

  // Ensure the name wrapper itself is visible first
  gsap.set('#hero-name', { opacity: 1 });

  if (reducedMotion) return;

  gsap.from('#hero-name .char:not(.char--space)', {
    opacity: 0,
    y: 18,
    duration: 0.25,
    stagger: 0.02,
    ease: 'power2.out',
    delay: 0.05,
  });
}

// ── Tagline: two-part sequential fade ───────────────────────────────
function _animateTagline() {
  if (reducedMotion) {
    const main = document.querySelector('.tagline-main');
    const sub  = document.querySelector('.tagline-sub');
    if (main) main.style.opacity = '1';
    if (sub)  sub.style.opacity  = '0.7';
    return;
  }

  gsap.timeline({ delay: 0.4 })
    .fromTo(
      '.tagline-main',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    )
    .fromTo(
      '.tagline-sub',
      { opacity: 0 },
      { opacity: 0.7, duration: 0.25, ease: 'power1.out' },
      '+=0.08'
    );
}

// ── Metrics: fade in block, then countup ────────────────────────────
function _revealMetrics() {
  if (reducedMotion) {
    document.querySelector('.hero-metrics').style.opacity = '1';
    _initMetrics();
    return;
  }

  gsap.to('.hero-metrics', {
    opacity: 1,
    duration: 0.35,
    delay: 0.7,
    ease: 'power2.out',
    onComplete: _initMetrics,
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

// ── Scroll hint: fades in 2 s after reveal ──────────────────────────
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
    delay: 1.2,
    ease: 'power1.out',
  });
}

// ── Sphere fade — gentle opacity fade as user scrolls past hero ──────
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
