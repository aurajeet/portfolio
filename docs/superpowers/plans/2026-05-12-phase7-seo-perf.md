# Phase 7 — SEO / OG Tags / Favicon / A11y Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add social sharing OG image cards, an AM monogram favicon, complete OpenGraph/Twitter metadata on every route, and fix Lighthouse-flagged a11y and perf issues.

**Architecture:** File-based Next.js App Router conventions — `app/icon.tsx` generates the favicon via `ImageResponse`, per-route `opengraph-image.tsx` files generate social preview cards using a shared `lib/og.tsx` template, and each route's metadata export gains a complete `openGraph` + `twitter` block. Fraunces italic is bundled as a TTF in `public/fonts/` and loaded with `fs.readFileSync` at build time. Geist is optional (try/catch fallback to `system-ui` if the file is absent).

**Tech Stack:** Next.js 16.2.6 (App Router), `next/og` ImageResponse, Fraunces variable italic TTF, TypeScript strict.

---

## File map

| File | Status | Purpose |
|------|--------|---------|
| `lib/site.ts` | New | `siteUrl()` helper |
| `.env.local.example` | New | Documents `NEXT_PUBLIC_SITE_URL` |
| `public/fonts/Fraunces-LightItalic.ttf` | New | Font for ImageResponse |
| `app/icon.tsx` | New | 32×32 AM monogram favicon |
| `app/apple-icon.tsx` | New | 180×180 AM monogram (iOS) |
| `app/favicon.ico` | Deleted | Replaced by generated PNG |
| `lib/og.tsx` | New | Shared OG image template |
| `app/opengraph-image.tsx` | New | Home OG card |
| `app/about/opengraph-image.tsx` | New | About OG card |
| `app/projects/opengraph-image.tsx` | New | Projects OG card |
| `app/experience/[slug]/opengraph-image.tsx` | New | Case study OG card |
| `app/projects/[slug]/opengraph-image.tsx` | New | Project/teardown OG card |
| `app/layout.tsx` | Modify | Add `metadataBase`, `openGraph`, `twitter` defaults |
| `app/page.tsx` | Modify | Add `metadata` with absolute title + OG |
| `app/about/page.tsx` | Modify | Extend metadata with OG/twitter |
| `app/projects/page.tsx` | Modify | Extend metadata with OG/twitter |
| `app/experience/[slug]/page.tsx` | Modify | Extend `generateMetadata` |
| `app/projects/[slug]/page.tsx` | Modify | Extend `generateMetadata` |

---

## Task 1: Font asset + site URL helper

**Files:**
- Create: `public/fonts/Fraunces-LightItalic.ttf` (downloaded)
- Create: `lib/site.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Download the Fraunces italic variable font**

```bash
mkdir -p public/fonts
curl -L \
  "https://github.com/google/fonts/raw/main/ofl/fraunces/Fraunces%5Bopsz%2Cwght%5D-Italic.ttf" \
  -o public/fonts/Fraunces-LightItalic.ttf
```

Verify: `ls -lh public/fonts/Fraunces-LightItalic.ttf` — expect > 100 KB.

If the URL fails, download from fonts.google.com → search "Fraunces" → Download family → extract the italic `.ttf` → rename to `Fraunces-LightItalic.ttf` → place in `public/fonts/`.

- [ ] **Step 2: Create `lib/site.ts`**

```ts
export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
```

- [ ] **Step 3: Create `.env.local.example`**

```bash
# Set to your production domain on Vercel (Phase 8)
# Example: https://aurajeet.com
NEXT_PUBLIC_SITE_URL=
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add public/fonts/Fraunces-LightItalic.ttf lib/site.ts .env.local.example
git commit -m "feat: add Fraunces font asset and siteUrl helper"
```

---

## Task 2: Favicon

**Files:**
- Create: `app/icon.tsx`
- Create: `app/apple-icon.tsx`
- Delete: `app/favicon.ico`

- [ ] **Step 1: Create `app/icon.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const font = readFileSync(
    join(process.cwd(), "public/fonts/Fraunces-LightItalic.ttf")
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F2EC",
          fontFamily: "Fraunces",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 13,
          color: "#1A1814",
          letterSpacing: "-0.5px",
        }}
      >
        AM
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: font, style: "italic", weight: 300 }],
    }
  );
}
```

- [ ] **Step 2: Create `app/apple-icon.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const font = readFileSync(
    join(process.cwd(), "public/fonts/Fraunces-LightItalic.ttf")
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F2EC",
          fontFamily: "Fraunces",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 72,
          color: "#1A1814",
          letterSpacing: "-1.5px",
        }}
      >
        AM
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: font, style: "italic", weight: 300 }],
    }
  );
}
```

- [ ] **Step 3: Remove the old favicon**

```bash
git rm app/favicon.ico
```

- [ ] **Step 4: Build and verify**

```bash
npm run build && npm start
```

Open `http://localhost:3000/icon` — expect AM monogram on paper background.
Open `http://localhost:3000/apple-icon` — expect the same at 180px.
Check the browser tab shows the new favicon.

