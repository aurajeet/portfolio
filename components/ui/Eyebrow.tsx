import { cn } from "@/lib/cn";

type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /**
   * `default` (text-mute) — used by all card-level + supporting eyebrows
   * (deep-dive headers, project card filing metadata, hero meta line).
   *
   * `accent` (text-ink-accent) — reserved for top-level section eyebrows
   * only: the landing's `EXPERIENCE` / `PROJECTS` / `CONTACT`, the `/projects`
   * page's `All work`, the `/about` page's `About`. Card-level eyebrows
   * stay default so the section-vs-card hierarchy reads at a glance.
   */
  tone?: "default" | "accent";
};

export function Eyebrow({ className, tone = "default", ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-sans text-eyebrow font-medium uppercase",
        "tracking-[var(--tracking-eyebrow)]",
        tone === "accent" ? "text-ink-accent" : "text-mute",
        className,
      )}
      {...props}
    />
  );
}
