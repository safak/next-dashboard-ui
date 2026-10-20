"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  ChevronRight,
  CalendarCheck2,
} from "lucide-react";
import { useMemo, useState } from "react";

interface TeacherEvent {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string | null;
  className: string;
}

interface TeacherEventsProps {
  events: TeacherEvent[];
}

type EventFilter = "upcoming" | "today" | "all";

export default function TeacherEvents({ events }: TeacherEventsProps) {
  const [filter, setFilter] = useState<EventFilter>("upcoming");

  const { now, todayStart, todayEnd } = useMemo(() => {
    const current = new Date();

    const start = new Date(current);
    start.setHours(0, 0, 0, 0);

    const end = new Date(current);
    end.setHours(23, 59, 59, 999);

    return {
      now: current,
      todayStart: start,
      todayEnd: end,
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const start = new Date(event.startTime);

      if (filter === "today") {
        return start >= todayStart && start <= todayEnd;
      }

      if (filter === "upcoming") {
        return start >= now;
      }

      return true;
    });
  }, [events, filter, now, todayStart, todayEnd]);

  const upcomingCount = events.filter(
    (event) => new Date(event.startTime) >= now,
  ).length;

  const todayCount = events.filter((event) => {
    const start = new Date(event.startTime);

    return start >= todayStart && start <= todayEnd;
  }).length;

  const formatDate = (value: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  };

  const formatTime = (value: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  };

  const getDay = (value: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
    }).format(new Date(value));
  };

  const getMonth = (value: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
    })
      .format(new Date(value))
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* HEADER */}

      <section
        className="
          relative
          overflow-hidden
          rounded-b-[28px]
          bg-gradient-to-br
          from-[#4B517D]
          via-[#555B86]
          to-[#626991]
          px-4
          pb-5
          pt-5
          shadow-[0_8px_24px_rgba(75,81,125,0.16)]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-12
            h-32
            w-32
            rounded-full
            bg-[#F59A23]/75
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-14
            top-8
            h-28
            w-28
            rounded-full
            border-[16px]
            border-white/10
          "
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-white/15
                text-white
                backdrop-blur-sm
              "
            >
              <CalendarDays className="h-5 w-5" strokeWidth={2} />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                Teacher Portal
              </p>

              <h1 className="text-[22px] font-bold text-white">Events</h1>

              <p className="mt-0.5 text-[10px] text-white/70">
                School events and activities
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/10
                px-3
                py-2.5
                backdrop-blur-md
              "
            >
              <p className="text-[9px] uppercase tracking-wide text-white/55">
                Upcoming
              </p>

              <p className="mt-0.5 text-lg font-bold text-white">
                {upcomingCount}
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/10
                px-3
                py-2.5
                backdrop-blur-md
              "
            >
              <p className="text-[9px] uppercase tracking-wide text-white/55">
                Today
              </p>

              <p className="mt-0.5 text-lg font-bold text-white">
                {todayCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}

      <section className="px-4 pt-5">
        <div className="flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
          <button
            type="button"
            onClick={() => setFilter("upcoming")}
            className={`
              flex-1
              rounded-xl
              px-3
              py-2
              text-[10px]
              font-semibold
              transition-all
              ${
                filter === "upcoming"
                  ? "bg-[#4B517D] text-white shadow-sm"
                  : "text-slate-500"
              }
            `}
          >
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setFilter("today")}
            className={`
              flex-1
              rounded-xl
              px-3
              py-2
              text-[10px]
              font-semibold
              transition-all
              ${
                filter === "today"
                  ? "bg-[#4B517D] text-white shadow-sm"
                  : "text-slate-500"
              }
            `}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`
              flex-1
              rounded-xl
              px-3
              py-2
              text-[10px]
              font-semibold
              transition-all
              ${
                filter === "all"
                  ? "bg-[#4B517D] text-white shadow-sm"
                  : "text-slate-500"
              }
            `}
          >
            All Events
          </button>
        </div>
      </section>

      {/* EVENTS */}

      <section className="px-4 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#4B517D]">
              {filter === "today"
                ? "Today's Events"
                : filter === "upcoming"
                  ? "Upcoming Events"
                  : "All Events"}
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-400">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"}
            </p>
          </div>

          <CalendarCheck2
            className="h-5 w-5 text-[#F59A23]"
            strokeWidth={1.8}
          />
        </div>

        {filteredEvents.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-slate-100
              bg-white
              px-5
              py-12
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#EEF2FA]
              "
            >
              <CalendarDays
                className="h-7 w-7 text-[#4B517D]"
                strokeWidth={1.7}
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-[#303552]">
              No events found
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              School events will appear here when scheduled by the
              administrator.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const start = new Date(event.startTime);
              const end = new Date(event.endTime);

              const isToday = start >= todayStart && start <= todayEnd;

              return (
                <div
                  key={event.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-100
                    bg-white
                    shadow-[0_4px_18px_rgba(75,81,125,0.06)]
                    transition-all
                    duration-200
                    active:scale-[0.99]
                  "
                >
                  <div className="flex gap-3 p-3.5">
                    {/* DATE */}

                    <div
                      className={`
                        flex
                        h-[58px]
                        w-[52px]
                        shrink-0
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        ${isToday ? "bg-[#FFF0D6]" : "bg-[#EEF2FA]"}
                      `}
                    >
                      <span
                        className={`
                          text-[9px]
                          font-bold
                          uppercase
                          ${isToday ? "text-[#F59A23]" : "text-[#4B517D]"}
                        `}
                      >
                        {getMonth(event.startTime)}
                      </span>

                      <span className="text-xl font-bold leading-none text-[#303552]">
                        {getDay(event.startTime)}
                      </span>
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-[13px] font-bold text-[#303552]">
                            {event.title}
                          </h3>

                          {event.category && (
                            <span className="mt-1 inline-flex rounded-full bg-[#FFF8EC] px-2 py-0.5 text-[8px] font-semibold text-[#B87938]">
                              {event.category}
                            </span>
                          )}
                        </div>

                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                      </div>

                      {event.description && (
                        <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-slate-500">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="flex items-center gap-1 text-[9px] text-slate-400">
                          <CalendarDays className="h-3 w-3" />

                          {formatDate(event.startTime)}
                        </div>

                        <div className="flex items-center gap-1 text-[9px] text-slate-400">
                          <Clock3 className="h-3 w-3" />
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </div>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-[#4B517D]">
                        <MapPin className="h-3 w-3" />

                        {event.className}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
