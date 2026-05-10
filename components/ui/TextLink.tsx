import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface TextLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function TextLink({
  arrow = true,
  className,
  children,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-2 font-sans text-[11px] font-medium uppercase",
        "tracking-[var(--tracking-eyebrow)] text-ink",
        "transition-opacity duration-300 ease-[var(--ease-luxe)] hover:opacity-60",
        className,
      )}
      {...props}
    >
      <span className="relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current">
        {children}
      </span>
      {arrow && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-[var(--ease-luxe)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </Link>
  );
}
