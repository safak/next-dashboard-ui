"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

import { CalendarHeaderProps } from "./calendar.types";
import { formatMonthYear } from "./calendar.utils";

export default function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="border-b border-slate-100 px-4 py-2.5 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF]">
          <CalendarDays className="h-4 w-4 text-[#4B517D]" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-[#303552]">
            School Calendar
          </h2>

          <p className="mt-0.5 truncate text-[9px] text-slate-400">
            Holidays, events & important dates
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPreviousMonth}
          aria-label="Previous month"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-[#EEF2FF] hover:text-[#4B517D]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <h3 className="text-xs font-bold text-[#303552]">
          {formatMonthYear(currentDate)}
        </h3>

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-[#EEF2FF] hover:text-[#4B517D]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
