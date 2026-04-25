/**
 * Scroll-reveal: fades elements with class `reveal` to opacity 1
 * when they enter the viewport. Honors prefers-reduced-motion via CSS.
 *
 * Usage: add class="reveal" to any element. Optionally combine with
 * --reveal-delay custom property for stagger.
 */

const REVEAL_THRESHOLD = 0.2;
const REVEAL_ROOT_MARGIN = "0px 0px -10% 0px";

const observer = new IntersectionObserver(
  (entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        obs.unobserve(entry.target);
      }
    }
  },
  { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
);

function init() {
  const targets = document.querySelectorAll(".reveal");
  targets.forEach((el) => observer.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
