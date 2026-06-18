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
// Speed: 68px/s → 2112px (8 cards × 264px) / 68 ≈ 31s per loop.
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
            "overflow-x-auto no-scrollbar pb-3",
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
      className={cn("relative -mr-6 md:-mr-10 xl:-mr-12", className)}
    >
      {/* Arrow controls — right-aligned to container content edge */}
      <div className="mb-4 flex justify-end gap-2 pr-6 md:pr-10 xl:pr-12">
        <button
          type="button"
          aria-label="Previous teardown"
          onClick={() => advance(-1)}
          className={cn(
            "flex h-11 w-11 items-center justify-center",
            "border border-rule text-sm text-ink",
            "transition-colors duration-300 ease-[var(--ease-luxe)]",
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
            "flex h-11 w-11 items-center justify-center",
            "border border-rule text-sm text-ink",
            "transition-colors duration-300 ease-[var(--ease-luxe)]",
            "hover:border-ink hover:bg-ink hover:text-paper",
          )}
        >
          →
        </button>
      </div>

      {/* Scrollable track wrapper — fade right-0 is now at viewport edge */}
      <div className="relative">
        <div
          ref={trackRef}
          className="overflow-x-scroll no-scrollbar pb-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setTimeout(() => setPaused(false), 1500)}
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
// TeardownCard — co-located here (moved from Projects.tsx)
// ---------------------------------------------------------------------------

interface TeardownCardProps {
  teardown: ProjectTeardown;
}

function TeardownCard({ teardown }: TeardownCardProps) {
  const lineOne = teardown.hook ?? teardown.brief;
  return (
    <Link
      href={`/projects/${teardown.slug}`}
      className="group flex flex-col h-full border border-rule"
    >
      <div className="aspect-square overflow-hidden bg-paper-pure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={teardown.thumb.src}
          alt={teardown.thumb.alt}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-cover"
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
