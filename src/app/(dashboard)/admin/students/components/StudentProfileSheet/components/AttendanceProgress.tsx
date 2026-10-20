"use client";

import { CalendarCheck, CalendarX, Trophy } from "lucide-react";

interface AttendanceProgressProps {
  attendancePercentage: number;
  presentDays: number;
  absentDays: number;
  workingDays: number;
}

export default function AttendanceProgress({
  attendancePercentage,
  presentDays,
  absentDays,
  workingDays,
}: AttendanceProgressProps) {
  const percentage = Math.max(0, Math.min(100, attendancePercentage ?? 0));

  const status =
    percentage >= 95
      ? "Excellent Attendance"
      : percentage >= 90
        ? "Very Good Attendance"
        : percentage >= 80
          ? "Good Attendance"
          : "Needs Improvement";

  const statusStyles =
    percentage >= 95
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : percentage >= 90
        ? "bg-blue-50 text-blue-700 border-blue-100"
        : percentage >= 80
          ? "bg-amber-50 text-amber-700 border-amber-100"
          : "bg-red-50 text-red-700 border-red-100";

  const progressColor =
    percentage >= 95
      ? "bg-emerald-500"
      : percentage >= 90
        ? "bg-blue-500"
        : percentage >= 80
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <Trophy className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              Attendance Progress
            </h3>

            <p className="truncate text-[11px] text-slate-500">
              Overall attendance performance
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles}`}
        >
          {status}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Overall Attendance
            </p>

            <p className="mt-1 text-3xl font-bold leading-none tracking-tight text-slate-900">
              {percentage}%
            </p>
          </div>

          <p className="text-[11px] text-slate-400">
            {presentDays} / {workingDays} working days
          </p>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
              <CalendarCheck className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                Present Days
              </p>

              <p className="text-lg font-bold leading-none text-emerald-700">
                {presentDays}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
              <CalendarX className="h-4 w-4 text-red-600" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium text-slate-500">
                Absent Days
              </p>

              <p className="text-lg font-bold leading-none text-red-700">
                {absentDays}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">{presentDays}</span> of{" "}
          <span className="font-semibold text-slate-700">{workingDays}</span>{" "}
          working days attended
        </p>
      </div>
    </div>
  );
}
