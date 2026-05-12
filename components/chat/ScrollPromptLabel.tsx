"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { HeroPromptMode } from "./useHeroExited";

const SCROLL_DISMISS_MS = 6_000;
const IDLE_POST_SCROLL_MS = 2_000;
const luxeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ScrollPromptLabelProps {
  mode: Exclude<HeroPromptMode, null>;
  onDismiss: () => void;
  onOpen: () => void;
}

export function ScrollPromptLabel({ mode, onDismiss, onOpen }: ScrollPromptLabelProps) {
  const reduced = useReducedMotion();

  // Ref guards prevent double-firing if timer and user action race.
  const firedRef = useRef(false);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  function safeDismiss() {
    if (firedRef.current) return;
    firedRef.current = true;
    onDismissRef.current();
  }

  // Dismiss timer — behaviour differs by trigger mode.
  // mode is stable for the lifetime of this component (hook fires once),
  // so [] deps is correct here.
  useEffect(() => {
    if (mode === "scroll") {
      const t = setTimeout(safeDismiss, SCROLL_DISMISS_MS);
      return () => clearTimeout(t);
    }

    // mode === "idle": stay until user scrolls, then wait 2s before dismissing.
    let t: ReturnType<typeof setTimeout> | null = null;
    function onScroll() {
      window.removeEventListener("scroll", onScroll);
      t = setTimeout(safeDismiss, IDLE_POST_SCROLL_MS);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (t) clearTimeout(t);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, transition: { duration: 0.4 } }
      }
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.4, ease: luxeEase }
      }
      className="pointer-events-auto max-w-[210px] border border-rule bg-paper px-3 py-2.5"
    >
      {/* Eyebrow row — X sits inline-right of the hairline divider */}
      <div className="mb-2 flex items-center justify-between border-b border-rule pb-2">
        <span
          className={cn(
            "font-sans text-[9px] font-medium uppercase text-mute",
            "tracking-[var(--tracking-eyebrow)]",
          )}
        >
          AI Assistant
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            safeDismiss();
          }}
          aria-label="Dismiss prompt"
          className={cn(
            "flex h-4 w-4 items-center justify-center text-mute",
            "cursor-pointer transition-opacity duration-200 ease-[var(--ease-luxe)] hover:text-ink",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          )}
        >
          <svg
            width={8}
            height={8}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M1.5 1.5 L10.5 10.5 M10.5 1.5 L1.5 10.5" />
          </svg>
        </button>
      </div>

      {/* Body + CTA — entire block opens the drawer on click */}
      <button
        type="button"
        onClick={onOpen}
        className="block w-full cursor-pointer text-left"
      >
        <p className="mb-1.5 font-sans text-[12px] leading-snug text-ink">
          Still exploring? I&apos;m trained on Aurajeet&apos;s entire portfolio.
        </p>
        <p className="font-sans text-[11px] text-mute">Ask me anything →</p>
      </button>
    </motion.div>
  );
}
