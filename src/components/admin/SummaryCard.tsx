import { LucideIcon, TrendingUp } from "lucide-react";

type CardColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "gray"
  | "indigo"
  | "slate";

interface SummaryCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: CardColor;
  trend?: string;

  /**
   * Compact mode for dense ERP dashboards.
   */
  compact?: boolean;
}

const colorMap: Record<
  CardColor,
  {
    bg: string;
    iconBg: string;
    iconColor: string;
    border: string;
    decoration: string;
  }
> = {
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    border: "border-blue-100",
    decoration: "bg-blue-100/40",
  },

  green: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    decoration: "bg-emerald-100/40",
  },

  red: {
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    border: "border-red-100",
    decoration: "bg-red-100/40",
  },

  yellow: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-100",
    decoration: "bg-amber-100/40",
  },

  purple: {
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    decoration: "bg-violet-100/40",
  },

  gray: {
    bg: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    border: "border-slate-200",
    decoration: "bg-slate-100/50",
  },

  indigo: {
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    decoration: "bg-indigo-100/40",
  },

  slate: {
    bg: "bg-slate-50",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    border: "border-slate-200",
    decoration: "bg-slate-100/50",
  },
};

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  trend,
  compact = false,
}: SummaryCardProps) {
  const styles = colorMap[color];
  const Icon = icon;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        ${styles.bg}
        ${styles.border}
        rounded-2xl
        border
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        ${compact ? "px-4 py-3" : "px-5 py-4"}
      `}
    >
      {/* Decorative pastel shape */}

      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          -right-7
          -top-7
          h-24
          w-24
          rounded-full
          ${styles.decoration}
          transition-transform
          duration-300
          group-hover:scale-110
        `}
      />

      {/* Header */}

      <div className="relative flex items-start justify-between gap-3">
        <p
          className={`
            min-w-0
            font-medium
            tracking-wide
            text-slate-500
            ${compact ? "text-xs" : "text-sm"}
          `}
        >
          {title}
        </p>

        {/* Icon */}

        <div
          className={`
            ${styles.iconBg}
            ${styles.iconColor}
            flex
            shrink-0
            items-center
            justify-center
            rounded-xl
            shadow-sm
            ring-1
            ring-black/[0.02]
            ${compact ? "h-9 w-9" : "h-11 w-11"}
          `}
        >
          <Icon
            strokeWidth={1.8}
            className={
              compact
                ? "h-[18px] w-[18px]"
                : "h-5 w-5"
            }
          />
        </div>
      </div>

      {/* Value */}

      <div className="relative mt-1">
        <h2
          className={`
            font-bold
            leading-none
            tracking-tight
            text-slate-950
            ${compact ? "text-2xl" : "text-3xl"}
          `}
        >
           {value}
        </h2>
      </div>

      {/* Subtitle */}

      {subtitle && (
        <p
          className={`
            relative
            mt-2
            max-w-[90%]
            truncate
            font-medium
            leading-4
            text-slate-400
            ${compact ? "text-[10px]" : "text-xs"}
          `}
          title={subtitle}
        >
          {subtitle}
        </p>
      )}

      {/* Trend */}

      {trend && (
        <div
          className={`
            relative
            flex
            items-center
            gap-1
            font-medium
            text-emerald-600
            ${compact ? "mt-1.5 text-[10px]" : "mt-2 text-xs"}
          `}
        >
          <TrendingUp
            className={
              compact
                ? "h-3 w-3"
                : "h-3.5 w-3.5"
            }
          />

          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}