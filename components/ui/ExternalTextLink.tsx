import { cn } from "@/lib/cn";

interface ExternalTextLinkProps {
  /** Outbound URL (https / mailto / tel / or absolute path to a static asset
   *  served by the same origin like a /cases/*.pdf). */
  href: string;
  /** Toggle the trailing `↗` glyph. Defaults to `true`. */
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Mirrors `TextLink` styling — uppercase tracked Geist, hairline underline,
 * 60% opacity on hover, animated arrow on hover — but renders a plain `<a>`
 * tag (not `next/link`) with `target="_blank" rel="noopener noreferrer"`,
 * and uses the `↗` glyph instead of `→` to signal "opens in new tab".
 *
 * Used wherever we need an inline outbound link in the chrome style — the
 * deck-discovery link in the project deep-dive headers, etc.
 */
export function ExternalTextLink({
  href,
  arrow = true,
  className,
  children,
}: ExternalTextLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase",
        "tracking-[var(--tracking-eyebrow)] text-ink",
        "transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-60",
        className,
      )}
    >
      <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
        {children}
      </span>
      {arrow && (
        <span
          aria-hidden="true"
          className="text-ink-accent transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          ↗
        </span>
      )}
    </a>
  );
}
