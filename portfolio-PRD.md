# Portfolio Website — Product Requirements Document
**Owner:** Aurajeet Mahapatra
**Audience:** HR, Hiring Managers (Senior PMs at tech companies)
**Goal:** Position Aurajeet as a structured, execution-oriented early-career PM with technical fluency and strong product instinct.
**Status:** All phases (1–6) complete. Phase 7 (project viewer + mobile polish) complete.
**Last updated:** 2026-04-12

---

## Guiding Principle
Every section answers one question a hiring manager has while scrolling:
- Hero → *"Who is this person?"*
- Projects → *"Can they think like a PM?"*
- AI Fluency → *"Are they modern and fast?"*
- About → *"Where do they come from?"*
- Experience → *"What have they actually done?"*
- Contact → *"How do I reach them?"*

---

## Visual & Design System

**Theme:** Dark background (`#04050a`) throughout
**Accent colour:** Gold (`#f5b944`) — used on numbers, labels, active states, pins, glows. Bright gold (`#ffd700`) for active/glow states.
**Typography:** Playfair Display (serif) for headings, Inter (sans-serif) for body text
**Layout:** Single-page scroll (index.html) with three sub-pages (experience.html, projects.html, project-viewer.html)
**Navigation:** AM monogram (top left) · Projects · About · Contact (top right)
**Footer:** `Aurajeet Mahapatra — 2026` (left) · `Built with Claude Code` (right)

**Key colour tokens (implemented in `css/main.css`):**

| Token | Value | Role |
|-------|-------|------|
| `--color-bg` | `#04050a` | Page background |
| `--color-surface` | `#0c0d14` | Cards, elevated surfaces |
| `--color-gold` | `#f5b944` | Accent / CTA |
| `--color-gold-bright` | `#ffd700` | Glow, active states |
| `--color-text` | `#e8e8e8` | Primary text |
| `--color-text-muted` | `#888` | Secondary / captions |

---

## Global Animation Layers

These layers are always present across every page, stacked in this order (back to front):

