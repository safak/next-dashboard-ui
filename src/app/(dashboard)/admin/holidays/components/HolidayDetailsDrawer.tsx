"use client";

import { CalendarDays, Clock3, FileText, Sparkles } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import type { Holiday } from "@prisma/client";

interface HolidayDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday: Holiday | null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
  }).format(new Date(date));
}

export default function HolidayDetailsDrawer({
  open,
  onOpenChange,
  holiday,
}: HolidayDetailsDrawerProps) {
  if (!holiday) {
    return null;
  }

  const holidayDate = new Date(holiday.date);

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Holiday Details"
      description="View holiday information and schedule."
      width="md"
      icon={<CalendarDays className="h-6 w-6" />}
      footer={
        <div className="flex w-full justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* =====================================================
            HOLIDAY OVERVIEW
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Holiday
                </p>

                <h3 className="mt-0.5 truncate text-base font-bold text-slate-900">
                  {holiday.title}
                </h3>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Holiday Title */}

            <div className="flex items-start gap-3 px-5 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Title
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {holiday.title}
                </p>
              </div>
            </div>

            {/* Date */}

            <div className="flex items-start gap-3 px-5 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Date
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(holidayDate)}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {formatDay(holidayDate)}
                </p>
              </div>
            </div>

            {/* Duration */}

            <div className="flex items-start gap-3 px-5 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Clock3 className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Duration
                </p>

                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    holiday.isFullDay
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {holiday.isFullDay ? "Full Day" : "Half Day"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SCHEDULE SUMMARY
        ===================================================== */}

        <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-violet-900">
                Holiday Schedule
              </p>

              <p className="mt-1 text-xs leading-5 text-violet-700">
                {formatDate(holidayDate)} is marked as a{" "}
                {holiday.isFullDay ? "full-day" : "half-day"} holiday.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
