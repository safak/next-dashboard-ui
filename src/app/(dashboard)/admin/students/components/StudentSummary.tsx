"use client";

import { Users, UserPlus, UserRound, Venus } from "lucide-react";

import type { StudentSummary as StudentSummaryType } from "@/types/student";

import SummaryCard from "@/components/admin/SummaryCard";

interface StudentSummaryProps {
  summary: StudentSummaryType;
  archived?: boolean;
}

export default function StudentSummary({
  summary,
  archived = false,
}: StudentSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard
        title={archived ? "Archived Students" : "Total Students"}
        value={summary.totalStudents}
        icon={Users}
        color="blue"
        compact
      />

      <SummaryCard
        title={archived ? "Archived This Month" : "New Admissions"}
        value={summary.newAdmissions}
        icon={UserPlus}
        color="green"
        compact
      />

      <SummaryCard
        title="Boys"
        value={summary.boys}
        icon={UserRound}
        color="yellow"
        compact
      />

      <SummaryCard
        title="Girls"
        value={summary.girls}
        icon={Venus}
        color="purple"
        compact
      />
    </div>
  );
}