- [ ] **Step 5: Commit**

```bash
git add app/icon.tsx app/apple-icon.tsx
git commit -m "feat: add AM monogram favicon via Next.js icon.tsx"
```

---

## Task 3: Shared OG image template

**Files:**
- Create: `lib/og.tsx`

- [ ] **Step 1: Create `lib/og.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

const fraunces = readFileSync(
  join(process.cwd(), "public/fonts/Fraunces-LightItalic.ttf")
);

// Geist is optional — fall back to system-ui if the file isn't present.
// To add Geist: download GeistSans-Regular.ttf from github.com/vercel/geist-font/releases
// and place it in public/fonts/.
let geist: Buffer | null = null;
try {
  geist = readFileSync(
    join(process.cwd(), "public/fonts/GeistSans-Regular.ttf")
  );
} catch {
  // system-ui fallback
}

const activeFonts: {
  name: string;
  data: Buffer;
  style: "italic" | "normal";
  weight: number;
}[] = [{ name: "Fraunces", data: fraunces, style: "italic", weight: 300 }];
if (geist) {
  activeFonts.push({ name: "Geist", data: geist, style: "normal", weight: 400 });
}

const bodyFont = geist ? "Geist" : "system-ui";

export function buildOgImage(title: string, subtitle?: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#F5F2EC",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* AM monogram — top-left */}
        <div
          style={{
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 36,
            color: "#1A1814",
            letterSpacing: "-0.5px",
          }}
        >
          AM
        </div>

        {/* Push title to lower half */}
        <div style={{ flex: 1 }} />

        {/* Title */}
        <div
          style={{
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 72,
            color: "#1A1814",
            lineHeight: 1.0,
            letterSpacing: "-1px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle ? (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 28,
              color: "#6B6560",
              marginTop: "24px",
              fontWeight: 400,
            }}
          >
            {subtitle}
          </div>
        ) : null}

        {/* Byline — bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            fontFamily: bodyFont,
            fontSize: 20,
            color: "#6B6560",
            fontWeight: 400,
          }}
        >
          aurajeet mahapatra
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: activeFonts,
    }
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/og.tsx
git commit -m "feat: add shared OG image template"
```

---

## Task 4: Static route OG images

**Files:**
- Create: `app/opengraph-image.tsx`
- Create: `app/about/opengraph-image.tsx`
- Create: `app/projects/opengraph-image.tsx`

- [ ] **Step 1: Create `app/opengraph-image.tsx`**

```tsx
import { buildOgImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return buildOgImage("Aurajeet Mahapatra", "Product Manager · Bangalore");
}
```

- [ ] **Step 2: Create `app/about/opengraph-image.tsx`**

```tsx
import { buildOgImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return buildOgImage("About", "Aurajeet Mahapatra · Product Manager");
}
```

- [ ] **Step 3: Create `app/projects/opengraph-image.tsx`**

```tsx
import { buildOgImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return buildOgImage("Projects", "Case studies & product teardowns");
}
```

- [ ] **Step 4: Build and visually verify all three cards**

