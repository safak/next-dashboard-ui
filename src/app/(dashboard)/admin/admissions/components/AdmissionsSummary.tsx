"use client";

import { GraduationCap, IndianRupee, UserCheck, Users } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface AdmissionsSummaryProps {
  summary: {
    totalAdmissions: number;
    thisYearAdmissions: number;
    activeStudents: number;
    feesDue: number;
  };
}

export default function AdmissionsSummary({ summary }: AdmissionsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard
        title="Total Admissions"
        value={summary.totalAdmissions}
        icon={GraduationCap}
        color="blue"
        compact
      />

      <SummaryCard
        title="This Academic Year"
        value={summary.thisYearAdmissions}
        icon={Users}
        color="purple"
        compact
      />

      <SummaryCard
        title="Active Students"
        value={summary.activeStudents}
        icon={UserCheck}
        color="green"
        compact
      />

      <SummaryCard
        title="Fees Due"
        value={`₹${summary.feesDue.toLocaleString("en-IN")}`}
        icon={IndianRupee}
        color="yellow"
        compact
      />
    </div>
  );
}
