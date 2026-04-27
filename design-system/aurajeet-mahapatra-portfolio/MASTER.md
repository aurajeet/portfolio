# Design System Master File

> **Source of truth:** `css/tokens.css` `:root` block — every token below mirrors what the codebase actually exports. If this document and `tokens.css` ever disagree, `tokens.css` wins; update this doc to match.

---

**Project:** Aurajeet Mahapatra Portfolio
**Updated:** 2026-04-27 (post-v2 layout polish)
**Category:** Portfolio / Personal
**Register:** Editorial / Swiss Modernism 2.0 / Exaggerated Minimalism — light only.

---

## Style identity

Editorial print register on warm cream paper. The site reads more like a quiet print portfolio than a marketing page. Heavy use of mono-caps eyebrows, generous reading width, hairline rules between sections, and a tan (`--accent-soft`) used selectively to flag metrics and section labels.

**Anti-patterns (rejected, do not introduce):**

- Dark mode (the site is light-only by design)
- AI purple / pink / blue gradients
- Neon accents
- 3D, particle systems, or any WebGL
- Scroll-jacking, parallax, scroll-coupled cinematic reveals
- Emoji used as icons
- Layout-shifting hover transforms (use `border-color` change, not `scale` or `translateY` lift on cards)
- Hardcoded colors / sizes / spacing — every CSS value must reference a token from `css/tokens.css`

---

## Global Rules

### Color Palette

| Role | Value | CSS variable |
|---|---|---|
| Page background | `#F6F4EF` | `--bg` |
| Card background | `#FFFFFF` | `--bg-card` |
| Subtle background (case-study tan blocks, panels) | `#EAE0D4` | `--bg-subtle` |
| Primary text | `#1A1A1A` | `--text` |
| Secondary text | `#555555` | `--text-secondary` |
| Tertiary text | `#888888` | `--text-tertiary` |
| Accent (links, primary CTA) | `#403227` (dark brown) | `--accent` |
| Accent hover | `#2A1F18` | `--accent-hover` |
| Soft accent (metrics, eyebrows, year rails) | `#A68D6F` (tan) | `--accent-soft` |
| Border / hairline rule | `#D9C6B0` | `--rule` |
| Soft shadow | `0 1px 2px rgba(64, 50, 39, 0.06)` | `--shadow-soft` |

**Contrast:** primary text `#1A1A1A` on `#F6F4EF` = ~14.5:1 (WCAG AAA). Tan accent `#A68D6F` on `#F6F4EF` = ~3.4:1 — used for non-text decorative elements (eyebrows, rules, metrics) where the value isn't the text being read; never for body copy.

**Paper texture (`--paper-noise`).** Inline SVG fractal-noise data URI (~400 bytes) tiled at 240×240 with `background-attachment: fixed` on `body` and `.site-nav`. Adds a subtle grain so cream doesn't feel sterile. Auto-disabled under `prefers-contrast: more` and `forced-colors: active`.

### Typography

- **Heading:** Source Serif 4 — variable, weights 600 / 700, italic 600 / 700
- **Body:** Inter — variable, weights 400 / 500 / 600
- **Mono:** JetBrains Mono — variable, weights 400 / 500

