import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CalendarEvent } from "@/lib/types";

/* ================================================= */
/* tailwind helper */
/* ================================================= */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ================================================= */
/* ✅ REQUIRED: used in SingleTeacherPage */
/* MUST return CalendarEvent[] ONLY */
/* ================================================= */
export function adjustScheduleToCurrentWeek(
  events: CalendarEvent[]
): CalendarEvent[] {
  if (!Array.isArray(events)) return [];

  const today = new Date();

  /* start of current week (Sunday) */
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return events.map((event) => {
    const originalStart = new Date(event.start);
    const originalEnd = new Date(event.end);

    const dayOffset = originalStart.getDay();

    const newStart = new Date(startOfWeek);
    newStart.setDate(startOfWeek.getDate() + dayOffset);
    newStart.setHours(
      originalStart.getHours(),
      originalStart.getMinutes()
    );

    const newEnd = new Date(newStart);
    newEnd.setHours(
      originalEnd.getHours(),
      originalEnd.getMinutes()
    );

    return {
      ...event,
      start: newStart,
      end: newEnd,
    };
  });
}
