import { cn } from "@/lib/cn";

type TagPillProps = React.HTMLAttributes<HTMLSpanElement>;

export function TagPill({ className, ...props }: TagPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-rule px-3 py-1.5",
        "font-sans text-eyebrow-sm font-medium uppercase text-ink",
        "tracking-[var(--tracking-eyebrow)]",
        "whitespace-nowrap select-none",
        className,
      )}
      {...props}
    />
  );
}
