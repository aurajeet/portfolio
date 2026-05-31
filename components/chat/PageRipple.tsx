"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

interface PageRippleProps {
  // Increment to fire one ripple. Driven by the drawer-open count, so each
  // time the chat opens a fresh ripple sweeps the page.
  fireKey: number;
}

// One-shot "ocean ripple" that sweeps across the whole page the instant the
// chat drawer starts opening — soft blurred rings riding a flowing iridescent
// wash, expanding from the pill and fading as they travel. Full-viewport,
// fixed, non-interactive, and layered ABOVE the drawer/nav so it's visible
// from the first frame and reaches every corner. Self-unmounts when it ends
// and renders nothing under `prefers-reduced-motion`.
export function PageRipple({ fireKey }: PageRippleProps) {
  const reduced = useReducedMotion();
  // Last fireKey whose run finished — set from the animationend handler
  // (event handler, not an effect), so no setState-in-effect.
  const [doneKey, setDoneKey] = useState(0);

  const playing = fireKey > 0 && fireKey !== doneKey;
  if (reduced || !playing) return null;

  return (
    <div
      key={fireKey}
      aria-hidden="true"
      className="page-ripple"
      onAnimationEnd={(e) => {
        // All finite layers share a 2.6s duration and end together; the
        // infinite spin never fires `animationend`. First finite end unmounts.
        if (e.animationName.startsWith("pr-") && e.animationName !== "pr-spin") {
          setDoneKey(fireKey);
        }
      }}
    >
      <span className="pr-origin">
        <span className="pr-wave" />
        <span className="pr-ring" />
        <span className="pr-ring pr-ring-2" />
      </span>

      <style jsx>{`
        @property --pr-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .page-ripple {
          position: fixed;
          inset: 0;
          /* Below the drawer and nav (both z-50) so the sweep washes the page
             but never tints the drawer. pointer-events stays off, so it never
             blocks interaction. */
          z-index: 49;
          overflow: hidden;
          pointer-events: none;
        }

        /* Origin anchor ≈ the pill, bottom-right. Tunable. */
        .pr-origin {
          position: absolute;
          right: 5rem;
          bottom: 2.5rem;
          width: 0;
          height: 0;
        }

        .pr-wave,
        .pr-ring {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          opacity: 0;
          transform: scale(0);
          will-change: transform, opacity;
        }

        /* Flowing iridescent wash. Sized in vmax so it scales to fill any
           viewport; blur is pre-transform so it softens as the disc grows. */
        .pr-wave {
          width: 16vmax;
          height: 16vmax;
          margin: -8vmax;
          filter: blur(6px);
          background: conic-gradient(
            from var(--pr-angle),
            oklch(75% 0.15 350 / 0.6),
            oklch(80% 0.12 200 / 0.5),
            oklch(78% 0.14 280 / 0.55),
            oklch(75% 0.15 350 / 0.6)
          );
          animation:
            pr-wave 2.6s ease-out 1 forwards,
            pr-spin 5s linear infinite;
        }

        /* Soft blurred energy rings */
        .pr-ring {
          width: 12vmax;
          height: 12vmax;
          margin: -6vmax;
          filter: blur(5px);
          background: radial-gradient(
            circle,
            transparent 48%,
            oklch(72% 0.13 285 / 0.7) 58%,
            oklch(75% 0.15 350 / 0.5) 72%,
            transparent 82%
          );
          animation: pr-ring 2.6s ease-out 1 forwards;
        }
        .pr-ring-2 {
          animation-name: pr-ring-2;
        }

        @keyframes pr-wave {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          6% {
            opacity: 0.72;
          }
          100% {
            opacity: 0;
            transform: scale(26);
          }
        }

        @keyframes pr-ring {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          5% {
            opacity: 0.62;
          }
          100% {
            opacity: 0;
            transform: scale(34);
          }
        }

        /* Same duration, but stays hidden until ~16% so it trails the first
           ring — stagger encoded in the keyframes, not animation-delay, so
           every layer still ends at 2.6s. */
        @keyframes pr-ring-2 {
          0%,
          16% {
            opacity: 0;
            transform: scale(0);
          }
          22% {
            opacity: 0.46;
          }
          100% {
            opacity: 0;
            transform: scale(34);
          }
        }

        @keyframes pr-spin {
          to {
            --pr-angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pr-wave,
          .pr-ring {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default PageRipple;
