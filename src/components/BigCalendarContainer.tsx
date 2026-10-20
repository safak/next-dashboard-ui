import prisma from "@/lib/prisma";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import BigCalendarClient from "./BigCalendarClient";
import { CalendarEvent } from "@/lib/types";

export default async function BigCalendarContainer({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) {
  const lessons = await prisma.lesson.findMany({
    where:
      type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number },
    select: {
      id: true,
      name: true,
      startTime: true,
      endTime: true,
    },
  });

  const holidays = await prisma.holiday.findMany({
    select: {
      id: true,
      title: true,
      date: true,
      isFullDay: true,
    },
  });

  const events = await prisma.event.findMany({
    where: type === "classId" ? { classId: id as number } : undefined,

    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
    },
  });

  const classEvents: CalendarEvent[] = lessons.map((l) => ({
    id: `class-${l.id}`,
    title: l.name,
    start: l.startTime,
    end: l.endTime,
    type: "CLASS",
  }));

  const holidayEvents: CalendarEvent[] = holidays.map((h) => {
    const start = new Date(h.date);
    const end = new Date(h.date);
    end.setHours(23, 59, 59, 999);

    return {
      id: `holiday-${h.id}`,
      title: `🎉 ${h.title}`,
      start,
      end,
      type: "HOLIDAY",
      allDay: h.isFullDay,
    };
  });

  const otherEvents: CalendarEvent[] = events.map((e) => ({
    id: `event-${e.id}`,
    title: e.title,
    start: e.startTime,
    end: e.endTime,
    type: "EVENT",
  }));

  const adjustedClasses = adjustScheduleToCurrentWeek(classEvents);

  const finalEvents: CalendarEvent[] = [
    ...adjustedClasses,
    ...holidayEvents,
    ...otherEvents, 
  ];

  return (
    <div className="w-full">
      {/* DESKTOP */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <BigCalendarClient events={finalEvents} />
          </div>
        </div>
      </div>

      {/* MOBILE AGENDA */}
      <div className="block sm:hidden">
        <MobileAgenda events={finalEvents} />
      </div>
    </div>
  );
}

/* =====================================================
   MOBILE AGENDA
===================================================== */

function MobileAgenda({ events }: { events: CalendarEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-6">
        No scheduled events
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((e) => (
        <div
          key={e.id}
          className={`rounded-lg p-3 text-xs border ${
            e.type === "HOLIDAY"
              ? "bg-yellow-50 border-yellow-200"
              : e.type === "EVENT"
                ? "bg-purple-50 border-purple-200"
                : "bg-blue-50 border-blue-200"
          }`}
        >
          <p className="font-semibold">{e.title}</p>

          <p className="text-gray-600 mt-1">
            {new Date(e.start).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}

            {!e.allDay && (
              <>
                {" · "}
                {new Date(e.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" – "}
                {new Date(e.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
