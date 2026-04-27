# Portfolio Website — Product Requirements Document

**Owner:** Aurajeet Mahapatra
**Audience:** HR, Hiring Managers (Senior PMs at tech / consumer / B2B companies)
**Goal:** Position Aurajeet as a structured, execution-oriented early-career PM with a real track record across political tech, B2B operations, and growth analytics — using an editorial publication aesthetic that reads more like a quiet portfolio than a marketing site.
**Status:** v2 redesign complete (2026-04-27).
**Live URL:** https://aurajeet.com
**Source:** GitHub `aurajeet/portfolio` — branch `main` deploys via Vercel.
**Last updated:** 2026-04-27

---

## v1 → v2 transition

The original v1 site (April 2026) used a dark-space cinematic theme — Three.js particle sphere, gold accent on `#04050a` black, scroll-driven nebula atmospheres, GSAP-orchestrated cinematic reveals, GLSL shaders, cursor trails, scroll progress bars. The recruiter feedback that drove v2: too busy, too much motion, too "designer", and three concrete style problems (different card sizes, mixed work / projects sections, type sprawl).

v2 strips all of that. Single static HTML/CSS site. No JavaScript except a 30-line IntersectionObserver-based scroll-reveal. No 3D, no particles, no atmospheres, no scroll-jacking, no gradients. The register is editorial / Swiss Modernism 2.0 / exaggerated minimalism — warm cream paper background with a tan accent, Source Serif 4 + Inter + JetBrains Mono, a 10-role typographic system, and content that does the talking.

Branch chronology:
- `main` carried v1 through 2026-04-16.
- `redesign/v2` rebuilt the site from scratch over 2026-04-26 → 04-27 across 28 commits (full reset of HTML, then design tokens + base CSS + components + layout, then content — index, about, case studies, 404 — then assets + redirects).
- v2 layout polish (typography consolidation + layout refinements) shipped 2026-04-27 in one merge.

---

## Goal

Every page answers one question a hiring manager has while reading:

| Page | Question |
|---|---|
| Home | "Who is this person and what's their best work?" |
| About | "How did they get here?" |
| Case study | "Can they think like a PM?" |

The site is short. There are 7 routes (home, about, four case studies, 404). Reading the entire site takes ~10 minutes.

---

## Visual & Design System

**Theme:** Editorial print register on warm cream paper. Light only — no dark mode.

