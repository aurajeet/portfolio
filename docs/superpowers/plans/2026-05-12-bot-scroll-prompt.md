# Bot Scroll Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface a contextual AI-bot prompt label next to the FAB when the reader scrolls past the hero section or idles on it for 15 seconds.

**Architecture:** Two new files (`useHeroExited.ts`, `ScrollPromptLabel.tsx`) and one modified file (`ChatFab.tsx`). The hook detects the trigger; the label handles display, timers, and dismissal; ChatFab composes them and owns localStorage persistence. No other files are touched.

**Tech Stack:** React 19, Next.js 16, TypeScript, Framer Motion 12, Tailwind CSS v4.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `components/chat/useHeroExited.ts` | IntersectionObserver + idle timer; returns `{ triggered, mode }` |
| Create | `components/chat/ScrollPromptLabel.tsx` | V3-C label UI, dismiss timers, animation |
| Modify | `components/chat/ChatFab.tsx` | Compose hook + label, own localStorage state |

---

## Task 1: Create `useHeroExited` hook

**Files:**
- Create: `components/chat/useHeroExited.ts`

- [ ] **Step 1.1: Create the file with the full hook implementation**

```typescript
// components/chat/useHeroExited.ts
"use client";

import { useEffect, useRef, useState } from "react";

export type HeroPromptMode = "scroll" | "idle" | null;

const IDLE_TIMEOUT_MS = 15_000;

export function useHeroExited(): { triggered: boolean; mode: HeroPromptMode } {
  const [state, setState] = useState<{ triggered: boolean; mode: HeroPromptMode }>({
    triggered: false,
    mode: null,
  });
  const firedRef = useRef(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#hero");
    if (!hero) return;

    let heroWasSeen = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    function fire(mode: Exclude<HeroPromptMode, null>) {
      if (firedRef.current) return;
      firedRef.current = true;
      setState({ triggered: true, mode });
    }

    // Path A: IntersectionObserver — fires when hero scrolls out of view.
    // heroWasSeen guard prevents false-firing when page loads already scrolled past hero.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        heroWasSeen = true;
      } else if (heroWasSeen) {
        fire("scroll");
        observer.disconnect();
      }
    });
    observer.observe(hero);

    // Path B: Idle timer — fires if user sits on the hero for 15s without scrolling.
    // Any scroll event cancels the timer; Path A takes over if they scroll.
    function onScroll() {
      if (idleTimer !== null) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
      window.removeEventListener("scroll", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    idleTimer = setTimeout(() => {
      fire("idle");
    }, IDLE_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      if (idleTimer !== null) clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return state;
}
```

- [ ] **Step 1.2: Verify types compile**

```bash
cd /Users/auro/Documents/PM_PORTFOLIO_MINIMALIST && npx tsc --noEmit
```

Expected: no errors referencing `useHeroExited.ts`.

- [ ] **Step 1.3: Commit**

```bash
git add components/chat/useHeroExited.ts
git commit -m "feat: add useHeroExited hook for scroll and idle triggers"
```

---

## Task 2: Create `ScrollPromptLabel` component

**Files:**
- Create: `components/chat/ScrollPromptLabel.tsx`

- [ ] **Step 2.1: Create the file with the full component**

```tsx
// components/chat/ScrollPromptLabel.tsx
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
```

- [ ] **Step 2.2: Verify types compile**

```bash
cd /Users/auro/Documents/PM_PORTFOLIO_MINIMALIST && npx tsc --noEmit
```

Expected: no errors referencing `ScrollPromptLabel.tsx`.

- [ ] **Step 2.3: Commit**

```bash
git add components/chat/ScrollPromptLabel.tsx
git commit -m "feat: add ScrollPromptLabel component (V3-C style)"
```

---

## Task 3: Wire into `ChatFab`

**Files:**
- Modify: `components/chat/ChatFab.tsx`

- [ ] **Step 3.1: Add new imports at the top of `ChatFab.tsx`**

Open `components/chat/ChatFab.tsx`. The current imports block is:

```typescript
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { ChatDrawer } from "./ChatDrawer";
```

Replace it with:

```typescript
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { ChatDrawer } from "./ChatDrawer";
import { ScrollPromptLabel } from "./ScrollPromptLabel";
import { useHeroExited, type HeroPromptMode } from "./useHeroExited";
```

- [ ] **Step 3.2: Add new constants and helpers after the existing ones**

The file currently has these constants near the top:

```typescript
const FAB_LABEL_STORAGE_KEY = "ai-bot-fab-label-seen";
const FAB_LABEL_TEXT = "Ask me anything";
const FAB_LABEL_VISIBLE_MS = 4000;
const FAB_LABEL_FADE_MS = 400;
```

Add these immediately after:

```typescript
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
```

- [ ] **Step 3.3: Add hook call and state inside `ChatFab` component body**

Inside the `ChatFab` function, after the existing `const [dismissedThisSession, setDismissedThisSession] = useState(false);` line, add:

```typescript
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
```

- [ ] **Step 3.4: Add `ScrollPromptLabel` into the existing `AnimatePresence` block**

