# PM Portfolio — Project Plan & Tracker

> Living document. Updated at every phase boundary.
> Last updated: 2026-05-10

---

## 1. Vision

Personal portfolio for a **Project Manager** role. Minimalist, black-and-white, luxury aesthetic. Reads like a quiet, confident scroll — typography-led, generous whitespace, restrained motion. Engaging without being loud.

---

## 2. Site Map

```
/                  Landing page
├── Hero
├── Education & Experience      (CTA → /experience)
├── Recent Projects              (CTA → /projects)
└── Contact

/experience        Detailed work experience (narrative deep-dive)
/projects          All projects, sorted by recency, filterable by category
```

### Landing Page Sections

| # | Section            | Notes                                                     |
|---|--------------------|-----------------------------------------------------------|
| 0 | Navigation Bar     | Sticky, minimal · Work · Projects · Resume · Contact      |
| 1 | Hero               | Opening line + portrait                                   |
| 2 | Education & Experience | Timeline view · CTA to detailed page                  |
| 3 | Recent Projects    | Horizontal scroll · CTA to all-projects page              |
| 4 | Contact            | Links/form + footer                                       |

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
| `--mute` | `#6B6B66` | Captions, eyebrows on dark |
| `--ink-soft` | `#1F1F1F` | Hover states |

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
| Hero | **Split layout** — eyebrow + serif name + tagline + 2 CTAs on LEFT · color portrait on RIGHT |
| Buttons | Filled `--ink` (primary) · outlined `--ink` (secondary) · square corners, uppercase tracked, 14px |
| Tertiary link | Underlined uppercase tracked text — "SEE ALL →" pattern |
| Eyebrow | Small uppercase tracked label above every section heading |
| Project card | Image-first, eyebrow category beneath, serif title, optional year |
| Nav | Sticky, hairline-bottom, distributed (logo center · links left/right) |

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
- **Deployment:** Vercel (static prerender for all 4 routes confirmed in build)
- **Resume:** Static PDF in `/public/resume.pdf`, downloaded directly from nav (file is user-supplied)
- **Contact:** Direct links only (mailto + LinkedIn) — no backend, no form service
- **Sub-pages:** True routed pages — `/experience` and `/projects` (deep-linkable, indexable, share-friendly)
- **Package manager:** npm (pnpm not installed locally)

---

## 5. Phased Build Plan

Each phase requires explicit user approval to start. Independent sub-tasks within a phase are dispatched as parallel sub-agents.

| Phase | Scope                                                                                  | Execution model            | Status      |
|-------|----------------------------------------------------------------------------------------|----------------------------|-------------|
| **0** | Discovery, content gathering, this `project.md`                                        | Orchestrator (main thread) | ✅ Done     |
| **1** | Foundation: repo init, design tokens, responsive layout shell, navigation              | Orchestrator               | ✅ Done     |
| **2** | Hero Section                                                                           | 1 sub-agent                | Pending     |
| **3** | Education & Experience section **+** `/experience` detail page                         | 2 parallel sub-agents      | Pending     |
| **4** | Recent Projects horizontal scroll **+** `/projects` all-projects page                  | 2 parallel sub-agents      | Pending     |
| **5** | Contact Section + footer                                                               | 1 sub-agent                | Pending     |
| **6** | Polish: transitions, scroll motion, microinteractions, a11y, responsive QA             | Orchestrator               | Pending     |
| **7** | Performance, SEO, OG tags, favicon                                                     | Orchestrator               | Pending     |
| **8** | Deployment                                                                             | Orchestrator               | Pending     |

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
| Q7 | Your name + hero tagline?                                                                 | 🟡 Awaiting (collected during Phase 0 content gathering) |
| Q8 | Visual reference photos                                                                   | ✅ Received & analyzed (BOHOY + Bruno Erdison) |

---

## 8. Content Inventory _(filled during Phase 0)_

- [ ] Full name
- [ ] Hero tagline / opening line
- [ ] Portrait photo
- [ ] College name, degree, graduation year
- [ ] Work experience entries: company · role · dates · key wins
- [ ] Detailed work experience narrative (for `/experience`)
- [ ] Projects: title · category · summary · outcome · hero image · year
- [ ] Resume PDF (if applicable)
- [ ] Contact: email, LinkedIn, optional socials
- [ ] Visual reference photos

---

## 9. Status

- **Current phase:** `1` — Foundation **complete**
- **Build status:** `npm run build` ✅ green · all 4 routes prerender as static · zero lint errors
- **Local dev:** `npm run dev` → http://localhost:3000

### Phase 1 deliverables shipped

- Next.js 16 app initialized at workspace root (no `src/`, alias `@/*`)
- Tailwind v4 design tokens in `app/globals.css` (palette, fonts, motion easings, type scale, custom container utilities)
- Fraunces + Geist Sans wired via `lib/fonts.ts`
- Lenis smooth-scroll provider in `lib/smooth-scroll.tsx` (respects `prefers-reduced-motion`)
- UI primitives: `Eyebrow`, `Heading`, `Button` + `ButtonLink`, `TextLink`, `Container`, `Footer`
- Sticky scroll-aware `Nav` with desktop distributed layout + mobile full-screen overlay
- Routes: `/`, `/experience`, `/projects` (latter two are stubs awaiting Phase 3/4)
- Root layout: fonts, smooth scroll, nav, footer slot, base metadata

### Outstanding for Phase 1 (user-side)

- Push to GitHub (no remote configured by default)
- Connect repo to Vercel for preview deploys
- Drop a real `public/resume.pdf` (currently 404)

### Outstanding inputs needed before Phase 2

- Full name + hero tagline (or vibe / 3 keywords)
- Portrait photo (color)
- Linkedin URL + email for contact section (Phase 5)
- Education record + work experience entries with dates and key wins (Phase 3)
- Project list with titles, categories, summaries, hero images, years (Phase 4)

### Next phase ready to start

**Phase 2 — Hero Section** (1 sub-agent). Awaiting user's content + explicit "go".
