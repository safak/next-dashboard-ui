"use client";

import { Users, School, BookOpen, GraduationCap } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  summary: {
    totalTeachers: number;
    teachersWithClasses: number;
    teachersWithSubjects: number;
    totalLessons: number;
  };
}

export default function TeachersSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* Teachers */}
      <SummaryCard
        title="Teachers"
        value={summary.totalTeachers}
        icon={Users}
        color="blue"
        compact
      />

      {/* Class Supervisors */}
      <SummaryCard
        title="Class Supervisors"
        value={summary.teachersWithClasses}
        icon={School}
        color="yellow"
        compact
      />

      {/* Subject Assignments */}
      <SummaryCard
        title="Subject Assignments"
        value={summary.teachersWithSubjects}
        icon={BookOpen}
        color="purple"
        compact
      />

      {/* Lessons */}
      <SummaryCard
        title="Lessons"
        value={summary.totalLessons}
        icon={GraduationCap}
        color="green"
        compact
      />
    </div>
  );
}
