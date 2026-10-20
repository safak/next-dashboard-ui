"use client";

import { CalendarDays, CheckCircle2, Clock3, Sparkles } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  summary: {
    total: number;
    fullDay: number;
    halfDay: number;
    upcoming: number;
  };
}

export default function HolidaysSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* Holidays */}
      <SummaryCard
        title="Holidays"
        value={summary.total}
        icon={CalendarDays}
        color="blue"
        compact
      />

      {/* Full Day */}
      <SummaryCard
        title="Full Day"
        value={summary.fullDay}
        icon={CheckCircle2}
        color="green"
        compact
      />

      {/* Half Day */}
      <SummaryCard
        title="Half Day"
        value={summary.halfDay}
        icon={Clock3}
        color="yellow"
        compact
      />

      {/* Upcoming */}
      <SummaryCard
        title="Upcoming"
        value={summary.upcoming}
        icon={Sparkles}
        color="purple"
        compact
      />
    </div>
  );
}
