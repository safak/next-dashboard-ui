"use client";

import { useEffect, useMemo, useState } from "react";
import { categoryConfig, getTimeIcon } from "./EventIcons";

export default function EventCard({ event }: any) {
  const rawCategory = event?.category ?? "default";
  const category = String(rawCategory).toLowerCase();
  const config = categoryConfig[category] || categoryConfig.default;

  const eventTime = useMemo(() => {
    return new Date(event.startTime);
  }, [event.startTime]);

  // CLIENT-ONLY STATES
  const [isPast, setIsPast] = useState<boolean | null>(null);
  const [isToday, setIsToday] = useState<boolean | null>(null);
  const [label, setLabel] = useState<string>("");

  // CLIENT-SIDE CALCULATION (prevents hydration mismatch)
  useEffect(() => {
    const now = new Date();

    const past = eventTime < now;
    const today =
      eventTime.getFullYear() === now.getFullYear() &&
      eventTime.getMonth() === now.getMonth() &&
      eventTime.getDate() === now.getDate();

    setIsPast(past);
    setIsToday(today);

    if (past) {
      setLabel(`Finished on ${eventTime.toLocaleDateString("en-GB")}`);
      return;
    }

    if (today) {
      setLabel("Starts Today");
      return;
    }

    const diffDays = Math.ceil(
      (eventTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    setLabel(`Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`);
  }, [eventTime]);

  // LIVE COUNTDOWN FOR TODAY ONLY
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!isToday || isPast === true) return;
    if (isToday === null || isPast === null) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = eventTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Starting now");
        clearInterval(timer);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown(
        `${h.toString().padStart(2, "0")}h ${m
          .toString()
          .padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isToday, isPast, eventTime]);

  // While values aren't initialized (during SSR), show placeholder
  if (isPast === null || isToday === null) {
    return <div className="opacity-0 h-10 w-full" />;
  }

  return (
    <div
      className={`relative flex gap-4 group transition-all duration-300 
      ${isPast ? "opacity-50 hover:opacity-80" : "opacity-100"}`}
    >
      {/* TIMELINE DOT */}
      <div className="flex flex-col items-center pt-2">
        <div
          className="w-2 h-2 rounded-full transition-all duration-200"
          style={{ backgroundColor: config.color }}
        />
        <div className="flex-1 w-px bg-gray-200"></div>
      </div>

      {/* CARD */}
      <div className="flex-1 p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">{event.title}</h3>

          {/* BADGE */}
          <span className="text-[10px] px-2 py-1 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
            {isToday ? countdown || label : label}
          </span>
        </div>

        {/* CATEGORY */}
        <div
          className="inline-flex items-center gap-1 px-2 py-1 mt-2 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          {config.icon}
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-xs mt-2 leading-snug line-clamp-2">
          {event.description}
        </p>

        {/* Small time icon */}
        <div className="absolute right-2 bottom-2 opacity-60">
          {getTimeIcon(event.startTime)}
        </div>
      </div>
    </div>
  );
}
