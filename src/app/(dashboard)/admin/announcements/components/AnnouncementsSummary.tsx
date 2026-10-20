"use client";

import { AlertTriangle, Bell, FileText, Send } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface AnnouncementsSummaryProps {
  total: number;
  published: number;
  drafts: number;
  urgent: number;
}

export default function AnnouncementsSummary({
  total,
  published,
  drafts,
  urgent,
}: AnnouncementsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard
        title="Total Announcements"
        value={total}
        icon={Bell}
        color="blue"
        compact
      />

      <SummaryCard
        title="Published"
        value={published}
        icon={Send}
        color="green"
        compact
      />

      <SummaryCard
        title="Drafts"
        value={drafts}
        icon={FileText}
        color="yellow"
        compact
      />

      <SummaryCard
        title="Urgent"
        value={urgent}
        icon={AlertTriangle}
        color="purple"
        compact
      />
    </div>
  );
}