Find this block in the return JSX:

```tsx
<AnimatePresence>
  {labelVisible && !open && (
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
</AnimatePresence>
```

Replace it with:

```tsx
<AnimatePresence>
  {labelVisible && !open && (
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
```

- [ ] **Step 3.5: Verify types compile**

```bash
cd /Users/auro/Documents/PM_PORTFOLIO_MINIMALIST && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3.6: Verify production build**

```bash
cd /Users/auro/Documents/PM_PORTFOLIO_MINIMALIST && npm run build
```

Expected: build completes with no errors. Warnings about `eslint-disable` on the `useEffect` deps line are acceptable.

- [ ] **Step 3.7: Commit**

```bash
git add components/chat/ChatFab.tsx
git commit -m "feat: wire scroll prompt into ChatFab"
```

---

## Task 4: Manual browser verification

Run the dev server and verify all six scenarios. Clear localStorage between each group using DevTools → Application → Local Storage → clear all.

```bash
cd /Users/auro/Documents/PM_PORTFOLIO_MINIMALIST && npm run dev
```

Open `http://localhost:3000`.

- [ ] **Scenario A — Scroll-past trigger (Path A)**
  1. Clear localStorage.
  2. Load the page. Wait for it to settle.
  3. Slowly scroll down past the hero section (the full viewport-height section with the name and photo).
  4. Expected: label slides in from the right next to the FAB with eyebrow `AI ASSISTANT`, body text, and `Ask me anything →` CTA.
  5. Wait 6 seconds without interacting.
  6. Expected: label fades out.
  7. Reload. Scroll past hero again.
  8. Expected: label does NOT appear (localStorage `ai-bot-scroll-prompt-seen = "1"`).

- [ ] **Scenario B — Idle trigger (Path B)**
  1. Clear localStorage.
  2. Load the page. Do not scroll at all.
  3. Wait 15 seconds.
  4. Expected: label slides in next to the FAB while you are still in the hero section.
  5. Start scrolling (any direction).
  6. Expected: label stays visible for 2 more seconds, then fades out.

- [ ] **Scenario C — X dismiss**
  1. Clear localStorage.
  2. Trigger the prompt (scroll past hero).
  3. Click the `✕` button in the eyebrow row.
  4. Expected: label fades out immediately. Drawer does NOT open.
  5. Reload and scroll past hero.
  6. Expected: prompt does NOT reappear.

- [ ] **Scenario D — Label click opens drawer**
  1. Clear localStorage.
  2. Trigger the prompt (scroll past hero).
  3. Click anywhere on the body text or CTA (not the ✕).
  4. Expected: `ChatDrawer` opens. Label fades out.
  5. Close drawer. Scroll to top, scroll past hero again.
  6. Expected: prompt does NOT reappear.

- [ ] **Scenario E — Drawer open suppresses prompt**
  1. Clear localStorage.
  2. Open the drawer manually via the FAB button before scrolling.
  3. Scroll past the hero while the drawer is open.
  4. Expected: scroll prompt does NOT appear while drawer is open.
  5. Close the drawer. Scroll back up and past the hero again.
  6. Expected: prompt appears now (drawer is closed, prompt not yet seen).

- [ ] **Scenario F — First-visit label and scroll prompt do not overlap**
  1. Clear localStorage (both keys).
  2. Load the page fresh. The first-visit "Ask me anything" label appears for 4 seconds.
  3. While that label is visible, scroll past the hero.
  4. Expected: scroll prompt does NOT appear until `labelVisible` is false (after 4s label dismisses).

- [ ] **Step 4.1: Commit verification note**

```bash
git commit --allow-empty -m "chore: manual browser verification passed for scroll prompt"
```

---

## Spec coverage check

| Spec section | Covered by |
|---|---|
| Path A scroll-past trigger | Task 1 (`useHeroExited` observer) |
| Path B 15s idle trigger | Task 1 (`useHeroExited` setTimeout) |
| Conflict rule (Path B fires first, Path A doesn't restart) | Task 1 (`firedRef` guard) |
| 6s auto-dismiss for scroll mode | Task 2 (`ScrollPromptLabel` useEffect) |
| 2s post-scroll dismiss for idle mode | Task 2 (`ScrollPromptLabel` useEffect) |
| X button — dismiss only | Task 2 (X button with `e.stopPropagation`) |
| Label click — opens drawer | Task 2 (body `<button>` calls `onOpen`) |
| Once-ever localStorage persistence | Task 3 (`writeScrollPromptSeen`, `readScrollPromptSeen`) |
| Coexistence with first-visit label | Task 3 (`!labelVisible` in `showScrollPrompt`) |
| Suppressed when drawer is open | Task 3 (`!open` in `showScrollPrompt`) |
| V3-C visual: eyebrow + divider + body + CTA | Task 2 (full JSX) |
| Animation: slide-in x:8, fade exit, reduced-motion guard | Task 2 (`motion.div` props) |
| No changes to Hero, ChatDrawer, or server | Confirmed — only 3 files touched |
