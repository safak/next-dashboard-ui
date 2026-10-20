// src/components/admin/StatsCard.tsx

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  prefix?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
  prefix = "",
}: StatsCardProps) {
  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl border border-gray-200
        bg-white
        p-4
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      `}
    >
      {/* Top Color Bar */}
      <div className={`absolute left-0 top-0 h-1 w-full ${bg}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            {prefix}
            {value}
          </h2>
        </div>

        <div
          className={`
            flex h-9 w-9 items-center justify-center
            rounded-2xl
            ${bg}
            ${color}
          `}
        >
          <Icon size={16} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}