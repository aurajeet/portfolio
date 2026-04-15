import { spaceBg }        from './space-bg.js';
import { perf }           from './perf.js';
import { cursorTrail }    from './cursor-trail.js';
import { PageTransition } from './page-transition.js';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PROJECTS = {
  netflix: {
    title: 'Netflix',
    pdf:   'Assets/Netflix.pdf',
    prototype: null,
  },
  jupiter: {
    title: 'Jupiter "Magic Spends"',
    pdf:   'Assets/Amazon Prime.pdf',
    prototype: null,
  },
  amazon: {
    title: 'Amazon Prime Video',
    pdf:   'Assets/Amazon Prime.pdf',
    prototype: null,
  },
};

document.addEventListener('DOMContentLoaded', () => {
  spaceBg.init();
  new PageTransition(spaceBg);
  if (!perf.isLow) cursorTrail.init();

  const params  = new URLSearchParams(window.location.search);
  const key     = params.get('project');
  const project = key && PROJECTS[key];

  if (!project) {
    window.location.href = 'projects.html';
    return;
  }

  document.getElementById('page-title').textContent =
    `${project.title} — Aurajeet Mahapatra`;
  document.getElementById('viewer-title').textContent = project.title;

  const from     = params.get('from');
  const backLink = document.querySelector('.back-link');
  if (from === 'home') {
    backLink.href = 'index.html';
  }

  const embed    = document.getElementById('pdf-embed');
  const fallback = document.getElementById('viewer-fallback');
  const fbLink   = document.getElementById('fallback-link');

  embed.src    = project.pdf;
  fbLink.href  = project.pdf;

  embed.addEventListener('error', () => {
    embed.style.display    = 'none';
    fallback.style.display = 'flex';
  });

  const cta = document.getElementById('prototype-cta');
  if (project.prototype) {
    cta.href = project.prototype;
  } else {
    cta.removeAttribute('href');
    cta.classList.add('prototype-cta--disabled');
    cta.title = 'Prototype coming soon';
  }

  _animateEntrance();
});

function _animateEntrance() {
  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.from('.viewer-topbar', {
    y: -20,
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
    ease: 'power2.out',
  });

  gsap.from('.viewer-embed-wrap', {
    opacity: 0,
    duration: 0.6,
    delay: 0.35,
    ease: 'power2.out',
  });
}
