"use client";

import { addDays, endOfWeek, format, isSameDay, startOfWeek } from "date-fns";

import { isSecondSaturday, toDateKey } from "./calendar.utils";

import { CalendarEvent, CalendarHoliday } from "./calendar.types";

interface Props {
  selectedDate: Date;
  holidays: Record<string, CalendarHoliday>;
  events?: Record<string, CalendarEvent[]>;
  onDateChange: (date: Date) => void;
  onActiveStartDateChange: (date: Date) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CompactWeekCalendar({
  selectedDate,
  holidays,
  events = {},
  onDateChange,
  onActiveStartDateChange,
}: Props) {
  const weekStart = startOfWeek(selectedDate, {
    weekStartsOn: 0,
  });

  const weekEnd = endOfWeek(selectedDate, {
    weekStartsOn: 0,
  });

  const days: Date[] = [];

  let current = weekStart;

  while (current <= weekEnd) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-7 text-center">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-[9px] font-medium text-slate-400 sm:text-[10px]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const holiday = holidays[toDateKey(day)];
          const dayEvents = events[toDateKey(day)] ?? [];
          const selected = isSameDay(day, selectedDate);
          const secondSaturday = isSecondSaturday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              title={
                holiday
                  ? `${holiday.title}${
                      holiday.isFullDay ? " - Full Day" : " - Partial"
                    }`
                  : undefined
              }
              onClick={() => {
                onDateChange(day);
                onActiveStartDateChange(day);
              }}
              className={[
                "relative flex h-9 min-w-0 flex-col items-center justify-center rounded-lg border transition-all sm:h-10",
                selected
                  ? "border-[#4B517D] bg-[#EEF2FF] text-[#4B517D] shadow-sm"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[11px] font-medium sm:text-xs",
                  selected && "font-bold",
                  holiday && !selected && "text-red-500",
                  secondSaturday && !selected && "text-[#F59A23]",
                  !holiday && !secondSaturday && !selected && "text-slate-600",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {format(day, "d")}
              </span>

              <div className="mt-1 flex min-h-[4px] items-center gap-1">
                {holiday && (
                  <span className="h-1 w-1 rounded-full bg-red-500" />
                )}

                {secondSaturday && (
                  <span className="h-1 w-1 rounded-full bg-[#F59A23]" />
                )}

                {dayEvents.length > 0 && (
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
