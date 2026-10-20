"use client";

import { Users, GraduationCap, School, ClipboardCheck } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface DashboardSummaryProps {
  students: number;
  teachers: number;
  classes: number;
  attendanceRate: number;
}

export default function DashboardSummary({
  students,
  teachers,
  classes,
  attendanceRate,
}: DashboardSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard
        title="Total Students"
        value={students}
        icon={GraduationCap}
        color="blue"
        compact
      />

      <SummaryCard
        title="Total Teachers"
        value={teachers}
        icon={Users}
        color="purple"
        compact
      />

      <SummaryCard
        title="Total Classes"
        value={classes}
        icon={School}
        color="green"
        compact
      />

      <SummaryCard
        title="Today's Attendance"
        value={`${attendanceRate}%`}
        icon={ClipboardCheck}
        color="yellow"
        compact
      />
    </div>
  );
}