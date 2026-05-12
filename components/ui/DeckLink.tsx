import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface DeckLinkProps {
  /** Path to the static PDF (e.g. `/cases/cred.pdf`). */
  href: string;
  /** Path to the cover image in /public/cases/ (16:9). Renders full-width
   *  inside the link block as the primary visual hook. SVG placeholders are
   *  in production today; real exports of the deck's first page swap in via
   *  a one-line edit per asset when each deck is finalized. */
  cover: string;
  /** Slide count, rendered as `{n} slides` on the metadata line. */
  pages: number;
  /** Original authoring date for the metadata line (e.g. `August 2023`).
   *  Optional — case studies omit this; teardowns pass their `authoredAt`. */
  authoredAt?: string;
  /** Tailwind className passthrough for outer spacing alignment. */
  className?: string;
}

/**
 * Hairline-bordered "Original deck" download block. Renders below the prose
 * body on every project deep dive (case studies + teardowns) when a PDF is
 * available. External link, opens in new tab with `noopener noreferrer`.
 *
 * Visual hierarchy: top hairline → Eyebrow label → cover image (16:9, full
 * container width) → Fraunces lowercase headline-as-link → Geist tracked
 * uppercase metadata. Whole block is one anchor — single tab stop, single
 * screen-reader announcement. The arrow translates rightward on hover; the
 * headline + cover image both dim to 60% to mirror the link affordance.
 *
 * The cover image uses a plain `<img>` (not `next/image`) so SVG placeholders
 * render without `dangerouslyAllowSVG`. Mirrors the same trade-off Phase 4
 * made for the Projects banner / thumbnail images. Swap to `next/image` once
 * real raster covers ship.
 */
export function DeckLink({
  href,
  cover,
  pages,
  authoredAt,
  className,
}: DeckLinkProps) {
  const meta = ["PDF", `${pages} slides`, authoredAt && `Authored ${authoredAt}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group block border-t border-rule pt-10 md:pt-12",
        className,
      )}
    >
      <Eyebrow>Original deck</Eyebrow>

      {/* Cover image — full-width inside the link block, hairline-bordered.
          Plain <img> for SVG placeholder compatibility (mirrors the Phase 4
          banner pattern). */}
      <div
        className={cn(
          "mt-6 overflow-hidden border border-rule bg-paper-pure md:mt-8",
          "transition-opacity duration-300 ease-[var(--ease-luxe)] group-hover:opacity-90",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="block aspect-[16/9] w-full object-cover"
        />
      </div>

      <p
        className={cn(
          "mt-8 inline-flex items-center gap-3 font-display text-2xl text-ink md:mt-10 md:text-3xl",
          "leading-snug tracking-[-0.01em]",
          "transition-opacity duration-300 ease-[var(--ease-luxe)] group-hover:opacity-60",
        )}
      >
        <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
          Read the original deck
        </span>
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
        >
          →
        </span>
      </p>

      <p
        className={cn(
          "mt-4 font-sans text-[11px] font-medium uppercase text-mute",
          "tracking-[var(--tracking-eyebrow)]",
        )}
      >
        {meta} · Opens in new tab ↗
      </p>
    </a>
  );
}
