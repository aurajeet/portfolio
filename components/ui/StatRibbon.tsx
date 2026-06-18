import { cn } from "@/lib/cn";

interface StatRibbonItem {
  value: string;
  label: string;
}

interface StatRibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StatRibbonItem[];
}

const columnsByCount: Record<number, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function StatRibbon({ items, className, ...props }: StatRibbonProps) {
  if (items.length === 0) return null;

  const columns = columnsByCount[items.length] ?? "md:grid-cols-4";

  return (
    <div
      className={cn("grid grid-cols-1", columns, className)}
      {...props}
    >
      {items.map((item, idx) => (
        <div
          key={item.label}
          className={cn(
            "flex min-w-0 flex-col",
            idx > 0 && [
              "mt-8 border-t border-rule pt-8",
              "md:mt-0 md:border-t-0 md:pt-0",
              "md:border-l md:pl-8",
            ],
          )}
        >
          <span
            className={cn(
              "font-display font-normal text-ink",
              "leading-tight tracking-[-0.02em] text-balance break-words",
              "text-3xl md:text-4xl lg:text-5xl",
            )}
          >
            {item.value}
          </span>
          <span
            className={cn(
              "mt-3 font-sans text-eyebrow-sm font-medium uppercase text-mute",
              "tracking-[var(--tracking-eyebrow)]",
            )}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
