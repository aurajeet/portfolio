# Phase 8b Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vercel Analytics for automatic page view tracking plus three custom events: `case_study_opened`, `project_opened`, and `ai_chat_opened`.

**Architecture:** Install `@vercel/analytics`, add the `<Analytics />` component to the root layout for automatic page view tracking, create a zero-render `TrackEvent` client component for server-component pages, and call `track()` directly in the existing `ChatFab` client component.

**Tech Stack:** Next.js 16, TypeScript, `@vercel/analytics`, React 19.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `package.json` | Add `@vercel/analytics` dependency |
| Modify | `app/layout.tsx` | Add `<Analytics />` for automatic page view tracking |
| Create | `components/analytics/TrackEvent.tsx` | Zero-render client component that calls `track()` on mount |
| Modify | `app/experience/[slug]/page.tsx` | Fire `case_study_opened` event on page load |
| Modify | `app/projects/[slug]/page.tsx` | Fire `project_opened` event on page load |
| Modify | `components/chat/ChatFab.tsx` | Fire `ai_chat_opened` when drawer opens |

---

## Task 1: Install package + add `<Analytics />` to layout

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `app/layout.tsx`

- [ ] **Step 1.1: Install `@vercel/analytics`**

```bash
npm install @vercel/analytics
```

Expected: `@vercel/analytics` appears in `package.json` dependencies. `package-lock.json` is updated.

- [ ] **Step 1.2: Add `<Analytics />` to `app/layout.tsx`**

Current `app/layout.tsx` line 7:
```tsx
import { ChatFab } from "@/components/chat/ChatFab";
```

Add one import line after it:
```tsx
import { ChatFab } from "@/components/chat/ChatFab";
import { Analytics } from "@vercel/analytics/next";
```

Current `app/layout.tsx` lines 43–45:
```tsx
        <Footer />
        <ChatFab />
      </body>
```

Replace with:
```tsx
        <Footer />
        <ChatFab />
        <Analytics />
      </body>
```

- [ ] **Step 1.3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 1.4: Verify production build passes**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with zero errors, same 25 routes as before.

- [ ] **Step 1.5: Commit**

```bash
git add package.json package-lock.json app/layout.tsx
git commit -m "feat: add Vercel Analytics for automatic page view tracking"
```

---

## Task 2: Create `TrackEvent` client component

**Files:**
- Create: `components/analytics/TrackEvent.tsx`

- [ ] **Step 2.1: Create the directory and file**

```bash
mkdir -p components/analytics
```

Create `components/analytics/TrackEvent.tsx` with this exact content:

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

- [ ] **Step 2.2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 2.3: Commit**

```bash
git add components/analytics/TrackEvent.tsx
git commit -m "feat: add TrackEvent client component for custom analytics events"
```

---

## Task 3: Wire `<TrackEvent>` to experience and project pages

**Files:**
- Modify: `app/experience/[slug]/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`

- [ ] **Step 3.1: Update `app/experience/[slug]/page.tsx`**

Current file line 3:
```tsx
import { CaseStudy } from "@/components/sections/CaseStudy";
```

Add import after it:
```tsx
import { CaseStudy } from "@/components/sections/CaseStudy";
import { TrackEvent } from "@/components/analytics/TrackEvent";
```

Current file lines 42–50 (the page component):
```tsx
export default async function ExperienceCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const { prev, next } = getNeighbors(slug);

  return <CaseStudy caseStudy={c} prev={prev} next={next} />;
}
```

Replace the return statement with a fragment:
```tsx
export default async function ExperienceCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const { prev, next } = getNeighbors(slug);

  return (
    <>
      <TrackEvent event="case_study_opened" properties={{ slug }} />
      <CaseStudy caseStudy={c} prev={prev} next={next} />
    </>
  );
}
```

- [ ] **Step 3.2: Update `app/projects/[slug]/page.tsx`**

Current file lines 3–4:
```tsx
import { ProjectCaseStudy } from "@/components/sections/ProjectCaseStudy";
import { TeardownDetail } from "@/components/sections/TeardownDetail";
```

Add import after line 4:
```tsx
import { ProjectCaseStudy } from "@/components/sections/ProjectCaseStudy";
import { TeardownDetail } from "@/components/sections/TeardownDetail";
import { TrackEvent } from "@/components/analytics/TrackEvent";
```