**Font import (in every HTML `<head>`):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,wght@0,600;0,700;1,600;1,700&display=swap" rel="stylesheet">
```

**Family variables:**

```css
--ff-serif: "Source Serif 4", Georgia, "Times New Roman", serif;
--ff-sans:  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--ff-mono:  "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
```

### Type Scale (modular, base 16, ratio 1.25, clamped on mobile)

| Token | Value | Usage |
|---|---|---|
| `--fs-display` | `clamp(2.75rem, 5vw + 1rem, 4.25rem)` (~44–68px) | Hero name only |
| `--fs-h1` | `clamp(2.25rem, 4vw + 1rem, 3.063rem)` (~36–49px) | Page titles |
| `--fs-h2` | `clamp(1.875rem, 3vw + 0.75rem, 2.441rem)` (~30–39px) | Section titles |
| `--fs-h3` | `clamp(1.5rem, 2vw + 0.625rem, 1.953rem)` (~24–31px) | Article-level h2, prose h2, card metrics |
| `--fs-h4` | `clamp(1.25rem, 1.5vw + 0.5rem, 1.563rem)` (~20–25px) | Card titles, prose h3, about h2 |
| `--fs-large` | `1.25rem` (20px) | Lede paragraphs |
| `--fs-body` | `1rem` (16px) | Body text |
| `--fs-small` | `0.875rem` (14px) | Buttons, mono links, footer, secondary UI |
| `--fs-tiny` | `0.75rem` (12px) | Mono caps eyebrows / tags |

### 10 Typographic Roles

Single source of truth for type styling. **Every component must map to exactly one role.** No ad-hoc `font-size + font-weight` declarations on components.

| Class | Family | Size | Weight | Used for |
|---|---|---|---|---|
| `.t-display` | serif | `--fs-display` | 700 | Hero name only |
| `.t-h1` | serif | `--fs-h1` | 700 | Page titles, case-study titles |
| `.t-h2` | serif | `--fs-h2` | 700 | Section titles |
| `.t-h3` | serif | `--fs-h3` | 700 | Article-level `h2`, prose `h2`, **card metrics** |
| `.t-h4` | serif | `--fs-h4` | 600 | Card titles, prose `h3`, about `h2` |
| `.t-lede` | serif | `--fs-large` | 400 | First-paragraph emphasis, page-sub |
| `.t-body` | sans | `--fs-body` | 400 | Body text |
| `.t-small` | sans | `--fs-small` | 500 | Buttons, mono links, footer |
| `.t-mono-caps` | mono | `--fs-tiny` | 500 | Eyebrows, tags, meta lines, section labels |
| `.t-mono-caps-lg` | mono | `--fs-small` | 500 | Page-level eyebrows |

**Documented exceptions** (the only two components that don't map to a role):

- `.btn` — sans / `--fs-small` / 600. Interactive convention; bolder than `.t-small` so the affordance reads.
- `.cs__sub` — serif / `--fs-h4` / 600 / italic. Case-study subtitle; intentionally italic for editorial voice.

### Line Height & Letter Spacing

| Token | Value |
|---|---|
| `--lh-h1` | `1.15` |
| `--lh-h2` | `1.2` |
| `--lh-h3` | `1.25` |
| `--lh-h4` | `1.3` |
| `--lh-body` | `1.6` |
| `--lh-mono` | `1.4` |
| `--lh-lede` | `1.5` |
| `--ls-mono-caps` | `0.08em` |
| `--ls-heading` | `-0.01em` |

### Weights

| Token | Value | Usage |
|---|---|---|
| `--fw-body` | 400 | Body |
| `--fw-emphasis` | 500 | Mono caps, mid-emphasis |
| `--fw-interface` | 600 | Buttons, card titles, h3/h4 |
| `--fw-heading` | 700 | h1/h2, display |

### Spacing Scale (8px base)

| Token | Value | Usage |
|---|---|---|
| `--sp-1` | `0.25rem` (4px) | Tight gaps |
| `--sp-2` | `0.5rem` (8px) | Inline spacing |
| `--sp-3` | `0.75rem` (12px) | Small gaps |
| `--sp-4` | `1rem` (16px) | Standard padding |
| `--sp-5` | `1.25rem` (20px) | |
| `--sp-6` | `1.5rem` (24px) | Section padding |
| `--sp-8` | `2rem` (32px) | Large gaps |
| `--sp-10` | `2.5rem` (40px) | Card padding |
| `--sp-12` | `3rem` (48px) | Section margins |
| `--sp-16` | `4rem` (64px) | Hero padding |
| `--sp-20` | `5rem` (80px) | |
| `--sp-24` | `6rem` (96px) | Section block padding (desktop) |

### Layout Containers

| Token | Value | Usage |
|---|---|---|
| `--container-max` | `70rem` (1120px) | Page width |
| `--reading-max` | `42.5rem` (680px) | Narrow reading column (case-study prose, about body) |
| `--artifact-max` | `52.5rem` (840px) | Stat ribbons, embedded artifact images |

### Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `--t-fast` | `100ms` | Micro-interactions (link / button color) |
| `--t-base` | `200ms` | Standard transitions |
| `--t-slow` | `300ms` | Larger transitions (modal-style) |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | Single shared ease curve |

All three duration tokens collapse to `0ms` under `prefers-reduced-motion: reduce` — interactions are instant, not blocked.

### Border Radius

A single 4px radius is used across cards, buttons, deck cover cards, and skip-link. Inline value `4px`; no token (it's the only radius in use).

---

## Component Primitives

Components are defined in `css/components.css`. Each component primitive has a clear role and minimum viable variants — no Tailwind-style utility sprawl, no ad-hoc inline styles.

### 1. Container

```html
<div class="container">…</div>
```

`max-width: var(--container-max)` (1120px), centered, with responsive horizontal padding (`--sp-6` mobile → `--sp-12` ≥48rem → `--sp-16` ≥64rem).

Variants: `.container--reading` (680px max), `.container--artifact` (840px max).

### 2. Stack / Row

`.stack` — vertical flex with `gap: var(--sp-4)`. Modifiers `--2`, `--3`, `--6`, `--8`, `--12` change the gap.

`.row` — horizontal flex (wrap) with `gap: var(--sp-4)`, `align-items: center`. `.row--6`, `.row--between`.

### 3. Card

```html
<a class="card reveal" href="/case/nwn">
  <p class="card__meta">2024 · NWN · INDIA</p>
  <h3 class="card__title">Nation With NaMo</h3>
  <p class="card__desc">…</p>
  <span class="card__metric">+12% MoM</span>
  <span class="card__metric-label">MoM Growth</span>