### Layer 1 — Deep Space Background `[BUILT]`
**File:** `js/space-bg.js`
A fixed Three.js canvas (`#space-bg`, z-index 0). Three star-particle layers at different depths, sizes, and drift speeds create parallax. Background colour matches `--color-bg` (#04050a). Star colours are cool white/warm white/soft grey — no gold at this depth.

### Layer 1b — Nebula Gradients `[BUILT]`
**File:** CSS in `#nebula` (index.html)
Fixed `<div>` with three `radial-gradient` ellipses — deep purple, navy, and dark green at very low opacity. Sits at z-index 1 above the star canvas.

### Layer 2 — Hero Sphere (Three.js) `[BUILT]`
**File:** `js/sphere.js`
A dedicated Three.js canvas (`#sphere-canvas`, z-index 2 within hero). 10,000 white particles (#E8EAF0) distributed with vein rejection sampling — clusters along great-circle ridges producing an organic geological texture. Rendered via custom GLSL shaders.

**Reveal:** Sphere expands from near-zero scale over 1.8s with 3 gold ripple rings pulsing outward.
**Idle:** Continuous slow Y-axis rotation + per-particle breathing in the vertex shader.
**Mouse:** Tilts toward cursor + screen-space scatter (NDC proximity in vertex shader).
**Ripple:** Outward ring wave on click; auto-fires every 5–13s from random surface point.
**On scroll:** Gentle opacity fade tied to scroll position (starts at hero center, fully transparent by hero bottom). GSAP ScrollTrigger scrub. No drain, no particle handoff.

### ~~Layer 3 — 2D Particle Canvas~~ `[REMOVED]`
**File:** `js/particles.js` (dead code — not imported anywhere)
The 2D particle flow system (drain, flow, orbit, convergence) was removed on 2026-04-11. The visual was too busy and distracted from the content. The hero sphere remains as the sole particle effect, fading gently on scroll.

### Layer 3b — Background Atmospheres (CSS) `[BUILT]`
**File:** CSS gradients in `#atmosphere` divs (`css/main.css`), animated by `js/sections.js`
The star field (Layer 1) remains constant — the one visual anchor across the entire page. What changes is the nebula/atmosphere layer: scroll-driven CSS gradient overlays that shift color continuously as the user scrolls.

**Transition style:** Continuous blend — no hard cuts. Bell-curve opacity profile for mid-page sections (fade in → hold → fade out). Contact atmosphere fades in and sustains.

**Max opacity:** 0.6 (reduced from 1.0 to keep atmospheres subtle).

**Section atmospheres:**

| Section | Color Palette | Feeling |
|---------|---------------|---------|
| Hero | Pure `#04050a` black | Cold void |
| Projects | Warm amber/gold | Approaching warmth |
| AI Fluency | Cool cyan + muted purple | Electric energy |
| About | Warm brown undertone | Distant intimacy |
| Contact | Aurora spectrum — green, blue, purple from below | Arrival |

**Implementation:** CSS-only gradients. Opacity animated via GSAP ScrollTrigger scrub. Zero render cost.

**Mobile responsive (≤768px):** All atmosphere gradient positions recentered toward 50% horizontally. Ellipses widened to fill narrow viewports. Nebula wisps also recentered. ScrollTrigger ranges tightened (`top 90%`/`bottom 10%`) so glow doesn't stretch over tall mobile sections. Peak opacity slightly boosted (0.7) to compensate for shorter visible window.

### Layer 4 — Cursor Trail (Global) `[BUILT]`
**File:** `js/cursor-trail.js`
8 tiny gold dots follow the mouse cursor and dissipate within 0.5s. Each dot is progressively smaller and more transparent (tail effect). Desktop only — hidden on touch devices. Disabled on slow devices (`perf.isLow`) and when `prefers-reduced-motion` is active. CSS in `main.css` (`#cursor-trail`, `.trail-dot`).

### Progress Bar (Global — Right Edge) `[BUILT]`
**File:** `js/progress-bar.js`
A 3px vertical gold line on the right edge of the screen. Fills top-to-bottom as the user scrolls. At 100% scroll, pulses with a gold glow (`box-shadow`). Disabled when `prefers-reduced-motion` is active. CSS in `main.css` (`#scroll-progress`, `#scroll-progress-fill`).

### Performance Strategy
- **All devices including mobile:** Full cinematic experience — no compromises, nothing removed
- **Slower desktop/laptop devices only:** Remove cursor trail and card stagger animations — cinematic core (hero sphere, experience sphere, icon animations) never touched
- **prefers-reduced-motion:** All GSAP animations skipped; text visible immediately; scroll hint shown at 0.6 opacity; Three.js spheres jump to full size

---

## Page 1 — index.html (Main Page)

---

### Section 1 — Hero `[BUILT]`

**Files:** `css/hero.css`, `js/hero.js`, `js/sphere.js`
**Layout:** Full-viewport. No photo. Three.js particle sphere as visual centrepiece. Name and tagline overlaid. Metrics below.

#### Content

**Name:**
```
Aurajeet Mahapatra
```
*Animation: `hero.js` wraps each character in `.char` spans. GSAP staggers them in (0.3s duration, 0.025s stagger, 0.1s delay) — fires after sphere reveal completes (~2.1s).*

**Tagline:**
```
I make complicated things feel obvious.
Scroll down to see if it worked.
```
*Line 1 fades in 0.84s after sphere reveal (GSAP timeline). Line 2 fades in softer (opacity 0.7) after a 0.15s gap.*

**Impact Snapshot Label:**
```
WHAT I'VE MOVED
```

**Metrics:**

| Number | Label |
|--------|-------|
| 1.2M+ | Users Acquired |
| 35% | Engagement Lifted |
| 40% | Faster Decisions |
| 31% | Revenue Grown |

*Metrics block fades in 1.5s after sphere reveal. Numbers count up simultaneously via IntersectionObserver + requestAnimationFrame (1.8s, ease-out-cubic). Gold numbers, labels fade in after count completes.*

**Scroll Hint:**
Small pulsing chevron at bottom of hero. Fades in 2.5s after sphere reveal. Floats up/down via CSS `@keyframes scroll-hint-float` (7px, 2s cycle).

#### Sphere Behaviour (As Built)
**10,000 white particles** (#E8EAF0) form a dense sphere via vein rejection sampling — organic geological texture with great-circle ridges. Rendered in Three.js with custom GLSL shaders.

**Cinematic reveal sequence (all timings from page load):**
- t = 0ms — page dark; only stars visible
- t = 300ms — sphere begins expanding from point of light + gold ring 1 launches
- t = 700ms — gold ring 2 launches
- t = 1100ms — gold ring 3 launches
- t = 2100ms — sphere at full size → name fades in
- t ~ 3500ms — tagline fades in
- t ~ 4600ms — metrics fade in, countup starts

**Idle:** Slow Y-axis auto-rotation + per-particle breathing (±1.3% radial pulse in vertex shader).
**Mouse:** Sphere tilts toward cursor (smooth lerp). NDC-space scatter pushes particles outward near cursor.
**Click/Auto-ripple:** Outward ring wave from surface point; auto-fires every 5–13s.

#### On Scroll — Sphere Fade `[BUILT]`

Sphere fades out gently via scroll-coupled opacity (GSAP ScrollTrigger scrub). Starts fading when hero center reaches viewport center, fully transparent by the time hero bottom reaches viewport top. Clean, simple, doesn't distract from content below.

---

### Section 2 — Projects `[BUILT]`

**Files:** `css/sections.css`, `index.html`, `js/sections.js`
**Layout:** Section intro, followed by 3 featured project cards in a row. "View All Projects" button below.

#### Content

**Section Label:**
```
PM PROJECTS
```

**Section Heading:**
```
Real problems. Real thinking. Real artefacts.
```

**Section Sub-heading:**
```
Three documents. Three different product problems. Each one is a real artefact of how I think.
```

#### Project Cards

**Card structure (consistent across all 3):**
- Top left: Document type label (small caps)
- Top right: PDF badge
- Title (serif, large)
- Sub-label: Problem hook (small caps, gold)
- Description (2–3 lines)
- Bottom: `VIEW DOCUMENT →`

---

**Card 1 — Jupiter**
```
Type label:    TEARDOWN
Title:         Jupiter "Magic Spends"
Sub-label:     WHY USERS WEREN'T INVESTING
Description:   Why users weren't investing and the micro-investment feature that fixes it.
CTA:           VIEW DOCUMENT →
```

**Card 2 — Rapido**
```
Type label:    FEATURE SPEC
Title:         Rapido Ride Conversions
Sub-label:     THE APP-SWITCHING PROBLEM
Description:   Eliminating app switching during captain-match wait. Research, solutions, metrics.
CTA:           VIEW DOCUMENT →
```

**Card 3 — Amazon Prime Video**
```
Type label:    OPPORTUNITY BRIEF
Title:         Amazon Prime Video
Sub-label:     PARADOX OF CHOICE
Description:   80% of users can't pick what to watch. Survey-backed research and four RICE-scored solutions.
CTA:           VIEW DOCUMENT →
```

**Below cards:**
```
VIEW ALL PROJECTS →
```
*Links to projects.html*

#### Project Viewer Flow `[BUILT]`
Clicking a project card no longer opens the PDF directly. Instead, it navigates (via warp transition) to `project-viewer.html?project=jupiter&from=home`. The viewer page embeds the PDF full-viewport with a fixed top bar containing:
- **← Back** (left) — returns to origin page (index.html or projects.html) with scroll position restored
- **Project title** (center, hidden on mobile)
- **View Prototype →** (right) — golden CTA button, opens prototype in new tab. Shown in disabled state when no prototype URL is configured.

The `from` query parameter tracks the origin page so the back link returns the user to exactly where they left.

#### Card Animations `[BUILT]`
- Cards fade and slide up from below on scroll entry — staggered, card 1 first then card 2 then card 3, half a beat apart
- On hover: card lifts with subtle shadow, PDF badge bounces
- Background atmosphere: warm amber nebula fades in (continuous blend)

---

### Section 3 — AI Fluency `[BUILT]`

**Files:** `css/sections.css`, `index.html`, `js/sections.js`, `js/ai-animations.js`
**Layout:** Heading, sub-heading, then 4 tool icons in a row with labels beneath each.

#### Content

**Section Heading:**
```
Unfair advantage.
```
*Animation: Snaps in with a subtle scale punch — appears at 110% then settles to 100% in 0.3 seconds.*

**Sub-heading:**
```
AI is how I think faster, build faster, and ship faster.
```

**Tools (icons + labels in a row):**
```
OpenClaw · Claude Cowork · Claude Code · ChatPRD
```

#### Icon Animations — Sequential Loop
Animations play one at a time in sequence. OpenClaw is the main character — always the most prominent.

**OpenClaw (leads every loop):**
Scurries from its position across the full icon row. Stops at the Claude Code icon. Taps it twice. Returns to its position. Triggers next animation.

**Claude Code (triggered by OpenClaw tap):**
Lights up. Blinking terminal cursor appears. Single line of code types out. Clears. Returns to idle.

**ChatPRD:**
Document unfolds from the top — like a PRD rolling out — then folds back to idle.

**Claude Cowork:**
Faint document appears behind it with a line of text being typed character by character, cursor blinking. Completes, clears.

Loop resets. OpenClaw scurries again.
All animations accelerate (2x speed) on hover over the tools area.

*Implementation: `js/ai-animations.js` builds a GSAP timeline with `repeat: -1`. IntersectionObserver starts/pauses based on section visibility. Overlay DOM elements (`.tool-code-overlay`, `.tool-prd-overlay`, `.tool-cowork-overlay`) are created dynamically.*

**Background atmosphere:** Cool cyan + muted purple fades in during this section.

---

### Section 4 — About / Background `[BUILT]`

**Files:** `css/sections.css`, `index.html`, `js/sections.js`
**Layout:** Label, body text, single CTA. Minimal.

#### Content

**Label:**
```
BACKGROUND
```

**Body Text:**
```
I've spent the last few years building systems under high stakes environments — growth funnels, analytics tools, operational workflows. Different industries, same instinct: find the real problem, then solve it properly.
```

**CTA:**
```
VIEW FULL EXPERIENCE →
```
*Links to experience.html*

#### Animation `[BUILT]`
Entire section fades in as a single block on scroll entry. Simple, clean fade — no stagger, no line-by-line.
Background atmosphere: warm brown deep field fades in subtly.

---

### Section 5 — Contact `[BUILT]`

**Files:** `css/sections.css`, `index.html`, `js/sections.js`
**Layout:** Label, heading, sub-heading, 4 CTA buttons in a row.

#### Content

**Label:**
```
CONTACT
```

**Heading:**
```
Let's connect.
```

**Sub-heading:**
```
Open to product roles. Always happy to have a conversation first.
```

**Buttons:**
```
EMAIL ME        → mailto:aurajeetm@gmail.com
LINKEDIN        → LinkedIn profile URL
VIEW RESUME     → Resume PDF
+91 85509 64470 → tel:+918550964470
```
*EMAIL ME uses filled gold style (primary CTA). Other three use outlined style (secondary).*

**Background atmosphere:** Aurora borealis spectrum fades in and sustains.

#### Button Hover Animations `[BUILT]`
- **EMAIL ME:** Shakes gently like an incoming notification
- **LINKEDIN:** Pulses like a connection request being sent
- **VIEW RESUME:** Slides open slightly like a document being pulled from an envelope
- **PHONE:** Subtle vibration like a ringing phone

*Implementation: CSS `@keyframes` in `sections.css`, wired via mouseenter/animationend handlers in `_initContactHovers()` in `sections.js`.*

---

## Page 2 — experience.html `[BUILT]`

**Files:** `experience.html`, `css/experience.css`, `js/experience-main.js`, `js/experience-sphere.js`

### Page Header

**Label:** `EXPERIENCE`
**Heading:** `The long way round.`
**Sub-heading:** `Scroll down to see what I picked up along the way.`

Header text is positioned high in the viewport (`padding-bottom: 42vh`) so it appears to float in the sky above the particle sphere. Fades in on load with staggered entrance animations, then fades out scroll-driven as the journey section approaches.

### Particle Sphere — Planet Effect

**File:** `js/experience-sphere.js`

A massive Three.js particle sphere positioned at the bottom ~60% of the viewport, creating a planet-horizon effect. Reuses the same vein rejection sampling as the hero sphere (`sphere.js`) for visual continuity.

- **15,000 white particles** (#E8EAF0) at 2× scale (`scale.set(2, 2, 2)`), effective radius 2.9 world units
- **Positioned deep below camera** — `position.y = -2.9`, so only the top arc (horizon) is visible
- **Camera:** `(0, 0, 4)` looking at `(0, -0.3, 0)` — slight downward angle
- **Particle sizes:** 1.0–1.8 range, 4.5 point size multiplier in GLSL
- **Idle:** Slow Y-axis auto-rotation + per-particle breathing animation
- **Mouse:** Tilts toward cursor + NDC-space scatter (same as hero sphere)
- **Dissolve:** Per-particle scatter effect with staggered thresholds — particles fly outward along their normals with per-particle randomness for organic disintegration. Driven by `setDissolve(0–1)`.

### Scroll Model — Pinned Step-Through

**File:** `js/experience-main.js`

The journey section is pinned via GSAP ScrollTrigger. Each scroll gesture (wheel tick or touch swipe) advances exactly one step — scroll velocity is irrelevant. Input is locked for 300ms between steps to prevent stacking.

**Steps:**

| Step | Visual |
|------|--------|
| 0 | Sphere visible, no cards (entry point) |
| 1 | Card 0 — "Product Manager" (NEXT) |
| 2 | Card 1 — Business Manager, HEBE |
| 3 | Card 2 — Associate Consultant, NWN |
| 4 | Card 3 — B.Tech, BIT Mesra |
| 5 | Grid reveal — sphere dissolves, all 4 cards visible |

**Boundary behavior:** At step 0, scrolling up exits the section and returns to the header. At step 5, scrolling down exits the section and scrolls past. The user cannot get stuck.

**Scroll hint:** Same pulsing chevron as hero. Appears on load, fades out on first scroll.

**Grid reveal (step 5):**
- Desktop: 2×2 grid centered in viewport, cards positioned via JS
- Mobile (≤600px): `.list-mode` class switches the fixed layer to a scrollable vertical flex column with `overscroll-behavior: contain`

**Sphere dissolve:** Animated via GSAP tween (0.5s, `power2.inOut`). Fires when entering step 5, reverses when stepping back.

### Experience Card Design

Cards are absolutely positioned in a fixed layer (`#exp-cards-layer`, `z-index: var(--z-content)`). Glass-morphism style: `rgba(12, 13, 20, 0.88)` background with 16px backdrop blur, 1px border, rounded corners.

**Card structure:**
```
Date range (small, muted, uppercase)
Contextual label (italic, serif)
Role title (serif, large, bold)
Company / context (gold, small caps)
Description (body text)
Skill tags (outlined gold pills)
```

### Experience Entries

**Entry 0 — NEXT**
```
Date:         NEXT
Context:      Next stop.
Title:        Product Manager
Company:      Wherever the right problem lives
Description:  I've spent years making decisions with incomplete data, managing people
              I didn't hire, and shipping outcomes under pressure. Turns out, that's
              just product management with a different job title. Now I'm making it official.
Tags:         Systems thinker · Structured by default · Ships under pressure
```

**Entry 1 — HEBE (2025 – Present)**
```
Date:         2025 — PRESENT
Context:      Then I ran something.
Title:        Business Manager
Company:      HEBE · B2B Essential Oil Manufacturing and Trading
Description:  Inherited a ₹1.6Cr business, a network of 5,000 farmers, and zero digital
              infrastructure. Left it at ₹2.1Cr, fully digitized, and considerably less chaotic.
Tags:         P&L ownership · Product-market fit · Go-to-market · Revenue growth · 0 to 1
```

**Entry 2 — Nation With NaMo (2023 – 2025)**
```
Date:         2023 — 2025
Context:      Before that, I learned to think.
Title:        Associate Consultant
Company:      Nation With NaMo · 4 states · 5 campaigns
Description:  Growth strategy. Experimentation. Analytics infrastructure. Cross-functional
              team management. All of it at scale, all of it under pressure.
Tags:         User research · Segmentation · Analytics dashboard · Personalisation ·
              Campaign lifecycle ownership · Go-to-market strategy
```

**Entry 3 — BIT Mesra (2019 – 2023)**
```
Date:         2019 — 2023
Context:      And it all started here.
Title:        B.Tech, Mechanical Engineering
Company:      Birla Institute of Technology, Mesra · 8.84 / 10
Description:  Studied mechanical engineering. Somehow ended up in politics, business,
              and product. The degree didn't predict this. Neither did I.
Tags:         Systems thinking · First principles · Analytical rigour
```

---

## Page 3 — projects.html (View All Projects) `[BUILT]`

**Files:** `projects.html`, `css/projects.css`, `js/projects-main.js`
**Layout:** Full grid of 8 project cards. Same card design as main page.
**Note:** Main page (index.html) shows only 3 featured cards. This page shows all 8.
**Navigation:** `← Back` link (top left, fixed) returns to `index.html`. Linked from "VIEW ALL PROJECTS →" in the Projects section on the main page. Project cards link to `project-viewer.html?project=<key>` (no `from` param — back returns to projects.html by default).
**Grid:** 3 columns on desktop (>1024px), 2 columns on tablet (641–1024px), 1 column on mobile (≤640px).
**Animations:** Header fades in on load (staggered label → heading → sub). Cards fade up with stagger on scroll entry (0.1s between columns). Placeholder cards animate to 55% opacity. `prefers-reduced-motion` shows everything immediately.

### Real Projects (3)
Same content as the 3 featured cards on the main page — Jupiter, Rapido, Amazon Prime Video.

### Placeholder Cards (5)

Same card design as real projects but slightly dimmed (reduced opacity).

```
Type label:    COMING SOON
Title:         [Untitled Project]
Sub-label:     IN PROGRESS
Description:   In progress. Check back soon.
CTA:           (no CTA — card not clickable)
```

---

## Page 4 — project-viewer.html (PDF Viewer + Prototype CTA) `[BUILT]`

**Files:** `project-viewer.html`, `css/project-viewer.css`, `js/project-viewer-main.js`
**Layout:** Fixed top bar + full-viewport embedded PDF. No scroll — the PDF has its own internal scroll.
**URL pattern:** `project-viewer.html?project=<key>&from=<origin>`

### Top Bar
Fixed at top with backdrop blur (`rgba(4, 5, 10, 0.88)`, 12px blur), 1px bottom border. Three elements:

| Position | Element | Behaviour |
|----------|---------|-----------|
| Left | `← Back` | Returns to origin page. If `from=home` → `index.html`, otherwise → `projects.html`. Scroll position restored by PageTransition. |
| Center | Project title | Serif font, muted color, ellipsis overflow. Hidden on mobile (≤768px). |
| Right | **View Prototype →** | Golden primary CTA (solid `--color-gold` bg, dark text). Opens in new tab. Disabled state (35% opacity, non-interactive) when no prototype URL is set. |

### Prototype CTA Button
```css
background: var(--color-gold);
color: #04050a;
font-weight: 700;
text-transform: uppercase;
border-radius: var(--radius-md);
```
Hover: `--color-gold-bright` background + 24px gold glow + 1px lift.

### Project Data (in `js/project-viewer-main.js`)
```javascript
const PROJECTS = {
  jupiter: { title, pdf, prototype: null },
  rapido:  { title, pdf, prototype: null },
  amazon:  { title, pdf, prototype: null },
};
```
Replace `null` with prototype URLs when available. The CTA auto-activates when a URL is present.

### PDF Embed
Uses `<embed type="application/pdf">` with a fallback download link for browsers without embed support. Fills viewport below the top bar.

### Entrance Animation
Top bar slides down from -20px with fade. PDF embed fades in 0.15s later. Both respect `prefers-reduced-motion`.

---

## Open Items

| # | Item | Status |
|---|------|--------|
| 1 | ChatPRD icon asset needed for AI Fluency section | Open |
| 2 | LinkedIn profile URL to be added | Open |
| 3 | Jupiter teardown PDF — not in Assets/ | **Missing** |
| 4 | Rapido feature spec PDF — not in Assets/ | **Missing** |
| 5 | Amazon Prime PDF — in Assets/ as `Amazon Prime.pdf` | Available |
| 6 | `Netflix PRD.pdf` in Assets/ — unclear which project this maps to | **Clarify** |
| 7 | Resume PDF — in Assets/ as `Aurajeet_Mahapatra.pdf` | Available |
| 8 | Placeholder cards to be replaced as new projects are completed | Ongoing |
| ~~9~~ | ~~Particle flow system~~ | **Removed** — too visually busy |
| 10 | `tools/generate-heightmap.mjs` + `Assets/textures/heightmap.png` — dead code from removed terrain planet | **Cleanup** |
| 11 | `Assets/Hridesh_Resume_December.pdf` — unrelated file in Assets/ | **Cleanup** |

---

## Available Assets

| File | Role |
|------|------|
| `Assets/Amazon Prime.pdf` | Card 3 project document |
| `Assets/Netflix PRD.pdf` | Unknown — needs mapping |
| `Assets/Aurajeet_Mahapatra.pdf` | Resume (Contact section) |
| `Assets/openclaw.png` | AI Fluency — OpenClaw icon |
| `Assets/Claude_AI_symbol.svg.png` | AI Fluency — Claude Code icon |
| `Assets/Claude-Cowork.jpg` | AI Fluency — Claude Cowork icon |
| `Assets/perplexity-ai-icon.webp` | AI Fluency — Perplexity icon (ChatPRD replacement?) |
| `Assets/Hridesh_Resume_December.pdf` | Unknown — does not belong to this portfolio |
| `Assets/textures/heightmap.png` | Dead code — leftover from removed terrain planet |

---

## File Structure (As Built)

```
index.html                  Main page — all sections built
experience.html             Experience page — built (Phase 4)
projects.html               Projects page — 8-card grid (Phase 5)
project-viewer.html         PDF viewer page — embedded PDF + prototype CTA (Phase 7)
portfolio-PRD.md            This document

css/
  main.css                  Design tokens, reset, layer positioning, atmospheres, z-index scale, mobile responsive lighting
  hero.css                  Hero layout, typography, metrics, scroll hint
  sections.css              Nav, projects, AI fluency, about, contact, footer, overlay styles
  projects.css              Projects page — grid layout, placeholder card styles, responsive
  project-viewer.css        Project viewer — top bar, prototype CTA, PDF embed, responsive
  experience.css            Experience page — sphere viewport, cards, scroll hint, responsive

js/
  main.js                   Entry point (index.html) — imports space-bg, hero, sections, ai-animations
  projects-main.js          Entry point (projects.html) — space-bg + card stagger animations
  project-viewer-main.js    Entry point (project-viewer.html) — query param routing, PDF/prototype setup
  space-bg.js               Layer 1 — Three.js star field (3 parallax layers)
  sphere.js                 Layer 2 — Three.js hero sphere (10k particles, GLSL shaders)
  hero.js                   Hero animation orchestrator (reveal, text, metrics, sphere fade)
  sections.js               Scroll-triggered section animations, atmospheres (mobile-adjusted), contact hovers
  ai-animations.js          AI Fluency icon animation loop (GSAP timeline)
  shooting-stars.js          Shooting star ambient effect (imported by space-bg.js)
  aurora.js                 Aurora borealis for contact section (mobile-adjusted band positions)
  cursor-trail.js           Layer 4 — gold dot trail following mouse cursor (desktop only)
  progress-bar.js           Scroll progress bar — vertical gold line, right edge
  page-transition.js        Warp-jump transitions — handles query params and hash fragments in URLs
  perf.js                   Performance detection — isLow flag for slow devices
  experience-main.js        Experience page orchestrator — pinned step-through scroll model
  experience-sphere.js      Experience page — 15k-particle sphere (planet effect, dissolve)
  particles.js              (dead code — not imported, kept for reference)

Assets/
  Amazon Prime.pdf          Project document
  Netflix PRD.pdf           Project document (needs mapping)
  Aurajeet_Mahapatra.pdf    Resume
  openclaw.png              AI tool icon
  Claude_AI_symbol.svg.png  AI tool icon
  Claude-Cowork.jpg         AI tool icon
  perplexity-ai-icon.webp   AI tool icon
  textures/heightmap.png    (dead code — leftover from removed terrain planet)

tools/
  generate-heightmap.mjs    (dead code — leftover from removed terrain planet)

design-system/
  aurajeet-mahapatra-portfolio/MASTER.md   Design system reference (updated 2026-04-11)
```

---

## Build Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | File structure + Three.js + GSAP setup + deep space background + 2D particle canvas | **Complete** |
| 2 | Hero — 3D sphere (sphere.js), cinematic reveal, text animations, metrics counter, scroll hint | **Complete** |
| 3 | Main page sections — Nav, Projects, AI Fluency (with icon animations), About, Contact (with button hovers), Footer, background atmospheres, sphere scroll fade | **Complete** |
| 4 | Experience page — particle sphere step-through with 4 experience cards + grid reveal | **Complete** |
| 5 | Projects page — 8-card grid (3 real + 5 placeholder) with stagger animations | **Complete** |
| 6 | Polish — cursor trail, scroll progress bar, performance detection, cross-page wiring | **Complete** |
| 7 | Project viewer page + mobile lighting fix + navigation fixes | **Complete** |

### Implementation Notes

Key deviations from original plan that are now the canonical design:

1. **Sphere is Three.js, not 2D canvas.** `sphere.js` uses WebGL with custom GLSL shaders for 10,000 vein-textured particles, gold reveal rings, ripple waves, and NDC-space mouse scatter.

2. **2D particle flow system removed.** The drain/flow/orbit/convergence particle system was too visually busy. Removed entirely on 2026-04-11. The hero sphere now fades out gently on scroll instead. `js/particles.js` is dead code.

3. **Background atmospheres at 60% max opacity.** Gradient overlays are scroll-driven but capped at 0.6 to stay subtle.

4. **AI icon animations in dedicated module.** `js/ai-animations.js` handles the sequential OpenClaw/Claude Code/ChatPRD/Cowork animation loop independently from section scroll triggers.

5. **Experience page: terrain planet replaced with particle sphere.** The original spec called for a terrain planet with heightmap displacement, PBR shaders, bloom post-processing, atmospheric scattering, and golden pins. This was replaced on 2026-04-11 with a simpler 15,000-particle sphere (same vein sampling as hero) positioned as a massive planet at the viewport bottom. `js/planet.js` was deleted. `tools/generate-heightmap.mjs` and `Assets/textures/heightmap.png` are dead code.

6. **Experience page: pinned step-through, not continuous scrub.** The original spec used a scroll-scrubbed camera zoom with planet rotation. This was replaced with a discrete pinned step-through model — each scroll gesture advances exactly one step, scroll velocity is irrelevant. Went through three iterations: continuous scrub → snap points → pinned step-through. The pinned model was chosen because it prevents users from accidentally skipping experience entries.

7. **Performance detection module.** `js/perf.js` checks `hardwareConcurrency` and `deviceMemory` to flag slow devices. When `perf.isLow` is true, cursor trail is disabled and card stagger animations are skipped. Core cinematic effects (spheres, icon animations) are never removed.

8. **Cursor trail and progress bar are global.** Both modules are imported and initialized in all three page entry points (`main.js`, `experience-main.js`, `projects-main.js`). The cursor trail is desktop-only (touch devices excluded) and respects `prefers-reduced-motion`.

9. **Project viewer replaces direct PDF links.** Project cards no longer open PDFs in a new tab. They navigate (via warp transition) to `project-viewer.html` which embeds the PDF with a golden "View Prototype" CTA at the top-right. The `from` query param tracks whether the user came from the landing page or the projects page, so the back button returns them to the correct origin with scroll position restored.

10. **Mobile lighting positions recentered.** All atmosphere layer gradients, nebula wisps, and aurora bands were tuned for desktop viewport widths. On mobile (≤768px), gradient centers are pulled toward 50% horizontally, ellipses widened, and ScrollTrigger ranges tightened so lighting aligns with the narrower, taller mobile layout.

11. **PageTransition handles query params and hashes.** The link interceptor originally checked `href.endsWith('.html')`, which failed for URLs with query params (`?project=...`) or hash fragments (`#projects`). Fixed to strip query/hash before checking: `href.split('?')[0].split('#')[0].endsWith('.html')`.

---

*Document updated 2026-04-12 to reflect Phase 7 — project viewer, mobile lighting, navigation fixes.*
