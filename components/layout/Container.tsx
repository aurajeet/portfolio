import { cn } from "@/lib/cn";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: "narrow" | "wide";
}

export function Container({
  width = "wide",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        width === "wide" ? "container-wide" : "container-narrow",
        className,
      )}
      {...props}
    />
  );
}
