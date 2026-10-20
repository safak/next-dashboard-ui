"use client";

import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Ban,
  ChevronRight,
  User,
} from "lucide-react";

interface Leave {
  id: number;
  teacherId: string;
  teacherName: string;
  teacherImage: string | null;
  phone: string | null;
  email: string | null;
  leaveDate: string;
  leaveType: string;
  duration: string;
  reason: string;
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
}

interface LeaveCardProps {
  leave: Leave;
  onClick: () => void;
}

export default function LeaveCard({ leave, onClick }: LeaveCardProps) {
  function formatLabel(value: string) {
    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  function getStatus() {
    switch (leave.status) {
      case "PENDING":
        return {
          label: "Pending",
          icon: Clock3,
          bg: "bg-[#FFF8EC]",
          text: "text-[#B87938]",
          dot: "bg-[#F59A23]",
        };

      case "APPROVED":
        return {
          label: "Approved",
          icon: CheckCircle2,
          bg: "bg-[#ECFDF3]",
          text: "text-emerald-600",
          dot: "bg-emerald-500",
        };

      case "REJECTED":
        return {
          label: "Rejected",
          icon: XCircle,
          bg: "bg-red-50",
          text: "text-red-600",
          dot: "bg-red-500",
        };

      case "CANCELLED":
        return {
          label: "Cancelled",
          icon: Ban,
          bg: "bg-slate-100",
          text: "text-slate-600",
          dot: "bg-slate-400",
        };

      default:
        return {
          label: formatLabel(leave.status),
          icon: Clock3,
          bg: "bg-slate-100",
          text: "text-slate-600",
          dot: "bg-slate-400",
        };
    }
  }

  const status = getStatus();
  const StatusIcon = status.icon;

  const formattedDate = new Date(leave.leaveDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        shadow-[0_4px_18px_rgba(75,81,125,0.05)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-[#4B517D]/20
        hover:shadow-[0_10px_28px_rgba(75,81,125,0.10)]
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EEF2FF]">
            {leave.teacherImage ? (
              <Image
                src={leave.teacherImage}
                alt={leave.teacherName}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-[#4B517D]" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#303552]">
              {leave.teacherName}
            </h3>

            <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
              {formatLabel(leave.leaveType)} Leave
            </p>
          </div>
        </div>

        <div
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 ${status.bg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />

          <StatusIcon className={`h-3 w-3 ${status.text}`} strokeWidth={2.2} />

          <span className={`text-[10px] font-semibold ${status.text}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Details */}

      <div className="grid grid-cols-2 gap-2.5 px-4 py-3.5">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-[#4B517D]" />

            <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
              Leave Date
            </span>
          </div>

          <p className="mt-1 text-xs font-semibold text-[#303552]">
            {formattedDate}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-[#B87938]" />

            <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
              Duration
            </span>
          </div>

          <p className="mt-1 truncate text-xs font-semibold text-[#303552]">
            {formatLabel(leave.duration)}
          </p>
        </div>
      </div>

      {/* Reason */}

      <div className="px-4 pb-3">
        <div className="rounded-xl bg-[#F8F9FC] px-3 py-2.5">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            Reason
          </p>

          <p className="line-clamp-2 text-xs leading-5 text-slate-600">
            {leave.reason || "No reason provided"}
          </p>
        </div>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
        <span className="text-[10px] font-semibold text-[#4B517D]">
          Review leave request
        </span>

        <div
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            bg-[#EEF2FF]
            text-[#4B517D]
            transition-all
            duration-200
            group-hover:bg-[#4B517D]
            group-hover:text-white
          "
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
