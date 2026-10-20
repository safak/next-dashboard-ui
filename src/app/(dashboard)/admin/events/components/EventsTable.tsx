"use client";

import { CalendarDays, Clock3, GraduationCap, Tag } from "lucide-react";

import EventRowActions from "./EventRowActions";
import type { EventRow } from "../types";

interface EventsTableProps {
  events: EventRow[];

  onEdit: (event: EventRow) => void;

  onDelete: (event: EventRow) => void;
}

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: Date) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventsTable({
  events,
  onEdit,
  onDelete,
}: EventsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Event
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Class
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Category
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Date
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Time
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="group border-b border-slate-100 transition-colors duration-150 last:border-b-0 hover:bg-indigo-50/30"
              >
                {/* EVENT */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {event.title}
                      </p>

                      <p className="mt-0.5 max-w-[360px] truncate text-xs text-slate-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* CLASS */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-sm font-medium text-slate-600">
                      {event.class?.name ?? "All Classes"}
                    </span>
                  </div>
                </td>

                {/* CATEGORY */}

                <td className="px-5 py-2.5">
                  {event.category ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      <Tag className="h-3 w-3" />
                      {event.category}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>

                {/* DATE */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {formatDate(event.startTime)}
                    </span>
                  </div>
                </td>

                {/* TIME */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {formatTime(event.startTime)}
                      {" – "}
                      {formatTime(event.endTime)}
                    </span>
                  </div>
                </td>

                {/* ACTIONS */}

                <td className="px-5 py-2.5">
                  <div className="flex justify-center">
                    <EventRowActions
                      event={event}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
