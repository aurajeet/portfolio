import { spaceBg } from './space-bg.js';
import { experienceSphere } from './experience-sphere.js';
import { cursorTrail } from './cursor-trail.js';
import { progressBar } from './progress-bar.js';
import { perf } from './perf.js';
import { PageTransition } from './page-transition.js';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ENTRY_COUNT = 4;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let sphereAlive = false;

document.addEventListener('DOMContentLoaded', () => {
  spaceBg.init();
  const transition = new PageTransition(spaceBg);

  const sphereEl = document.getElementById('sphere-viewport');
  if (!perf.isLow && sphereEl) {
    experienceSphere.init(sphereEl);
    sphereAlive = true;
  }
  if (!perf.isLow) cursorTrail.init();
  progressBar.init();

  /* ── Header entrance ──────────────────────────────────── */
  const d = transition.entranceDelay;
  if (!reducedMotion) {
    gsap.from('.exp-label',   { opacity: 0, y: 12, duration: 0.5, delay: 0.2 + d });
    gsap.from('.exp-heading', { opacity: 0, y: 16, duration: 0.6, delay: 0.4 + d });
    gsap.from('.exp-sub',     { opacity: 0, duration: 0.5, delay: 0.7 + d });
  }

  /* ── Scroll hint ──────────────────────────────────────── */
  const hint = document.getElementById('scroll-hint');
  if (hint) {
    if (reducedMotion) {
      hint.style.opacity = '0.6';
    } else {
      gsap.to(hint, { opacity: 0.75, duration: 0.8, delay: 0.6, ease: 'power1.out' });
    }
  }

  /* ── Sphere + header exit (scroll-driven) ─────────────── */
  const body = document.getElementById('exp-body');

  if (!reducedMotion && body) {
    gsap.to('#exp-header', {
      y: -120,
      opacity: 0,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: body,
        start: 'top bottom',
        end: 'top 40%',
        scrub: 0.3,
      },
    });

    if (sphereEl) {
      gsap.to(sphereEl, {
        y: -150,
        opacity: 0,
        scale: 0.92,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: body,
          start: 'top bottom',
          end: 'top 30%',
          scrub: 0.3,
          onLeave: () => {
            if (sphereAlive) {
              experienceSphere.destroy();
              sphereAlive = false;
              sphereEl.style.display = 'none';
            }
          },
        },
      });
    }

    if (hint) {
      ScrollTrigger.create({
        trigger: body,
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to(hint, { opacity: 0, duration: 0.3 }),
      });
    }
  }

  /* ── Card fade-in entrances ───────────────────────────── */
  const cards = document.querySelectorAll('.exp-card');

  if (reducedMotion) {
    cards.forEach((c) => { c.style.opacity = '1'; c.style.transform = 'none'; });
  } else {
    cards.forEach((card) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }

  /* ── Timeline active state (follows which card is in view) */
  const tlNodes = document.querySelectorAll('.exp-tl-node');

  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter:     () => setActiveNode(tlNodes, i),
      onEnterBack: () => setActiveNode(tlNodes, i),
    });
  });

  /* ── Atmosphere bell-curve per card ───────────────────── */
  if (!reducedMotion) {
    cards.forEach((card, i) => {
      const atmo = document.getElementById(`exp-atmo-${i}`);
      if (!atmo) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.6,
        },
      });

      tl.fromTo(atmo,
        { opacity: 0 },
        { opacity: 0.7, duration: 0.35, ease: 'power1.in' }
      );
      tl.to(atmo,
        { opacity: 0, duration: 0.35, ease: 'power1.out' },
        0.65
      );
    });
  }
});

function setActiveNode(nodes, activeIndex) {
  nodes.forEach((node, i) => {
    node.classList.toggle('active', i === activeIndex);
  });
}
