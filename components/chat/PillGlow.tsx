"use client";

import { useReducedMotion } from "framer-motion";

interface PillGlowProps {
  // While true, the glow pulses continuously. It starts on page load and the
  // parent sets it false once the user has engaged with the chat (opened the
  // drawer), stopping it for good.
  active: boolean;
}

// Continuous iridescent "Apple Intelligence" glow that pulses out of the Ask AI
// pill to draw the eye, then stops once the user engages. Sits behind the pill,
// decorative, non-interactive. Renders nothing under `prefers-reduced-motion`.
export function PillGlow({ active }: PillGlowProps) {
  const reduced = useReducedMotion();
  if (reduced || !active) return null;

  return (
    <span aria-hidden="true" className="pill-glow">
      <style jsx>{`
        @property --pg-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .pill-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 150px;
          height: 150px;
          margin-left: -75px;
          margin-top: -75px;
          border-radius: 999px;
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          background: conic-gradient(
            from var(--pg-angle),
            var(--iris-1),
            var(--iris-2),
            var(--iris-3),
            var(--iris-1)
          );
          filter: blur(18px);
          will-change: transform, opacity;
          /* Bloom loops on a 2.6s cycle (≈1.3s glow + rest); the gradient
             flows independently on a slow 6s spin. */
          animation:
            pg-bloom 2.6s ease-out infinite,
            pg-spin 6s linear infinite;
        }

        /* Desktop only — wider reach. Mobile keeps the 150px base. */
        @media (min-width: 768px) {
          .pill-glow {
            width: 230px;
            height: 230px;
            margin-left: -115px;
            margin-top: -115px;
          }
        }

        @keyframes pg-bloom {
          0% {
            opacity: 0;
            transform: scale(0.45);
          }
          8% {
            opacity: 0.85;
          }
          50% {
            opacity: 0;
            transform: scale(1.7);
          }
          100% {
            opacity: 0;
            transform: scale(1.7);
          }
        }

        @keyframes pg-spin {
          to {
            --pg-angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pill-glow {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}

export default PillGlow;
