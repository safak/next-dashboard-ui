"use client";

import { Search, CalendarDays } from "lucide-react";

interface AttendanceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AttendanceSearch({
  value,
  onChange,
}: AttendanceSearchProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* Search Box */}
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search teacher..."
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              py-3
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              focus:border-violet-500
              focus:ring-2
              focus:ring-violet-100
            "
          />
        </div>

        {/* Today's Date */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 border border-slate-200">
          <CalendarDays size={20} className="text-violet-600" />

          <div>
            <p className="text-xs text-slate-500">Attendance Date</p>

            <p className="text-sm font-semibold text-slate-800">
              {today}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}