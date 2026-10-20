"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface StudentAttendanceDailySummaryProps {
  workingDays: number;
  present: number;
  absent: number;
  pending: number;
  attendancePercentage: number;
}

export default function StudentAttendanceDailySummary({
  workingDays,
  present,
  absent,
  pending,
  attendancePercentage,
}: StudentAttendanceDailySummaryProps) {
  const cards = [
    {
      title: "Working Days",
      value: workingDays,
      subtitle:
        workingDays === 1
          ? "1 working day"
          : `${workingDays} working days`,
      icon: CalendarDays,
      color: "indigo" as const,
    },
    {
      title: "Present",
      value: present,
      subtitle:
        present === 1
          ? "1 day present"
          : `${present} days present`,
      icon: CheckCircle2,
      color: "green" as const,
    },
    {
      title: "Absent",
      value: absent,
      subtitle:
        absent === 1
          ? "1 day absent"
          : `${absent} days absent`,
      icon: XCircle,
      color: "red" as const,
    },
    {
      title: "Attendance",
      value: `${attendancePercentage}%`,
      subtitle:
        pending > 0
          ? `${pending} ${
              pending === 1 ? "day" : "days"
            } pending`
          : "Attendance completed",
      icon: Clock3,
      color: "blue" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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