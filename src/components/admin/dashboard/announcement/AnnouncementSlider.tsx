"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";

import { DashboardAnnouncement } from "./announcement.types";
import { formatDate } from "../calendar/calendar.utils";

interface Props {
  announcements: DashboardAnnouncement[];
}

const AUTO_SLIDE_DELAY = 6000;

export default function AnnouncementSlider({ announcements }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = announcements.length;

  useEffect(() => {
    if (paused || total <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(timer);
  }, [paused, total]);

  const announcement = useMemo(
    () => announcements[current],
    [announcements, current],
  );

  const previous = () => setCurrent((prev) => (prev - 1 + total) % total);

  const next = () => setCurrent((prev) => (prev + 1) % total);

  if (!announcement) return null;

  const priorityStyles = {
    LOW: {
      border: "border-l-slate-400",
      badge: "bg-slate-100 text-slate-700",
    },
    NORMAL: {
      border: "border-l-blue-500",
      badge: "bg-blue-100 text-blue-700",
    },
    HIGH: {
      border: "border-l-orange-500",
      badge: "bg-orange-100 text-orange-700",
    },
    URGENT: {
      border: "border-l-red-500",
      badge: "bg-red-100 text-red-700",
    },
  }[announcement.priority];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative overflow-hidden rounded-xl border border-gray-200 border-l-4 bg-white shadow-sm
        hover:border-violet-200 hover:shadow-md transition-all duration-300 ${priorityStyles.border}`}
    >
      {/* Progress */}

      {total > 1 && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-100">
          <div
            key={current}
            className="h-full bg-violet-600 animate-[progress_6s_linear]"
          />
        </div>
      )}

      <div
        key={announcement.id}
        className="px-5 py-2 animate-in fade-in slide-in-from-right-2 duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          {/* Left */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Megaphone size={16} className="shrink-0 text-violet-600" />

              <h3
                title={announcement.title}
                className="truncate text-[16px] font-semibold text-gray-900"
              >
                {announcement.title}
              </h3>

              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles.badge}`}
              >
                {announcement.priority}
              </span>
            </div>

            <p
              title={announcement.description}
              className="mt-1 truncate text-sm leading-6 text-gray-500"
            >
              {announcement.description}
            </p>
          </div>

          {/* Right */}
          <div className="shrink-0">
            <Link
              href="/admin/announcements"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-violet-600 transition-all hover:bg-violet-50 hover:text-violet-700"
            >
              View all
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <CalendarDays size={13} />
              {formatDate(announcement.date)}
            </span>

            {announcement.className && (
              <span className="flex items-center gap-1">
                <GraduationCap size={13} />
                {announcement.className}
              </span>
            )}
          </div>

          {total > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={previous}
                className="rounded-md p-1 transition hover:bg-gray-100"
              >
                <ChevronLeft size={15} />
              </button>

              <div className="flex items-center gap-1">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`transition-all duration-300 ${
                      current === index
                        ? "h-2 w-5 rounded-full bg-violet-600"
                        : "h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="rounded-md p-1 transition hover:bg-gray-100"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
