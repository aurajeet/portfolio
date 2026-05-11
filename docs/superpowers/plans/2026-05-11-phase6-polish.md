# Phase 6 Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll reveals to landing page sections (Work, Projects, Contact) and replace the static teardown row with a continuous RAF-driven marquee with ink arrow controls.

**Architecture:** A new `FadeUp` client wrapper uses Framer Motion `useInView` to animate children on scroll — sections stay server components, only their content gets wrapped. The teardown marquee is extracted to `TeardownMarquee.tsx`, a dedicated client component that drives scrollLeft via `requestAnimationFrame` for a seamless loop, with pause-on-hover and arrow-click advance. `prefers-reduced-motion` is respected everywhere: FadeUp renders children unwrapped; marquee falls back to the Phase 4 static overflow-x-auto.

**Tech Stack:** Next.js 16 App Router, React 19, Framer Motion 12, Tailwind CSS v4, TypeScript strict

**Design deviation from spec:** The spec describes CSS `animation-play-state` for the marquee. Instead we use a RAF loop incrementing `scrollLeft` on the scrollable track — this is the only way to support clean arrow-click advances without CSS `transform` and JS scroll fighting each other. The user-visible behaviour (35s loop, pause-on-hover, arrow advance) is identical.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/ui/FadeUp.tsx` | **Create** | `useInView` reveal wrapper, reduced-motion guard |
| `components/sections/TeardownMarquee.tsx` | **Create** | RAF marquee loop, arrow buttons, reduced-motion fallback, TeardownCard |
| `components/sections/Work.tsx` | **Modify** | Wrap eyebrow + each article entry in `<FadeUp>` |
| `components/sections/Projects.tsx` | **Modify** | Wrap eyebrow + each ProjectCard in `<FadeUp>`; swap TeardownRow → TeardownMarquee |
| `components/sections/Contact.tsx` | **Modify** | Wrap inner content block in `<FadeUp>` |

---

## Task 1: FadeUp component

**Files:**
- Create: `components/ui/FadeUp.tsx`

- [ ] **Step 1.1 — Create the file**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px 0px 0px 0px" });

  if (reduced) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 1.2 — Verify lint passes**

```bash
cd /Users/auro/Documents/PM_PORTFOLIO_MINIMALIST && npm run lint
```

Expected: no errors or warnings.

- [ ] **Step 1.3 — Commit**

```bash
git add components/ui/FadeUp.tsx
git commit -m "feat: add FadeUp scroll-reveal wrapper component"
```

---

## Task 2: Work section reveals

**Files:**
- Modify: `components/sections/Work.tsx`

- [ ] **Step 2.1 — Replace the file content**

```tsx
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/ui/FadeUp";
import { Heading } from "@/components/ui/Heading";
import { TagPill } from "@/components/ui/TagPill";
import { caseStudies } from "@/content/experience";
import { cn } from "@/lib/cn";

