"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

const luxeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Locked Package E + Style B labels (AI Bot.md §8.7). Order: top-left,
// top-right, bottom-left, bottom-right.
export const CHIP_LABELS = [
  "30-second overview",
  "Strongest Project?",
  "Notice Period?",
  "Team sizes managed?",
] as const;

export type ChipLabel = (typeof CHIP_LABELS)[number];

/** The chip whose tap also flips brief mode on. */
const BRIEF_MODE_CHIP: ChipLabel = "30-second overview";

interface SuggestedChipsProps {
  /** Fires after a chip is tapped. `isBrief` is true ONLY for the
   *  `30-second overview` chip (per §8.4 — the chip is the brief-mode
   *  trigger). The drawer pre-fills + auto-submits inside this callback. */
  onPick: (label: ChipLabel, isBrief: boolean) => void;
}

export function SuggestedChips({ onPick }: SuggestedChipsProps) {
  const reduced = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.04,
      },
    },
  };

  const chipVariants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.5,
        ease: luxeEase,
      },
    },
  };

  return (
    <motion.div
      role="group"
      aria-label="Suggested questions"
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-2 gap-2"
    >
      {CHIP_LABELS.map((label) => (
        <motion.button
          key={label}
          type="button"
          variants={chipVariants}
          onClick={() => onPick(label, label === BRIEF_MODE_CHIP)}
          className={cn(
            "flex h-10 items-center justify-center border border-rule bg-paper px-3",
            "text-center font-sans text-[11px] font-medium text-ink",
            "cursor-pointer select-none",
            "transition-colors duration-200 ease-[var(--ease-luxe)]",
            "hover:bg-ink hover:text-paper",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          )}
        >
          {label}
        </motion.button>
      ))}
    </motion.div>
  );
}
