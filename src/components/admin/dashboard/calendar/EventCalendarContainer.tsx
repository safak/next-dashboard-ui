import prisma from "@/lib/prisma";
import { startOfYear, endOfYear } from "date-fns";

import SchoolCalendar from "./SchoolCalendar";

import { CalendarHoliday, CalendarEvent } from "./calendar.types";

import { toDateKey } from "./calendar.utils";

type Props = {
  date?: string;
};

export default async function EventCalendarContainer({ date }: Props) {
  const selectedDate =
    date && !isNaN(new Date(date).getTime()) ? new Date(date) : new Date();

  selectedDate.setHours(0, 0, 0, 0);

  const calendarStart = startOfYear(selectedDate);
  const calendarEnd = endOfYear(selectedDate);

  const holidays = await prisma.holiday.findMany({
    where: {
      date: {
        gte: calendarStart,
        lte: calendarEnd,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const holidayMap: Record<string, CalendarHoliday> = {};

  holidays.forEach((holiday) => {
    const key = toDateKey(holiday.date);

    holidayMap[key] = {
      id: holiday.id,
      title: holiday.title,
      date: holiday.date,
      isFullDay: holiday.isFullDay,
    };
  });

  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: calendarStart,
        lte: calendarEnd,
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const eventMap: Record<string, CalendarEvent[]> = {};

  events.forEach((event) => {
    const key = toDateKey(event.startTime);

    if (!eventMap[key]) {
      eventMap[key] = [];
    }

    eventMap[key].push({
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
    });
  });

  return <SchoolCalendar holidays={holidayMap} events={eventMap} />;
}