**Style identity** (per UI/UX Pro Max framework):
- Editorial Grid / Magazine (#47)
- Swiss Modernism 2.0 (#32)
- Exaggerated Minimalism (#29)

**Anti-patterns (rejected):** AI purple/pink gradients, neon accents, dark mode, harsh animations, scroll-jacking, parallax, emoji icons, 3D, particle systems.

**Color palette** (single source of truth: `css/tokens.css`):

| Role | Value | CSS variable |
|---|---|---|
| Page background | `#F6F4EF` | `--bg` |
| Card background | `#FFFFFF` | `--bg-card` |
| Subtle background (case-study tan blocks) | `#EAE0D4` | `--bg-subtle` |
| Primary text | `#1A1A1A` | `--text` |
| Secondary text | `#555555` | `--text-secondary` |
| Tertiary text | `#888888` | `--text-tertiary` |
| Accent (links, primary CTA) | `#403227` (dark brown) | `--accent` |
| Accent hover | `#2A1F18` | `--accent-hover` |
| Soft accent (metrics, eyebrow tan) | `#A68D6F` | `--accent-soft` |
| Border / rule | `#D9C6B0` | `--rule` |

**Paper texture.** A 240×240px SVG fractal-noise overlay (~400 bytes inline data URI) tiled on `body` and `.site-nav` with `background-attachment: fixed`. Adds a subtle grain so the cream doesn't feel sterile. Auto-disabled under `prefers-contrast: more` and `forced-colors: active`.

**Typography:**
- Heading: Source Serif 4 (variable, weights 600/700, italic 600/700)
- Body: Inter (variable, weights 400/500/600)
- Mono: JetBrains Mono (variable, weights 400/500)

**10 typographic roles** (every component maps to exactly one):

| Role | Family | Size | Weight | Usage |
|---|---|---|---|---|
| `t-display` | serif | `--fs-display` (44–68px) | 700 | Hero name only |
| `t-h1` | serif | `--fs-h1` (36–49px) | 700 | Page titles |
| `t-h2` | serif | `--fs-h2` (30–39px) | 700 | Section titles |
| `t-h3` | serif | `--fs-h3` (24–31px) | 700 | Article-level h2, prose h2, card metrics |
| `t-h4` | serif | `--fs-h4` (20–25px) | 600 | Card titles, prose h3, about h2 |
| `t-lede` | serif | `--fs-large` (20px) | 400 | First-paragraph emphasis |
| `t-body` | sans | `--fs-body` (16px) | 400 | Body text |
| `t-small` | sans | `--fs-small` (14px) | 500 | Buttons, mono links, footer |
| `t-mono-caps` | mono | `--fs-tiny` (12px) | 500 | Eyebrows, tags, meta lines, section labels |
| `t-mono-caps-lg` | mono | `--fs-small` (14px) | 500 | Page-level eyebrows |

Documented exceptions: `.btn` (sans / 14px / 600 — interactive convention) and `.cs__sub` (serif / 20–25px / 600 / italic — case-study subtitle, intentionally italic for editorial voice).

**Spacing scale** (8px base, in `--sp-*`): 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 px.

**Layout containers:**
- `--container-max: 70rem` (1120px) — page width
- `--reading-max: 42.5rem` (680px) — narrow reading column for case-study prose and about body
- `--artifact-max: 52.5rem` (840px) — slightly wider, for stat ribbons and embedded images

**Motion tokens:** `--t-fast: 100ms` / `--t-base: 200ms` / `--t-slow: 300ms`. Single shared ease curve `cubic-bezier(0.4, 0, 0.2, 1)`. Transitions zeroed under `prefers-reduced-motion: reduce`.

---

## Pages

### Home — `index.html`

Editorial vault. Five sections, top to bottom.

#### 1. Hero — Magazine masthead

Two-column grid inside `--container-max`. Left column: `PRODUCT MANAGER · BENGALURU, INDIA` mono-caps eyebrow → `Aurajeet Mahapatra` h1 (display) → positioning paragraph (serif, `t-h3`-sized). Right column (340px wide on desktop): editorial portrait photo with a thin tan border. Vertical hairline rule between columns; horizontal rule below hero.

Mobile (<64rem): stacks. Photo above text on portrait orientation.

#### 2. WORK section

`WORK` mono-caps section label. Two cards: NWN, HEBE. 1 column on mobile, 2 columns on ≥48rem.

#### 3. PM PROJECTS section

`PM PROJECTS` mono-caps section label. Two cards: Netflix, Amazon Prime. Same card layout as WORK. Anchored as `#projects` in the nav.

All four cards share identical dimensions, padding (`--sp-10`), internal stack ordering, metric size (`t-h3`), and metric color (`--accent-soft` tan). No featured/minor variants. The visual differentiator between the two sections is the section label only.

#### 4. BACKGROUND section — "The thread."

Two-column grid. Left rail (4/12): `BACKGROUND` mono-caps eyebrow + `<h2>The thread.</h2>`. Right column (8/12): one paragraph + outbound link to `/about`.

#### 5. CONTACT colophon

Lede paragraph + single primary `Email me →` button + `<dl>` grid of Email / LinkedIn / Resume / Phone (each with mono-caps label and clickable value link). Replaces the original four-button contact strip.

#### Footer — slim

Credit + `Back to top ↑` only. The contact colophon directly above carries the actual contact information.

### About — `about.html`

Wide editorial header → narrow body with year-range timeline rail.

#### Header (full container, 1120px)

`ABOUT` eyebrow → 2-column row at ≥48rem: left column (4/12) `t-h1` "Three roles, one thread."; right column (8/12) bio paragraph. Horizontal rule closes the header before the body begins.

#### Body (reading container, 680px, centered)

Five role sections. Mobile: year reads as `t-mono-caps` line above each `<h2>`. Desktop (≥48rem): `grid-template-columns: 140px 1fr` with the year range in a left rail (`--accent-soft` tan), the heading + paragraph in the right column.

| Section | Year rail |
|---|---|
| BIT Mesra | `2019–2023` |
| Nation With NaMo | `2023–2025` |
| HEBE | `2025–PRESENT` |
| Why product, why now | `THESIS` |
| What I'm looking for | `LOOKING FOR` |

#### Tools & methods

`<h2>Tools & methods</h2>` → row of 6 `.tag` chips (SQL, Power BI, Excel, Claude Code, AI Prototyping, Product Instrumentation) → descriptive paragraph (~`--sp-4` breathing room above).

#### Footer

Same colophon + slim footer as the homepage (visual parity).

### Case studies — `case/{nwn,hebe,netflix,amazon-prime}.html`

Four pages, identical layout. Long-form editorial articles with stat ribbons, embedded methods grids, and (for spec-exercise studies) a deck cover card linking to the original PDF.

Layout (top to bottom):

1. Page-level mono-caps eyebrow (`CASE STUDY · 2024 · NWN · INDIA` etc.)
2. `t-h1` title
3. `cs__sub` italic serif subtitle
4. Stat ribbon — 3-up grid of `.stat` blocks (`<value>` `<label>` `<sub>`)
5. Prose body (within `--reading-max`)
6. Methods / Tools / Collaborators tan block — 3-column grid, mono-caps headings, `.tag` chips for each item (replaced bulleted lists in v2)
7. (Netflix, Amazon Prime only) Deep-dive deck cover card — 16:9 first-page JPEG inside an `<a target="_blank">` opening the full PDF in a new tab. Replaced the v1 auto-loaded `<object>` PDF embed (~10 MB → ~474 KB across both pages, mobile-reliable, no JS).
8. Disclaimer block — for spec exercises only; reads as a publisher's note distinguishing real work (NWN, HEBE) from PM craft demonstrations (Netflix, Amazon Prime).
9. Prev / All work ↑ / Next nav (3-up flex with equal-width columns; missing prev/next on the edge pages renders as an invisible spacer so the centerpiece stays optically centered).
10. Full footer (colophon + standard footer — not the slim variant).

Spec-defined non-negotiable: layout, hero, stat ribbon, prose, and methods grid structure are unchanged across the v2 polish pass. Only inner content of `cs__methods` (bullets → chips), the deck embed (object → cover card), and the prev/next slot count (2 → 3) changed.

### 404 — `404.html`

Editorial framing line + the existing `404 — Page not found` mono heading + a short prose paragraph + a return link. Full footer.

---

## Functional behavior

**No client-side router.** Each route is a static HTML file. Vercel handles `cleanUrls: true` (so `/about` serves `about.html`, `/case/nwn` serves `case/nwn.html`).

**Redirects** (`vercel.json`): `/resume` → Google Drive PDF; `/projects.html` → `/#case-studies`; `/experience.html` → `/about`; `/project-viewer.html?project=netflix` → `/case/netflix`; `/project-viewer.html?project=amazon` → `/case/amazon-prime`. All 301 except `/resume` (302).

**Cache headers:** HTML — 5 minutes, must-revalidate. CSS / JS — 5 minutes, must-revalidate. Assets — 1 year, immutable.

**Skip-link** at the top of every page (`Skip to content` → `#main`).

**Scroll-reveal** (`js/reveal.js`, ~30 LoC). IntersectionObserver fades and translates `.reveal` elements into view as they enter the viewport. Respects `prefers-reduced-motion: reduce` (instantly visible, no transform).

**No analytics, no third-party trackers.** Only Google Fonts (preconnected) and Google Drive (resume link).

---

## Decisions log (v2)

Confirmed user decisions captured during the redesign brief and the layout polish pass.

### Plan-level

- **Approach:** rebuild from scratch on `redesign/v2`, not iterate on v1. The old codebase was a write-off.
- **Style register:** editorial / Swiss Modernism 2.0 (user: *"Go full editorial"*).
- **Animation budget:** scroll-reveal only. Defer all animation choreography (button polish, hover refinements, sticky-nav scroll state, reading-progress bar) until layout is final.

### Homepage

- **Section labels:** `WORK` (real work — NWN, HEBE) and `PM PROJECTS` (spec exercises — Netflix, Amazon Prime). Picked from a shortlist.
- **Card uniformity:** all four homepage cards share identical dimensions, padding, internal stack, metric size, and metric color. Featured/minor variants removed in the v2 polish pass.
- **Card metrics:** all tan (`--accent-soft`). Size standardized to the `t-h3` role.
- **Hero:** photo constrained inside `--container-max`, thin 1px rule border, vertical hairline between text and photo columns, top-aligned.
- **Contact:** colophon block (lede + single primary "Email me →" button + Email/LinkedIn/Resume/Phone labeled grid) replaces the original 4-button row.
- **Footer:** on home and about, collapsed to credit + back-to-top only (since the colophon lives just above).

### About

- Wide editorial header (full container) → narrow body (reading container).
- Year-range rail on desktop using `t-mono-caps` in `--accent-soft` tan.
- Tools/methods rendered as `.tag` chips, not inline `·`-separated text.

### Case-study pages

- **Layout, hero, stat ribbon, prose, and methods grid structure: unchanged.** Non-negotiable (user: *"I really like the page layout of the project pages. Don't make any drastic change in the layout or grid in that."*).
- **Methods/Tools/Collaborators block:** tan background kept; bullet lists → `.tag` chips inside each column; mono-caps headings unchanged.
- **PDF embed (Netflix, Amazon Prime):** replaced with a deck cover card — first-page JPEG (1600×900, ~190–284 KB each, generated via `sips -s format jpeg -s formatOptions 85 -Z 1600`), wrapped as a clickable card opening the full PDF in a new tab. Visible-by-default for the editorial preview feel; reliable on mobile (tap → new tab); no JS surface area.
- **Prev/next nav:** 3-up flex layout with center `All work ↑` link.
- **Disclaimer block:** unchanged. Explicitly opted out of restyle.

### Typography (v2 polish)

- **10 named roles** replace ad-hoc `font-size + font-weight` declarations site-wide.
- **All card metrics → `t-h3`** (`--fs-h3` / 700 / serif), color `--accent-soft` tan. Chose `t-h3` over `t-h2` so the metric reads louder than the `t-h4` card title without shouting.
- **`.section__label` → `--fs-tiny` / 500 / 0.14em tracking.** Custom 11px value dropped.
- **No inline `style="..."` attributes anywhere on the site.**

---

## File structure

```
index.html                 Homepage
about.html                 About page
404.html                   404 page
case/
  nwn.html                 Nation With NaMo (real work)
  hebe.html                HEBE (real work)
  netflix.html             Netflix spec exercise
  amazon-prime.html        Amazon Prime spec exercise

css/
  tokens.css               Design tokens (color, type, spacing, motion)
  base.css                 Reset, base typography, 10 typographic roles, spacing utilities
  components.css           Component primitives (container, card, tag, btn, nav, footer, page-header, etc.)
  layout.css               Page-level layouts (hero, case grid, background grid, colophon, about)
  case-study.css           Case-study-specific styles (hero, ribbon, prose, methods chips, deck card, 3-up nav)

js/
  reveal.js                IntersectionObserver scroll-reveal (~30 LoC, only JS file)

Assets/
  aurajeet-portrait.jpg    Editorial portrait (home hero)
  netflix-cover.jpg        Netflix deck first-page JPEG
  amazon-prime-cover.jpg   Amazon Prime deck first-page JPEG
  Netflix.pdf              Netflix spec exercise (full deck)
  Amazon Prime.pdf         Amazon Prime spec exercise (full deck)
  Aurajeet_Mahapatra.pdf   Resume
  og-default.png           Open Graph default image (1200×630)
  favicon.svg              SVG favicon

vercel.json                Routing (cleanUrls, redirects, cache headers)
serve.py                   Local dev server simulating Vercel cleanUrls + redirects

design-system/
  aurajeet-mahapatra-portfolio/MASTER.md   Design system reference (this site)

portfolio-PRD.md           This document
```

Legacy v1 assets remain in `Assets/` for now (`Claude-Cowork.jpg`, `Claude_AI_symbol.svg.png`, `openclaw.png`, `perplexity-ai-icon.webp`, `textures/`) but are no longer referenced anywhere in v2 markup. Slated for cleanup in a future commit.

---

## Acceptance criteria (v2 polish, all met)

- [x] Every typographic style on the site maps to one of the 10 named roles.
- [x] All four homepage case cards have identical dimensions, padding, and metric size.
- [x] Homepage has two distinct sections: WORK and PM PROJECTS.
- [x] Hero photo is constrained inside the container with a thin border.
- [x] About page has a wide editorial header → narrow body with a year-range rail on desktop.
- [x] No inline `style="..."` attributes remain in HTML pages.
- [x] All four case-study pages still pass on `/case/[slug]` and have unchanged hero/ribbon/prose/methods grids.
- [x] Case-study pages use the deck cover card pattern (no auto-loaded PDFs).
- [x] Case-study nav has a 3-up layout with a center "All work ↑" link.
- [x] No regressions: `prefers-reduced-motion`, focus-visible, skip-link, responsive breakpoints all still work.

Pending (sweep work, not blocking deploy):

- [ ] 404 page editorial framing line.
- [ ] Final dead-CSS sweep (`.about-tools__icons` rules, deprecated `.card--featured` / `.card--minor` doc-comments, legacy `Assets/textures/` and unused tool icons).

---

*Document rewritten 2026-04-27 to reflect the v2 redesign. Replaces the v1 PRD which described the dark-space cinematic theme deprecated 2026-04-26.*
