"use client";

import {
  School,
  Users,
  UserCheck,
  BookOpen,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  summary: {
    totalClasses: number;
    totalStudents: number;
    totalCapacity: number;
    assignedTeachers: number;
  };
}

export default function ClassesSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* Classes */}
      <SummaryCard
        title="Classes"
        value={summary.totalClasses}
        icon={School}
        color="blue"
        compact
      />

      {/* Students */}
      <SummaryCard
        title="Students"
        value={summary.totalStudents}
        icon={Users}
        color="green"
        compact
      />

      {/* Capacity */}
      <SummaryCard
        title="Capacity"
        value={summary.totalCapacity}
        icon={BookOpen}
        color="purple"
        compact
      />

      {/* Teachers */}
      <SummaryCard
        title="Teachers"
        value={summary.assignedTeachers}
        icon={UserCheck}
        color="yellow"
        compact
      />
    </div>
  );
}