Current file lines 75–93 (the page component):
```tsx
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  // Look up case studies first (Netflix + Amazon Prime get the rich
  // template); fall back to teardowns (lighter template); 404 otherwise.
  const caseStudy = getCaseStudy(slug);
  if (caseStudy) {
    const { prev, next } = getCaseStudyNeighbors(slug);
    return <ProjectCaseStudy project={caseStudy} prev={prev} next={next} />;
  }

  const teardown = getTeardown(slug);
  if (teardown) {
    const { prev, next } = getTeardownNeighbors(slug);
    return <TeardownDetail teardown={teardown} prev={prev} next={next} />;
  }

  notFound();
}
```

Replace both return statements to wrap each in a fragment:
```tsx
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  // Look up case studies first (Netflix + Amazon Prime get the rich
  // template); fall back to teardowns (lighter template); 404 otherwise.
  const caseStudy = getCaseStudy(slug);
  if (caseStudy) {
    const { prev, next } = getCaseStudyNeighbors(slug);
    return (
      <>
        <TrackEvent event="project_opened" properties={{ slug }} />
        <ProjectCaseStudy project={caseStudy} prev={prev} next={next} />
      </>
    );
  }

  const teardown = getTeardown(slug);
  if (teardown) {
    const { prev, next } = getTeardownNeighbors(slug);
    return (
      <>
        <TrackEvent event="project_opened" properties={{ slug }} />
        <TeardownDetail teardown={teardown} prev={prev} next={next} />
      </>
    );
  }

  notFound();
}
```

- [ ] **Step 3.3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 3.4: Verify production build passes**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with zero errors, 25 routes unchanged.

- [ ] **Step 3.5: Commit**

```bash
git add "app/experience/[slug]/page.tsx" "app/projects/[slug]/page.tsx"
git commit -m "feat: fire case_study_opened and project_opened analytics events"
```

---

## Task 4: Add `ai_chat_opened` event to `ChatFab`

**Files:**
- Modify: `components/chat/ChatFab.tsx`

- [ ] **Step 4.1: Add `track` import to `ChatFab.tsx`**

Current file line 6:
```tsx
import { ChatDrawer } from "./ChatDrawer";
```

Add import after it:
```tsx
import { ChatDrawer } from "./ChatDrawer";
import { track } from "@vercel/analytics";
```

- [ ] **Step 4.2: Add `track` call to `handleOpen`**

Current file lines 104–113:
```tsx
  const handleOpen = useCallback(() => {
    setOpen(true);
    // Opening the drawer is also a first-visit signal — mark the label as
    // seen so the FAB doesn't re-prompt on the next visit even if the
    // user opened before the 4s timer fired.
    if (!seenBefore) {
      setDismissedThisSession(true);
      writeLabelSeen();
    }
  }, [seenBefore]);
```

Replace with (add `track` call as the first line inside the callback):
```tsx
  const handleOpen = useCallback(() => {
    track("ai_chat_opened");
    setOpen(true);
    // Opening the drawer is also a first-visit signal — mark the label as
    // seen so the FAB doesn't re-prompt on the next visit even if the
    // user opened before the 4s timer fired.
    if (!seenBefore) {
      setDismissedThisSession(true);
      writeLabelSeen();
    }
  }, [seenBefore]);
```

- [ ] **Step 4.3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 4.4: Verify production build passes**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with zero errors, 25 routes unchanged.

- [ ] **Step 4.5: Commit**

```bash
git add components/chat/ChatFab.tsx
git commit -m "feat: fire ai_chat_opened analytics event when chat drawer opens"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|-----------------|------|
| `@vercel/analytics` package installed | Task 1 |
| `<Analytics />` in root layout for page view tracking | Task 1 |
| `components/analytics/TrackEvent.tsx` — zero-render client component | Task 2 |
| `case_study_opened` event on experience pages | Task 3 |
| `project_opened` event on project pages | Task 3 |
| `ai_chat_opened` event in `ChatFab.handleOpen` | Task 4 |
| `properties: { slug }` on both page events | Tasks 3 |
| Build passes throughout | Tasks 1, 3, 4 |
