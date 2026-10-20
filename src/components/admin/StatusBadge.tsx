"use client";

import {
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
  Ban,
  UserCheck,
  UserX,
  HelpCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string | null | undefined;
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  size = "sm",
}: StatusBadgeProps) {
  const normalizedStatus = (status || "UNKNOWN").toUpperCase();

  const statusMap: Record<
    string,
    {
      label: string;
      icon: React.ElementType;
      className: string;
    }
  > = {
    PRESENT: {
      label: "Present",
      icon: CheckCircle2,
      className:
        "bg-green-100 text-green-700 border-green-200",
    },

    ABSENT: {
      label: "Absent",
      icon: XCircle,
      className:
        "bg-red-100 text-red-700 border-red-200",
    },

    LATE: {
      label: "Late",
      icon: Clock3,
      className:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
    },

    LEAVE: {
      label: "Leave",
      icon: CalendarDays,
      className:
        "bg-blue-100 text-blue-700 border-blue-200",
    },

    PENDING: {
      label: "Pending",
      icon: Clock3,
      className:
        "bg-orange-100 text-orange-700 border-orange-200",
    },

    APPROVED: {
      label: "Approved",
      icon: CheckCircle2,
      className:
        "bg-green-100 text-green-700 border-green-200",
    },

    REJECTED: {
      label: "Rejected",
      icon: XCircle,
      className:
        "bg-red-100 text-red-700 border-red-200",
    },

    CANCELLED: {
      label: "Cancelled",
      icon: Ban,
      className:
        "bg-gray-100 text-gray-700 border-gray-200",
    },

    ACTIVE: {
      label: "Active",
      icon: UserCheck,
      className:
        "bg-emerald-100 text-emerald-700 border-emerald-200",
    },

    INACTIVE: {
      label: "Inactive",
      icon: UserX,
      className:
        "bg-slate-100 text-slate-700 border-slate-200",
    },
  };

  const config = statusMap[normalizedStatus] || {
    label: status || "Unknown",
    icon: HelpCircle,
    className:
      "bg-slate-100 text-slate-700 border-slate-200",
  };

  const Icon = config.icon;

  const sizeClasses =
    size === "md"
      ? "px-3 py-1.5 text-sm"
      : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        font-medium
        ${config.className}
        ${sizeClasses}
      `}
    >
      <Icon size={size === "md" ? 16 : 14} />

      {config.label}
    </span>
  );
}