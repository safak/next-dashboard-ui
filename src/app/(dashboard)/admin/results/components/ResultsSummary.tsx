"use client";

import {
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  total: number;
  average: number;
  examResults: number;
  assignmentResults: number;
}

export default function ResultsSummary({
  total,
  average,
  examResults,
  assignmentResults,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* Total Results */}
      <SummaryCard
        title="Results"
        value={total}
        icon={ClipboardCheck}
        color="blue"
        compact
      />

      {/* Average Score */}
      <SummaryCard
        title="Average"
        value={`${average}%`}
        icon={TrendingUp}
        color="green"
        compact
      />

      {/* Exam Results */}
      <SummaryCard
        title="Exams"
        value={examResults}
        icon={GraduationCap}
        color="yellow"
        compact
      />

      {/* Assignment Results */}
      <SummaryCard
        title="Assignments"
        value={assignmentResults}
        icon={FileCheck2}
        color="purple"
        compact
      />
    </div>
  );
}