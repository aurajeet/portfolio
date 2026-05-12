# Bot Scroll Prompt — Design Spec

**Date:** 2026-05-12
**Status:** Approved — ready for implementation

---

## Overview

When a recruiter lands on the portfolio and either scrolls past the hero section or idles on it for 15 seconds, the AI bot surfaces a contextual prompt label next to the FAB. The prompt introduces the bot and invites questions. It is non-blocking, dismissible, and appears at most once ever per browser.

---

## 1. Trigger Conditions

Two independent paths can fire the prompt. Whichever fires first wins — the second path does not re-trigger.

### Path A — Scroll-past (IntersectionObserver)

- An `IntersectionObserver` watches `#hero`.
- The observer records whether the hero was ever intersecting after mount (guards against the page loading already scrolled past the hero and false-firing).
- When the hero transitions from intersecting → not intersecting, the prompt fires with `mode: 'scroll'`.
- The observer disconnects immediately after firing.

### Path B — Idle-in-hero (timer)

- A 15-second `setTimeout` starts on mount.
- Any `scroll` event before 15 s cancels the timer.
- If 15 s elapse with no scroll and the hero is still in view, the prompt fires with `mode: 'idle'`.
- The timer is cleared on unmount.

### Conflict rule

If Path B fires and the user subsequently scrolls past the hero, the prompt is already visible and in its 2 s post-scroll countdown. Path A does not restart or replace the timer.

---

## 2. Dismiss Behaviour

Dismiss behaviour differs by trigger mode.

| Mode | Auto-dismiss | Manual dismiss |
|------|-------------|----------------|
| `'scroll'` | 6 s after prompt appears | X button or clicking label |
| `'idle'` | 2 s after first scroll event | X button or clicking label |

**Clicking the label** (anywhere except X): opens the `ChatDrawer` and marks the prompt as seen.
**Clicking X**: dismisses immediately, marks as seen, does not open the drawer.

All dismiss paths write `"1"` to localStorage key `ai-bot-scroll-prompt-seen`. The prompt never shows again on any subsequent visit.

---

## 3. Persistence & Coexistence

**Storage key:** `ai-bot-scroll-prompt-seen`

Read via `useSyncExternalStore` (same pattern as the existing first-visit label in `ChatFab`). SSR snapshot returns `true` to keep the prompt out of server-rendered HTML.

**Coexistence with the first-visit label (`ai-bot-fab-label-seen`):**

The two labels share the same physical slot (left of the FAB) but use separate keys. They cannot show simultaneously — the scroll prompt renders only when `!open && !scrollPromptSeen && triggered`. In practice they do not overlap: the idle path needs 15 s and the scroll-past path requires the user to have scrolled, by which point the first-visit label's 4 s window has already elapsed.

---

## 4. Visual Design

### Label structure

```
┌─────────────────────────────────────┐
│ AI ASSISTANT                      ✕ │  ← eyebrow row
│ ─────────────────────────────────── │  ← hairline divider (border-b border-rule)
│ Still exploring? I'm trained on     │
│ Aurajeet's entire portfolio.        │  ← body
│                                     │
│ Ask me anything →                   │  ← muted CTA
└─────────────────────────────────────┘
                                  [FAB]
```

### Tailwind / token reference

| Element | Classes |
|---------|---------|
| Outer card | `border border-rule bg-paper px-3 py-2.5` |
| Eyebrow row | `flex items-center justify-between pb-2 mb-2 border-b border-rule` |
| Eyebrow text | `font-sans text-[9px] font-medium uppercase tracking-[var(--tracking-eyebrow)] text-mute` |
| X button | `flex h-4 w-4 items-center justify-center text-mute hover:text-ink cursor-pointer` |
| Body | `font-sans text-[12px] text-ink leading-snug mb-1.5 max-w-[200px]` |
| CTA | `font-sans text-[11px] text-mute` |

### Microcopy (locked)

- Eyebrow: `AI ASSISTANT`
- Body: `Still exploring? I'm trained on Aurajeet's entire portfolio.`
- CTA: `Ask me anything →`

---

## 5. Animation

Matches the existing first-visit label motion exactly — no new easing curves.

| State | Value |
|-------|-------|
| Enter | `opacity: 0, x: 8` → `opacity: 1, x: 0`, 400 ms, `[0.16, 1, 0.3, 1]` |
| Exit | `opacity: 0`, 400 ms |
| Reduced motion | `initial={false}`, instant exit (`duration: 0`) |

Uses `AnimatePresence` + `motion.div`. The scroll prompt mounts inside the same `AnimatePresence` block as the first-visit label in `ChatFab`.

---

## 6. Component Breakdown

### New: `components/chat/useHeroExited.ts`

```ts
type HeroPromptMode = 'scroll' | 'idle' | null

function useHeroExited(): { triggered: boolean; mode: HeroPromptMode }
```

- Mounts `IntersectionObserver` on `document.querySelector('#hero')`.
- Starts 15 s idle `setTimeout` on mount.
- Any scroll event before 15 s cancels the idle timer.
- Returns `{ triggered: false, mode: null }` until one path fires.
- Cleans up observer, timer, and scroll listener on unmount.
- Internal guard: tracks `heroWasSeen` — only fires scroll-past if hero was intersecting at least once after mount.

### New: `components/chat/ScrollPromptLabel.tsx`

```ts
interface ScrollPromptLabelProps {
  mode: 'scroll' | 'idle'
  onDismiss: () => void
  onOpen: () => void
}
```

- Renders the V3-C label (eyebrow + divider + body + CTA + X button).
- Manages dismiss timer internally:
  - `mode === 'scroll'`: `setTimeout(onDismiss, 6000)` on mount.
  - `mode === 'idle'`: adds a `scroll` listener; on first scroll, `setTimeout(onDismiss, 2000)`.
- Clicking label body/CTA → `onOpen()`.
- Clicking X → `onDismiss()`.
- Clears timer and listener on unmount.
- Wraps in `motion.div` with enter/exit animation. Reduced-motion guard via `useReducedMotion()`.

### Modified: `components/chat/ChatFab.tsx`

- Calls `useHeroExited()`.
- Reads `ai-bot-scroll-prompt-seen` from localStorage via `useSyncExternalStore`.
- Adds `writeScrollPromptSeen()` helper (mirrors existing `writeLabelSeen()`).
- Renders `<ScrollPromptLabel>` inside the existing `AnimatePresence` block when:
  ```ts
  triggered && !scrollPromptSeen && !open
  ```
- `onDismiss` → `writeScrollPromptSeen()` + session-local state flip.
- `onOpen` → `handleOpen()` + `writeScrollPromptSeen()`.

---

## 7. Out of Scope

- No changes to `ChatDrawer`, `Hero`, or any page-level component.
- No server-side changes.
- The prompt does not pre-populate any message in the drawer — it opens the drawer to its default empty state.
- No analytics event on prompt fire (can be added later as a one-liner).
