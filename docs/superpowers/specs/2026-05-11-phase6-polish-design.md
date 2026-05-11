# Phase 6 Polish — Design Spec

**Date:** 2026-05-11
**Status:** Approved

---

## Scope

Landing page polish only. Sub-pages (experience, project, teardown deep-dives, about) keep their current static render — no scroll reveals there.

Three deliverables:
1. `<FadeUp>` scroll reveal component
2. Teardown marquee (CSS animation + JS arrow control)
3. A11y + responsive QA pass

---

## 1. FadeUp Component

**File:** `components/ui/FadeUp.tsx`
**Type:** `"use client"`

### API

```ts
FadeUp({
  children: React.ReactNode,
  delay?: number,     // stagger offset in seconds, default 0
  className?: string,
})
```

### Behavior

- `useInView({ once: true, margin: "-80px" })` — fires once when element is 80px into the viewport.
- `useReducedMotion()` — when true, renders children unwrapped with no Framer Motion wrapper at all. Zero motion, zero bundle cost for reduced-motion users.
- Animation: `opacity 0→1` + `translateY 8px→0`, duration `400ms`, easing `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-luxe`).

### Usage across sections

| Section | What gets wrapped | Stagger |
|---------|-------------------|---------|
| Work | Eyebrow + heading block; each `<article>` entry | `index * 0.06s` per entry |
| Projects | Eyebrow + heading block; top-tier card pair; teardown row header | None (marquee handles its own timing) |
| Contact | Eyebrow + status line + email block | None |

Sections (`Work`, `Projects`, `Contact`) remain server components. Only their inner content blocks are wrapped in `<FadeUp>` — no architecture change to the section files beyond the import and wrapper.

---

## 2. Teardown Marquee

**File:** `components/sections/Projects.tsx` — `TeardownRow` function
**Change:** Becomes `"use client"` (or extracted to a `TeardownMarquee.tsx` client component, imported by the server `Projects`)

### DOM structure

```
<div role="region" aria-label="Product teardowns">
  <!-- Arrow row: above the strip, flex justify-end gap-2 -->
  <div>
    <button type="button" aria-label="Previous teardown">←</button>
    <button type="button" aria-label="Next teardown">→</button>
  </div>

  <!-- Scrollable track -->
  <div ref={trackRef} style="overflow-x: hidden; position: relative;">
    <!-- Animated strip: two copies side-by-side for seamless loop -->
    <ul
      ref={stripRef}
      class="animate-marquee-x flex ..."
      style="--marquee-duration: 35s; animation-play-state: paused|running"
    >
      {cards} {cards}
    </ul>

    <!-- Right-edge fade (unchanged from Phase 4) -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 ..." />
  </div>
</div>
```

### Arrow buttons

- Size: `32×32px`
- Style: `border border-rule bg-paper` at rest, `bg-ink text-paper` on hover — hairline at rest, fills ink on hover
- Color: ink (`--color-ink`) — **not** accent
- Placement: above the strip, `flex justify-end gap-2`

### Interaction logic

| Event | Behavior |
|-------|----------|
| `mouseenter` strip | `setPaused(true)` → `animation-play-state: paused` |
| `mouseleave` strip | `setPaused(false)` → `animation-play-state: running` |
| Arrow `←` click | `setPaused(true)` + `trackRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' })` → resume after 600ms |
| Arrow `→` click | Same, positive direction |
| `prefers-reduced-motion` | `useReducedMotion()` → skip `animate-marquee-x`, render static `overflow-x-auto` (Phase 4 fallback) |

### Card sizing (unchanged)

- `lg`: `240px`, `md`: `220px`, mobile: `200px`
- Gap: `16px` mobile / `24px` md+

### Animation

- Keyframe: `marquee-x` (already in `globals.css`) — `translateX(0) → translateX(-50%)`
- Duration: `35s` (within the 30–40s spec range)
- Two copies of the card list rendered side-by-side so the keyframe's 50% translate lands copy 2 where copy 1 started — seamless loop

---

## 3. A11y

All existing ARIA is preserved. Phase 6 additions:

- Arrow buttons: `type="button"`, `aria-label="Previous teardown"` / `aria-label="Next teardown"`.
- `FadeUp`: wraps in `motion.div` only — no role or ARIA changes. Screen reader sees identical DOM.
- `prefers-reduced-motion` coverage:
  - `FadeUp`: no-ops entirely (children rendered without motion wrapper)
  - Marquee: static `overflow-x-auto` fallback
  - Lenis: already guards itself in `lib/smooth-scroll.tsx`
- Focus ring: globally defined in `globals.css` — no changes needed.

---

## 4. Responsive QA

Manual check at three breakpoints after implementation:

| Breakpoint | Check |
|------------|-------|
| 375px (iPhone SE) | Hero stacks correctly; work entries readable; marquee cards 200px wide; contact centered |
| 768px (iPad) | Nav desktop links; hero split; grid columns activate |
| 1280px+ (desktop) | Full layout; marquee at 240px; FadeUp triggers correctly |

Verify FadeUp causes no layout shift — `translateY 8px` is imperceptible on small screens; `opacity` is the primary signal.

---

## Out of Scope

- Automated a11y audit (axe / Lighthouse) — Phase 7
- Sub-page scroll reveals — deferred by user decision
- Lenis integration changes — already complete
- About page `PhotoMarquee` — already implemented in Phase 5.5

---

## Files Changed

| File | Change |
|------|--------|
| `components/ui/FadeUp.tsx` | **New** — scroll reveal wrapper |
| `components/sections/Work.tsx` | Wrap section header + entries in `<FadeUp>` |
| `components/sections/Projects.tsx` | Wrap section header + cards; extract `TeardownRow` to client component with marquee |
| `components/sections/Contact.tsx` | Wrap section header + email block in `<FadeUp>` |
