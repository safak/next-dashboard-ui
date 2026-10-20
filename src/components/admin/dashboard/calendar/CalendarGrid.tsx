"use client";

import { useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

import { CalendarGridProps } from "./calendar.types";
import { isSecondSaturday, toDateKey } from "./calendar.utils";

export default function CalendarGrid({
  selectedDate,
  activeStartDate,
  holidays,
  events = {},
  onDateChange,
  onActiveStartDateChange,
}: CalendarGridProps) {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = calendarRef.current;

    if (!root) return;

    const tiles = root.querySelectorAll<HTMLElement>(
      ".react-calendar__month-view__days__day",
    );

    tiles.forEach((tile) => {
      tile.removeAttribute("title");
    });
  }, [holidays, activeStartDate]);

  return (
    <div ref={calendarRef} className="calendar-grid">
      <Calendar
        value={selectedDate}
        activeStartDate={activeStartDate}
        onChange={(value) => {
          if (value instanceof Date) {
            onDateChange(value);
          }
        }}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) {
            onActiveStartDateChange(activeStartDate);
          }
        }}
        showNavigation={false}
        showNeighboringMonth={false}
        showFixedNumberOfWeeks
        calendarType="gregory"
        formatShortWeekday={(_, date) =>
          date.toLocaleDateString("en-US", {
            weekday: "short",
          })
        }
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const classes: string[] = [];
          const day = date.getDay();

          if (isSecondSaturday(date)) {
            classes.push("calendar-second-saturday");
          }

          if (holidays[toDateKey(date)]) {
            classes.push("calendar-holiday");
          }

          if (day === 0) {
            classes.push("calendar-tooltip-first");
          }

          if (day === 5 || day === 6) {
            classes.push("calendar-tooltip-last");
          }

          return classes.join(" ");
        }}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const dots = [];
          const holiday = holidays[toDateKey(date)];

          if (holiday) {
            dots.push(<span key="holiday" className="calendar-dot holiday" />);
          }

          if (isSecondSaturday(date)) {
            dots.push(
              <span key="secondSaturday" className="calendar-dot saturday" />,
            );
          }

          if ((events[toDateKey(date)] ?? []).length > 0) {
            dots.push(<span key="event" className="calendar-dot event" />);
          }

          return (
            <>
              {holiday && (
                <span className="calendar-holiday-tooltip">
                  <strong>{holiday.title}</strong>

                  <span>
                    {holiday.isFullDay ? "Full Day Holiday" : "Partial Holiday"}
                  </span>
                </span>
              )}

              {dots.length > 0 && (
                <div className="calendar-dot-container">{dots}</div>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
