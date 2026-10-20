"use client";

import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Summary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

interface LeaveSummaryProps {
  summary: Summary | null;
  loading: boolean;
}

export default function LeaveSummary({ summary, loading }: LeaveSummaryProps) {
  const cards = [
    {
      title: "Total Requests",
      value: summary?.total ?? 0,
      icon: ClipboardList,
      color: "indigo" as const,
    },
    {
      title: "Pending",
      value: summary?.pending ?? 0,
      icon: Clock3,
      color: "yellow" as const,
    },
    {
      title: "Approved",
      value: summary?.approved ?? 0,
      icon: CheckCircle2,
      color: "green" as const,
    },
    {
      title: "Rejected",
      value: summary?.rejected ?? 0,
      icon: XCircle,
      color: "red" as const,
    },
    {
      title: "Cancelled",
      value: summary?.cancelled ?? 0,
      icon: Ban,
      color: "slate" as const,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          compact
        />
      ))}
    </div>
  );
}
