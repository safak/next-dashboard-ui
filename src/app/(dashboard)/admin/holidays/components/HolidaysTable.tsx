"use client";

import { CalendarDays, Clock3 } from "lucide-react";

import HolidayRowActions from "./HolidayRowActions";
import type { Holiday } from "@prisma/client";

interface HolidaysTableProps {
  holidays: Holiday[];

  onEdit: (holiday: Holiday) => void;
  onDelete: (holiday: Holiday) => void;
  onView: (holiday: Holiday) => void;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
  }).format(new Date(date));
}

export default function HolidaysTable({
  holidays,
  onEdit,
  onDelete,
  onView,
}: HolidaysTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Holiday
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Date
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Duration
              </th>

              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Created
              </th>

              <th className="w-[110px] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {holidays.map((holiday) => (
              <tr
                key={holiday.id}
                className="group transition-colors hover:bg-slate-50/70"
              >
                {/* Holiday */}
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onView(holiday)}
                    className="flex items-center gap-3 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-violet-700">
                        {holiday.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Holiday #{holiday.id}
                      </p>
                    </div>
                  </button>
                </td>

                {/* Date */}
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(holiday.date)}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDay(holiday.date)}
                    </p>
                  </div>
                </td>

                {/* Duration */}
                <td className="px-4 py-4">
                  {holiday.isFullDay ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <Clock3 className="h-3.5 w-3.5" />
                      Full Day
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      <Clock3 className="h-3.5 w-3.5" />
                      Half Day
                    </span>
                  )}
                </td>

                {/* Created */}
                <td className="px-4 py-4">
                  <p className="text-xs font-medium text-slate-500">
                    {formatDate(holiday.createdAt)}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-center">
                  <HolidayRowActions
                    item={holiday}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
