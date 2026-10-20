"use client";

import { CalendarDays, Clock3, Sparkles, Layers3 } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  total: number;
  upcoming: number;
  today: number;
  categories: number;
}

export default function EventsSummary({
  total,
  upcoming,
  today,
  categories,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {/* Events */}
      <SummaryCard
        title="Events"
        value={total}
        icon={CalendarDays}
        color="blue"
        compact
      />

      {/* Upcoming */}
      <SummaryCard
        title="Upcoming"
        value={upcoming}
        icon={Clock3}
        color="green"
        compact
      />

      {/* Today */}
      <SummaryCard
        title="Today"
        value={today}
        icon={Sparkles}
        color="yellow"
        compact
      />

      {/* Categories */}
      <SummaryCard
        title="Categories"
        value={categories}
        icon={Layers3}
        color="purple"
        compact
      />
    </div>
  );
}
