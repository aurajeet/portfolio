// Shared motion tokens.
//
// The "luxe" easing curve is the single source of truth for framer-motion
// `ease` values across the site. Its CSS counterpart is `--ease-luxe` in
// app/globals.css (used by Tailwind `ease-[var(--ease-luxe)]`); keep the two
// in sync if either changes.
export const EASE_LUXE: [number, number, number, number] = [0.16, 1, 0.3, 1];
