"use client";

import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Lesson = {
  id: number;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  scheduleDate: string | null;
  subject: {
    id: number;
    name: string;
  };
  teacher: {
    name: string;
    surname: string | null;
  };
};

type Props = {
  lessons: Lesson[];
};

const dayMap: Record<string, string> = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
};

const cardColors = [
  "from-[#EEF2FA] to-[#E4E8F3]",
  "from-[#FFF8EC] to-[#FFECCF]",
  "from-[#EAF7E0] to-[#DFF2C8]",
  "from-[#F3EEF9] to-[#EAE3F4]",
  "from-[#FFF1E2] to-[#FFE4C2]",
];

const cardIcons = [
  "/subjects.png",
  "/homework.png",
  "/studassignment.png",
  "/notifications.png",
  "/myclasses.png",
];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function getMonday(date: Date) {
  const result = new Date(date);
  const day = result.getDay();

  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));

  result.setHours(0, 0, 0, 0);

  return result;
}

function getWeekDates(date: Date) {
  const monday = getMonday(date);

  return Array.from({ length: 6 }, (_, index) => {
    const result = new Date(monday);

    result.setDate(monday.getDate() + index);

    return result;
  });
}

function getStatus(lesson: Lesson, selectedDate: Date) {
  const now = new Date();

  if (!isSameDate(selectedDate, now)) {
    return "Scheduled";
  }

  const start = new Date(lesson.startTime);
  const end = new Date(lesson.endTime);

  if (now >= start && now <= end) {
    return "Live";
  }

  if (now > end) {
    return "Completed";
  }

  return "Upcoming";
}

