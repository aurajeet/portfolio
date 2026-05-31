"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { ChatDrawer } from "./ChatDrawer";
import { ColorOrb } from "./ColorOrb";
import { PillGlow } from "./PillGlow";
import { PageRipple } from "./PageRipple";
import { track } from "@vercel/analytics";
import { ScrollPromptLabel } from "./ScrollPromptLabel";
import { useHeroExited, type HeroPromptMode } from "./useHeroExited";

const FAB_LABEL_STORAGE_KEY = "ai-bot-fab-label-seen";
const FAB_LABEL_TEXT = "Ask me anything";
const FAB_LABEL_VISIBLE_MS = 4000;
const FAB_LABEL_FADE_MS = 400;

// `useSyncExternalStore` subscribe — no real subscription required; we only
// read at mount and rely on local state for subsequent updates. React 19's
// lint rules treat this as the canonical "read external state" hook.
const noopSubscribe = () => () => {};

function readLabelSeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(FAB_LABEL_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function writeLabelSeen() {
  try {
    window.localStorage.setItem(FAB_LABEL_STORAGE_KEY, "1");
  } catch {}
}

const SCROLL_PROMPT_STORAGE_KEY = "ai-bot-scroll-prompt-seen";

function readScrollPromptSeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(SCROLL_PROMPT_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function writeScrollPromptSeen() {
  try {
    window.localStorage.setItem(SCROLL_PROMPT_STORAGE_KEY, "1");
  } catch {}
}

// ChatFab is the single entry-point the orchestrator mounts in app/layout.tsx.
// It owns the open/close state for the drawer and renders the closed-state
// FAB + first-visit label. Drawer animation/lifecycle is handled inside
// `ChatDrawer`.
export function ChatFab() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  // Once the user opens the chat, the attention glow stops for good.
  const [hasEngaged, setHasEngaged] = useState(false);
  // Bumped on every open to fire the page-wide ocean ripple.
  const [openCount, setOpenCount] = useState(0);

  // Has the user seen the "Ask me anything" label on a prior visit? Read
  // from localStorage via `useSyncExternalStore` so we don't hit React 19's
  // setState-in-effect lint rule. SSR snapshot returns `true` (act as if
  // seen) to keep the label out of the server-rendered HTML — the post-
  // hydration first paint reveals it for genuinely-first-visit users.
  const seenBefore = useSyncExternalStore(
    noopSubscribe,
    readLabelSeen,
    () => true,
  );

  // Session-local dismissal — flipped by the 4s timer or the user clicking
  // the FAB. Drives the AnimatePresence exit transition.
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  const labelVisible = !seenBefore && !dismissedThisSession && !open;

  const { triggered, mode } = useHeroExited();

  const scrollPromptSeen = useSyncExternalStore(
    noopSubscribe,
    readScrollPromptSeen,
    () => true,
  );
  const [scrollPromptDismissed, setScrollPromptDismissed] = useState(false);

  const showScrollPrompt =
    triggered &&
    mode !== null &&
    !scrollPromptSeen &&
    !scrollPromptDismissed &&
    !open &&
    !labelVisible;

  // 4-second auto-dismiss timer. setState fires inside a setTimeout callback
  // (not the effect body), which the React 19 lint rule permits.
  useEffect(() => {
    if (seenBefore || dismissedThisSession) return;
    const timer = window.setTimeout(() => {
      setDismissedThisSession(true);
      writeLabelSeen();
    }, FAB_LABEL_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [seenBefore, dismissedThisSession]);

  const handleOpen = useCallback(() => {
    track("ai_chat_opened");
    setOpen(true);
    setHasEngaged(true);
    setOpenCount((c) => c + 1);
    // Opening the drawer is also a first-visit signal — mark the label as
    // seen so the FAB doesn't re-prompt on the next visit even if the
    // user opened before the 4s timer fired.
    if (!seenBefore) {
      setDismissedThisSession(true);
      writeLabelSeen();
    }
  }, [seenBefore]);

  const handleClose = useCallback(() => setOpen(false), []);

  // Escape closes the drawer. We listen at the window level so the textarea
  // doesn't have to be focused to escape — but only when the drawer is open
  // so we don't intercept other pages' Escape semantics.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  return (
    <>
      {/* FAB + first-visit label. The FAB itself sits in the bottom-right
          corner regardless of drawer state; it doesn't slide off-screen
          when the drawer opens (the user might want to close-and-reopen
          from the same affordance — and the spec doesn't call for hiding
          it). The label uses `AnimatePresence` so a 400ms fade out runs
          before unmount. */}
      <div
        className={cn(
          "pointer-events-none fixed z-40 flex items-center gap-3",
          "right-4 bottom-4 md:right-6 md:bottom-6",
        )}
      >
        <AnimatePresence>
          {labelVisible && (
            <motion.div
              key="fab-label"
              aria-hidden="true"
              initial={reduced ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, transition: { duration: FAB_LABEL_FADE_MS / 1000 } }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
              }
              className={cn(
                "pointer-events-none border border-rule bg-paper px-2 py-1.5",
                "font-sans text-[13px] text-ink",
              )}
            >
              {FAB_LABEL_TEXT}
            </motion.div>
          )}
          {showScrollPrompt && (
            <ScrollPromptLabel
              key="scroll-prompt"
              mode={mode as Exclude<HeroPromptMode, null>}
              onDismiss={() => {
                setScrollPromptDismissed(true);
                writeScrollPromptSeen();
              }}
              onOpen={() => {
                handleOpen();
                setScrollPromptDismissed(true);
                writeScrollPromptSeen();
              }}
            />
          )}
        </AnimatePresence>

        {/* Relative wrapper anchors the one-shot glow behind the pill. The
            glow blooms once when the hero scrolls out of view (`triggered`),
            drawing the eye to the launcher. */}
        <div className="pointer-events-none relative flex items-center">
          <PillGlow active={!hasEngaged} />
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Open chat"
            aria-expanded={open}
            className={cn(
              "pointer-events-auto relative z-10 flex h-14 items-center gap-3 rounded-full",
              "bg-ink py-2 pr-6 pl-2.5",
              "cursor-pointer transition-colors duration-200 ease-[var(--ease-luxe)]",
              "hover:bg-ink-soft",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
            )}
          >
            {/* Base tone matches the ink pill so the orb's core blends into it,
                while the accents stay colorful — the glowing-ball look. */}
            <ColorOrb dimension="32px" tones={{ base: "oklch(22.64% 0 0)" }} />
            <span className="font-sans text-[15px] font-medium text-paper select-none">
              Ask AI
            </span>
          </button>
        </div>
      </div>

      <PageRipple fireKey={openCount} />

      <ChatDrawer open={open} onClose={handleClose} />
    </>
  );
}
