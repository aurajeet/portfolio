/*
 * Performance detection — identifies slow devices and exposes
 * a flag for other modules to check.
 *
 * Heuristics:
 * - navigator.hardwareConcurrency <= 4
 * - navigator.deviceMemory <= 4 (where supported)
 * - Mobile device with low core count
 *
 * When isLow is true, cursor trail and card stagger animations
 * should be disabled. Core cinematic effects (spheres, icon
 * animations) are never touched.
 */

function detectLowPerf() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 8;

  if (cores <= 2) return true;
  if (cores <= 4 && memory <= 4) return true;

  return false;
}

export const perf = {
  isLow: detectLowPerf(),
};
