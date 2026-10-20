"use client";

import { CalendarDays, Clock } from "lucide-react";

interface UpcomingEvent {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

interface DashboardUpcomingEventsProps {
  events: UpcomingEvent[];
}

export default function DashboardUpcomingEvents({
  events,
}: DashboardUpcomingEventsProps) {
  return (
    <div className="flex h-full min-h-[235px] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-[#303552]">Upcoming Events</h3>

          <p className="mt-0.5 text-[10px] text-slate-400">
            School events and activities
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FA]">
          <CalendarDays className="h-4 w-4 text-[#4B517D]" />
        </div>
      </div>

      {/* EVENTS */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {events.length === 0 ? (
          <div className="flex h-full min-h-[170px] items-center justify-center px-5 text-center">
            <div>
              <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-2 text-sm font-medium text-slate-500">
                No upcoming events
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Upcoming school activities will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((event) => {
              const startDate = new Date(event.startTime);

              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                >
                  {/* DATE */}
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#FFF4E4]">
                    <span className="text-[9px] font-semibold uppercase text-[#F59A23]">
                      {startDate.toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>

                    <span className="text-sm font-bold text-[#303552]">
                      {startDate.getDate()}
                    </span>
                  </div>

                  {/* EVENT DETAILS */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {event.title}
                    </p>

                    {event.description && (
                      <p className="truncate text-[9px] font-medium text-slate-400">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="h-3 w-3" />

                      {startDate.toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
