import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary"
  | "primary";

interface StatusBadgeProps {
  children: ReactNode;
  variant?: StatusVariant;
  className?: string;
}

const variants: Record<StatusVariant, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700",

  warning:
    "border-amber-200 bg-amber-50 text-amber-700",

  danger:
    "border-red-200 bg-red-50 text-red-700",

  info:
    "border-sky-200 bg-sky-50 text-sky-700",

  secondary:
    "border-slate-200 bg-slate-100 text-slate-700",

  primary:
    "border-indigo-200 bg-indigo-50 text-indigo-700",
};

export default function StatusBadge({
  children,
  variant = "secondary",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}