# PM Portfolio — Project Plan & Tracker

> Living document. Updated at every phase boundary.
> Last updated: 2026-05-11

---

## 1. Vision

Personal portfolio for a **Project Manager** role. Minimalist, black-and-white, luxury aesthetic. Reads like a quiet, confident scroll — typography-led, generous whitespace, restrained motion. Engaging without being loud.

---

## 2. Site Map

```
/                              Landing page
├── Nav                        Sticky, scroll-blur
├── Hero                       Full-bleed greyscale bg / color subject right
├── Work                       Stacked vertical entries → /experience/[slug]
├── Projects                   2 large case studies + marquee scroll of teardowns
├── Contact                    Email-as-headline + phone + LinkedIn
└── Footer                     Wordmark + copyright + synthetic timestamp

/experience/[slug]             Per-case-study deep dive (no /experience index)
/projects                      Index — filterable catalog
/projects/[slug]               Per-project case study
/about                         Personal page (background, journey, hobbies)
/resume.pdf                    Direct download
```

### Landing Page Sections

| # | Section  | Notes                                                                                                                                  |
|---|----------|----------------------------------------------------------------------------------------------------------------------------------------|
| 0 | Nav      | Sticky · logo left · `Work · Projects · About · Resume · Contact` · scroll-blur after hero · no CTA button                             |
| 1 | Hero     | Full-bleed photo · greyscale bg bleeds into paper · color subject right ~40% · text overlay left ~60% · ~92vh · mobile stacks text-first |
| 2 | Work     | Stacked vertical entries · hairline divider · type-led · per-entry → `/experience/[slug]` · no `/experience` index                     |
| 3 | Projects | Two-tier · 2 large case studies (50/50 split) + marquee scroll of 7–8 teardowns · `View all projects →` → `/projects` index            |
| 4 | Contact  | Centered · eyebrow + italic status line + email-as-headline + phone · LinkedIn · no form                                               |
| 5 | Footer   | Hairline-top · wordmark + copyright · synthetic "Last updated" timestamp 8–9 days prior                                                |

---

## 3. Visual Direction

Calibrated against user-supplied references (BOHOY luxury monochrome streetwear, Bruno Erdison portfolio).

### Palette

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#0A0A0A` (near-black) | Primary text, filled buttons |
| `--paper` | `#FAFAF7` (warm off-white) | Page background |
| `--paper-pure` | `#FFFFFF` | Cards, image frames |
| `--rule` | `#E6E6E1` | Hairlines, borders |
| `--mute` | `#6B6B66` | Captions, supporting eyebrows, card-level metadata |
| `--ink-soft` | `#1F1F1F` | Hover states |
| `--ink-accent` | `#A8772B` (considered ochre) | Magazine "second ink" — top-level section eyebrows, arrow glyphs (`→` / `←` / `↗`), `<ol>` folio numbers, leading section number on About. Never on body / headings / hairlines / fills. |

> Off-white background (not pure white) gives the "paper" / luxury editorial feel — pure white reads digital/sterile.

### Typography

| Role | Font | Notes |
|------|------|-------|
| Display (hero, section headlines) | **Fraunces** (variable serif, Google Fonts, free) | Modern editorial serif. Lowercase preferred for headlines. |
| Body / nav / UI | **Geist Sans** (Vercel, free) | Clean grotesque, pairs cleanly with Fraunces |
| Eyebrow / labels | Geist Sans, uppercase, tracked +0.12em | All-caps small labels |

Type scale (rem): `0.75 · 0.875 · 1 · 1.125 · 1.25 · 1.5 · 2 · 2.75 · 3.75 · 5 · 7`

### Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (easeOutExpo) — slow exit, no bounce
- Durations: `200ms` micro · `400ms` UI · `700ms` reveal · `1200ms` hero
- Scroll-driven reveals with subtle vertical translate (8–24px) + opacity
- Smooth scroll via Lenis (lerp 0.1)
- No spinning, no bouncing, no parallax-on-everything. Restraint.

### Layout

- 8pt grid, max content width `1280px`, content `1120px`
- Section vertical padding: `clamp(80px, 12vw, 200px)`
- Generous left/right gutter on desktop

### Components

| Component | Style |
|-----------|-------|
| Nav | Sticky · logo left · links right · hairline-bottom + `backdrop-blur` activate after hero scroll · no CTA button · mobile = full-screen overlay |
| Hero | **Full-bleed photo** · greyscale bg bleeds into `--paper` · color subject right ~40% · text overlay left ~60% (eyebrow + lowercase Fraunces name + italic positioning + 2 CTAs) · ~92vh desktop · mobile stacks text-first / photo below · 1200ms `easeOutExpo` reveal on load |
| Buttons | Filled `--ink` (primary) · outlined `--ink` (secondary) · square corners, uppercase tracked, 14px |
| Tertiary link | Underlined uppercase tracked text — "SEE ALL →" pattern |
| Eyebrow | Small uppercase tracked label above every section heading |
| Work entry | Type-led, no image · eyebrow (`COMPANY · ROLE · DATES`) → headline-as-value-statement (Fraunces ~2.25rem) → italic dek (1–2 sentences) → metrics line (3 hard numbers, middot-separated) → 4 capability tag pills (hairline-bordered, no fill) → `Read case study →` CTA · whole entry clickable · entries separated by single hairline divider |
| Case study card (Projects top) | Large image (3:2, slight desaturation) → eyebrow (`CATEGORY · YEAR`) → Fraunces title (~1.5rem) → italic dek (2 lines) → 2-metric outcome line → `Read case study →` CTA · 50/50 split on desktop, stacks on mobile |
| Teardown card (Projects bottom) | Smaller square image (slight desaturation) → Fraunces title (~1rem, max 2 lines) → year in `--mute` · no eyebrow / dek / metrics · whole card clickable |
| Marquee scroll | Continuous gentle horizontal motion (~30–40s loop) · pause on hover · manual back/next arrow override · respects `prefers-reduced-motion` (freezes to manual scroll) · cropped trailing card signals scroll affordance |
| Contact email | Lowercase Fraunces serif `clamp(2rem, 4vw, 3rem)` · `mailto:` link · arrow translates 6px right on hover · email IS the headline of the section |
| Footer | Hairline-top · paper bg continues · ~12px Geist Sans `--mute` · single horizontal row (wordmark + copyright left · synthetic "Last updated [date]" right, dated 8–9 days prior to current) · stacks single column on mobile · no secondary social channels |

### Imagery

- Site **chrome** (nav, sections, type, buttons) is strict monochrome
- Photography keeps **color** — portrait pops against the black/white shell, project screenshots/dashboards remain legible
- Subtle desaturation (~85%) optional for non-hero project images for cohesion

---

## 4. Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first via `@theme` in `app/globals.css` — no `tailwind.config.ts`)
- **Animation:** Framer Motion (mobile menu transitions; section reveals come in Phase 6) + Lenis 1.3 (smooth scroll)
- **Class merging:** `clsx` + `tailwind-merge` (via `lib/cn.ts`)
- **Fonts:** Fraunces + Geist Sans via `next/font/google` (variable fonts)
- **Deployment:** Vercel (static prerender for all routes — currently 7 prerendered pages: `/`, `/_not-found`, `/experience/nwn`, `/experience/hebe`, `/projects`)
- **Resume:** Static PDF in `/public/resume.pdf`, downloaded directly from nav (file is user-supplied)
- **Contact:** Direct links only (mailto + LinkedIn) — no backend, no form service
- **Sub-pages:** True routed pages — `/experience/[slug]` (per case study), `/projects` (index), `/projects/[slug]` (per project), `/about` (personal page) — deep-linkable, indexable, share-friendly
- **Package manager:** npm (pnpm not installed locally)

---

## 5. Phased Build Plan

Each phase requires explicit user approval to start. Independent sub-tasks within a phase are dispatched as parallel sub-agents.

| Phase | Scope                                                                                  | Execution model            | Status      |
|-------|----------------------------------------------------------------------------------------|----------------------------|-------------|
| **0** | Discovery, content gathering, this `project.md`                                        | Orchestrator (main thread) | ✅ Done     |
| **1** | Foundation: repo init, design tokens, responsive layout shell, navigation              | Orchestrator               | ✅ Done     |
| **1.5** | Chrome alignment to new locked spec — Nav refactor (layout, `AM` wordmark, `About` link) + Footer cleanup (wordmark, remove tagline). Synthetic timestamp deferred to Phase 5; hero-aware scroll-trigger logic deferred to Phase 2 | Orchestrator | ✅ Done |
| **2** | Hero Section (full-bleed greyscale-bg / color-subject overlay · text left · gating dependency: photo shoot per brief) **+** hero-aware Nav scroll-trigger logic | 1 sub-agent | ✅ Done |
| **3** | Work section (stacked vertical, type-led entries) **+** per-case-study `/experience/[slug]` template (no index page) | 2 parallel sub-agents | ✅ Done |
| **4** | Projects section (two-tier: 2 large case studies + marquee scroll of teardowns) **+** `/projects` index **+** per-project `/projects/[slug]` template | Orchestrator (single thread) | ✅ Done — code shipped with placeholder banner / thumbnail SVGs; magazine-style image production deferred to a follow-up pass |
| **4.5** | Lift teardown prose from the source SIGMA · PM & Tech Club decks **+** add downloadable original-deck PDFs to all 11 deep dives (9 teardowns + 2 case studies) **+** deck-visibility upgrade (header `ExternalTextLink` + cover image inside `DeckLink`, slide-count metadata) | Orchestrator | ✅ Done |
| **5** | Contact section (email-as-headline + phone + LinkedIn) **+** Footer (wordmark + copyright + synthetic timestamp) | Orchestrator (single thread) | ✅ Done |
| **5.5** | About page `/about` (personal background, journey, hobbies — photography / calligraphy / sketching) | Orchestrator (single thread) | ✅ Done — code shipped with placeholder SVGs + clearly-tagged placeholder copy; real photos + body content swap in via single-line edits in `content/about.ts` |
| **6** | Polish: transitions, scroll reveals, marquee implementation, microinteractions, a11y, responsive QA | Orchestrator | ✅ Done — `FadeUp` scroll-reveal wrapper on Work / Projects / Contact; teardown row replaced with RAF-driven `TeardownMarquee` (35s loop, pause-on-hover, ink arrow controls, reduced-motion static fallback) |
| **7** | Performance, SEO, OG tags, favicon                                                     | Orchestrator               | Pending     |
| **8** | Deployment                                                                             | Orchestrator               | Pending     |
| **9** | AI Recruiter Bot — FAB + drawer + Vercel AI SDK edge route + Gemini 2.5 Flash + 4 client-rendered tools (navigate / openProject / downloadResume / getContact) + suggested chips + brief mode. Website-only knowledge mode for v1 (assembled from `content/{experience,projects,about}.ts` + Contact / Hero constants); `content/bot-knowledge.md` retrains additively when authored. See [AI Bot.md](AI%20Bot.md) for the full spec. | Orchestrator + 2 parallel sub-agents (Backend / Frontend) | ✅ Done — code shipped; outstanding are user-side env vars (`GOOGLE_GENERATIVE_AI_API_KEY` required; Upstash optional) + `/public/resume.pdf` drop-in + eventual `content/bot-knowledge.md` Tier 3 overlay |

