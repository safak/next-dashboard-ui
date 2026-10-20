"use client";

import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";

import type { MonthlyAttendanceDay, MonthlyAttendanceStudent } from "./types";

import { formatDateToISO, getTodayDate, parseDate } from "./utils";

interface MonthlyAttendanceHistoryProps {
  student: MonthlyAttendanceStudent;
  month: string;
  workingDayKeys: string[];
  onDateClick: (date: string) => void;
}

export default function MonthlyAttendanceHistory({
  student,
  month,
  workingDayKeys,
  onDateClick,
}: MonthlyAttendanceHistoryProps) {
  const attendanceMap = new Map<string, MonthlyAttendanceDay>(
    student.attendance.map((item) => [item.date, item]),
  );

  const today = getTodayDate();

  /**
   * Only show working days that have already occurred.
   */
  const visibleWorkingDays = workingDayKeys.filter((date) => date <= today);

  return (
    <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-2.5">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="mb-2 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-indigo-500" />

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Daily Attendance
        </span>

        <span className="text-xs text-slate-400">Click a date to correct</span>
      </div>

      {/* ============================================================
          DATE BUTTONS
      ============================================================ */}

      {visibleWorkingDays.length === 0 ? (
        <p className="py-2 text-sm text-slate-500">
          No working dates available.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visibleWorkingDays.map((dateKey) => {
            const date = parseDate(dateKey);

            const record = attendanceMap.get(dateKey);

            const status = record?.status;

            const isToday = dateKey === today;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onDateClick(dateKey)}
                title={
                  status === "PRESENT"
                    ? `${dateKey} — Present`
                    : status === "ABSENT"
                      ? `${dateKey} — Absent`
                      : `${dateKey} — Pending`
                }
                className={cn(
                  `
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-sm
                  `,

                  /* PRESENT */

                  status === "PRESENT" &&
                    `
                      border-green-200
                      bg-green-50
                      text-green-700
                      hover:bg-green-100
                    `,

                  /* ABSENT */

                  status === "ABSENT" &&
                    `
                      border-red-200
                      bg-red-50
                      text-red-700
                      hover:bg-red-100
                    `,

                  /* PENDING */

                  !status &&
                    `
                      border-amber-200
                      bg-amber-50
                      text-amber-700
                      hover:bg-amber-100
                    `,

                  /* TODAY */

                  isToday &&
                    `
                      ring-2
                      ring-indigo-200
                      ring-offset-1
                    `,
                )}
              >
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
