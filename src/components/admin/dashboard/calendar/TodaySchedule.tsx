import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";

import { TodayScheduleProps } from "./calendar.types";
import { formatTime } from "./calendar.utils";

export default function TodaySchedule({ events }: TodayScheduleProps) {
  return (
    <div className="border-t border-gray-100 px-5 py-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Today&apos;s Schedule
          </h3>

          <p className="text-[11px] text-gray-500">
            Events & activities for today
          </p>
        </div>

        <Link
          href="/admin/events"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          View All
        </Link>
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-5">
          <CalendarDays className="mb-1.5 h-7 w-7 text-gray-300" />

          <p className="text-xs font-medium text-gray-500">
            No events scheduled today
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {events.map((event) => (
            <div
              key={event.id}
              className="group flex items-center gap-2.5 py-2.5 transition-colors hover:bg-indigo-50/50"
            >
              {/* Event Icon */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                <Clock className="h-3.5 w-3.5 text-indigo-600" />
              </div>

              {/* Event Information */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-800">
                  {event.title}
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-indigo-600">
                    {formatTime(event.startTime)}
                  </span>

                  {event.description && (
                    <>
                      <span className="text-[10px] text-gray-300">•</span>

                      <span className="truncate text-[10px] text-gray-400">
                        {event.description}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
