import { cn } from "@/lib/cn";

type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-sans text-xs font-medium uppercase text-mute",
        "tracking-[var(--tracking-eyebrow)]",
        className,
      )}
      {...props}
    />
  );
}
