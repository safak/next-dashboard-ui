"use client";

import { CalendarCheck, CalendarX, Clock3, Percent } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface AttendanceSummary {
  attendancePercentage: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
}

interface AttendanceSummaryCardsProps {
  summary: AttendanceSummary;
}

export default function AttendanceSummaryCards({
  summary,
}: AttendanceSummaryCardsProps) {
  const attendancePercentage = summary.attendancePercentage ?? 0;
  const presentDays = summary.presentDays ?? 0;
  const absentDays = summary.absentDays ?? 0;
  const lateDays = summary.lateDays ?? 0;

  const attendanceLabel =
    attendancePercentage >= 95
      ? "Excellent"
      : attendancePercentage >= 90
        ? "Very Good"
        : attendancePercentage >= 80
          ? "Good"
          : "Needs Improvement";

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard
        title="Attendance"
        value={`${attendancePercentage}%`}
        subtitle={attendanceLabel}
        icon={Percent}
        color="blue"
        compact
      />

      <SummaryCard
        title="Present"
        value={presentDays}
        subtitle="Present Days"
        icon={CalendarCheck}
        color="green"
        compact
      />

      <SummaryCard
        title="Absent"
        value={absentDays}
        subtitle="Absent Days"
        icon={CalendarX}
        color="red"
        compact
      />

      <SummaryCard
        title="Late"
        value={lateDays}
        subtitle="Late Arrivals"
        icon={Clock3}
        color="yellow"
        compact
      />
    </div>
  );
}
