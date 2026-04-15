import { heroSphere }    from './sphere.js';

/* ── Hero Section — Animation Orchestrator ──────────────────────
   Cinematic reveal sequence (all timings from page load):
     t = 0 ms   — page dark; only stars visible
     t = 300 ms — sphere begins expanding from a point of light
     t = 300 ms — gold ring 1 launches outward
     t = 700 ms — gold ring 2 launches
     t = 1100ms — gold ring 3 launches
     t = 2100ms — sphere at full size → name fades in letter by letter
     t ≈ 3500ms — tagline line 1 fades in
     t ≈ 4600ms — metrics fade in, countup starts
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

// ── Called when sphere reaches full size (~2.1 s after page load) ──
function _onSphereRevealed() {
  _animateName();
  _animateTagline();      // delay: 1.4 s within function → ~3.5 s total
  _revealMetrics();       // delay: 2.5 s within function → ~4.6 s total
  _initScrollHint();      // delay: 2.0 s within function → ~4.1 s total
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

  // 0.8 s total: 0.1 delay + 16×0.025 stagger + 0.3 duration ≈ 0.8 s
  gsap.from('#hero-name .char:not(.char--space)', {
    opacity: 0,
    y: 18,
    duration: 0.3,
    stagger: 0.025,
    ease: 'power2.out',
    delay: 0.1,
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

  // delay: 0.84 s (1.4 × 0.6); durations/gap also ×0.6
  gsap.timeline({ delay: 0.84 })
    .fromTo(
      '.tagline-main',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' }
    )
    .fromTo(
      '.tagline-sub',
      { opacity: 0 },
      { opacity: 0.7, duration: 0.36, ease: 'power1.out' },
      '+=0.15'
    );
}

// ── Metrics: fade in block, then countup ────────────────────────────
function _revealMetrics() {
  if (reducedMotion) {
    document.querySelector('.hero-metrics').style.opacity = '1';
    _initMetrics();
    return;
  }

  // delay: 1.5 s (2.5 × 0.6); duration: 0.48 s (0.8 × 0.6)
  // Metrics fade completes at ~2.0 s after sphere reveal
  gsap.to('.hero-metrics', {
    opacity: 1,
    duration: 0.48,
    delay: 1.5,
    ease: 'power2.out',
    onComplete: _initMetrics, // start countup once metrics are visible
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
      const label = el.closest('.metric')?.querySelector('.metric-label');
      if (label) label.style.opacity = '1';
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
  const DURATION = 1800;
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
    } else {
      const label = el.closest('.metric')?.querySelector('.metric-label');
      if (label) gsap.to(label, { opacity: 1, duration: 0.4, ease: 'power1.out' });
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

  // Appears 0.5 s after metrics fade finishes (metrics done at ~2.0 s)
  gsap.to(hint, {
    opacity: 0.75,
    duration: 0.8,
    delay: 2.5,
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
