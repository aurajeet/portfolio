import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";

/**
 * Synthetic "Last updated" timestamp — Phase 0 spec calls for 8–9 days
 * prior to the build date, varying per build so it doesn't read as a
 * frozen string. Computed at module load (build time for SSG); each
 * production build gets a fresh stamp ~8–9 days back.
 *
 * Trade-off acknowledged in the decisions log: the date isn't truly
 * "last updated"; it's a always-fresh editorial signal during the
 * active job-search window.
 *
 * Format: `2 May 2026` (en-GB) — international, day-first, no comma.
 * Reads cleaner editorially than the en-US `May 2, 2026`.
 */
const FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getSyntheticLastUpdated(): string {
  // Random offset in [8.0, 9.0) days back from now.
  const offsetDays = 8 + Math.random();
  const ms = offsetDays * 24 * 60 * 60 * 1000;
  const date = new Date(Date.now() - ms);
  return FORMATTER.format(date);
}

export function Footer() {
  const year = new Date().getFullYear();
  const lastUpdated = getSyntheticLastUpdated();

  return (
    <footer className="border-t border-rule">
      <Container>
        <div
          className={cn(
            "flex flex-col gap-4 py-10 md:py-12",
            "md:flex-row md:items-baseline md:justify-between md:gap-6",
          )}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display text-base tracking-tight text-ink md:text-lg">
              AM
            </span>
            <span
              className={cn(
                "font-sans text-[11px] uppercase tracking-[var(--tracking-eyebrow)] text-mute",
              )}
            >
              © {year} Aurajeet Mahapatra
            </span>
          </div>

          <p
            className={cn(
              "font-sans text-[11px] uppercase tracking-[var(--tracking-eyebrow)] text-mute",
              "md:text-right",
            )}
          >
            Last updated · {lastUpdated}
          </p>
        </div>
      </Container>
    </footer>
  );
}