export default function ParentClassesSchedule({ lessons }: Props) {
  const today = useMemo(() => new Date(), []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(today));

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const selectedLessons = useMemo(() => {
    const selectedDay = selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
    });

    const selectedDayCode = dayMap[selectedDay];

    return lessons
      .filter((lesson) => {
        /*
         * If a lesson has a specific schedule date,
         * it should only appear on that exact date.
         */
        if (lesson.scheduleDate) {
          return isSameDate(new Date(lesson.scheduleDate), selectedDate);
        }

        /*
         * Otherwise treat it as a recurring
         * weekly lesson.
         */
        return lesson.day === selectedDayCode;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  }, [lessons, selectedDate]);

  const goToPreviousWeek = () => {
    const previousWeek = new Date(weekStart);

    previousWeek.setDate(previousWeek.getDate() - 7);

    setWeekStart(previousWeek);

    const previousSelectedDate = new Date(previousWeek);

    setSelectedDate(previousSelectedDate);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(weekStart);

    nextWeek.setDate(nextWeek.getDate() + 7);

    setWeekStart(nextWeek);

    const nextSelectedDate = new Date(nextWeek);

    setSelectedDate(nextSelectedDate);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const monthTitle =
    weekDates[0].getMonth() === weekDates[5].getMonth()
      ? weekDates[0].toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : `${weekDates[0].toLocaleDateString("en-US", {
          month: "short",
        })} - ${weekDates[5].toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}`;

  return (
    <section className="mt-6">
      {/* ================= WEEK HEADER ================= */}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousWeek}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#4B517D]
            shadow-[0_6px_18px_rgba(75,81,125,0.07)]
            transition
            active:scale-95
          "
        >
          <ArrowLeft size={16} />
        </button>

        <div className="text-center">
          <h3 className="text-[17px] font-extrabold text-[#4B517D]">
            {monthTitle}
          </h3>

          <p className="mt-0.5 text-[9px] text-slate-400">
            {weekDates[0].getDate()} - {weekDates[5].getDate()} Week Schedule
          </p>
        </div>

        <button
          type="button"
          onClick={goToNextWeek}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#4B517D]
            shadow-[0_6px_18px_rgba(75,81,125,0.07)]
            transition
            active:scale-95
          "
        >
          <span className="text-base">→</span>
        </button>
      </div>

      {/* ================= DAYS ================= */}

      <div className="mt-4">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {weekDates.map((date) => {
            const isSelected = isSameDate(selectedDate, date);

            const isToday = isSameDate(today, date);

            return (
              <button
                type="button"
                key={date.toISOString()}
                onClick={() => selectDate(date)}
                className={`
                  flex
                  h-[70px]
                  min-w-[55px]
                  flex-col
                  items-center
                  justify-center
                  rounded-[19px]
                  border
                  transition-all
                  active:scale-95
                  ${
                    isSelected
                      ? "border-[#4B517D] bg-[#4B517D] text-white shadow-[0_8px_20px_rgba(75,81,125,0.20)]"
                      : "border-slate-100 bg-white text-slate-700"
                  }
                `}
              >
                {isToday ? (
                  <span
                    className={`
                      text-[8px]
                      font-bold
                      uppercase
                      ${isSelected ? "text-[#F59A23]" : "text-[#F59A23]"}
                    `}
                  >
                    TODAY
                  </span>
                ) : (
                  <span
                    className={`
                      text-[9px]
                      font-medium
                      ${isSelected ? "text-white/70" : "text-slate-400"}
                    `}
                  >
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                )}

                <span className="mt-0.5 text-[22px] font-extrabold leading-none">
                  {date.getDate()}
                </span>

                <span
                  className={`
                    mt-1
                    text-[10px]
                    ${isSelected ? "text-white/80" : "text-slate-500"}
                  `}
                >
                  {formatDay(date)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TIMELINE ================= */}

      <div className="mt-7 space-y-4">
        {selectedLessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16">
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[#EEF2FA]
              "
            >
              <CalendarDays className="h-8 w-8 text-[#4B517D]" />
            </div>

            <h3 className="mt-5 text-[17px] font-bold text-[#4B517D]">
              No Classes Scheduled
            </h3>

            <p className="mt-2 text-center text-[11px] leading-5 text-slate-400">
              No classes are scheduled for
              <br />
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </p>
          </div>
        ) : (
          selectedLessons.map((lesson, index) => {
            const status = getStatus(lesson, selectedDate);

            return (
              <div key={lesson.id} className="flex items-start gap-2.5">
                {/* TIME */}

                <div className="w-[48px] shrink-0 pt-5">
                  <p className="text-[8px] font-semibold text-slate-400">
                    {formatTime(new Date(lesson.startTime))}
                  </p>
                </div>

                {/* LESSON CARD */}

                <div
                  className={`
                      flex-1
                      rounded-[23px]
                      bg-gradient-to-br
                      ${cardColors[index % cardColors.length]}
                      p-3.5
                      shadow-[0_5px_18px_rgba(75,81,125,0.05)]
                    `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-[15px]
                            bg-white/75
                          "
                      >
                        <Image
                          src={cardIcons[index % cardIcons.length]}
                          alt={lesson.name}
                          width={25}
                          height={25}
                          className="object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-extrabold text-slate-900">
                          {lesson.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-1">
                          <Clock3 className="h-3 w-3 text-slate-500" />

                          <span className="text-[10px] font-medium text-slate-600">
                            {formatTime(new Date(lesson.startTime))}
                            {" - "}
                            {formatTime(new Date(lesson.endTime))}
                          </span>
                        </div>

                        <p className="mt-1 text-[9px] uppercase tracking-wide text-slate-400">
                          {lesson.day}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}

                    <span
                      className={`
                          shrink-0
                          rounded-full
                          px-2.5
                          py-1
                          text-[8px]
                          font-bold
                          ${
                            status === "Live"
                              ? "bg-emerald-100 text-emerald-700"
                              : status === "Completed"
                                ? "bg-slate-200 text-slate-600"
                                : status === "Upcoming"
                                  ? "bg-[#FFF1DC] text-[#C87808]"
                                  : "bg-[#EEF2FA] text-[#4B517D]"
                          }
                        `}
                    >
                      {status}
                    </span>
                  </div>

                  {/* SUBJECT / TEACHER */}

                  <div className="mt-3 border-t border-white/50 pt-2.5">
                    <p className="text-[9px] font-bold text-slate-700">
                      {lesson.subject.name}
                    </p>

                    <p className="mt-0.5 text-[8px] text-slate-400">
                      {lesson.teacher.name} {lesson.teacher.surname || ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
