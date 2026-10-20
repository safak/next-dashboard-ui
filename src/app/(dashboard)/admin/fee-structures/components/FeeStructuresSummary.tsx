"use client";

import { ReceiptText, CheckCircle2, XCircle, School } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  summary: {
    totalStructures: number;
    activeStructures: number;
    inactiveStructures: number;
    classesConfigured: number;
  };
}

export default function FeeStructuresSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <SummaryCard
        title="Fee Structures"
        value={summary.totalStructures}
        icon={ReceiptText}
        color="blue"
        compact
      />

      <SummaryCard
        title="Active"
        value={summary.activeStructures}
        icon={CheckCircle2}
        color="green"
        compact
      />

      <SummaryCard
        title="Inactive"
        value={summary.inactiveStructures}
        icon={XCircle}
        color="yellow"
        compact
      />

      <SummaryCard
        title="Classes Configured"
        value={summary.classesConfigured}
        icon={School}
        color="purple"
        compact
      />
    </div>
  );
}
