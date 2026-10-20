"use client";

import {
  CheckCircle2,
  ClipboardList,
  Clock3,
  Plane,
  Users,
  XCircle,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Summary {
  totalTeachers: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  pending: number;
}

interface AttendanceSummaryProps {
  summary: Summary | null;
  loading: boolean;
}

export default function AttendanceSummary({
  summary,
  loading,
}: AttendanceSummaryProps) {
  if (loading) {
    return null;
  }

  const cards = [
    {
      title: "Teachers",
      value: summary?.totalTeachers ?? 0,
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Present",
      value: summary?.present ?? 0,
      icon: CheckCircle2,
      color: "green" as const,
    },
    {
      title: "Absent",
      value: summary?.absent ?? 0,
      icon: XCircle,
      color: "red" as const,
    },
    {
      title: "Late",
      value: summary?.late ?? 0,
      icon: Clock3,
      color: "yellow" as const,
    },
    {
      title: "Leave",
      value: summary?.leave ?? 0,
      icon: Plane,
      color: "blue" as const,
    },
    {
      title: "Pending",
      value: summary?.pending ?? 0,
      icon: ClipboardList,
      color: "purple" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          compact
        />
      ))}
    </div>
  );
}
