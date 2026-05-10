import { cn } from "@/lib/cn";

type ButtonVariant = "filled" | "outlined";
type ButtonSize = "sm" | "md";

const variantStyles: Record<ButtonVariant, string> = {
  filled: "bg-ink text-paper hover:bg-ink-soft",
  outlined: "border border-ink text-ink hover:bg-ink hover:text-paper",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-[11px]",
  md: "h-12 px-7 text-xs",
};

export function buttonStyles(
  variant: ButtonVariant = "filled",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center font-sans font-medium uppercase",
    "tracking-[var(--tracking-button)] transition-colors duration-300",
    "ease-[var(--ease-luxe)] cursor-pointer whitespace-nowrap select-none",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles(variant, size, className)} {...props} />
  );
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return <a className={buttonStyles(variant, size, className)} {...props} />;
}
