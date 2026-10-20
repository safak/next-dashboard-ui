"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

interface DashboardHeaderProps {
  greeting: string;
}

export default function DashboardHeader({ greeting }: DashboardHeaderProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setDate(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(now),
      );

      setTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
          .format(now)
          .replace(/\b(am|pm)\b/i, (period) => period.toUpperCase()),
      );
    };

    // Display the current date and time immediately.
    updateDateTime();

    // Refresh the clock every 30 seconds.
    const intervalId = window.setInterval(updateDateTime, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(75,81,125,0.05)] sm:px-6 sm:py-5">
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#EEF2FF] opacity-70" />

      <div className="pointer-events-none absolute -bottom-20 right-24 h-32 w-32 rounded-full bg-[#FFF4E4] opacity-50" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="animate-[fadeInUp_0.5s_ease-out]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F59A23]" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B87938]">
              Welcome back
            </p>
          </div>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#303552] sm:text-[27px]">
            {greeting}
            <span className="ml-2 inline-block animate-bounce">👋</span>
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Here’s what’s happening at your school today.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-2 animate-[fadeIn_0.7s_ease-out]">
          {/* Current Date */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 transition-all duration-200 hover:border-[#DDE2F5] hover:bg-[#F8F9FF]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
              <CalendarDays className="h-3.5 w-3.5 text-[#4B517D]" />
            </div>

            <div>
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                Date
              </p>

              <p className="text-[11px] font-semibold text-[#303552]">
                {date || "Loading date..."}
              </p>
            </div>
          </div>

          {/* Current Time */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 transition-all duration-200 hover:border-[#DDE2F5] hover:bg-[#F8F9FF]">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF4E4]">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#F59A23] opacity-40" />

              <Clock className="relative h-3.5 w-3.5 text-[#F59A23]" />
            </div>

            <div>
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                Current Time
              </p>

              <p className="text-[11px] font-semibold text-[#303552]">
                {time || "Loading time..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
