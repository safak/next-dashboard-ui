"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Users,
  XCircle,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

import type { MonthlyAttendanceData } from "./types";

interface MonthlyAttendanceSummaryProps {
  data: MonthlyAttendanceData;
}

export default function MonthlyAttendanceSummary({
  data,
}: MonthlyAttendanceSummaryProps) {
  const markedRecords = data.present + data.absent;

  const presentPercentage =
    markedRecords > 0
      ? Number(
          ((data.present / markedRecords) * 100).toFixed(2),
        )
      : 0;

  const absentPercentage =
    markedRecords > 0
      ? Number(
          ((data.absent / markedRecords) * 100).toFixed(2),
        )
      : 0;

  const attendanceRate =
    markedRecords > 0
      ? Number(
          ((data.present / markedRecords) * 100).toFixed(2),
        )
      : 0;

  const cards = [
    {
      title: "Total Students",
      value: data.totalStudents,
      subtitle:
        data.workingDays === 1
          ? "1 working day"
          : `${data.workingDays} working days`,
      icon: Users,
      color: "indigo" as const,
    },
    {
      title: "Present",
      value: `${presentPercentage}%`,
      subtitle:
        data.present === 1
          ? "1 marked record"
          : `${data.present} marked records`,
      icon: CheckCircle2,
      color: "green" as const,
    },
    {
      title: "Absent",
      value: `${absentPercentage}%`,
      subtitle:
        data.absent === 1
          ? "1 marked record"
          : `${data.absent} marked records`,
      icon: XCircle,
      color: "red" as const,
    },
    {
      title: "Pending",
      value: data.pending,
      subtitle:
        data.pending === 1
          ? "1 pending record"
          : `${data.pending} pending records`,
      icon: Clock,
      color: "yellow" as const,
    },
    {
      title: "Attendance",
      value: `${attendanceRate}%`,
      subtitle:
        markedRecords > 0
          ? `${markedRecords} ${
              markedRecords === 1
                ? "marked record"
                : "marked records"
            }`
          : "0 attendance",
      icon: CalendarDays,
      color: "blue" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          color={card.color}
          compact
        />
      ))}
    </div>
  );
}