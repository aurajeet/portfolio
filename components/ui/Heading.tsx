import { cn } from "@/lib/cn";

type HeadingVariant = "display" | "h1" | "h2" | "h3" | "h4";

const sizeStyles: Record<HeadingVariant, string> = {
  display: "text-[clamp(3rem,9vw,7.5rem)] leading-[0.95]",
  h1: "text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02]",
  h2: "text-[clamp(1.75rem,2.5vw,2.25rem)] leading-[1.1]",
  h3: "text-[clamp(1.25rem,1.8vw,1.625rem)] leading-[1.2]",
  h4: "text-[clamp(1.125rem,1.4vw,1.375rem)] leading-[1.3]",
};

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: HeadingVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  italic?: boolean;
}

export function Heading({
  variant = "h2",
  as,
  italic = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag: React.ElementType =
    as ?? (variant === "display" ? "h1" : variant);

  return (
    <Tag
      className={cn(
        "font-display font-normal text-ink tracking-[-0.012em]",
        sizeStyles[variant],
        italic && "italic",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
