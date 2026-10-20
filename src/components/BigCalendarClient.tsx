"use client";

import { useMemo, useState } from "react";
import { CalendarEvent } from "@/lib/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  getYear,
} from "date-fns";

export default function BigCalendarClient({
  events,
}: {
  events: CalendarEvent[];
  onEventClick?: (e: CalendarEvent) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [hoverEvent, setHoverEvent] = useState<CalendarEvent | null>(null);

  /* ================= COLORS ================= */
  const colors: Record<string, string> = {
    CLASS: "bg-blue-500",
    EVENT: "bg-emerald-500",
    HOLIDAY: "bg-amber-400 text-black",
    EXAM: "bg-purple-500",
    PRESENT: "bg-green-500",
    ABSENT: "#ef4444",
  };

  /* ================= RANGE ================= */
  const days = useMemo(() => {
    if (view === "week") {
      const start = startOfWeek(currentDate);
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }

    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));

    const list = [];
    let d = start;

    while (d <= end) {
      list.push(d);
      d = addDays(d, 1);
    }

    return list;
  }, [currentDate, view]);

  /* ================= GROUP EVENTS ================= */
  const grouped = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};

    events.forEach((e) => {
      const key = format(new Date(e.start), "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });

    return map;
  }, [events]);

  /* ================= MONTH CHANGE ================= */
  const handleMonthChange = (monthIndex: number) => {
    const year = getYear(currentDate);
    setCurrentDate(new Date(year, monthIndex, 1));
  };

  const getHeatmapBg = (events: CalendarEvent[]) => {
    if (!events.length) return "";

    if (events.some((e) => e.type === "ABSENT")) return "bg-red-50";

    if (events.some((e) => e.type === "PRESENT")) return "bg-green-50";

    return "";
  };

  /* ================= RENDER ================= */
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden relative">
      {/* ========= TOOLBAR ========= */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 border-b text-xs sm:text-sm gap-2 overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Month dropdown */}
          <select
            value={currentDate.getMonth()}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="border rounded px-1.5 py-0.5 text-[10px] sm:text-xs"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {format(new Date(2025, i), "MMMM")}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="border rounded px-1.5 py-0.5 text-[10px] sm:text-xs"
          >
            Today
          </button>

          {/* ⭐ NEW VIEW TOGGLE */}
          <button
            onClick={() => setView("month")}
            className={`border rounded px-1.5 py-0.5 text-[10px] sm:text-xs ${
              view === "month" ? "bg-indigo-600 text-white" : "border"
            }`}
          >
            Month
          </button>

          <button
            onClick={() => setView("week")}
            className={`border rounded px-1.5 py-0.5 text-[10px] sm:text-xs ${
              view === "week" ? "bg-indigo-600 text-white" : "border"
            }`}
          >
            Week
          </button>
        </div>

        {/* year nav */}
        <div className="flex items-center gap-1 sm:gap-3 font-medium shrink-0 text-xs">
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, -1))}
            className="w-7 h-7 border rounded-full text-xs"
          >
            ◀
          </button>

          <span>{format(currentDate, "yyyy")}</span>

          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="w-7 h-7 border rounded-full text-xs"
          >
            ▶
          </button>
        </div>
      </div>

      {/* ========= WEEK HEADERS ========= */}
      <div className="grid grid-cols-7 border-b text-[10px] sm:text-[11px] font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
          <div
            key={d}
            className={`text-center py-0.5 sm:py-1 ${
              i === 0 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ========= GRID ========= */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayEvents = grouped[key] || [];
          const isSunday = day.getDay() === 0;

          return (
            <div
              key={key}
              className={`border-r border-b min-h-[42px] sm:min-h-[69px] p-0.5 sm:p-1 text-[10px] sm:text-[11px] relative
                ${isSunday ? "bg-gray-50" : ""}
                ${getHeatmapBg(dayEvents)}`}
            >
              {/* date */}
              <span
                className={`absolute top-1 left-1 font-medium ${
                  isSunday ? "text-red-500" : "text-gray-700"
                }`}
              >
                {format(day, "d")}
              </span>

              {/* events */}
              <div className="mt-4 space-y-0.5">
                {dayEvents.slice(0, 2).map((e, index) => (
                  <div
                    key={`${e.id}-${index}-${e.start}`}
                    onMouseEnter={() => setHoverEvent(e)}
                    onMouseLeave={() => setHoverEvent(null)}
                    className={`px-1 py-[1px] rounded text-white truncate text-[9px] sm:text-[10px] cursor-pointer ${colors[e.type]}`}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========= TOOLTIP ========= */}
      {hoverEvent && (
        <div className="absolute bottom-4 left-4 bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-50">
          <p className="font-semibold">{hoverEvent.title}</p>
          <p>
            {format(new Date(hoverEvent.start), "dd MMM, hh:mm a")} —{" "}
            {format(new Date(hoverEvent.end), "hh:mm a")}
          </p>
        </div>
      )}
    </div>
  );
}
