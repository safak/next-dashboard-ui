"use client";

import {
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  summary: {
    totalSubjects: number;
    totalLessons: number;
    teachersAssigned: number;
  };
}

export default function SubjectsSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      <SummaryCard
        title="Subjects"
        value={summary.totalSubjects}
        icon={BookOpen}
        color="purple"
        compact
      />

      <SummaryCard
        title="Lessons"
        value={summary.totalLessons}
        icon={GraduationCap}
        color="blue"
        compact
      />

      <SummaryCard
        title="Teachers"
        value={summary.teachersAssigned}
        icon={Users}
        color="green"
        compact
      />
    </div>
  );
}