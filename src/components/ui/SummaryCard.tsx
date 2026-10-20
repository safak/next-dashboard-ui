import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;

  subtitle?: string;

  icon: LucideIcon;

  variant?: "primary" | "success" | "warning" | "danger" | "secondary";

  layout?: "default" | "compact";

  trend?: string;
  badge?: string;
  progress?: number;

  loading?: boolean;

  onClick?: () => void;
}

const variants = {
  primary: {
    card: "border-sky-100",
    icon: "bg-sky-100 text-sky-700",
    badge: "bg-sky-100 text-sky-700",
    progress: "bg-sky-500",
  },

  success: {
    card: "border-emerald-100",
    icon: "bg-emerald-100 text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    progress: "bg-emerald-500",
  },

  warning: {
    card: "border-amber-100",
    icon: "bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    progress: "bg-amber-500",
  },

  danger: {
    card: "border-rose-100",
    icon: "bg-rose-100 text-rose-700",
    badge: "bg-rose-100 text-rose-700",
    progress: "bg-rose-500",
  },

  secondary: {
    card: "border-slate-200",
    icon: "bg-slate-100 text-slate-700",
    badge: "bg-slate-100 text-slate-700",
    progress: "bg-slate-500",
  },
};

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,

  variant = "primary",
  layout = "default",

  trend,
  badge,
  progress,

  loading = false,

  onClick,
}: SummaryCardProps) {
  const colors = variants[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-white shadow-sm transition-all",
        layout === "compact" ? "p-3" : "p-4",
        colors.card,
        onClick && "cursor-pointer hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium text-slate-500",
              layout === "compact" ? "text-xs" : "text-sm",
            )}
          >
            {title}
          </p>

          {loading ? (
            <div className="mt-2 h-8 w-20 animate-pulse rounded bg-slate-200" />
          ) : (
            <h2
              className={cn(
                "mt-1 font-bold tracking-tight text-slate-900",
                layout === "compact" ? "text-2xl" : "text-3xl",
              )}
            >
              {value}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
          )}
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg",
            layout === "compact" ? "h-8 w-8" : "h-9 w-9",
            colors.icon,
          )}
        >
          <Icon
            className={cn(layout === "compact" ? "h-3.5 w-3.5" : "h-4 w-4")}
          />
        </div>
      </div>

      {layout === "default" && (trend || badge) && (
        <div className="mt-3 flex items-center justify-between">
          {trend ? (
            <span className="text-sm font-medium text-emerald-600">
              {trend}
            </span>
          ) : (
            <span />
          )}

          {layout === "default" && badge && (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                colors.badge,
              )}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      {layout === "default" && progress !== undefined && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn("h-full rounded-full", colors.progress)}
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
