"use client";

import { BookOpen, GraduationCap, School, Users } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  summary: {
    totalLessons: number;
    totalSubjects: number;
    totalClasses: number;
    totalTeachers: number;
  };
}

export default function LessonsSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* Lessons */}
      <SummaryCard
        title="Lessons"
        value={summary.totalLessons}
        icon={BookOpen}
        color="blue"
        compact
      />

      {/* Subjects */}
      <SummaryCard
        title="Subjects"
        value={summary.totalSubjects}
        icon={GraduationCap}
        color="purple"
        compact
      />

      {/* Classes */}
      <SummaryCard
        title="Classes"
        value={summary.totalClasses}
        icon={School}
        color="yellow"
        compact
      />

      {/* Teachers */}
      <SummaryCard
        title="Teachers"
        value={summary.totalTeachers}
        icon={Users}
        color="green"
        compact
      />
    </div>
  );
}
