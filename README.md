# PM Portfolio

Minimalist black & white luxury portfolio for a Project Manager role. Built with Next.js (App Router), TypeScript, Tailwind v4, Framer Motion, and Lenis.

See [`project.md`](./project.md) for the full plan, decisions log, and phase tracker.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first via `@theme`)
- **Animation:** Framer Motion + Lenis (smooth scroll)
- **Fonts:** Fraunces (display) + Geist Sans (body) via `next/font/google`
- **Hosting:** Vercel

## Project structure

```
app/                     Routes (App Router)
  layout.tsx             Root: fonts, smooth scroll, nav, footer
  page.tsx               Landing — section stubs until Phases 2–5
  globals.css            Tailwind import + design tokens
  experience/page.tsx    /experience deep-dive (stub)
  projects/page.tsx      /projects archive (stub)

components/
  layout/                Container, Footer
  nav/                   Sticky nav (desktop + mobile overlay)
  ui/                    Eyebrow, Heading, Button, ButtonLink, TextLink

lib/
  cn.ts                  className merger (clsx + tailwind-merge)
  fonts.ts               next/font configuration
  smooth-scroll.tsx      Lenis client provider

public/                  Static assets (resume.pdf, portrait, project images)
project.md               Plan / decisions / status — single source of truth
```

## Phase status

| Phase | Status |
|-------|--------|
| 0 — Discovery & spec | Done |
| 1 — Foundation | Done (current) |
| 2 — Hero | Pending |
| 3 — Education & Experience + `/experience` | Pending |
| 4 — Recent Projects + `/projects` | Pending |
| 5 — Contact | Pending |
| 6 — Polish (motion, transitions, a11y) | Pending |
| 7 — Performance, SEO, OG, favicon | Pending |
| 8 — Deployment | Pending |

## Required user-supplied assets

These need to be dropped into `public/` (and content fields in components) once the user provides them — see `project.md` §8:

- `public/resume.pdf` — replaces the placeholder used by the Nav download
- Portrait image — referenced from the Hero section in Phase 2
- Project hero images — referenced from project cards in Phase 4
