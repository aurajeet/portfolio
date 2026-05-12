# Phase 7 — SEO / OG Tags / Favicon / A11y Design Spec

**Date:** 2026-05-12
**Status:** Approved

---

## Scope

Five deliverables, no new pages or features:

1. Site URL env var (`lib/site.ts`)
2. Favicon — AM monogram in Fraunces via Next.js `icon.tsx`
3. OG image system — dynamic per-route `ImageResponse` cards
4. Social metadata — `openGraph` + `twitter` blocks on every route
5. A11y + perf — targeted Lighthouse pass, fix what's flagged

---

## 1. Site URL

**File:** `lib/site.ts`

```ts
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
```

Add `NEXT_PUBLIC_SITE_URL=` (blank value) to `.env.local.example` with a comment: `# Set to your production domain on Vercel (Phase 8)`.

`metadataBase` in `app/layout.tsx` root metadata must be set to `new URL(siteUrl())` — required for Next.js to resolve relative OG image paths to absolute URLs.

---

## 2. Favicon

**Font dependency:** `public/fonts/Fraunces-LightItalic.ttf`
Latin-subset of Fraunces (wght 300, ital 1) read with `fs.readFileSync` inside the icon routes. Target size ≤ 40KB subsetted.

**Files added:**

| File | Size | Purpose |
|------|------|---------|
| `app/icon.tsx` | 32×32 | Browser tab favicon, `/icon.png` |
| `app/apple-icon.tsx` | 180×180 | iOS home screen |

**Template (shared visual logic):**

- Background: `#F5F2EC` (`--paper`)
- Text: "AM" centered, Fraunces Light Italic
- Color: `#1A1814` (`--ink`)
- No border, no decoration — lettermark only

**Deletion:** `app/favicon.ico` is removed. Next.js serves the generated PNG icon instead.

---

## 3. OG Image System

### Shared template

**File:** `lib/og.tsx`

Exports a single function:

```ts
export function buildOgImage(title: string, subtitle?: string): ImageResponse
```

**Canvas:** 1200×630px

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  AM                                [top-left, Fraunces] │
│                                                         │
│  {title}                           [~72px, Fraunces]    │
│  {subtitle}                        [~28px, Geist, mute] │
│                                                         │
│                       aurajeet mahapatra [bottom-right]  │
└─────────────────────────────────────────────────────────┘
```

- Background: `#F5F2EC`, text: `#1A1814`, muted: `#6B6560`
- Padding: 80px all sides
- Fonts: `public/fonts/Fraunces-LightItalic.ttf` + `public/fonts/GeistSans-Regular.ttf`

> If `GeistSans-Regular.ttf` is unavailable, fall back to `system-ui` in the OG template only.

### Per-route OG image files

| File | Title | Subtitle |
|------|-------|---------|
| `app/opengraph-image.tsx` | `Aurajeet Mahapatra` | `Product Manager · Bangalore` |
| `app/about/opengraph-image.tsx` | `About` | `Aurajeet Mahapatra · Product Manager` |
| `app/projects/opengraph-image.tsx` | `Projects` | `Case studies & product teardowns` |
| `app/experience/[slug]/opengraph-image.tsx` | `c.title` | `c.dek.short` |
| `app/projects/[slug]/opengraph-image.tsx` | `project.title` or `teardown.hook` | `project.dek.short` or `teardown.brief` |

Dynamic route OG files export `generateImageMetadata` alongside the default `Image` export so Next.js generates one image per slug at build time.

---

## 4. Social Metadata

### Root layout (`app/layout.tsx`)

```ts
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Aurajeet Mahapatra · Project Manager", template: "%s · Aurajeet Mahapatra" },
  description: "Project Manager portfolio. Selected work, experience, and recent projects.",
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

### Per-route updates

**Important — shallow merge behavior:** In Next.js App Router, adding an `openGraph` field to a page's metadata replaces the layout's `openGraph` object entirely (not a deep merge). Each page that exports `openGraph` must include the complete object: `{ type, siteName, locale, title, description, url }`.

The `images` field is omitted from every `openGraph` object — Next.js automatically picks up the co-located `opengraph-image.tsx` file and injects it.

**Home page (`app/page.tsx`):** Currently has no metadata export. When adding one, use `title: { absolute: "Aurajeet Mahapatra · Project Manager" }` to bypass the layout's title template (which would otherwise append "· Aurajeet Mahapatra" again). All other routes use a plain string title and inherit the template correctly.

Routes to update: `app/page.tsx`, `app/about/page.tsx`, `app/projects/page.tsx`, `app/experience/[slug]/page.tsx`, `app/projects/[slug]/page.tsx`.

---

## 5. A11y + Perf

**Process:**

1. `next build` — confirm zero errors
2. `next start` — serve locally
3. `npx lighthouse http://localhost:3000 --output=json --quiet` — capture scores
4. Repeat for `/about`, `/projects`, one experience slug, one project slug
5. Fix every **Opportunity** or **Diagnostic** flagged in Performance and Accessibility categories
6. Re-run to confirm scores improved

**Not in scope:** Lighthouse SEO category (canonical, sitemap, robots.txt — Phase 8).

---

## Files Changed

| File | Change |
|------|--------|
| `lib/site.ts` | **New** — `siteUrl()` helper |
| `.env.local.example` | **New** — documents `NEXT_PUBLIC_SITE_URL` |
| `public/fonts/Fraunces-LightItalic.ttf` | **New** — font for ImageResponse |
| `public/fonts/GeistSans-Regular.ttf` | **New** — font for ImageResponse |
| `app/icon.tsx` | **New** — 32×32 AM monogram favicon |
| `app/apple-icon.tsx` | **New** — 180×180 AM monogram |
| `app/favicon.ico` | **Deleted** |
| `lib/og.tsx` | **New** — shared OG template |
| `app/opengraph-image.tsx` | **New** — home OG image |
| `app/about/opengraph-image.tsx` | **New** |
| `app/projects/opengraph-image.tsx` | **New** |
| `app/experience/[slug]/opengraph-image.tsx` | **New** |
| `app/projects/[slug]/opengraph-image.tsx` | **New** |
| `app/layout.tsx` | Add `metadataBase`, `openGraph`, `twitter` defaults |
| `app/page.tsx` | Add `metadata` export with OG fields |
| `app/about/page.tsx` | Extend `metadata` with OG fields |
| `app/projects/page.tsx` | Extend `metadata` with OG fields |
| `app/experience/[slug]/page.tsx` | Extend `generateMetadata` with OG fields |
| `app/projects/[slug]/page.tsx` | Extend `generateMetadata` with OG fields |

---

## Out of Scope

- `robots.txt` / `sitemap.xml` — Phase 8
- Analytics — Phase 8
- Bundle analysis — not flagged by targeted Lighthouse audit
- Sub-page scroll reveals — locked in Phase 6
