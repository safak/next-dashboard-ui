"use client";

import { useMemo, useState } from "react";

import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import CalendarLegend from "./CalendarLegend";

import { CalendarEvent, CalendarHoliday } from "./calendar.types";

interface SchoolCalendarProps {
  holidays: Record<string, CalendarHoliday>;
  events?: Record<string, CalendarEvent[]>;
}

export default function SchoolCalendar({
  holidays,
  events = {},
}: SchoolCalendarProps) {
  const today = useMemo(() => new Date(), []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [activeStartDate, setActiveStartDate] = useState(today);

  const handlePreviousMonth = () => {
    setActiveStartDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setActiveStartDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-visible rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(75,81,125,0.06)]">
      <CalendarHeader
        currentDate={activeStartDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <div className="min-w-0 px-3 pb-2 pt-2 sm:px-4 sm:pb-2 sm:pt-3">
        <CalendarGrid
          selectedDate={selectedDate}
          activeStartDate={activeStartDate}
          holidays={holidays}
          events={events}
          expanded={true}
          onDateChange={setSelectedDate}
          onActiveStartDateChange={setActiveStartDate}
        />
      </div>

      <div className="border-t border-slate-100">
        <CalendarLegend />
      </div>
    </div>
  );
}
