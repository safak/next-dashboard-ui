"use client";

import {
  CalendarCheck2,
  CalendarDays,
  Clock3,
} from "lucide-react";

import type {
  MonthlyAttendanceData,
} from "./types";

interface MonthlyAttendanceInfoProps {
  data: MonthlyAttendanceData;
}

export default function MonthlyAttendanceInfo({
  data,
}: MonthlyAttendanceInfoProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoItem
          icon={CalendarDays}
          label="Working Days"
          value={data.workingDays}
          description="Days counted in this month"
        />

        <InfoItem
          icon={CalendarCheck2}
          label="Completed Days"
          value={data.completedDays}
          description="Attendance completed for all students"
        />

        <InfoItem
          icon={Clock3}
          label="Pending"
          value={data.pending}
          description="Attendance records still missing"
        />
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Icon className="h-5 w-5 text-slate-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="text-lg font-bold text-slate-800">
          {value}
        </p>

        <p className="truncate text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}