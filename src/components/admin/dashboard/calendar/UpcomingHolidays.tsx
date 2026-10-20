import { Calendar, CalendarX2 } from "lucide-react";

import { UpcomingHolidaysProps } from "./calendar.types";
import { formatDate } from "./calendar.utils";

export default function UpcomingHolidays({
  holidays,
}: UpcomingHolidaysProps) {
  return (
    <div className="border-t border-gray-100 px-5 py-3">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-red-500" />

        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Upcoming Holidays
          </h3>

          <p className="text-[11px] text-gray-500">
            Next school holidays
          </p>
        </div>
      </div>

      {/* Empty State */}
      {holidays.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-5">
          <CalendarX2 className="mb-1.5 h-7 w-7 text-gray-300" />

          <p className="text-xs font-medium text-gray-500">
            No upcoming holidays
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {holidays.map((holiday) => (
            <div
              key={`${holiday.title}-${holiday.date.toISOString()}`}
              className="group flex items-center gap-2.5 py-2.5 transition-colors hover:bg-red-50/60"
            >
              {/* Holiday Indicator */}
              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />

              {/* Holiday Information */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-800 group-hover:text-gray-900">
                  {holiday.title}
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  {holiday.isFullDay ? "Full Day" : "Partial Day"}
                </p>
              </div>

              {/* Date */}
              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold text-gray-700">
                  {formatDate(holiday.date, {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>

                <p className="text-[10px] text-gray-400">
                  {formatDate(holiday.date, {
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}