</a>
```

`background: var(--bg-card)`, `border: 1px solid var(--rule)`, `padding: var(--sp-10)`, `gap: var(--sp-4)`. Hover: `border-color: var(--accent)`. Card title color shifts to `--accent` on hover.

**Card metrics** are always `--fs-h3` / 700 / serif / `--accent-soft` (tan) / `tabular-nums`. No `card--featured` / `card--minor` size variants — uniform across all four homepage cards.

### 4. Tag

```html
<span class="tag">SQL</span>
```

Inline-block pill: mono caps `--fs-tiny` / 500, `--text-secondary` text, 1px `--rule` border, `999px` border-radius, `--sp-1 --sp-3` padding. `.tag--accent` swaps color and border to `--accent`.

### 5. Stat / Stat-ribbon

Used in case-study hero ribbons.

```html
<div class="stat-ribbon">
  <div class="stat">
    <span class="stat__value">5,000+</span>
    <span class="stat__label">Farmers</span>
  </div>
  …
</div>
```

`.stat__value` is serif / 700 / `--fs-h2` / `--accent-soft` / `tabular-nums`.
`.stat-ribbon` is `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))` with hairline rules above and below.

### 6. Link Variants

`.link--mono` — sans / `--fs-small` / 500 (the "READ →" mono affordance).
`.link--quiet` — `--text-secondary`, hover → `--accent`.

### 7. Button

```html
<a class="btn btn--primary" href="mailto:…">Email me →</a>
<a class="btn btn--secondary" href="…">All work ↑</a>
```

`.btn` — sans / `--fs-small` / 600, `padding: var(--sp-3) var(--sp-6)`, 4px radius.
`.btn--primary` — solid `--accent` bg, `--bg` text. Hover → `--accent-hover` bg.
`.btn--secondary` — transparent bg, `--accent` text + border. Hover → solid `--accent` bg + `--bg` text.

### 8. Divider

```html
<hr class="divider">
```

`border-top: 1px solid var(--rule)`, `margin-block: var(--sp-12)`. Editorial chapter break.

### 9. MetaLine

```html
<p class="meta-line">CASE STUDY · 2024 · NWN · INDIA</p>
```

Mono / `--fs-small` / 500 / `0.12em` tracking / `--accent-soft` color. The page-level eyebrow above an h1.

### 10. Section label

```html
<p class="section__label">WORK</p>
```

Mono / `--fs-tiny` / 500 / `0.14em` tracking / `--accent-soft`. Sits above the content of a `<section>`. Variant `.section__label--tight` halves the bottom margin when the label is directly coupled to the next element (e.g., a deep-dive deck preview).

### 11. PageHeader (`.page-header`)

The narrow-column page header used on case-study pages. About-page uses its own wide header (`.about-header` in `layout.css`).

### 12. Site nav

`<nav class="site-nav">` — sticky top, mirrors body's paper texture (background-attachment: fixed, so the grain aligns continuously with the body), border-bottom hairline rule. Monogram (left) + text links (right). Active link gets `aria-current="page"` → tan underline.

### 13. Site footer

`.site-footer` (default — credit + colophon-style links) and `.site-footer--slim` (credit + back-to-top only, used on home + about where the colophon component sits directly above).

### 14. Colophon (in `css/layout.css`)

```html
<div class="colophon">
  <p class="colophon__lede">…</p>
  <div class="colophon__cta"><a class="btn btn--primary">Email me →</a></div>
  <dl class="colophon__grid">
    <div class="colophon__item">
      <dt>Email</dt>
      <dd><a href="mailto:…">aurajeetm@gmail.com</a></dd>
    </div>
    …
  </dl>