```bash
npm run build && npm start
```

Open in browser and confirm each shows the branded card:
- `http://localhost:3000/opengraph-image`
- `http://localhost:3000/about/opengraph-image`
- `http://localhost:3000/projects/opengraph-image`

- [ ] **Step 5: Commit**

```bash
git add app/opengraph-image.tsx app/about/opengraph-image.tsx app/projects/opengraph-image.tsx
git commit -m "feat: add OG images for home, about, and projects routes"
```

---

## Task 5: Dynamic route OG images

**Files:**
- Create: `app/experience/[slug]/opengraph-image.tsx`
- Create: `app/projects/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Create `app/experience/[slug]/opengraph-image.tsx`**

```tsx
import { buildOgImage } from "@/lib/og";
import { getCase } from "@/content/experience";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  return buildOgImage(c?.title ?? "Experience", c?.dek.short);
}
```

- [ ] **Step 2: Create `app/projects/[slug]/opengraph-image.tsx`**

```tsx
import { buildOgImage } from "@/lib/og";
import { getCaseStudy, getTeardown } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cs = getCaseStudy(slug);
  if (cs) return buildOgImage(cs.title, cs.dek.short);

  const td = getTeardown(slug);
  if (td) return buildOgImage(td.hook ?? td.title, td.brief);

  return buildOgImage("Projects");
}
```

- [ ] **Step 3: Build and visually verify**

```bash
npm run build && npm start
```

Open and confirm each shows the correct dynamic title:
- `http://localhost:3000/experience/hebe/opengraph-image`
- `http://localhost:3000/experience/nwn/opengraph-image`
- `http://localhost:3000/projects/netflix/opengraph-image`
- `http://localhost:3000/projects/amazon-prime/opengraph-image`
- `http://localhost:3000/projects/cred/opengraph-image`

- [ ] **Step 4: Commit**

```bash
git add "app/experience/[slug]/opengraph-image.tsx" "app/projects/[slug]/opengraph-image.tsx"
git commit -m "feat: add OG images for experience and project dynamic routes"
```

---

## Task 6: Root layout metadata

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `app/layout.tsx`**

Add the `siteUrl` import and extend the `metadata` export. Replace the current `import` block and `metadata` export (lines 1–16) with:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { fraunces, geistSans } from "@/lib/fonts";
import { SmoothScroll } from "@/lib/smooth-scroll";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/layout/Footer";
import { ChatFab } from "@/components/chat/ChatFab";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Aurajeet Mahapatra · Project Manager",
    template: "%s · Aurajeet Mahapatra",
  },
  description:
    "Project Manager portfolio. Selected work, experience, and recent projects.",
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

Keep the `RootLayout` component unchanged.

- [ ] **Step 2: Build and verify meta tags**

```bash
npm run build && npm start
```

```bash
curl -s http://localhost:3000 | grep -o 'content="[^"]*"' | grep -i "aurajeet\|summary"
```

Expected: `content="Aurajeet Mahapatra"` (site_name) and `content="summary_large_image"` (twitter card) appear.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add metadataBase and OG/twitter defaults to root layout"
```

---

## Task 7: Per-route metadata

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/experience/[slug]/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`

> **Note on shallow merge:** In Next.js App Router, a page's `openGraph` object replaces the layout's `openGraph` entirely (not a deep merge). Every page that exports `openGraph` must include the complete object — `type`, `siteName`, `locale`, `title`, `description`, `url` — not just delta fields.

- [ ] **Step 1: Add metadata to `app/page.tsx`**

The home page currently has no metadata export. Use `title: { absolute: "..." }` to bypass the layout's template (which would otherwise append "· Aurajeet Mahapatra" again). Insert this export before the `export default function Home()` line:

```tsx
import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Work } from "@/components/sections/Work";

export const metadata: Metadata = {
  title: { absolute: "Aurajeet Mahapatra · Project Manager" },
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
    title: "Aurajeet Mahapatra · Project Manager",
    description:
      "Project Manager portfolio. Selected work, experience, and recent projects.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurajeet Mahapatra · Project Manager",
    description:
      "Project Manager portfolio. Selected work, experience, and recent projects.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Projects />
      <Contact />
    </>
  );
}
```

