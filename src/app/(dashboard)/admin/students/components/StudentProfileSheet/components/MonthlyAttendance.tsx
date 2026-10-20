"use client";

import { CalendarDays } from "lucide-react";

interface MonthlyAttendanceItem {
  month: string;
  percentage: number;
}

interface MonthlyAttendanceProps {
  monthly: MonthlyAttendanceItem[];
}

export default function MonthlyAttendance({ monthly }: MonthlyAttendanceProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) {
      return "bg-emerald-500";
    }

    if (percentage >= 90) {
      return "bg-blue-500";
    }

    if (percentage >= 80) {
      return "bg-amber-500";
    }

    return "bg-red-500";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
            <CalendarDays className="h-4 w-4 text-violet-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              Monthly Attendance
            </h3>

            <p className="truncate text-[11px] text-slate-500">
              Attendance trend by month
            </p>
          </div>
        </div>

        {monthly.length > 0 && (
          <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
            {monthly.length} {monthly.length === 1 ? "Month" : "Months"}
          </span>
        )}
      </div>

      {monthly.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <CalendarDays className="mx-auto h-6 w-6 text-slate-300" />

          <p className="mt-2 text-xs font-medium text-slate-500">
            No attendance records available.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {monthly.map((item) => {
            const percentage = Math.max(0, Math.min(100, item.percentage ?? 0));

            return (
              <div key={item.month} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-xs font-semibold text-slate-800">
                    {item.month}
                  </p>

                  <span className="shrink-0 text-xs font-bold text-slate-900">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                      percentage,
                    )}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
