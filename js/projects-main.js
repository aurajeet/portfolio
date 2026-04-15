import { spaceBg } from './space-bg.js';
import { cursorTrail } from './cursor-trail.js';
import { progressBar } from './progress-bar.js';
import { perf } from './perf.js';
import { PageTransition } from './page-transition.js';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  spaceBg.init();
  const transition = new PageTransition(spaceBg);

  if (!perf.isLow) cursorTrail.init();
  progressBar.init();

  if (reducedMotion) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    return;
  }

  /* ── Header entrance ─────────────────────────────────────── */
  const d = transition.entranceDelay;
  gsap.from('.projects-header .section-label', { opacity: 0, y: 12, duration: 0.5, delay: 0.2 + d });
  gsap.from('.projects-header .section-heading', { opacity: 0, y: 16, duration: 0.6, delay: 0.4 + d });
  gsap.from('.projects-header .section-sub', { opacity: 0, duration: 0.5, delay: 0.6 + d });

  /* ── Card stagger on scroll ──────────────────────────────── */
  const cards = document.querySelectorAll('.projects-grid .project-card');
  const skipStagger = perf.isLow;

  cards.forEach((card, i) => {
    const targetOpacity = card.classList.contains('project-card--placeholder') ? 0.55 : 1;

    if (skipStagger) {
      card.style.opacity = targetOpacity;
      card.style.transform = 'none';
      return;
    }

    gsap.to(card, {
      opacity: targetOpacity,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      },
      delay: (i % 3) * 0.1,
    });
  });
});