- [ ] **Step 2: Replace `metadata` in `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { About } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Aurajeet Mahapatra, an air force kid turned product manager. Disposition, agency, work, and what I do when no one's measuring.",
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
    title: "About · Aurajeet Mahapatra",
    description:
      "About Aurajeet Mahapatra, an air force kid turned product manager. Disposition, agency, work, and what I do when no one's measuring.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About · Aurajeet Mahapatra",
    description:
      "About Aurajeet Mahapatra, an air force kid turned product manager. Disposition, agency, work, and what I do when no one's measuring.",
  },
};

export default function AboutPage() {
  return <About />;
}
```

- [ ] **Step 3: Replace `metadata` in `app/projects/page.tsx`**

Replace only the `metadata` export (keep the rest of the 215-line file untouched):

```ts
export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project, sorted by recency. Two case studies (Netflix India, Amazon Prime Video) and nine product teardowns from the SIGMA · PM & Tech Club series.",
  openGraph: {
    type: "website",
    siteName: "Aurajeet Mahapatra",
    locale: "en_IN",
    title: "Projects · Aurajeet Mahapatra",
    description:
      "Every project, sorted by recency. Two case studies (Netflix India, Amazon Prime Video) and nine product teardowns from the SIGMA · PM & Tech Club series.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects · Aurajeet Mahapatra",
    description:
      "Every project, sorted by recency. Two case studies (Netflix India, Amazon Prime Video) and nine product teardowns from the SIGMA · PM & Tech Club series.",
  },
};
```

- [ ] **Step 4: Replace `generateMetadata` in `app/experience/[slug]/page.tsx`**

Replace the existing `generateMetadata` function with:

```ts
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.dek.long,
    openGraph: {
      type: "website",
      siteName: "Aurajeet Mahapatra",
      locale: "en_IN",
      title: `${c.title} · Aurajeet Mahapatra`,
      description: c.dek.long,
      url: `/experience/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.title} · Aurajeet Mahapatra`,
      description: c.dek.long,
    },
  };
}
```

- [ ] **Step 5: Replace `generateMetadata` in `app/projects/[slug]/page.tsx`**

Replace the existing `generateMetadata` function with:

```ts
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const caseStudy = getCaseStudy(slug);
  if (caseStudy) {
    return {
      title: caseStudy.title,
      description: caseStudy.dek.long,
      openGraph: {
        type: "website",
        siteName: "Aurajeet Mahapatra",
        locale: "en_IN",
        title: `${caseStudy.title} · Aurajeet Mahapatra`,
        description: caseStudy.dek.long,
        url: `/projects/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${caseStudy.title} · Aurajeet Mahapatra`,
        description: caseStudy.dek.long,
      },
    };
  }

  const teardown = getTeardown(slug);
  if (teardown) {
    const title = teardown.hook ?? teardown.title;
    return {
      title,
      description: teardown.brief,
      openGraph: {
        type: "website",
        siteName: "Aurajeet Mahapatra",
        locale: "en_IN",
        title: `${title} · Aurajeet Mahapatra`,
        description: teardown.brief,
        url: `/projects/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} · Aurajeet Mahapatra`,
        description: teardown.brief,
      },
    };
  }

  return {};
}
```

- [ ] **Step 6: Build and verify all meta tags**

```bash
npm run build && npm start
```

```bash
# Home — expect og:title = "Aurajeet Mahapatra · Project Manager"
curl -s http://localhost:3000 | grep -o 'property="og:title" content="[^"]*"'

# About
curl -s http://localhost:3000/about | grep -o 'property="og:title" content="[^"]*"'

# Projects
curl -s http://localhost:3000/projects | grep -o 'property="og:title" content="[^"]*"'

# Experience deep dive
curl -s http://localhost:3000/experience/hebe | grep -o 'property="og:title" content="[^"]*"'

# Project deep dive
curl -s http://localhost:3000/projects/netflix | grep -o 'property="og:title" content="[^"]*"'

# Teardown
curl -s http://localhost:3000/projects/cred | grep -o 'property="og:title" content="[^"]*"'
```