export function Work() {
  return (
    <section id="work" className="section-y border-t border-rule">
      <Container>
        <FadeUp>
          <Eyebrow tone="accent">EXPERIENCE</Eyebrow>
        </FadeUp>

        <div className="mt-12 md:mt-16">
          {caseStudies.map((c, i) => (
            <FadeUp key={c.slug} delay={i * 0.06}>
              <article
                className={cn(
                  "pt-12 md:pt-16",
                  i > 0 && "mt-12 border-t border-rule md:mt-16",
                )}
              >
                <Link
                  href={`/experience/${c.slug}`}
                  aria-label={`Read case study: ${c.title}`}
                  className="group block"
                >
                  <Eyebrow>{c.eyebrow}</Eyebrow>

                  <Heading
                    variant="h3"
                    as="h2"
                    className="mt-6 max-w-[24ch] text-balance"
                  >
                    {c.title}
                  </Heading>

                  <p
                    className={cn(
                      "mt-6 max-w-[58ch] font-display italic text-ink/85",
                      "text-[1.125rem] leading-snug md:text-xl",
                    )}
                  >
                    {c.dek.short}
                  </p>

                  <div
                    className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-rule py-4"
                  >
                    {c.metrics.map((m) => (
                      <div key={m.label} className="flex flex-col gap-0.5">
                        <span className="font-display text-sm text-ink md:text-base">
                          {m.value}
                        </span>
                        <span
                          className={cn(
                            "font-sans text-[10px] font-medium uppercase text-mute",
                            "tracking-[var(--tracking-eyebrow)]",
                          )}
                        >
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.tags.slice(0, 4).map((tag) => (
                      <TagPill key={tag}>{tag}</TagPill>
                    ))}
                  </div>

                  <span
                    className={cn(
                      "mt-8 inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase",
                      "tracking-[var(--tracking-eyebrow)] text-ink",
                    )}
                  >
                    <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
                      Read case study
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </article>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2.2 — Verify lint passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 2.3 — Commit**

```bash
git add components/sections/Work.tsx
git commit -m "feat: add FadeUp scroll reveals to Work section"
```

---

## Task 3: TeardownMarquee component

**Files:**
- Create: `components/sections/TeardownMarquee.tsx`

The marquee uses a `requestAnimationFrame` loop that increments `scrollLeft` on the track div. At `0.068 px/ms` (≈ 68 px/s), 9 cards × 264 px per card = 2376 px total → ~35s per full pass. When `scrollLeft` reaches `scrollWidth / 2` (one full copy of the cards), it resets to 0 — seamless loop because copy 2 visually continues from where copy 1 ended.

`TeardownCard` is co-located here (moved from `Projects.tsx`).

- [ ] **Step 3.1 — Create the file**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { type ProjectTeardown } from "@/content/projects";
import { cn } from "@/lib/cn";

interface TeardownMarqueeProps {
  teardowns: ProjectTeardown[];
  className?: string;
}

// Scroll increment per arrow click (lg card width + gap).
// Matches the li sizing below: w-[240px] + gap-6 (24px) = 264px.
const CARD_STEP = 264;
// Speed: 68px/s → 2376px (9 cards × 264px) / 68 ≈ 35s per loop.
const PX_PER_MS = 0.068;

export function TeardownMarquee({ teardowns, className }: TeardownMarqueeProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    lastTsRef.current = 0;

    function tick(ts: number) {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const elapsed = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (!track) return;
      track.scrollLeft += PX_PER_MS * elapsed;

      // Seamless loop: when we've scrolled through one full copy, reset to 0.
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft -= track.scrollWidth / 2;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, paused]);

  function advance(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    setPaused(true);
    track.scrollBy({ left: dir * CARD_STEP, behavior: "smooth" });
    // Resume auto-scroll after scroll settles + small buffer.
    setTimeout(() => setPaused(false), 700);
  }

  // prefers-reduced-motion: static Phase 4 overflow-x-auto fallback.
  if (reduced) {
    return (
      <div
        aria-label="Product teardowns"
        role="region"
        className={cn("relative -mr-6 md:-mr-10 xl:-mr-12", className)}
      >
        <ul
          className={cn(
            "flex items-stretch gap-4 md:gap-6",
            "overflow-x-auto no-scrollbar",
            "snap-x snap-mandatory",
            "scroll-pl-6 md:scroll-pl-10 xl:scroll-pl-12",
            "pr-12 md:pr-16",
          )}
        >
          {teardowns.map((t) => (
            <li
              key={t.slug}
              className="flex shrink-0 flex-col snap-start w-[200px] md:w-[220px] lg:w-[240px]"
            >
              <TeardownCard teardown={t} />
            </li>
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-paper to-transparent"
        />
      </div>
    );
  }

  return (
    <div
      aria-label="Product teardowns"
      role="region"
      className={cn("relative", className)}
    >
      {/* Arrow controls — above strip, right-aligned, ink hairline buttons */}
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous teardown"
          onClick={() => advance(-1)}
          className={cn(
            "flex h-8 w-8 items-center justify-center",
            "border border-rule text-sm text-ink",
            "transition-colors duration-200 ease-[var(--ease-luxe)]",
            "hover:border-ink hover:bg-ink hover:text-paper",
          )}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next teardown"
          onClick={() => advance(1)}
          className={cn(
            "flex h-8 w-8 items-center justify-center",
            "border border-rule text-sm text-ink",
            "transition-colors duration-200 ease-[var(--ease-luxe)]",
            "hover:border-ink hover:bg-ink hover:text-paper",
          )}
        >
          →
        </button>
      </div>

      {/* Scrollable track wrapper — needed for absolute-positioned fade */}
      <div className="relative">
        <div
          ref={trackRef}
          className={cn(
            "-mr-6 md:-mr-10 xl:-mr-12",
            "overflow-x-scroll no-scrollbar",
          )}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Two copies of card list for seamless RAF loop */}
          <ul className="flex items-stretch gap-4 md:gap-6 pr-12 md:pr-16">
            {[...teardowns, ...teardowns].map((t, i) => (
              <li
                key={`${t.slug}-${i}`}
                className="flex shrink-0 flex-col w-[200px] md:w-[220px] lg:w-[240px]"
              >
                <TeardownCard teardown={t} />
              </li>
            ))}
          </ul>
        </div>

        {/* Right-edge fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-paper to-transparent"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TeardownCard — co-located here (moved from Projects.tsx in Task 4)
// ---------------------------------------------------------------------------

interface TeardownCardProps {
  teardown: ProjectTeardown;
}

function TeardownCard({ teardown }: TeardownCardProps) {
  const lineOne = teardown.hook ?? teardown.brief;
  return (
    <Link
      href={`/projects/${teardown.slug}`}
      aria-label={`Open the ${teardown.product} teardown`}
      className="group flex flex-col h-full border border-rule"
    >
      <div className="overflow-hidden bg-paper-pure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teardown.thumb.src}
          alt={teardown.thumb.alt}
          loading="lazy"
          decoding="async"
          className="block aspect-square w-full object-cover"
        />
      </div>

      <div className="flex-1 p-3">
        <p
          className={cn(
            "font-display text-base leading-snug text-ink",
            "transition-opacity duration-300 ease-[var(--ease-luxe)] group-hover:opacity-60",
          )}
        >
          {lineOne}
        </p>
        <p
          className={cn(
            "mt-2 font-sans text-[11px] font-medium uppercase text-mute",
            "tracking-[var(--tracking-eyebrow)]",
          )}
        >
          {teardown.product}
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3.2 — Verify lint passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3.3 — Commit**

```bash
git add components/sections/TeardownMarquee.tsx
git commit -m "feat: add TeardownMarquee with RAF loop, pause-on-hover, arrow controls"
```

---

## Task 4: Projects section — FadeUp reveals + wire TeardownMarquee

**Files:**
- Modify: `components/sections/Projects.tsx`

Remove `TeardownRow` and `TeardownCard` from this file (both now live in `TeardownMarquee.tsx`). Add `FadeUp` to the section header and each `ProjectCard`. Import `TeardownMarquee`.

- [ ] **Step 4.1 — Replace the file content**

```tsx
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/ui/FadeUp";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { TeardownMarquee } from "@/components/sections/TeardownMarquee";
import {
  projectCaseStudies,
  projectTeardowns,
  type ProjectCaseStudy,
} from "@/content/projects";
import { cn } from "@/lib/cn";

export function Projects() {
  return (
    <section id="projects" className="section-y border-t border-rule">
      <Container>
        <FadeUp>
          <Eyebrow tone="accent">PROJECTS</Eyebrow>
        </FadeUp>

        {/* ---------- Top tier ---------- */}
        <div
          className={cn(
            "mt-12 grid grid-cols-1 gap-16",
            "md:mt-16 md:grid-cols-2 md:gap-10",
          )}
        >
          {projectCaseStudies.map((cs, i) => (
            <FadeUp key={cs.slug} delay={i * 0.08}>
              <ProjectCard project={cs} />
            </FadeUp>
          ))}
        </div>

        {/* ---------- Bottom tier (teardown marquee) ---------- */}
        <TeardownMarquee
          teardowns={projectTeardowns}
          className="mt-24 md:mt-32"
        />

        {/* ---------- View all link ---------- */}
        <FadeUp>
          <div className="mt-12 flex justify-end md:mt-16">
            <TextLink href="/projects">View all projects</TextLink>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

// ---------- Top-tier card ----------

interface ProjectCardProps {
  project: ProjectCaseStudy;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article>
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Read case study: ${project.title}`}
        className="group block"
      >
        <div className="overflow-hidden border border-rule bg-paper-pure">
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={project.banner.desktop}
            />
            <img
              src={project.banner.mobile}
              alt={project.banner.alt}
              loading="lazy"
              decoding="async"
              className={cn(
                "block w-full h-auto",
                "aspect-[9/19.5] md:aspect-[3/2]",
                "object-cover",
              )}
            />
          </picture>
        </div>

        <div className="mt-8 md:mt-10">
          <Eyebrow>{project.eyebrow}</Eyebrow>

          <Heading
            variant="h3"
            as="h2"
            className="mt-5 max-w-[28ch] text-balance"
          >
            {project.title}
          </Heading>

          <p
            className={cn(
              "mt-5 max-w-[48ch] font-display italic text-ink/85",
              "text-base leading-snug md:text-lg",
            )}
          >
            {project.dek.short}
          </p>

          <div
            className={cn(
              "mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3",
              "border-y border-rule py-4",
              "font-sans text-[11px] uppercase",
              "tracking-[var(--tracking-eyebrow)] text-ink",
            )}
          >
            <span>{project.metrics.join(" · ")}</span>
            <span className="inline-flex items-center gap-2">
              <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
                Read case study
              </span>
              <span
                aria-hidden="true"
                className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
```

- [ ] **Step 4.2 — Verify lint passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 4.3 — Commit**

```bash
git add components/sections/Projects.tsx
git commit -m "feat: add FadeUp to Projects section and wire TeardownMarquee"
```

---

## Task 5: Contact section reveals

**Files:**
- Modify: `components/sections/Contact.tsx`

Wrap the entire inner content block in a single `<FadeUp>` — Contact is one tight centered block, no need to stagger sub-elements.

- [ ] **Step 5.1 — Add FadeUp import and wrap inner content**

In `components/sections/Contact.tsx`, add the import and wrap the existing inner div:

```tsx
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FadeUp } from "@/components/ui/FadeUp";
import { cn } from "@/lib/cn";

export const EMAIL = "aurajeetm@gmail.com";
export const PHONE_DISPLAY = "+91 85509 64470";
export const PHONE_HREF = "tel:+918550964470";
export const LINKEDIN_URL = "https://www.linkedin.com/in/aurajeet-mahapatra/";
export const STATUS_LINE =
  "Looking for PM roles. Open to relocate or work remotely.";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section-y border-t border-rule"
    >
      <Container>
        <FadeUp>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Eyebrow tone="accent">Contact</Eyebrow>
            <h2 id="contact-heading" className="sr-only">
              Contact Aurajeet Mahapatra
            </h2>

            <p
              className={cn(
                "mt-8 max-w-[42ch] font-display italic text-ink/85",
                "text-xl leading-snug md:text-2xl",
              )}
            >
              {STATUS_LINE}
            </p>

            <a
              href={`mailto:${EMAIL}`}
              className={cn(
                "group mt-12 inline-flex flex-wrap items-baseline justify-center",
                "gap-x-3 gap-y-1 lowercase text-ink",
                "font-display font-normal tracking-[-0.01em]",
                "text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.05]",
                "transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-90",
                "md:mt-14 md:gap-x-4",
              )}
              aria-label={`Email Aurajeet at ${EMAIL}`}
            >
              <span className="border-b border-current pb-1">{EMAIL}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "inline-block text-ink-accent transition-transform duration-300",
                  "ease-[var(--ease-luxe)] group-hover:translate-x-1.5",
                )}
              >
                →
              </span>
            </a>

            <p
              className={cn(
                "mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2",
                "font-sans text-[11px] font-medium uppercase",
                "tracking-[var(--tracking-eyebrow)] text-ink",
                "md:mt-14 md:text-xs",
              )}
            >
              <a
                href={PHONE_HREF}
                className="transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-60"
                aria-label={`Call Aurajeet at ${PHONE_DISPLAY}`}
              >
                {PHONE_DISPLAY}
              </a>
              <span aria-hidden="true" className="text-mute">
                ·
              </span>
              <Link
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener"
                className={cn(
                  "group inline-flex items-center gap-2",
                  "transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-60",
                )}
              >
                <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
                  LinkedIn
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            </p>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5.2 — Verify lint passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5.3 — Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat: add FadeUp scroll reveal to Contact section"
```

---

## Task 6: Full build verify + QA

**Files:** None modified — verification only.

- [ ] **Step 6.1 — Run production build**

```bash
npm run build
```

Expected output includes:
```
✓ Compiled successfully
Route (app)         Size    First Load JS
┌ ○ /               ...
...
○ (Static)  prerendered as static content
```

No TypeScript errors, no build failures. The `/api/chat` route may still show as dynamic — that's expected.

- [ ] **Step 6.2 — Start dev server for QA**

```bash
npm run dev
```

Open `http://localhost:3000` in Chrome DevTools. Resize to the following widths and verify:

**375px — iPhone SE:**
- Hero stacks (text above, photo placeholder below)
- Work entries are readable, full width
- Marquee cards are 200px wide, auto-scrolling
- Contact section is centered

**768px — iPad:**
- Nav shows desktop links (Work · Projects · About · Resume · Contact)
- Hero shows split layout
- Projects grid is 2 columns
- Marquee arrow buttons appear above the strip

**1280px+ — Desktop:**
- Marquee cards are 240px wide
- Scroll down slowly — verify Work entry 1 fades up, then entry 2 fades up with slight delay
- Verify Projects eyebrow fades up, then card 1, then card 2
- Verify Contact block fades up
- Hover over teardown marquee — verify it pauses
- Click ← / → arrows — verify strip advances one card width and resumes

- [ ] **Step 6.3 — Verify reduced-motion**

In Chrome DevTools → Rendering tab → check "Emulate CSS media feature prefers-reduced-motion: reduce". Reload.

Expected:
- No FadeUp animation (elements appear immediately at full opacity)
- Marquee shows static overflow-x-auto (Phase 4 behaviour, no auto-scroll)
- Hero and Nav still render correctly (they have their own reduced-motion guards)

- [ ] **Step 6.4 — Update project.md Phase 6 status**

In `project.md`, find the Phase 6 row in the table (§5) and change `Pending` to `✅ Done`:

```markdown
| **6** | Polish: transitions, scroll reveals, marquee implementation, microinteractions, a11y, responsive QA | Orchestrator | ✅ Done |
```

- [ ] **Step 6.5 — Final commit**

```bash
git add project.md
git commit -m "chore: mark Phase 6 complete in project.md"
```