</div>
```

Lede + single primary CTA + 2-column `<dl>` of labeled mono-caps + clickable values. Replaces the v1 four-button contact strip.

---

## Style Guidelines

### When adding a new piece of UI

1. **Type style:** pick exactly one of the 10 roles above. If none fits, push back — don't add a new role unless the design genuinely demands one. The two documented exceptions are tracked above.
2. **Color:** all colors must come from the `--bg-*`, `--text-*`, `--accent-*`, or `--rule` variables. No hex values in new CSS.
3. **Spacing:** use the `--sp-*` scale. No magic numbers.
4. **Border:** `1px solid var(--rule)` is the universal hairline. `1px solid var(--accent)` is the active/hover state.
5. **Radius:** 4px for everything that has a radius. Inline, no token.
6. **Reveal animation:** add `class="reveal"` to opt the element into the IntersectionObserver fade-up. Disabled automatically under `prefers-reduced-motion: reduce`.
7. **Container:** wrap in `<div class="container">` (or `--reading` / `--artifact`) for horizontal centering and padding. Don't roll new container widths.

### Responsive breakpoints

The site uses three media-query breakpoints, in `rem` (so they scale with user font-size preferences):

| Breakpoint | Pixel @ 16px | Use |
|---|---|---|
| `min-width: 48rem` | 768px | Mobile → tablet (single → multi-column) |
| `min-width: 64rem` | 1024px | Tablet → desktop (full hero, container padding bump) |

Mobile-first: base styles are mobile, media queries layer on for larger viewports.

---

## Anti-Patterns (Do NOT use)

- **Dark mode** — the site is light only by design.
- **Hardcoded colors / sizes / spacing** — always reference a token.
- **Inline `style="..."` attributes** — replaced with utility classes (`.u-mt-12`, `.u-mb-3`, etc.) or component variants. None remain on the site.
- **Emoji as icons** — use SVG or Unicode arrows (`→`, `↑`, `↗`).
- **Layout-shifting hover transforms** — no `scale()` or `translateY(-Npx)` on cards. Use `border-color` change.
- **`font-size + font-weight` ad-hoc** — every text style maps to one of the 10 roles.
- **JavaScript** — the site has exactly one JS file (`js/reveal.js`, ~30 LoC). Don't add more without discussion.
- **3D / particles / WebGL / Three.js / GSAP** — all rejected during the v1 → v2 transition.
- **Scroll-jacking, parallax, scroll-coupled cinematic reveals.**
- **AI gradients** — purple/pink/blue diagonals, neon accents, glassmorphism beyond the existing `.colophon` and case-study tan block.

---

## Pre-Delivery Checklist

Before merging UI changes:

- [ ] Every text style maps to one of the 10 typographic roles (or is a documented exception).
- [ ] Every color value comes from `--bg-*` / `--text-*` / `--accent-*` / `--rule`. No new hex values.
- [ ] Every spacing value uses the `--sp-*` scale.
- [ ] No inline `style="..."` attributes in HTML.
- [ ] `cursor: pointer` on all clickable elements (default for `<a>` and `<button>` — only check if you've reset it).
- [ ] Hover states transition smoothly via `--t-fast` / `--t-base`.
- [ ] Focus-visible state preserved (`outline: 2px solid var(--accent)`, `outline-offset: 2px`).
- [ ] `prefers-reduced-motion: reduce` respected (motion tokens collapse to 0ms; `.reveal` shows immediately without transform).
- [ ] Skip-link (`Skip to content` → `#main`) at the top of every page.
- [ ] Responsive: layouts work at 375px, 768px, 1024px, 1440px.
- [ ] No horizontal scroll on mobile.
- [ ] HTTP 200 on every route after change (`/`, `/about`, `/case/{nwn,hebe,netflix,amazon-prime}`, `/404`).
- [ ] Lints clean (no HTML/CSS diagnostics).

---

*Document rewritten 2026-04-27 to reflect the v2 redesign and layout polish. Replaces the v1 design system file which described the deprecated dark-space-gold theme.*