Each should return a non-empty `og:title` specific to that page.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/about/page.tsx app/projects/page.tsx \
  "app/experience/[slug]/page.tsx" "app/projects/[slug]/page.tsx"
git commit -m "feat: add OpenGraph and Twitter metadata to all routes"
```

---

## Task 8: Lighthouse a11y + perf pass

**Files:** Varies — fix whatever is flagged.

- [ ] **Step 1: Build and start the production server**

```bash
npm run build && npm start
```

Leave this running. Open a second terminal for the Lighthouse commands.

- [ ] **Step 2: Run Lighthouse on all five pages**

```bash
npx lighthouse@latest http://localhost:3000 \
  --only-categories=accessibility,performance \
  --output=html --output-path=./lh-home.html \
  --chrome-flags="--headless --no-sandbox"

npx lighthouse@latest http://localhost:3000/about \
  --only-categories=accessibility,performance \
  --output=html --output-path=./lh-about.html \
  --chrome-flags="--headless --no-sandbox"

npx lighthouse@latest http://localhost:3000/projects \
  --only-categories=accessibility,performance \
  --output=html --output-path=./lh-projects.html \
  --chrome-flags="--headless --no-sandbox"

npx lighthouse@latest http://localhost:3000/experience/hebe \
  --only-categories=accessibility,performance \
  --output=html --output-path=./lh-experience.html \
  --chrome-flags="--headless --no-sandbox"

npx lighthouse@latest http://localhost:3000/projects/netflix \
  --only-categories=accessibility,performance \
  --output=html --output-path=./lh-project.html \
  --chrome-flags="--headless --no-sandbox"
```

Open each `.html` file in a browser. Note every **Opportunity** and **Diagnostic** item. Ignore the SEO category (Phase 8 scope).

- [ ] **Step 3: Fix flagged issues**

Common fixes for this codebase — apply whichever are actually flagged:

**Images missing explicit `width`/`height`:**
Find bare `<img>` tags without both attributes. Add them. Example in `app/projects/page.tsx`:
```tsx
// Before
<img src={teardown.thumb.src} alt={teardown.thumb.alt} loading="lazy" decoding="async" className="..." />

// After — use actual dimensions for the image content
<img src={teardown.thumb.src} alt={teardown.thumb.alt} width={400} height={400} loading="lazy" decoding="async" className="..." />
```

**Colour contrast failures:**
If `--color-mute` (#6B6560) is flagged for small text, darken it in `app/globals.css`. WCAG AA requires 4.5:1 for text under 18px. Check the exact failing element and adjust only that token.

**Missing button `aria-label`:**
Arrow buttons in `components/sections/TeardownMarquee.tsx` should already have `aria-label="Previous teardown"` / `aria-label="Next teardown"` from Phase 6. If flagged, verify they're present.

**Links without discernible name:**
Any `<a>` or `<Link>` without visible text or `aria-label`. Add `aria-label` to icon-only links.

**`font-display` issues:**
`next/font` with `display: "swap"` (already set in `lib/fonts.ts`) satisfies this. If flagged, no change needed — Lighthouse sometimes warns on the first run and clears on rebuild.

Fix issues directly in the component files. Stop the server (`Ctrl+C`), rebuild, restart, then re-run Lighthouse after each batch of fixes.

- [ ] **Step 4: Re-run Lighthouse and confirm**

```bash
npm run build && npm start
```

```bash
npx lighthouse@latest http://localhost:3000 \
  --only-categories=accessibility,performance \
  --output=html --output-path=./lh-home-v2.html \
  --chrome-flags="--headless --no-sandbox"
```

Open `lh-home-v2.html`. Accessibility ≥ 95, Performance ≥ 80 on a local production build.

- [ ] **Step 5: Remove report files and commit**

```bash
rm -f lh-*.html
git add -A
git commit -m "fix: resolve Lighthouse a11y and perf flags (Phase 7)"
```
