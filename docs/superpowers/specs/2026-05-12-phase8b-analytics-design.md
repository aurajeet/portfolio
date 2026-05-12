# Phase 8b — Analytics Design Spec

**Date:** 2026-05-12
**Status:** Approved

---

## Scope

Add Vercel Analytics to the portfolio for page view tracking and three custom events. No third-party services, no cookies, no consent banner required.

Deliverables:
1. `@vercel/analytics` package installed
2. Automatic page view tracking via `<Analytics />` in root layout
3. Custom event: `case_study_opened` (experience pages)
4. Custom event: `project_opened` (project pages)
5. Custom event: `ai_chat_opened` (chat FAB)

---

## 1. Package

```bash
npm install @vercel/analytics
```

No environment variables required — Vercel Analytics auto-detects the project when deployed on Vercel. In local dev, `<Analytics />` is a no-op.

---

## 2. Page View Tracking

**File:** `app/layout.tsx`

Add `<Analytics />` from `@vercel/analytics/next` inside `<body>`, after the existing children. Tracks all route navigations automatically.

```tsx
import { Analytics } from "@vercel/analytics/next";

// Inside <body>:
<Analytics />
```

Placement: after `<ChatFab />`, before `</body>`.

---

## 3. Custom Events

### `components/analytics/TrackEvent.tsx` (new)

A zero-render `"use client"` component. Calls `track()` once on mount via `useEffect`. Used on server-component pages that cannot call `track()` inline.

```tsx
"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

interface TrackEventProps {
  event: string;
  properties?: Record<string, string>;
}

export function TrackEvent({ event, properties }: TrackEventProps) {
  useEffect(() => {
    track(event, properties);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
```

### `app/experience/[slug]/page.tsx`

Both pages currently return a single component. Wrap in a React fragment to add `<TrackEvent>` alongside it:

```tsx
import { TrackEvent } from "@/components/analytics/TrackEvent";

// Change: return <CaseStudy c={c} neighbors={neighbors} />;
// To:
return (
  <>
    <TrackEvent event="case_study_opened" properties={{ slug }} />
    <CaseStudy c={c} neighbors={neighbors} />
  </>
);
```

`slug` is already available as the awaited `params.slug`.

### `app/projects/[slug]/page.tsx`

Same fragment pattern. The existing return renders either `<ProjectCaseStudy>` or `<TeardownDetail>` depending on the slug — wrap the whole conditional in a fragment:

```tsx
import { TrackEvent } from "@/components/analytics/TrackEvent";

return (
  <>
    <TrackEvent event="project_opened" properties={{ slug }} />
    {/* existing conditional render */}
  </>
);
```

### `components/chat/ChatFab.tsx`

`ChatFab` is already `"use client"`. Add one line inside `handleOpen`:

```tsx
import { track } from "@vercel/analytics";

const handleOpen = useCallback(() => {
  track("ai_chat_opened");
  setOpen(true);
  if (!seenBefore) {
    setDismissedThisSession(true);
    writeLabelSeen();
  }
}, [seenBefore]);
```

---

## 4. Event Reference

| Event name | Fired when | Properties |
|------------|------------|------------|
| `case_study_opened` | Experience page loads (`/experience/[slug]`) | `{ slug }` |
| `project_opened` | Project page loads (`/projects/[slug]`) | `{ slug }` |
| `ai_chat_opened` | User opens the AI chat drawer | none |

---

## 5. Verification

After deployment:

1. Visit `https://portfolio-hazel-delta-98.vercel.app` — page view appears in Vercel Analytics dashboard.
2. Open an experience page — `case_study_opened` event appears.
3. Open a projects page — `project_opened` event appears.
4. Click the AI chat FAB — `ai_chat_opened` event appears.

Dashboard: Vercel project → Analytics tab.

---

## Files Changed

| File | Change |
|------|--------|
| `package.json` / `package-lock.json` | Add `@vercel/analytics` |
| `app/layout.tsx` | Add `<Analytics />` import + component |
| `components/analytics/TrackEvent.tsx` | **New** — zero-render client event tracker |
| `app/experience/[slug]/page.tsx` | Add `<TrackEvent event="case_study_opened" slug={slug} />` |
| `app/projects/[slug]/page.tsx` | Add `<TrackEvent event="project_opened" slug={slug} />` |
| `components/chat/ChatFab.tsx` | Add `track('ai_chat_opened')` in `handleOpen` |

---

## Out of Scope

- Speed Insights (`@vercel/speed-insights`) — can be added as a one-liner later
- Funnel analysis or session replay
- Any server-side or API route tracking
