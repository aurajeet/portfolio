import { spaceBg }        from './space-bg.js';
import { shootingStars }  from './shooting-stars.js';
import { initHero }       from './hero.js';
import { initSections }   from './sections.js';

import { cursorTrail }    from './cursor-trail.js';
import { progressBar }    from './progress-bar.js';
import { perf }           from './perf.js';
import { PageTransition } from './page-transition.js';
import { aurora }         from './aurora.js';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
} else {
  console.warn('GSAP or ScrollTrigger not loaded — check script order in HTML');
}

document.addEventListener('DOMContentLoaded', () => {
  spaceBg.init();
  const transition = new PageTransition(spaceBg);

  shootingStars.init();

  if (transition.isArriving) {
    setTimeout(() => initHero(), 450);
  } else {
    initHero();
  }

  initSections();

  if (!perf.isLow) cursorTrail.init();
  if (!perf.isLow) aurora.init();
  progressBar.init();
});
