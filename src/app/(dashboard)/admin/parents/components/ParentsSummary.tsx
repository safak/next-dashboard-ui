"use client";

import { UserCheck, UserRound, Users } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  summary: {
    totalParents: number;
    parentsWithStudents: number;
    linkedStudents: number;
  };
}

export default function ParentsSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      {/* Parents */}
      <SummaryCard
        title="Parents"
        value={summary.totalParents}
        icon={Users}
        color="blue"
        compact
      />

      {/* Linked Parents */}
      <SummaryCard
        title="Linked Parents"
        value={summary.parentsWithStudents}
        icon={UserCheck}
        color="green"
        compact
      />

      {/* Linked Students */}
      <SummaryCard
        title="Students"
        value={summary.linkedStudents}
        icon={UserRound}
        color="purple"
        compact
      />
    </div>
  );
}
