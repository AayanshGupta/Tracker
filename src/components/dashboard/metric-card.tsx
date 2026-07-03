import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneConfig = {
  blue: {
    icon: "bg-primary/10 text-primary",
    border: "border-l-primary",
    value: "text-primary",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    border: "border-l-emerald-500",
    value: "text-emerald-700 dark:text-emerald-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    border: "border-l-amber-500",
    value: "text-amber-700 dark:text-amber-400",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
    border: "border-l-rose-500",
    value: "text-rose-700 dark:text-rose-400",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    border: "border-l-violet-500",
    value: "text-violet-700 dark:text-violet-400",
  },
} as const;

export function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: keyof typeof toneConfig;
}) {
  const t = toneConfig[tone];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-l-4 bg-card px-5 py-5 shadow-card transition-shadow hover:shadow-md",
        t.border
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "font-display mt-2 text-4xl font-bold tabular-nums tracking-tight",
              t.value
            )}
          >
            {value}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{helper}</p>
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", t.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
