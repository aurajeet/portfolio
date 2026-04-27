/**
 * Scroll-reveal: fades elements with class `reveal` to opacity 1
 * and translates them up to their final position when they enter
 * the viewport. Honors prefers-reduced-motion via CSS.
 *
 * Sibling stagger (Commit 5b): elements in the same parent are
 * given a per-index `--reveal-delay` so they cascade in instead
 * of all popping at once. CSS consumes it as `transition-delay`.
 *
 * Usage: add class="reveal" to any element. No manual delay
 * markup needed — stagger is applied automatically based on
 * sibling order at init time.
 */

const REVEAL_THRESHOLD = 0.2;
const REVEAL_ROOT_MARGIN = "0px 0px -10% 0px";
const STAGGER_MS = 80;

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

function applyStagger(targets) {
  const groups = new Map();
  for (const el of targets) {
    const parent = el.parentElement;
    if (!parent) continue;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  }
  for (const siblings of groups.values()) {
    if (siblings.length < 2) continue;
    siblings.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${i * STAGGER_MS}ms`);
    });
  }
}

function init() {
  const targets = document.querySelectorAll(".reveal");
  applyStagger(targets);
  targets.forEach((el) => observer.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
