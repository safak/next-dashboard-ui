"use client";

import {
  GraduationCap,
  Users,
  CalendarRange,
  ArrowRightLeft,
} from "lucide-react";

interface PromotionSummaryProps {
  totalStudents?: number;
  totalClasses?: number;
  currentYear?: string;
  nextYear?: string;
}

export default function PromotionSummary({
  totalStudents = 0,
  totalClasses = 0,
  currentYear = "-",
  nextYear = "-",
}: PromotionSummaryProps) {
  const cards = [
    {
      title: "Eligible Students",
      value: totalStudents,
      icon: Users,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Classes",
      value: totalClasses,
      icon: GraduationCap,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Current Year",
      value: currentYear,
      icon: CalendarRange,
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      color: "text-violet-600",
    },
    {
      title: "Next Year",
      value: nextYear,
      icon: ArrowRightLeft,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl border border-slate-200 p-5 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`rounded-xl ${card.iconBg} p-3`}
              >
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}