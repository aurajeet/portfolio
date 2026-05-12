# Phase 8 — SEO: robots.txt + sitemap.xml Design Spec

**Date:** 2026-05-12
**Status:** Approved

---

## Scope

Two deliverables and one environment variable:

1. `app/robots.ts` — Next.js robots metadata file
2. `app/sitemap.ts` — Next.js sitemap metadata file (16 routes)
3. `NEXT_PUBLIC_SITE_URL` — set to production domain in Vercel

No existing files are modified.

---

## 1. robots.ts

**File:** `app/robots.ts`

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
```

- Single rule: allow all crawlers on all paths.
- `sitemap` field points to the generated sitemap using `siteUrl()` so the URL is correct in both local dev and production.

---

## 2. sitemap.ts

**File:** `app/sitemap.ts`

Imports `siteUrl()` from `lib/site.ts` and the three content arrays from the existing data layer.

**Entries (16 total):**

| Group | Count | Source |
|-------|-------|--------|
| Static pages | 3 | `/`, `/about`, `/projects` |
| Experience slugs | 2 | `caseStudies` from `content/experience.ts` |
| Project slugs | 11 | `projectCaseStudies` + `projectTeardowns` from `content/projects.ts` |

No `lastModified`, `priority`, or `changeFrequency` fields — Next.js omits them when absent, and Google ignores them on small sites.

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { caseStudies } from "@/content/experience";
import { projectCaseStudies, projectTeardowns } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  const staticRoutes = ["/", "/about", "/projects"].map((path) => ({
    url: `${base}${path}`,
  }));

  const experienceRoutes = caseStudies.map((c) => ({
    url: `${base}/experience/${c.slug}`,
  }));

  const projectRoutes = [...projectCaseStudies, ...projectTeardowns].map((p) => ({
    url: `${base}/projects/${p.slug}`,
  }));

  return [...staticRoutes, ...experienceRoutes, ...projectRoutes];
}
```

---

## 3. NEXT_PUBLIC_SITE_URL Environment Variable

**Production value:** `https://portfolio-hazel-delta-98.vercel.app`

Set via Vercel CLI:

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
# Enter value: https://portfolio-hazel-delta-98.vercel.app
```

`lib/site.ts` already falls back to `http://localhost:3000` for local dev — no `.env.local` change needed.

---

## Verification

After deployment:

1. `https://portfolio-hazel-delta-98.vercel.app/robots.txt` — should return `Allow: /` and the sitemap URL.
2. `https://portfolio-hazel-delta-98.vercel.app/sitemap.xml` — should list all 16 URLs with the production domain.

---

## Files Changed

| File | Change |
|------|--------|
| `app/robots.ts` | **New** — allow-all robots metadata |
| `app/sitemap.ts` | **New** — 16-route sitemap from content layer |

**No existing files modified.**

---

## Out of Scope

- Analytics — Phase 8b
- Custom domain (`aurajeet.com`) — future; swap `NEXT_PUBLIC_SITE_URL` when ready
- `canonical` tags — already handled by Next.js `metadataBase` set in Phase 7
- `sitemap-index` — not needed for 16 routes
