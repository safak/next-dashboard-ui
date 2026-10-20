"use client";

import { CheckCircle2, FileText, AlertTriangle } from "lucide-react";

interface DocumentsSummaryProps {
  uploaded: number;
  missing: number;
  total: number;
}

export default function DocumentsSummary({
  uploaded,
  missing,
  total,
}: DocumentsSummaryProps) {
  const completion = total > 0 ? Math.round((uploaded / total) * 100) : 0;

  const cards = [
    {
      title: "Uploaded",
      value: uploaded,
      subtitle: `${completion}% Completed`,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Missing",
      value: missing,
      subtitle: missing === 0 ? "All Documents Available" : "Documents Pending",
      icon: AlertTriangle,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Total",
      value: total,
      subtitle: "Required Documents",
      icon: FileText,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-xl border border-slate-200 ${card.bg} p-2 shadow-sm transition-all 
            hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-1 text-[9px] text-slate-500">{card.subtitle}</p>
              </div>

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