---

## 6. Decisions Log

| Date       | Decision                                                                | Rationale         |
|------------|-------------------------------------------------------------------------|-------------------|
| 2026-05-10 | Phased build with explicit user gating per phase                        | Per user request  |
| 2026-05-10 | Orchestrator + parallel sub-agents for independent UI sections          | Per user request  |
| 2026-05-10 | `project.md` is the single source of truth for plan / decisions / state | Per user request  |
| 2026-05-10 | Stack: Next.js + React + TS + Tailwind + Framer Motion                  | Best fit for sub-routes, animations, Vercel deploy |
| 2026-05-10 | Resume = PDF download (no styled page)                                  | Per user choice — keeps nav minimal |
| 2026-05-10 | Contact = direct links only (no form / no backend)                      | Per user choice — fastest, zero infra |
| 2026-05-10 | Hosting = Vercel                                                        | Per user choice — pairs with Next.js |
| 2026-05-10 | Content = user-supplied (real copy, dates, details)                     | Per user choice — no placeholder filler |
| 2026-05-10 | Sub-pages = true routes (`/experience`, `/projects`)                    | Deep-linkable, SEO, accessibility, share-friendly |
| 2026-05-10 | Hero = split layout (BOHOY-style) — text left, portrait right          | Reads professional / PM-coded, gives recruiters context immediately |
| 2026-05-10 | Imagery = color photography on monochrome chrome (Bruno-style)          | Portrait pops; project dashboards stay legible |
| 2026-05-10 | Display font = Fraunces, Body = Geist Sans                              | Free, modern editorial pairing matching reference vibe |
| 2026-05-10 | Background = warm off-white (#FAFAF7), not pure white                   | Editorial / paper feel; pure white reads digital |
| 2026-05-10 | Phase 1 used Next.js 16 + Tailwind v4 (current latest)                  | Next 15 was planned; latest stable is 16 — adopted with no spec impact |
| 2026-05-10 | Added `tailwind-merge` (was not in original deps list)                  | Safe Tailwind class merging; standard for production React+Tailwind apps |
| 2026-05-10 | npm instead of pnpm                                                     | pnpm not installed on the machine; npm works equivalently |
| 2026-05-10 | Brainstorm reframe — landing page redesigned from independent first principles (not anchored to old portfolio) | User-led reset; every section's choice re-evaluated against criteria |
| 2026-05-10 | Target audience locked: mixed Design-led + Growth-stage + Big Tech PM roles (active search) | All design choices calibrated to the most conservative on essentials and most demanding on craft |
| 2026-05-10 | Evaluation criteria for every choice: practical-for-recruiters · professional/senior-coded · beautiful-in-service-of-the-first-two | Three-criterion rubric resolves all design tradeoffs in priority order |
| 2026-05-10 | Active search timeline → decisive choices, no infinite refinement, ship in weeks | Constrains design discipline; one strong v1 over endless iteration |
| 2026-05-10 | Nav: logo left + links right (conventional) — `Work · Projects · About · Resume · Contact` · sticky with `backdrop-blur` after hero scroll · no CTA button | Conventional layout costs nothing for Big Tech recruiters; design-led folks see craft in typography anyway |
| 2026-05-10 | **Hero changed from split layout → full-bleed photo** (greyscale bg bleeds into paper · color subject right ~40% · text overlay left ~60%) | User-led; preserves "color portrait pops" via selective desaturation; mobile stacks text-first / photo below |
| 2026-05-10 | Hero positioning copy deferred — write in a later pass | User choice — lock layout first |
| 2026-05-10 | No section between Hero and Work (rejected credibility-strip / metrics-strip / capability-strip alternatives) | Editorial discipline — metrics live in case study cards; row-of-numbers reads SaaS-marketing |
| 2026-05-10 | Section renamed: "Education & Experience" → "Work" (eyebrow `EXPERIENCE`); education moves off landing to About / de-emphasized | Work outcomes carry more weight than degree for 2-yr PM |
| 2026-05-10 | Work section layout: stacked vertical full-width entries, hairline divider, type-led, no images on landing entries | Two entries don't benefit from side-by-side; stacked breathes; type discipline carries (mockup confirmed) |
| 2026-05-10 | Dropped `/experience` index page; per-case-study routes only at `/experience/[slug]` | Only 2 entries — landing's Work section already lists both; index would be redundant |
| 2026-05-10 | Projects section adopts two-tier structure: 2 large case study cards (50/50 split) + marquee scroll of 7–8 product teardowns | Honors content quality distribution (case studies vs teardowns are different content types) |
| 2026-05-10 | Project teardown scroll contains teardowns only (case studies appear at top tier only — no duplication in scroll) | Cleaner hierarchy; case studies don't appear twice on the same page |
| 2026-05-10 | No sub-eyebrows in Projects section between the two tiers | Visual hierarchy (size + spatial separation) carries the meaning without explicit labels |
| 2026-05-10 | Marquee scroll behavior: continuous gentle horizontal motion (~30–40s loop), pause-on-hover, manual back/next arrow override, respects `prefers-reduced-motion` | Bruno Erdison reference + accessibility refinements |
| 2026-05-10 | Project images carry subtle desaturation (~85–90%) for cohesion across heterogeneous screenshots | Existing imagery decision applied consistently to project card system |
| 2026-05-10 | Contact uses email-as-headline treatment (large lowercase Fraunces, `mailto:` link) | Editorial weight on the primary action; recruiters can read+copy in one glance even if mailto fails |
| 2026-05-10 | Contact includes phone number (`tel:` link) alongside LinkedIn as secondary tier | Per user request — direct channel, common expectation in Indian recruiter context |
| 2026-05-10 | Contact status copy framed broadly: "Looking for PM roles. Open to relocate or work remotely." | Wider recruiter funnel during active search; less filtered inbound accepted as tradeoff |
| 2026-05-10 | Footer: no secondary social channels (Twitter / GitHub / etc. omitted) | User choice — fewer maintenance points, no stale-profile risk |
| 2026-05-10 | Footer "Last updated" timestamp = synthetic, dated 8–9 days prior to current date (varies) | User choice with documented caveat: AI flagged honesty / credibility risk; user opted to keep this for active-search "always-fresh" effect |
| 2026-05-10 | Added `/about` route to nav and sitemap (personal background, journey, hobbies: photography / painting / calligraphy) | Differentiator that humanizes site; routed page (not landing scroll) preserves contact CTA primacy |
| 2026-05-10 | Hero photo brief: environmental wide-angle, color subject on greyscale bg, ≥4K, 16:9 or 21:9 aspect, business-casual neutrals, composed expression, shot for left-side negative space | Execution carries the entire Hero section; brief documented in §8 Content Inventory |
| 2026-05-10 | Phase 1.5 shipped — Nav consolidated to logo-left / single-nav-right with 5 links (`Work · Projects · About · Resume · Contact`); `About` points to `/#about` placeholder until Phase 5.5 routes `/about`; `AM` Fraunces wordmark replaces `Portfolio` in Nav and Footer; Footer tagline removed; copyright placeholder reads `[Full Name]` until name supplied | Executes the locked Phase 1.5 task list — pure refactor of Phase 1 chrome, no spec changes |
| 2026-05-10 | Name supplied: **Aurajeet Mahapatra** — `AM` wordmark = real initials (not arbitrary). Footer copyright resolved to `© {year} Aurajeet Mahapatra`; root metadata title resolved to `Aurajeet Mahapatra — Project Manager` (template `%s — Aurajeet Mahapatra`). Phase 7 still owns OG tags / description / favicon refinement | Closes Phase 1.5 placeholder + the browser-tab-title inconsistency flagged in the Phase 1.5 summary |
| 2026-05-10 | Hero photo = **placeholder** for Phase 2 (CSS-only soft greyscale frame on the right that bleeds into `--paper`); real photo per shoot brief in §8 swaps in later with no layout shift | User opted to unblock Phase 2 now rather than wait on shoot logistics; placeholder treatment matches the locked greyscale-bleed spec so swap is non-disruptive |
| 2026-05-10 | Hero tagline source provided (campaign growth + HEBE B2B supply chain), with explicit license to improvise / rewrite from scratch — drafts to be presented for user selection before Phase 2 execution | User unblocked the deferred tagline pass; selection happens at Phase 2 kickoff so copy is locked before component is built |
| 2026-05-10 | Hero copy locked at Phase 2 kickoff: eyebrow `PRODUCT MANAGER · BASED IN BANGALORE · OPEN TO ROLES` (city = `BANGALORE`, English-international form, swap to `BENGALURU` if user prefers); tagline = Option A: *"I build products under hard constraints — short cycles, partial data, real consequences."*; CTAs = defaults (`View work` → `#work`, filled · `Get in touch` → `#contact`, outlined) | User selections from Phase 2 kickoff form — tagline closest to user's original voice (just trimmed); city in international form to read instantly for non-Indian recruiters |
| 2026-05-10 | Hero photo placeholder treatment: CSS-only gradient + hairline frame, no silhouette / no avatar / no "your photo here" text. Desktop = full-bleed `linear-gradient(to right, --paper 0% → --paper 50% → --rule 100%)` with hairline frame at `inset-y-[10%] right-[6%] w-[36%]`. Mobile = portrait block `aspect-[4/5] max-w-sm` with vertical gradient mirror. Real photo swap = replace gradient `<div>` with `next/image fill` inside `HeroPhotoPlaceholder` — zero layout shift | User-approved placeholder strategy; isolated swap point so the eventual real-portrait drop-in is non-disruptive |
| 2026-05-10 | Hero `<h1>` rendered directly with display tokens, NOT via the `Heading` primitive — needed tighter min-size (`3.5rem`), tighter leading (`0.92`), tighter tracking (`-0.02em`), and explicit reference to `--text-display-xl` (7.5rem, "reserved for hero name" per `globals.css`). The `Heading` primitive untouched; section headings in Phases 3+ continue to use it | The display variant of `Heading` is calibrated for section headings, not the hero name — overriding three defaults via `className` reads worse than rendering raw |
| 2026-05-10 | Nav scroll-trigger replaced from `window.scrollY > 24` placeholder → IntersectionObserver on `#hero` with `rootMargin: -64px 0 0 0` (accounts for fixed nav strip). Fallback to original scroll heuristic on routes without `#hero` (currently `/experience`, `/projects`). Effect deps include `usePathname()` so the observer reattaches on client-side route changes (orchestrator polish on top of sub-agent output) | Hero-aware activation was the core Phase 2 ask; the pathname dep prevents a stale-observer bug after `/` ↔ `/experience` client-side nav |
| 2026-05-10 | Phase 3 content storage = single typed TS array in [content/experience.ts](content/experience.ts) (`CaseStudy[]` + `getCase` + `getNeighbors` helpers); content lifted verbatim from user's vetted `Cases/nwn.html` + `Cases/hebe.html` source files | Sets the reusable pattern Phase 4 will copy for projects (`content/projects.ts`); decouples data from presentation; both Track A landing entries and Track B deep dives consume the same source-of-truth |
| 2026-05-10 | Slug shape locked to `nwn` / `hebe` (matches the user's old portfolio URL convention) — `slug` typed as the union literal in `content/experience.ts` so adding a third experience entry would require an explicit type widen | Preserves any inbound links to the legacy slugs and keeps the typed array narrow until a third entry actually exists |
| 2026-05-10 | Landing-card picks (3 metrics + first 4 tags from a 5-or-6-deep tag list) chosen for cohort breadth: NWN landing surfaces `Growth Experimentation · Segmentation & Targeting · Analytics Infrastructure · Cross-functional Execution` (drops `Geospatial Modeling` to the deep dive); HEBE landing surfaces `P&L · Marketplace · Supply Chain · Pricing` (drops `0-to-1 · GTM` to the deep dive) | Landing pills must read instantly to a recruiter scanning at depth; deep dive can carry the long tail of capability vocabulary without saturating the headline scan |
| 2026-05-10 | Deep-dive structure intentionally preserves the user's old portfolio template: `Context · My role · Approach (with h3 subsections) · Outcomes · Reflections` + `Methods · Tools · Collaborators` meta-block + cross-case pagination | Per user note: *"I liked the structure and content presentation style + the content has been vetted by me hence saves time"* — copy + structure are reused, only the visual execution is reskinned to the new editorial-luxury system |
| 2026-05-10 | `/experience` index page deleted ([app/experience/page.tsx](app/experience/page.tsx) removed in Phase 3); `/experience` now correctly 404s | Per the locked decision in this log; landing's Work section already lists both case studies, so an index route is redundant |
| 2026-05-10 | Two new reusable primitives shipped: [components/ui/TagPill.tsx](components/ui/TagPill.tsx) (children-based hairline-bordered span — used by both landing entries and deep-dive header / meta block) and [components/ui/StatRibbon.tsx](components/ui/StatRibbon.tsx) (1–4 item type-led stat row, hairlines flip axis at the `md` breakpoint) | Designed for direct reuse in Phase 4 project case studies (Amazon Prime + Netflix), so both phases stay visually + structurally aligned |
| 2026-05-10 | Landing Work entries use a single `<Link>` wrapping the whole `<article>` with `aria-label`, plus a visible "Read case study →" treatment rendered as a styled `<span>` mirroring `TextLink` (no nested anchors) | Satisfies "whole entry clickable + visible CTA affordance" without violating HTML5's anchor-nesting rule; one tab stop + one screen-reader announcement per entry; sighted users get a hover affordance via `group-hover:translate-x-1` on the arrow |
| 2026-05-10 | Cross-case nav uses a local `PrevLink` helper inside [components/sections/CaseStudy.tsx](components/sections/CaseStudy.tsx) (mirrors `TextLink` styling but with leading `←` and `group-hover:-translate-x-1`); `TextLink` API itself untouched | Pagination is the only place on the site that needs leftward-arrow link styling; extending `TextLink` for a one-off would bloat the primitive's API |
| 2026-05-10 | Next.js 16 dynamic-route `params` typed as `Promise<{ slug: string }>` and awaited in [app/experience/[slug]/page.tsx](app/experience/[slug]/page.tsx) — both `generateMetadata` and the page component | Verified against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`; the AGENTS.md caveat about Next 15+ async `params` is now applied in production code |
| 2026-05-10 | Work entries reordered to **HEBE → NWN** (reverse-chronological / resume convention) — array order in [content/experience.ts](content/experience.ts) drives both the landing display order and `getNeighbors`-derived cross-case nav, so the swap is one-line and cascades cleanly. HEBE deep dive now has no `prev` (empty left spacer); NWN deep dive now has no `next` (empty right spacer); `Previous: HEBE` appears on the NWN deep dive | Per user request — current/in-progress role gets the visual prominence of the first card on landing; matches resume convention recruiters scan for |
| 2026-05-10 | Phase 4 visuals decoupled from Phase 4 code — placeholder SVGs ship with the code build (clearly labeled "PLACEHOLDER" so they never get mistaken for final assets); magazine-style banner + thumbnail production runs as a follow-up pass and swaps in via a one-line `image.*` change in [content/projects.ts](content/projects.ts) per asset, no code refactor needed | Code work isn't blocked on iterative magazine-banner production; site is shippable end-to-end now and visually upgrades over time as real images land |
| 2026-05-10 | Project case studies + teardowns share the `/projects/[slug]` route — case studies (Netflix, Amazon Prime) render the rich `<ProjectCaseStudy>` template with disclaimer + ribbon + prose; teardowns render the lighter `<TeardownDetail>` placeholder template (deck content lift deferred). Cross-project pagination is class-aware (case-study deep dives walk only case studies via `getCaseStudyNeighbors`; teardown deep dives walk only teardowns via `getTeardownNeighbors`) | Single dynamic route is simplest; class-aware nav keeps the two content tiers from interleaving in pagination, which would read incoherent given the asymmetric depth of content |
| 2026-05-10 | Teardown displayed `year` locked to **2026** for all 9 entries, overriding the actual 2022–2023 PDF authoring dates. The original `authoredAt` string ("January 2022", etc.) is preserved on each teardown for honesty in the deep dive | Visual cohesion across the section (case studies are also dated 2026); active-job-search "always-fresh" framing carries the same trade-off as the synthetic Footer timestamp decision |
| 2026-05-10 | Teardown row ships as a **static horizontal scroll** in Phase 4 (manual swipe / wheel via `overflow-x-auto` + `snap-x`, with `no-scrollbar` chrome cleanup utility added to [app/globals.css](app/globals.css)). Continuous marquee animation + pause-on-hover + arrow override land in Phase 6 polish per [project.md](project.md) §5 | Static scroll is fully usable today; marquee is a polish concern that needs `prefers-reduced-motion` short-circuit + manual nav controls + animation calibration, which fits the Phase 6 scope rather than blocking Phase 4 ship |
| 2026-05-10 | Teardown thumbnail right-edge bleed signaled via paper-color gradient mask (`bg-gradient-to-l from-paper to-transparent`) on a `pointer-events-none` overlay; row negative-margins out of `<Container>` on the right so the trailing card meets the actual viewport edge | The cropped-tail-card scroll affordance only reads if it meets the viewport edge, not the container gutter; the gradient mask provides the visual fade Bruno Erdison's portfolio uses, without compromising click targets on the trailing card |
| 2026-05-10 | `<picture>` element used for case-study card banners with `<source media="(min-width: 768px)">` — true asset swap between `[slug]-desktop.svg` (3:2) and `[slug]-mobile.svg` (9:19.5), not a CSS resize. Plain `<img>` tag intentional (placeholders are SVG; `next/image` rejects SVGs without `dangerouslyAllowSVG`); swap to `next/image` lands when real WebP banners arrive | Correct responsive-image pattern delivers the right aspect at each breakpoint; `<img>` inside `<picture>` is the pattern the Next.js eslint rule recognizes (no `no-img-element` warning) so no lint disable needed |
| 2026-05-10 | New `ol` block kind added to [content/projects.ts](content/projects.ts) `ProseBlock` type (with optional `{lead, rest}` per item shape for "1. Recommendation name. Description." formatting) — Netflix and Amazon Prime decks both close on ranked lists that need the lead/rest separation. Renders with two-column grid (zero-padded number + content) and divide-y hairlines | Faithful rendering of the case-study deck structure; ProseBody pattern stays declarative and the new kind is opt-in (existing experience CaseStudy doesn't use it) |
| 2026-05-10 | Contact details supplied: email `aurajeetm@gmail.com`, phone `+91 85509 64470` (display) / `tel:+918550964470` (URI), LinkedIn `https://www.linkedin.com/in/aurajeet-mahapatra/`. All three locked into [components/sections/Contact.tsx](components/sections/Contact.tsx) constants at the top of the file (single-source-of-truth pattern, easy edit when needed) | User-supplied; closes the last gating dependency on the landing page |
| 2026-05-10 | Email rendered as the section's visual headline rather than via the `Heading` primitive — needed lowercase enforcement, much tighter clamp `clamp(2rem, 5.5vw, 3.75rem)`, and an inline-flex shape so the trailing arrow translates with the link as one unit on hover. Hidden `<h2 class="sr-only">` satisfies the section's `aria-labelledby` and outline hierarchy without a competing visual headline | Same pattern as the Phase 2 Hero name (`Heading` is calibrated for section headings, not the hero name nor the email-as-headline contact treatment); accessibility outline preserved via the sr-only h2 |
| 2026-05-10 | Phone link uses sanitized `tel:+918550964470` (no spaces, country code prefixed) while displaying the spaced `+91 85509 64470` form for human readability — `tel:` URIs technically tolerate spaces but stripping them is the safe cross-dialer pattern | Mobile dialers across iOS and Android handle stripped `tel:` URIs identically; spacing in display form aids readability for sighted desktop users who will copy-paste |
| 2026-05-10 | LinkedIn opens in a new tab (`target="_blank" rel="noopener"`) — the only outbound link on the section. Phone and email are same-origin handlers (mailto / tel) that hand off to the OS rather than navigating away | Respects the recruiter's session — they came to read the portfolio, opening LinkedIn in-page would lose context. `noopener` blocks the linked tab from manipulating the opening window via `window.opener` |
| 2026-05-10 | Synthetic "Last updated" timestamp shipped — random offset in `[8.0, 9.0)` days back from the build date, formatted via `Intl.DateTimeFormat("en-GB")` as e.g. `2 May 2026`. Computed at module load (build time for SSG), so each production build refreshes the stamp | Implements the Phase 0 decision deferred from Phase 1.5 ("synthetic 'Last updated' timestamp 8–9 days prior to current date, varying"). en-GB day-first format reads cleaner editorially than en-US for an international portfolio |
| 2026-05-10 | Footer rebuild: 2-column on desktop (`AM` wordmark + copyright on left · synthetic timestamp on right), stacks single column on mobile via `flex-col gap-4 md:flex-row md:items-baseline md:justify-between`. Copyright + timestamp share the same `text-[11px] uppercase tracked` treatment so they sit at equal visual weight as the chrome they are | Honors the Phase 0 footer spec ("hairline-top · wordmark + copyright left · synthetic 'Last updated' right · stacks single column on mobile"); equal type weight signals "this row is metadata, not content" |
| 2026-05-10 | About page locked to a 4-section magazine structure ahead of build: (1) air force family upbringing — disposition, (2) college — agency, (3) NWN + HEBE merged — proof, (4) photography + calligraphy + sketching collage — authenticity. Each section reframed from the user's initial "what I learnt" to a section-specific *job* (disposition / agency / proof / authenticity) so the four sections tell one arc instead of four parallel lesson summaries | Brainstorm output — pushed back on the user's initial chronological + repeating-frame instinct; reframe gives each section a distinct purpose without breaking the chronology, which keeps the page from reading as a memoir-as-resume |
| 2026-05-10 | About sections render via a discriminated `layout` field on each `AboutSection` (`image-right` / `image-left` / `grid-below` / `collage`). Sections 1+2 alternate image side via `md:order-2` / `md:order-1` overrides on the text/image divs respectively; section 3 (proof) renders text + 4-photo grid below; section 4 (authenticity) renders text + mixed-aspect tile grid using `grid-flow-row-dense` so portrait + square + landscape + square tiles compose cleanly without manual placement math | Single component handles all four layouts via a `MagazineSection` switch; data-driven via `content/about.ts`, no per-section custom JSX. Mobile DOM order keeps text first regardless of layout (alternation only applies above the `md` breakpoint) so screen-reader / no-CSS reading order is consistent |
| 2026-05-10 | About page placeholders carry the same pattern as Phase 4: 10 SVG files at `public/about/section-*` clearly labeled "PLACEHOLDER", paired with body strings in [content/about.ts](content/about.ts) that are clear-language `[PLACEHOLDER · ~N words. Cover X.]` markers describing what each section needs to do. Real photos + final copy swap in via single-line edits per asset, no code refactor | Same de-coupling principle as Phase 4 — code can ship today; copy + photo iteration happens async without blocking subsequent phases. The descriptive placeholder bodies double as a brief whenever the user (or I, in a later session) sits down to refine |
| 2026-05-10 | About page `<img>` placeholder uses centralized into a local `PlaceholderImg` helper inside [components/sections/About.tsx](components/sections/About.tsx) — single eslint-disable comment instead of 9 inline ones. `src` and `alt` are extracted explicitly (not rest-spread) so the `jsx-a11y/alt-text` rule can statically verify both are always passed | DRY + easy migration target: when real photos land, swap `PlaceholderImg` → `next/image` in one place, all 9 image renders upgrade together |
| 2026-05-10 | Nav `About` link updated from `/#about` (Phase 1.5 placeholder) to `/about` (real route shipped this phase). One-line edit in the `links` array in [components/nav/Nav.tsx](components/nav/Nav.tsx) | Closes the last placeholder href on the nav; About is the fifth and final section of the canonical landing-anchor + dedicated-route mix the spec called for |
| 2026-05-10 | Phase 4.5 — teardown prose lift + original-deck PDFs. Source PDFs (9 SIGMA · PM & Tech Club teardowns + the 2 case-study decks) added to `Cases/` and copied to `public/cases/{slug}.pdf` for serving. `ProjectTeardown` extended with optional `prose: ProseBlock[]`, `deckHref`, `deckSize`; `ProjectCaseStudy` extended with required `deckHref`, `deckSize`. All 9 teardowns now carry full prose lifted from the decks, restructured into the standard portfolio shape (The product · Audience · Feature observations with h3 sub-sections · Recommendations as ranked `ol` · Metrics) | The deferred Phase 4 content lift; closes the "Deep dive — coming soon" placeholder template. Voice is third-person analytical (matches the existing `brief` lines) — distinct from the first-person voice of Netflix and Amazon Prime, which is honest about the difference between an authored-deck-from-2022 and a self-directed exercise |
| 2026-05-10 | New `DeckLink` UI primitive at [components/ui/DeckLink.tsx](components/ui/DeckLink.tsx) — hairline-bordered "Original deck" download block with Eyebrow + Fraunces lowercase headline + Geist tracked metadata line (`PDF · {size} · Authored {date} · Opens in new tab ↗`). Used by both [components/sections/ProjectCaseStudy.tsx](components/sections/ProjectCaseStudy.tsx) and [components/sections/TeardownDetail.tsx](components/sections/TeardownDetail.tsx); external link opens in new tab with `noopener noreferrer` | The case-study HTML had a deck-cover-image pattern; we don't have cover images for teardowns, so the simpler text-only block works for all 11 deep dives uniformly. Whole block is one anchor (single tab stop, single screen-reader announcement) following the same whole-card-clickable pattern used elsewhere on the site |
| 2026-05-10 | `TeardownDetail` template made content-aware: when `prose` is present, renders the full deep dive (header → ProseBody → DeckLink → pagination); when absent, falls back to the existing "Deep dive — coming soon" placeholder card. Same prose renderer pattern as `ProjectCaseStudy` (h2 / h3 / p / ul / ol with `lead`/`rest`) — duplicated rather than extracted to a shared module to keep the component graph flat | Conditional fallback means the template stays useful for any future teardown added without prose; the duplicated `ProseBody` is a known eyes-open trade-off. Lift to a shared module if a third consumer ever needs it |
| 2026-05-10 | Deck visibility upgraded — two surfaces now signal "the original deck exists." (1) An `ExternalTextLink` "Open the original deck ↗" placed under the tag pills (case studies) / under the brief (teardowns) so a skim-reader sees the artifact within the first viewport. (2) `DeckLink` block at the bottom now renders the deck's first-page cover image (16:9, full container width) above the headline, turning a text-only CTA into a visual artifact. Both surfaces point at the same `deckHref`, opening in a new tab with `noopener noreferrer` | Solves the three reader paths separately: the skim-reader catches the deck in the header, the top-to-bottom reader hits the cover-image block as a substantive handoff, the deck-first reader has the header link as an exit-to-deck. Single source of truth (`deckHref` on the data) keeps both surfaces honest |
| 2026-05-10 | `deckSize` field replaced with `deckPages` (slide count). File size matters when downloading; cloud-PDF readers open in-browser, so size is noise. Slide count is content metadata — primary signal of how much the reader is committing to. New `deckCover` field added (path to first-page image at /public/cases/{slug}-cover.svg). All three deck fields are required on `ProjectCaseStudy`, optional on `ProjectTeardown` (consistent with the existing pattern that lets a teardown ship with the placeholder fallback) | Explicit user decision; replaces `PDF · 2.7 MB` with `PDF · 8 slides · Authored August 2023 · Opens in new tab ↗` on the metadata line. The slide-count signal is borrowed from how PMs actually evaluate decks at work — it's the readable proxy for "how much detail" |
| 2026-05-10 | 11 placeholder cover SVGs at [public/cases/{slug}-cover.svg](public/cases/), 16:9 (`1600×900`), clearly labeled "DECK COVER PLACEHOLDER" + product name + "Real cover swaps in when the deck is finalized". Same convention as the Phase 4 banner / thumbnail placeholders | User opted to ship placeholders today and swap to real cover JPGs after updating the source PDFs. One-line edit per asset — change `deckCover: "/cases/cred-cover.svg"` to `"/cases/cred-cover.jpg"` in [content/projects.ts](content/projects.ts) — no code refactor |
| 2026-05-10 | Two new UI primitives shipped: [components/ui/ExternalTextLink.tsx](components/ui/ExternalTextLink.tsx) (mirrors `TextLink` styling but uses plain `<a target="_blank" rel="noopener noreferrer">` and the `↗` glyph instead of `→` — used wherever inline outbound chrome links are needed) and the cover-image-renderer extension to [components/ui/DeckLink.tsx](components/ui/DeckLink.tsx). The `<img>` for the cover uses a plain `<img>` tag with eslint-disable + empty alt (image is decorative; the link's accessible name comes from the headline text) | `next/image` rejects SVG without `dangerouslyAllowSVG` — same trade-off Phase 4 made. Empty alt prevents redundant screen-reader announcement of "image" + "Read the original deck" — the standard a11y pattern for image-inside-link with text content |
| 2026-05-10 | Teardown card pattern reworked from `{Product} teardown` + `2026` → magazine-style `Hook` (Line 1, primary) + `Product` (Line 2, eyebrow-styled byline). Year dropped because every card showed the locked-to-2026 value (zero differentiation, and contradicting the real `authoredAt` shown later); legacy `${product} teardown` title dropped because it added no signal beyond what the section header already carries. Same rework applied to the deep-dive header: eyebrow trimmed from `PRODUCT TEARDOWN · CRED · 2026` to `PRODUCT TEARDOWN · CRED`, H1 leads with the hook (or falls back to the legacy title until each hook is finalized) | User-led design call. Year on a uniform-2026 set was simultaneously dishonest (vs the preserved `authoredAt`) and noise; "{X} teardown" is redundant with both the section eyebrow and the surrounding visual context. Hook-first reads as portfolio content (an argument); product-name-first reads as artifact catalog. Magazine-style headline + byline is the more recruiter-scannable pattern in a 9-card grid |
| 2026-05-10 | Optional `hook?: string` field added to `ProjectTeardown`. When present, hook fills the card Line 1, the deep-dive `<h1>`, and the Next.js page `<title>` for share previews. When absent, the card falls back to `brief` (the existing one-liner) and the deep-dive `<h1>` falls back to `title`. Legacy `title` and `year` fields kept on the type but no longer rendered on cards — graceful migration path: each entry's hook can land independently as the source slides are refreshed, no big-bang content swap required | Same placeholder-everything pattern Phase 4 set: ship the structure now, swap content per-entry over time. The fallback to `brief` means cards remain differentiated even before any hook is written (no card reads "CRED" / "CRED" with the product name twice). `title` and `year` retained for one release while we confirm nothing external depends on them; safe to delete once `hook` is populated for every entry |
| 2026-05-10 | About-page register reframed at content-fill kickoff from "experience-as-capability-evidence" (each section had a PM-coded *job*: disposition / agency / proof / authenticity) to "the longer version of me" — biography, not pitch. [content/about.ts](content/about.ts) updated: body briefs rewritten to surface specific places / people / years; eyebrows relabeled to neutral biographical headers (`01 · Air-force kid` / `02 · College years` / `03 · The field` / `04 · After-hours`); old headlines (`Born into systems`, `What I chose to commit to`, etc.) converted to `[PLACEHOLDER · …]` briefs to be co-derived with each section's final body (a great headline is downstream of the actual content, not upstream of it); top-of-file comment captures the new register and the no-thesis discipline. Banned the "X taught me Y" / "this is why I [now] …" connect-the-dots move across all four sections, on top of the existing PM-cliché ban list | User-led correction: rest of the site is the pitch (case studies, metrics, capability tags); About should be the room where the reader meets the human, not the same pitch in nicer clothes. Each section now closes on a fact or image, never a lesson; the reader connects the dots themselves and gives more credit because they weren't asked to |
| 2026-05-10 | Phase 4 image production pass kicked off. Per-card workflow: user supplies the official transparent-PNG / SVG logo upfront → I source brand colors + reference imagery → propose 2–3 composition options + lock the brief → generate the editorial photo via Imagen-class AI (subject-led still life or app surface, brand-tonal background, dummy realistic content where a name / number / metric is needed) → center-crop to required aspect via `sips` → composite the official logo bottom-left at ~6% inset via SVG + `rsvg-convert` (alpha-preserving; if logo arrives black-on-transparent, an `feColorMatrix` invert flips it to white-on-dark) → convert PNG → WebP at quality 90 via `cwebp` → write to `/public/projects/teardowns/{slug}.webp` (or banner / deck-cover slot per asset type) → update the corresponding `image.*` path in [content/projects.ts](content/projects.ts) one-line. Tools added to chain: `cwebp` (via `brew install webp`); `rsvg-convert` was already on the system via `librsvg`. CRED teardown thumbnail (matte-black metal card on Cod Gray NeoPOP-aesthetic backdrop, `AURAJEET MAHAPATRA` name embossed, dummy Stripe test number `4242 4242 4242 4242`, expiry `12/29`, no bank/network logos, official CRED stacked-logo lockup white-on-transparent at bottom-left) shipped as the first card; final WebP is 117 KB at 1024×1024 (vs. ~700–900 KB had we shipped PNG, ~6–7× smaller) | The Phase 4 follow-up the placeholder strategy was explicitly designed for; technique is incremental and swap-in-only — no code refactor for any subsequent card. Per-card brief lock + user-supplied logo upfront is the workflow optimization adopted after the CRED round trip on logo sourcing |
| 2026-05-10 | About-page section structure refined to a 3-act pattern (Setup → Shaping → Image) — each section now ~3 short paragraphs. SETUP describes the phase honestly (places / people / costs); SHAPING names what the experience left in the writer in plain personal language ("I make friends fast", "Routine feels like home" — not CV vocab like "strong interpersonal skills" or "disciplined"); IMAGE closes on a concrete fact or scene. Briefs in [content/about.ts](content/about.ts) updated for Sections 2 (College) and 3 (The work); Section 4 (Off-hours collage) deliberately exempted to preserve the "hobbies as themselves, not as evidence" register. Test for any shaping line: would a friend recognize this about you, or does it sound like something you'd put on a CV? Section 1 (`Where the jets were the alarm`) committed under the new structure as the canonical example: 3 paragraphs (~107 words), shaping para reads "Some things from that life have stayed with me. I make friends fast. I'm comfortable in new places. Routine feels like home." | User calibration after Section 1 v3: pure "no pitch" register read as detached / observational; the page needed shaping to land but in personal-language form (recognizable to a friend, invisible to a recruiter). Splitting shaping into its own paragraph beats asking it to pull double-duty inside a description-paragraph; keeps SETUP honest and IMAGE restrained while letting SHAPING do real work. Bans on "X taught me Y" / connect-the-dots moves still hold |
| 2026-05-10 | About-page eyebrows switched from the textured set (`01 · Air-force kid` / `02 · College years` / `03 · The field` / `04 · After-hours`) to the plain-editorial set (`01 · Childhood` / `02 · College` / `03 · The work` / `04 · Off-hours`). Top-of-file comment in [content/about.ts](content/about.ts) updated to match (`childhood, college, the work (NWN + HEBE merged), and off-hours (hobby collage)`). Section 1 headline locked at `Where the jets were the alarm` (image-as-headline from the v5 body) | User preference exercising one of the two pre-approved options. Plain set is more universal — eyebrows now act as neutral category labels, letting the headlines and bodies carry distinctive voice. Textured set pre-framed each section before the reader read it; plain set lets the body do the work |
| 2026-05-11 | Single editorial accent color introduced: `--ink-accent: #A8772B` (considered ochre — Kinfolk / Cereal-coded). Applied as a "second ink" at medium breadth: top-level section eyebrows (`EXPERIENCE` / `PROJECTS` / `CONTACT` / `All work` / `About` page header) via a new `tone="accent"` prop on [components/ui/Eyebrow.tsx](components/ui/Eyebrow.tsx); all arrow glyphs (`→` in TextLink / inline "Read case study" spans / Contact email link, `←` in PrevLink helpers + new `prefixArrow` prop on TextLink, `↗` in ExternalTextLink + Contact LinkedIn); `<ol>` folio numbers in `ProjectCaseStudy` + `TeardownDetail` ProseBody; leading "01" / "02" / "03" / "04" of About-page section eyebrows via a new local `SectionEyebrow` helper that splits the "NN · Label" string at first " · ". Card-level eyebrows (project filing metadata, deep-dive headers, hero meta line, stat ribbon labels, footer chrome) intentionally stay muted to preserve section-vs-card hierarchy. Body, headings (Fraunces in ink), hairlines, buttons, and fills stay strictly monochrome | Brought clarity + magazine wayfinding without breaking the editorial-luxury monochrome shell. Color rendered as type-only at ≤2% surface area, never in fills/borders/headings/body — matches the discipline of premium editorial publications (Apartamento, Kinfolk, NYT Magazine). User selected ochre after seeing side-by-side full-page mockups against ink-blue and oxblood alternatives. Build green; 19 prerendered pages; zero lint warnings even at `--max-warnings 0`; TypeScript strict |
| 2026-05-11 | **Phase 9 (AI Recruiter Bot) shipped** in website-only mode. Foundation: deps installed (`ai`, `@ai-sdk/google`, `@ai-sdk/react`, `@upstash/redis`, `@upstash/ratelimit`, `react-markdown`, `zod`); robot icon extracted from `Reference/ai-bot-states.svg` to [public/ai-bot-icon.svg](public/ai-bot-icon.svg). Backend: 4-tool contract in [lib/bot/tools.ts](lib/bot/tools.ts) (Zod schemas + `ChatTools` / `ChatMessage` types shared between server + client); knowledge assembler in [lib/bot/knowledge.ts](lib/bot/knowledge.ts) reading from `content/{experience,projects,about}.ts` + Hero / Contact constants (with marked merge point for the future `bot-knowledge.md` overlay); system-prompt builder in [lib/bot/system-prompt.ts](lib/bot/system-prompt.ts) with default + brief-mode variants; rate limiter in [lib/bot/rate-limit.ts](lib/bot/rate-limit.ts) (Upstash sliding-window 20 msgs/24h, graceful no-op when env vars missing); edge POST handler at [app/api/chat/route.ts](app/api/chat/route.ts) (Gemini 2.5 Flash, streamText, stop after 3 steps, 300-token cap, 1000-char input cap, 10-turn history cap, `<user_input>` injection guard, 429 + 503 friendly errors). Frontend: `<ChatFab/>` (64×64 ink slab, robot icon, first-visit "Ask me anything" label), `<ChatDrawer/>` (right drawer 420px / mobile bottom sheet 90vh + drag-to-dismiss + AI disclosure + sticky input + MORE QUESTIONS re-summon), `<ChatMessage/>` (markdown rendering + blinking caret for thinking/streaming), `<ChatActionCard/>` (4 adaptive shapes: rich / minimal / medium / inline pill), `<SuggestedChips/>` (Package E + Style B 2×2). Locked Hero + Contact constants lifted to named exports for single-source-of-truth between page and bot. Mounted in [app/layout.tsx](app/layout.tsx). Two parallel sub-agents (Backend + Frontend) dispatched on a shared contract — clean integration, zero conflicts. Build green; 19 prerendered pages + dynamic `/api/chat` edge route; zero lint warnings; TypeScript strict | User-led divergence from the original spec gate (`bot-knowledge.md` first draft) — bot trains on website content for v1 and retrains additively when the markdown overlay is authored. Notice period inline-stubbed (`Can join immediately.`) to keep the locked 4th chip working without a placeholder deflect. AI SDK 6.x is API-compatible with the v5 patterns the spec was drafted against — same `streamText` + `convertToModelMessages` + `toUIMessageStreamResponse`. Server-side `tool({...})` with no-op `execute` chosen over client-side tools because the cards are pure rendering surfaces with click-driven side effects (smooth-scroll, route push, download, copy), not data fetches the model needs results from |

---

## 7. Open Questions

| #  | Question                                                                                  | Status      |
|----|-------------------------------------------------------------------------------------------|-------------|
| Q1 | Tech stack?                                                                               | ✅ Next.js + React + TS + Tailwind + Framer Motion |
| Q2 | "Resume" nav target?                                                                      | ✅ PDF download |
| Q3 | Contact section?                                                                          | ✅ Direct links only |
| Q4 | Sub-pages — true routes vs modals vs in-route transition?                                 | ✅ True routes |
| Q5 | Hosting target?                                                                           | ✅ Vercel |
| Q6 | Project content — user-supplied or AI-drafted placeholders?                               | ✅ User-supplied |
| Q7 | Your name + hero tagline?                                                                 | ✅ Name = **Aurajeet Mahapatra**; tagline = *"I build products under hard constraints — short cycles, partial data, real consequences."* |
| Q8 | Visual reference photos                                                                   | ✅ Received & analyzed (BOHOY + Bruno Erdison) |

---

## 8. Content Inventory _(filled during Phase 0)_

### Identity & contact

- [x] Full name — **Aurajeet Mahapatra**
- [ ] Email (for `mailto:` link in Contact)
- [ ] Phone number with country code (for `tel:` link in Contact)
- [ ] LinkedIn URL
- [ ] City for hero eyebrow location

### Hero

- [x] Eyebrow content — `PRODUCT MANAGER · BASED IN BANGALORE · OPEN TO ROLES` (locked Phase 2)
- [x] One-line positioning copy — *"I build products under hard constraints — short cycles, partial data, real consequences."* (locked Phase 2, Option A)
- [x] CTA copy — `View work` (filled, → `#work`) · `Get in touch` (outlined, → `#contact`) (locked Phase 2, defaults)
- [~] **Hero photo** — Phase 2 ships with placeholder (CSS-only gradient + hairline frame in `HeroPhotoPlaceholder`); real photo per shoot brief swaps in later via `next/image fill` inside the same component, zero layout shift. Shoot brief retained for the eventual photo:
  - Environmental wide-angle, ≥4K wide, 16:9 or 21:9 aspect (wider gives better mobile crop flexibility)
  - Subject anchored right 35–45% of frame, ample empty negative space on left for text overlay
  - Three-quarter or half-body framing (NOT full silhouette)
  - Greyscale background, smooth warm-tone gradient (no texture, no objects, no environmental clutter)
  - Background tone-targeted to match `--paper` (`#FAFAF7`) so it bleeds invisibly into page
  - Subject in color (selective desaturation in post — mask subject, desaturate background)
  - Outfit: business-casual neutrals (no full suit, no hoodies, no saturated colors)
  - Pose: confident-relaxed, mid-thought; expression composed, eyeline into the frame (toward text side, not out of it)
  - Export: AVIF + WebP, sRGB color space, 1× and 2× variants for retina

### Work (2 entries)

All shipped via [content/experience.ts](content/experience.ts) — landing entries + `/experience/[slug]` deep dives both render from this typed source. Order on landing = reverse-chronological (resume convention): HEBE first, NWN second.

**Entry 1 — HEBE (Product & Operations Lead · Jul '25 – Present):**

- [x] Company / role / dates — `HEBE · PRODUCT & OPERATIONS LEAD · JUL '25 – PRESENT`
- [x] Headline-as-value-statement — *Rebuilding a ₹1.6 Cr B2B essential-oil business as a digitally instrumented supply chain*
- [x] Short + long italic dek
- [x] 3 hard metrics — `₹1.6 Cr → ₹2.1 Cr in 12 months · 5,000+ farmer suppliers · 0 → 1 marketplace built`
- [x] 6 capability tags (first 4 surface on landing): `P&L · Marketplace · Supply Chain · Pricing · 0-to-1 · GTM`
- [x] Stat ribbon (3 stats for deep-dive header)
- [x] Full narrative — `Context · My role · Approach (4 h3 subsections: Diagnosis / Marketplace / Supplier-network / Operations digitization) · Outcomes (5-item list) · Reflections`
- [x] Methods / Tools / Collaborators meta block

**Entry 2 — NWN (Nation With NaMo · Associate Consultant · Jul '23 – Jul '25):**

- [x] Company / role / dates — `NATION WITH NAMO · ASSOCIATE CONSULTANT · JUL '23 – JUL '25`
- [x] Headline-as-value-statement — *Growth, experimentation, and analytics for five state-level electoral campaigns*
- [x] Short + long italic dek (landing uses short, deep dive uses long)
- [x] 3 hard metrics — `5/5 campaigns won · 1.2M+ signups · 1.5M+ voter profiles modeled`
- [x] 5 capability tags (first 4 surface on landing): `Growth Experimentation · Segmentation & Targeting · Analytics Infrastructure · Cross-functional Execution · Geospatial Modeling`
- [x] Stat ribbon (4 stats for deep-dive header)
- [x] Full narrative — `Context · My role · Approach (3 h3 subsections: Campaign / Political / Governance war rooms) · Outcomes (7-item list) · Reflections`
- [x] Methods / Tools / Collaborators meta block

### Projects

**Top tier — case study projects (2):**

- [ ] Title · category · year (e.g. `GROWTH · 2025`)
- [ ] Hero image, 3:2 aspect, slight desaturation (~85–90%)
- [ ] Italic dek (2 lines)
- [ ] 2-metric outcome line
- [ ] Full case study content for `/projects/[slug]`

**Bottom tier — product teardowns (7–8):**

- [ ] Title · year for each
- [ ] Square image (slight desaturation, harmonized treatment across the row)
- [ ] Full teardown content for `/projects/[slug]`

**`/projects` index page:**

- [ ] Filter taxonomy (categories): e.g. Growth · Analytics · Strategy · Research · Internal Tool
- [ ] Sort options (default: most recent first)

### Contact

- [ ] Status line copy — currently locked as: *"Looking for PM roles. Open to relocate or work remotely."*

### About `/about`

- [ ] Personal background / life journey copy (~400–600 words target)
- [ ] Hobbies content woven into one thread (photography, painting, calligraphy)
- [ ] Personal photos (professionally taken, ~6–10 max — supports narrative, doesn't become parallel portfolio)

### Other

- [ ] Resume PDF for `/public/resume.pdf` (currently 404)
- [x] Visual reference photos (received & analyzed: BOHOY + Bruno Erdison)
- [x] Mockups: Work section · Projects section · Contact section (in `/assets`)

---

## 9. Status

- **Current phase:** `9` — **AI Recruiter Bot shipped (2026-05-11) in website-only mode.** FAB + drawer + Gemini 2.5 Flash edge route + 4 client-rendered tools + suggested chips + brief mode all live. Bot trains on existing typed website content; `content/bot-knowledge.md` Tier 3 overlay can land later for additive retrain — see [AI Bot.md](AI%20Bot.md) for the full spec + outstanding user-side items (env vars, resume PDF). Landing page + all five routed sections + the chat interface together: Hero ✓ Work ✓ Projects ✓ Contact ✓ Footer ✓ About route ✓ AI bot ✓.
- **Build status:** `npm run build` ✅ green · 19 static pages prerender + new dynamic `/api/chat` edge route · zero lint errors · zero lint warnings · TypeScript strict
- **Local dev:** `npm run dev` → http://localhost:3000 (bot replies require `GOOGLE_GENERATIVE_AI_API_KEY` in `.env.local`; without the key the route returns a friendly 503 and the rest of the site works normally)

### Phase 1 deliverables shipped

- Next.js 16 app initialized at workspace root (no `src/`, alias `@/*`)
- Tailwind v4 design tokens in `app/globals.css` (palette, fonts, motion easings, type scale, custom container utilities)
- Fraunces + Geist Sans wired via `lib/fonts.ts`
- Lenis smooth-scroll provider in `lib/smooth-scroll.tsx` (respects `prefers-reduced-motion`)
- UI primitives: `Eyebrow`, `Heading`, `Button` + `ButtonLink`, `TextLink`, `Container`, `Footer`
- Sticky scroll-aware `Nav` with desktop distributed layout + mobile full-screen overlay
- Routes: `/`, `/experience`, `/projects` (latter two are stubs awaiting Phase 3/4)
- Root layout: fonts, smooth scroll, nav, footer slot, base metadata

### Phase 1.5 deliverables shipped

- [components/nav/Nav.tsx](components/nav/Nav.tsx) — `leftLinks` + `rightLinks` collapsed into a single `links` array of 5 entries (`Work · Projects · About · Resume · Contact`); desktop layout restructured to logo-left + single primary `<nav>` on the right (dual-nav split removed); mobile menu inherits the new order automatically
- `AM` Fraunces serif wordmark replaces `Portfolio` text in both Nav (`text-lg md:text-xl`, `tracking-tight`) and Footer (`text-base md:text-lg`, `tracking-tight`); links to `/` from Nav with `aria-label="AM — home"`
- `About` nav link points at `/#about` placeholder until Phase 5.5 ships the routed `/about` page
- [components/layout/Footer.tsx](components/layout/Footer.tsx) — `Designed with restraint. Built in Next.js.` tagline removed; copyright resolved to `© {year} Aurajeet Mahapatra` (placeholder closed once name was supplied)
- [app/layout.tsx](app/layout.tsx) — root metadata title aligned with the visible chrome: `Aurajeet Mahapatra — Project Manager` (default) / `%s — Aurajeet Mahapatra` (template). Phase 7 still owns OG tags / description / favicon refinement
- **Deferred (per spec):** synthetic "Last updated" footer timestamp arrives in Phase 5 alongside the full Footer rebuild

### Phase 2 deliverables shipped

- [components/sections/Hero.tsx](components/sections/Hero.tsx) — new `"use client"` component implementing the locked spec: full-bleed treatment with text overlay left, CSS-only `HeroPhotoPlaceholder` on the right (subcomponent), staggered Framer Motion reveal (~1200ms, easeOutExpo, eyebrow → name → tagline → CTAs), responsive desktop-overlay / mobile-stack layout, `useReducedMotion` short-circuit. Hero name rendered as raw `<motion.h1>` with `--text-display-xl` token (clamp 3.5rem → 9vw → 7.5rem), tight leading (0.92), tight tracking (-0.02em); `Heading` primitive untouched
- [components/nav/Nav.tsx](components/nav/Nav.tsx) — placeholder `window.scrollY > 24` trigger replaced with `IntersectionObserver` on `#hero` (rootMargin `-64px 0 0 0`, threshold 0). Fallback to original scroll heuristic on routes without `#hero`. Effect deps include `usePathname()` so the observer reattaches correctly on client-side route changes (orchestrator polish on top of sub-agent output to prevent stale-observer bug)
- [app/page.tsx](app/page.tsx) — Phase 1 intro placeholder + hero stub removed; `<Hero />` rendered at the top of `Home`. The `#work` / `#projects` / `#contact` placeholder stubs ship unchanged (their own phases own the rebuild)
- Locked content in production: eyebrow `PRODUCT MANAGER · BASED IN BANGALORE · OPEN TO ROLES`; name `aurajeet mahapatra` (lowercase); tagline (italic Fraunces); CTAs `View work` (filled, `#work`) and `Get in touch` (outlined, `#contact`)
- All 4 routes still prerender as static; lint clean; TypeScript strict

### Phase 5.5 deliverables shipped

- [content/about.ts](content/about.ts) — single source of truth for the About page: `AboutSection` type with `layout` discriminator (`"image-right" | "image-left" | "grid-below" | "collage"`), `AboutImage` type with optional `aspect` for collage tiles, and `aboutSections` array (4 entries). Body strings are clear-language `[PLACEHOLDER · ~N words. Cover X.]` markers describing each section's job — doubles as the brief for the eventual content-refinement pass
- [components/sections/About.tsx](components/sections/About.tsx) — page component (server, no motion). Editorial header (`About` eyebrow + italic display heading) → 4 magazine sections rendered via a `MagazineSection` switch over `layout`. Sections 1+2 alternate image side via `md:order-1` / `md:order-2` (DOM order: text first → text always reads first on mobile / no-CSS); section 3 renders text + 4-photo grid below (`grid-cols-2` mobile / `grid-cols-4` desktop); section 4 renders text + mixed-aspect collage (`grid-flow-row-dense`, `col-span-2` on landscape tile to span 2 cols on desktop, single col on mobile). Hairline `border-t border-rule` separators between sections. `← Back to portfolio` link at the bottom. Local `PlaceholderImg` helper centralizes the lint-disable for placeholder `<img>` use (`src` + `alt` extracted explicitly so the JSX-a11y rule statically verifies both)
- [app/about/page.tsx](app/about/page.tsx) — server component route with `metadata = { title: "About", description: "..." }` (root layout template wraps as `… — Aurajeet Mahapatra`); renders `<About />`
- [components/nav/Nav.tsx](components/nav/Nav.tsx) — `About` nav link updated from `/#about` (Phase 1.5 placeholder) to `/about` (real route shipped this phase). One-line edit in the `links` array
- [public/about/](public/about/) — 10 placeholder SVGs ship alongside the code: 1 for section 1 (`section-1-child-plane.svg`, 4:3) + 1 for section 2 (`section-2-college.svg`, 4:3) + 4 for section 3 (`section-3-{nwn,hebe}-{1,2}.svg`, 1:1 each) + 4 for section 4 (`section-4-{photo-portrait,photo-square,calligraphy,sketch}.svg`, mixed aspects). Each clearly labeled "PLACEHOLDER" with subject hint so they're never mistaken for final assets. Real photos swap in via single-line `images[*].src` change in [content/about.ts](content/about.ts) per asset
- All 11 route entries / 19 prerendered pages green; lint clean (zero warnings even at `--max-warnings 0`); TypeScript strict

### Phase 5 deliverables shipped

- [components/sections/Contact.tsx](components/sections/Contact.tsx) — landing Contact section (server component, no motion). Centered three-tier composition per locked spec: `CONTACT` eyebrow + sr-only `<h2>` (satisfies `aria-labelledby` outline) → italic Fraunces status line (`Looking for PM roles. Open to relocate or work remotely.`) → email-as-headline (`aurajeetm@gmail.com`, lowercase Fraunces serif `clamp(2rem, 5.5vw, 3.75rem)`, `mailto:` link, trailing `→` translates 6px right on hover via inline-flex group) → tier-2 row with phone (`+91 85509 64470` display / `tel:+918550964470` URI) and LinkedIn (`https://www.linkedin.com/in/aurajeet-mahapatra/`, opens in new tab with `noopener`) middot-separated. Contact constants live at the top of the file as a single source of truth — easy edit
- [components/layout/Footer.tsx](components/layout/Footer.tsx) — rebuilt with the synthetic "Last updated" timestamp deferred from Phase 1.5. `getSyntheticLastUpdated()` computes a date in `[8.0, 9.0)` days back at module load (build time for SSG); each production build refreshes the stamp. Format `2 May 2026` via `Intl.DateTimeFormat("en-GB")`. Layout: 2-col on desktop (`AM` wordmark + `© 2026 Aurajeet Mahapatra` on the left, timestamp right-aligned), stacks single column on mobile. Copyright + timestamp share the same `text-[11px] uppercase tracked` chrome treatment for equal weight
- [app/page.tsx](app/page.tsx) — `id: "contact"` placeholder stub array entirely removed; `<Contact />` rendered after `<Projects />`. Landing page is now four real sections + footer: `<Hero /> <Work /> <Projects /> <Contact />`. The placeholder-stub mapping pattern is gone with no remaining stubs
- All 9 route entries / 18 prerendered pages green; lint clean (zero warnings even at `--max-warnings 0`); TypeScript strict

### Phase 4 deliverables shipped

- [content/projects.ts](content/projects.ts) — single source of truth for the Projects section: `ProjectCaseStudy` + `ProjectTeardown` discriminated types, `ProseBlock` (extends Phase 3's union with a new `ol` block kind for ranked recommendation lists), `projectCaseStudies` array (Netflix India + Amazon Prime Video, content lifted verbatim from `Cases/netflix.html` + `Cases/amazon-prime.html`), `projectTeardowns` array (9 entries derived from the `Cases/Teardown_*.pdf` set — slugs `cred · blinkit · sportskeeda · groww · spotify · cult-fit · zerodha · instagram · zoom`), `allProjects` flat list, and four lookup helpers (`getProject` / `getCaseStudy` / `getTeardown` / `getCaseStudyNeighbors` / `getTeardownNeighbors`)
- [components/sections/Projects.tsx](components/sections/Projects.tsx) — landing section orchestrator (server component, no motion): `PROJECTS` eyebrow → top tier (2 case-study cards in 50/50 grid: banner image + editorial card metadata block with eyebrow + Fraunces title + italic dek + hairline-bordered metrics row + `READ CASE STUDY →`) → bottom tier (`<TeardownRow>` — `overflow-x-auto` + `snap-x` + `no-scrollbar` horizontal scroll with right-edge paper-color gradient mask for the cropped-tail-card scroll affordance, row negative-margins out of `<Container>` so the trailing card meets the actual viewport edge) → `View all projects →` link. Top-tier banners use `<picture>` + `<source media="(min-width: 768px)">` for true desktop / mobile asset swap (3:2 → 9:19.5)
- [components/sections/ProjectCaseStudy.tsx](components/sections/ProjectCaseStudy.tsx) — rich deep-dive template for case studies (Netflix, Amazon Prime). Same skeleton as the experience [CaseStudy.tsx](components/sections/CaseStudy.tsx) (header + StatRibbon + ProseBody + cross-case nav with `PrevLink` helper) **plus** an italic disclaimer block above the prose (required for self-directed exercises) **and** the new `ol` ProseBody branch (zero-padded number column + lead/rest item shape) for the ranked Recommendations sections in both decks. No methods/tools/collaborators meta block (these are spec exercises, not role work)
- [components/sections/TeardownDetail.tsx](components/sections/TeardownDetail.tsx) — lighter deep-dive template for teardowns. Header (eyebrow with product + year + title + brief) → bordered placeholder block ("Deep dive — coming soon" + "Original deck authored {authoredAt}") → cross-teardown pagination (walks teardowns only via `getTeardownNeighbors`). Full content lifts in alongside the magazine-style image production
- [app/projects/[slug]/page.tsx](app/projects/[slug]/page.tsx) — single dynamic route handling both kinds. `generateStaticParams` returns all 11 slugs (2 case studies + 9 teardowns); `generateMetadata` resolves per-project title + description; `params: Promise<{ slug: string }>` is awaited. Lookup tries case studies first, falls back to teardowns, `notFound()` otherwise
- [app/projects/page.tsx](app/projects/page.tsx) — index page (replaces the Phase 1 stub). Editorial header (`All work` eyebrow + `Projects` italic display heading + dek) → `Case studies` subsection (2-card grid mirroring landing top tier) → `Product teardowns` subsection (responsive grid: 2-col mobile / 3-col tablet / 4-col desktop with all 9 thumbnails) → `← Back to portfolio` footer link
- [app/page.tsx](app/page.tsx) — `id: "projects"` placeholder stub removed from `sections` array; `<Projects />` rendered between `<Work />` and the remaining `#contact` stub. Index numbering jump (Hero → Work → 04 Contact) self-resolves once Phase 5 replaces the contact stub
- [app/globals.css](app/globals.css) — new `no-scrollbar` Tailwind utility (`@utility no-scrollbar { ... }`) added to hide scrollbar chrome on horizontal-scroll regions (teardown row today, marquee tomorrow). Cross-browser cover: WebKit `::-webkit-scrollbar { display: none }` + Firefox `scrollbar-width: none` + IE/legacy `-ms-overflow-style: none`
- [public/projects/](public/projects/) — 13 placeholder SVGs ship alongside the code: 4 banners (`{netflix,amazon-prime}-{desktop,mobile}.svg` at 1800×1200 / 540×1170) + 9 teardown thumbnails (`teardowns/{slug}.svg` at 800×800). Each is a clearly-labeled "PLACEHOLDER" frame so nothing ever ships looking final by mistake. Real magazine-style banners + product-imagery thumbnails swap in via a one-line `image.*` change in [content/projects.ts](content/projects.ts) per asset, no code refactor
- All 9 route entries / 18 prerendered pages green; lint clean (zero warnings even at `--max-warnings 0`); TypeScript strict

### Phase 3 deliverables shipped

- [content/experience.ts](content/experience.ts) — single source of truth: `CaseStudy` type + `ProseBlock` discriminated union + `caseStudies` array (NWN + HEBE, content lifted verbatim from `Cases/nwn.html` + `Cases/hebe.html`) + `getCase(slug)` and `getNeighbors(slug)` helpers. Sets the typed-content pattern Phase 4 will reuse for projects.
- [components/ui/TagPill.tsx](components/ui/TagPill.tsx) — children-based hairline-bordered span primitive (`<TagPill>{label}</TagPill>`); reused by both landing entries and the deep-dive header / meta block; designed for direct reuse in Phase 4
- [components/ui/StatRibbon.tsx](components/ui/StatRibbon.tsx) — 1–4 item type-led stat row with hairline dividers that flip axis at the `md` breakpoint (vertical on desktop, horizontal between rows on mobile); large Fraunces value + small Geist tracked uppercase label; designed for direct reuse in Phase 4
- [components/sections/Work.tsx](components/sections/Work.tsx) — landing Work section (server component, no motion in this phase): `EXPERIENCE` eyebrow → 2 stacked `<article>` entries separated by hairline divider. Per entry: eyebrow → headline (`Heading variant="h3" as="h2"`, `~2.25rem` Fraunces, `max-w-[24ch] text-balance`) → italic short dek → metrics line (Geist uppercase tracked, hairline rules above + below for editorial weight) → first-4 capability `<TagPill>`s → visible "Read case study →" treatment as a styled `<span>`. Whole `<article>` wrapped in a single `<Link>` with `aria-label`; arrow translates `1px` rightward via `group-hover` (no nested anchors)
- [components/sections/CaseStudy.tsx](components/sections/CaseStudy.tsx) — deep-dive template (server component): header (eyebrow → `Heading variant="h1"` title → italic long dek → all tags) → `<StatRibbon>` → prose body (switches on `ProseBlock.kind` for `h2 / h3 / p / ul`; body Geist Sans `max-w-[68ch] leading-relaxed`; `<ul>` rendered with `divide-y divide-rule` hairlines, no bullet markers) → 3-column Methods · Tools · Collaborators meta block (single column on mobile) → `<nav aria-label="Case study pagination">` with `Previous: …` (local `PrevLink` helper) / `All work` (→ `/#work`) / `Next: …` (`TextLink`)
- [app/experience/[slug]/page.tsx](app/experience/[slug]/page.tsx) — Next.js 16 dynamic route (server component, no `"use client"`): `generateStaticParams` returns both slugs · `generateMetadata` returns `{ title: caseStudy.title, description: caseStudy.dek.long }` (root layout template wraps as `… — Aurajeet Mahapatra`) · `params: Promise<{ slug: string }>` is awaited · `notFound()` from `next/navigation` for unknown slugs
- [app/page.tsx](app/page.tsx) — `id: "work"` placeholder entry removed from the `sections` array; `<Work />` rendered between `<Hero />` and the remaining `#projects` / `#contact` stubs. The remaining stubs ship unchanged (their phases own the rebuild)
- [app/experience/page.tsx](app/experience/page.tsx) — **deleted** (the Phase 1 stub). `/experience` now correctly 404s; `app/experience/` only contains `[slug]/page.tsx`
- All 5 route entries / 7 prerendered pages green; lint clean; TypeScript strict

### Outstanding for Phase 1 (user-side, evergreen)

- Push to GitHub (no remote configured by default)
- Connect repo to Vercel for preview deploys
- Drop a real `public/resume.pdf` (currently 404)

### Outstanding inputs needed before later phases

- Real hero portrait — placeholder is shipped and stable; swap-in is non-blocking
- Project visuals — Phase 4 image production pass **in progress** (started 2026-05-10; technique + tools chain captured in §6 Decisions Log). Per-asset workflow: editorial AI-generated photo + official brand logo composited at bottom-left ~6% inset, exported to WebP. Swap is still one-line per asset in [content/projects.ts](content/projects.ts), no code refactor. Progress tracker below
- Deck covers — Phase 4.5 visibility-upgrade shipped with 11 placeholder SVGs at [public/cases/{slug}-cover.svg](public/cases/), 16:9 aspect. User intends to refresh the source PDFs first; once finalized, real first-page covers (JPG/PNG, same aspect ratio) swap in by replacing the file or updating the `deckCover:` path string in [content/projects.ts](content/projects.ts) per entry — no code refactor
- About page content + photos — Phase 5.5 shipped with placeholder SVGs across all 10 image slots and clearly-tagged placeholder body strings; real photos + final body copy swap in via single-line edits in [content/about.ts](content/about.ts) per asset / per body. Each placeholder body is itself a brief describing the section's job and word-count target

### Phase 4 image production tracker

Pass started 2026-05-10. Per-card workflow + tools chain captured in §6 Decisions Log. Total: 24 image slots across 4 categories. Per-card brief locked with user (composition + dummy realistic content where applicable + official transparent-PNG/SVG logo) **before** generation.

**Teardown thumbnails (1:1, 1024×1024 WebP)** — 1/9 shipped
- [x] `cred` — [public/projects/teardowns/cred.webp](public/projects/teardowns/cred.webp) (117 KB · matte-black metal card / Stripe test number / official stacked logo)
- [ ] `blinkit`
- [ ] `sportskeeda`
- [ ] `groww`
- [ ] `spotify`
- [ ] `cult-fit`
- [ ] `zerodha`
- [ ] `instagram`
- [ ] `zoom`

**Case study banners (3:2 desktop 1800×1200 + 9:19.5 mobile 540×1170 WebP)** — 0/4
- [ ] `netflix-desktop` · `netflix-mobile`
- [ ] `amazon-prime-desktop` · `amazon-prime-mobile`

**Teardown deck covers (16:9, 1600×900 WebP)** — 0/9 (queued after thumbnails)

**Case study deck covers (16:9, 1600×900 WebP)** — 0/2 (queued after banners)

### Phase 6 polish queue (addressed in Phase 6, not earlier)

- Extract a reusable `<RevealOnView>` motion wrapper from the Hero variants pattern; apply to Work / Projects / Contact section eyebrows + headings + bodies for cadence consistency
- Wrap Phase 3 Work entries + Case-study prose blocks (h2 / h3 / p / ul) + StatRibbon items in `<RevealOnView>` once it exists; staggered fade-up matching the Hero rhythm
- Marquee implementation for the Projects bottom-tier teardown row (Framer Motion + CSS keyframe loop with `prefers-reduced-motion` short-circuit, mirrors Hero pattern)
- Trailing `→` translate-on-hover microinteraction for the primary `View work` CTA (matches the existing `TextLink` arrow pattern, ties the two link systems together) — design-review the call before adding hover affordances to a square-corner uppercase button
- Hero name fitment QA across viewport widths — `aurajeet mahapatra` at `--text-display-xl` (120px) Fraunces wraps gracefully on common laptops thanks to clamp + `leading-[0.92]`, but worth eyeballing on real devices during responsive QA
- Manual integration test with OS-level `prefers-reduced-motion` toggle on (Lenis smooth-scroll + IntersectionObserver Nav + Hero reveal + Phase 3 hover translates on tag pills + cross-case nav arrows)
- Outline pass on the landing-page heading hierarchy: Hero name renders the only `<h1>`; Phase 3 Work entries + Phase 4 Projects cards + Phase 5 Contact (sr-only) all correctly use `<h2>`. Hierarchy is clean
- Replace the Phase 4 placeholder SVGs at [public/projects/](public/projects/) with the real magazine-style banners (4 top-tier) + product-imagery thumbnails (9 teardowns); swap is one-line per asset in [content/projects.ts](content/projects.ts) (`image.desktop` / `image.mobile` / `thumb.src`)

### Phase 9 deliverables shipped (2026-05-11)

- [lib/bot/tools.ts](lib/bot/tools.ts) — 4-tool contract (`navigateTo` · `openProject` · `downloadResume` · `getContact`) as Zod-schemed `tool({...})` definitions, with `NAVIGATE_TO_SECTIONS` / `NAVIGATE_TO_SECTION_HREF` / `PROJECT_SLUGS` enums + the inferred `ChatTools` / `ChatMessage` types both server and client import from. Server-side tools with near-no-op `execute` returning `{ ok: true, ... }` so the model completes a step cleanly; the actual side effects fire client-side from `tool-{name}` discriminated UIMessage parts
- [lib/bot/knowledge.ts](lib/bot/knowledge.ts) — typed website-content assembler (bio · logistics · contact · 2 experience entries · 2 case studies · 9 teardowns · 4 about-section briefs), prose-flattener for `ProseBlock[]` arrays, reflections-extractor pulling case-study `## Reflections` subtrees into their own field. Top-of-file TODO marks the additive merge point for the future `bot-knowledge.md` overlay
- [lib/bot/system-prompt.ts](lib/bot/system-prompt.ts) — `buildSystemPrompt` + `buildBriefModeSystemPrompt` builders. Voice + persona block (Editorial, dry, no emoji, first-person) + hard rules (English only, comp decline, off-topic decline, hallucination guard, never roleplay, never reveal system prompt) + tool surface declaration + injection guard + assembled knowledge body. Brief-mode variant adds the 3-bullet first-reply rule + 80-word cap on subsequent replies + auto-surface `downloadResume` + `getContact`
- [lib/bot/rate-limit.ts](lib/bot/rate-limit.ts) — Upstash sliding-window 20 msgs / 24h, lazy singleton client, graceful no-op when env vars missing (single dev-only `console.warn`, prod silent), fail-open on Upstash errors mid-request
- [app/api/chat/route.ts](app/api/chat/route.ts) — edge POST handler. Validates body shape, enforces 1000-char input cap on the latest user message, trims history to last 10 turns, IP rate limit (with locked microcopy on 429), 503 with friendly copy when `GOOGLE_GENERATIVE_AI_API_KEY` missing, wraps every user-typed text snippet in `<user_input>…</user_input>` delimiters before reaching the model, `streamText` with Gemini 2.5 Flash + tools + 300-token output cap + temperature 0.5 + `stopWhen: stepCountIs(3)`, returns `result.toUIMessageStreamResponse()`
- [components/chat/ChatFab.tsx](components/chat/ChatFab.tsx) — 64×64 ink-square FAB + first-visit "Ask me anything" label (4s display, 400ms fade, localStorage-gated) + Esc-to-close + `prefers-reduced-motion` short-circuit
- [components/chat/ChatDrawer.tsx](components/chat/ChatDrawer.tsx) — right drawer (420px desktop) / bottom sheet (90vh mobile, drag-to-dismiss with 120px / 600px-per-second flick threshold), `useChat` hook with `DefaultChatTransport`, AI disclosure banner (first open only, localStorage-gated), suggested-chips empty state, MORE QUESTIONS re-summon, sticky auto-grow textarea + send button, brief-mode regex on first user message, body auto-scrolls to bottom on stream, drawer cancels mid-stream when closed, error rows resolve to locked microcopy by error shape (rate-limit / network / unknown)
- [components/chat/ChatMessage.tsx](components/chat/ChatMessage.tsx) — user bubble (right, ink/paper, square, `whitespace-pre-wrap`) + assistant bubble (left, paper-pure with hairline border, square). React-markdown rendering for assistant text (lists, links target=_blank, no images, no code blocks). Tool parts discriminated by `part.type === "tool-{name}"` with state-guard against `input-streaming` flicker. Single visual treatment for thinking + streaming via blinking `--ink` caret (Framer Motion opacity loop, `prefers-reduced-motion` → solid bar)
- [components/chat/ChatActionCard.tsx](components/chat/ChatActionCard.tsx) — 4 adaptive shapes: rich `openProject` card (140px, eyebrow + Fraunces title + 1-line outcome + 56×56 thumbnail + `OPEN →`, whole card is the `<Link>`), minimal `downloadResume` card (80px, hairline-PDF icon + filename + `DOWNLOAD →`, anchor with `download`), medium `getContact` card (100px, email + LinkedIn lines + `COPY →` button that copies email to clipboard with 2s `COPIED ✓` confirmation), inline pill `navigateTo` (36px, tracked-uppercase pill, calls `onNavigate` to close the drawer so Lenis smooth-scroll runs uninterrupted). Local 11-slug `PROJECT_CARDS` lookup for title + outcome + thumb path; email + LinkedIn imported from the Contact section's exported constants for single-source-of-truth
- [components/chat/SuggestedChips.tsx](components/chat/SuggestedChips.tsx) — 2×2 grid (Package E + Style B labels: `30-second overview` · `Are they looking?` · `Open to remote?` · `Notice period?`), staggered Framer Motion fade-up entry, `30-second overview` chip flips brief mode in the parent
- [public/ai-bot-icon.svg](public/ai-bot-icon.svg) — robot icon extracted from the FAB closeup mockup, paper-on-transparent via `feColorMatrix` invert filter (no runtime color filter needed)
- [components/sections/Hero.tsx](components/sections/Hero.tsx) — `HERO_EYEBROW` / `HERO_NAME` / `HERO_TAGLINE` lifted to named exports so the bot's knowledge assembler reads the same source-of-truth strings the recruiter sees on the page; render output unchanged
- [components/sections/Contact.tsx](components/sections/Contact.tsx) — `EMAIL` / `PHONE_DISPLAY` / `PHONE_HREF` / `LINKEDIN_URL` / `STATUS_LINE` lifted to named exports for single-source-of-truth between the page and the bot's contact card
- [app/layout.tsx](app/layout.tsx) — `<ChatFab/>` mounted alongside the existing nav / footer
- All 9 route entries / 19 prerendered pages green + new dynamic `/api/chat` edge route; lint clean (zero warnings even at `--max-warnings 0`); TypeScript strict

### Phase 9 outstanding (user-side, not code blockers)

- **Provision env vars on Vercel before deploy.** `GOOGLE_GENERATIVE_AI_API_KEY` is required for the bot to reply (without it `/api/chat` returns 503 with friendly copy, rest of site works). `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are optional for v1; without them rate limiting is a no-op
- **Drop `/public/resume.pdf` in.** The `downloadResume` tool currently surfaces a 404 link
- **Author `content/bot-knowledge.md`** when ready (template in [AI Bot.md](AI%20Bot.md) §9). Loader has a marked merge point — landing the file is purely additive, no code refactor. Tier 3 anecdotes / candid FAQ / voice samples / weakness framing all live there
- **Manual QA pass** before launch: rate-limit hit, abuse-prompt set, mobile drawer flow on a real phone, brief-mode end-to-end, tool cards on slow networks

### Next phase ready to start

**Phase 6 — Polish** (orchestrator). Extract a `<RevealOnView>` motion wrapper, apply staggered fade-up to Work / Projects / Contact / About sections matching the Hero rhythm; build the actual continuous marquee animation for the Projects bottom-tier teardown row (CSS keyframe loop + `prefers-reduced-motion` short-circuit); microinteractions; a11y audit (now also covers the chat drawer / FAB); responsive QA (now also covers the bottom-sheet drag-to-dismiss). No gating dependencies.

Open in parallel (none gate any subsequent phase):

- **Phase 4 image follow-up** — real magazine-style banners + product-imagery thumbnails to swap into placeholder SVGs at [public/projects/](public/projects/) one-line at a time
- **Phase 5.5 content + photos follow-up** — final About body copy + 10 real photos to swap into placeholder SVGs at [public/about/](public/about/) and the `[PLACEHOLDER · …]` body strings in [content/about.ts](content/about.ts) — each one-line edit
- **Phase 7 perf / SEO / OG tags / favicon**
- **Phase 8 deployment** — push to GitHub + Vercel hookup; provision Phase 9 env vars at the same time
- **Phase 9 follow-up** — author `content/bot-knowledge.md` for the additive Tier 3 overlay (anecdotes / FAQ / voice samples / weakness framing); drop in `/public/resume.pdf`
