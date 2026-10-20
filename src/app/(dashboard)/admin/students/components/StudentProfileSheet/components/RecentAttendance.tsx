"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  XCircle,
} from "lucide-react";

interface AttendanceRecord {
  id: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
}

interface RecentAttendanceProps {
  records: AttendanceRecord[];
  onViewAll?: () => void;
}

const MAX_RECENT_RECORDS = 5;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function getStatusConfig(status: AttendanceRecord["status"]) {
  switch (status) {
    case "PRESENT":
      return {
        label: "Present",
        icon: CheckCircle2,
        badge: "bg-emerald-50 text-emerald-700",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      };

    case "ABSENT":
      return {
        label: "Absent",
        icon: XCircle,
        badge: "bg-red-50 text-red-700",
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
      };

    case "LATE":
      return {
        label: "Late",
        icon: Clock3,
        badge: "bg-amber-50 text-amber-700",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      };

    case "LEAVE":
      return {
        label: "Leave",
        icon: Plane,
        badge: "bg-blue-50 text-blue-700",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      };
  }
}

export default function RecentAttendance({
  records,
  onViewAll,
}: RecentAttendanceProps) {
  const recentRecords = records.slice(0, MAX_RECENT_RECORDS);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Attendance
            </h3>

            <p className="text-[11px] text-slate-500">
              Last 5 attendance records
            </p>
          </div>
        </div>

        {recentRecords.length > 0 && (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
            {recentRecords.length}
          </span>
        )}
      </div>

      {/* Empty */}
      {recentRecords.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <CalendarDays className="mx-auto h-7 w-7 text-slate-300" />

          <h4 className="mt-2 text-xs font-semibold text-slate-800">
            No Attendance Records
          </h4>

          <p className="mt-1 text-[11px] text-slate-500">
            Attendance has not been recorded yet.
          </p>
        </div>
      ) : (
        <>
          {/* Records */}
          <div className="divide-y divide-slate-100">
            {recentRecords.map((record) => {
              const config = getStatusConfig(record.status);
              const Icon = config.icon;

              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
                    >
                      <Icon
                        className={`h-4 w-4 ${config.iconColor}`}
                        strokeWidth={2}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900">
                        {formatDate(record.date)}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Attendance recorded
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.badge}`}
                  >
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* View All */}
          {onViewAll && records.length > MAX_RECENT_RECORDS && (
            <div className="border-t border-slate-100 px-4 py-3">
              <button
                type="button"
                onClick={onViewAll}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Complete Attendance History
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
