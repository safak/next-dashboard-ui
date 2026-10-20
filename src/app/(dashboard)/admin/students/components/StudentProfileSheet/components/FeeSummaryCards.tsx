"use client";

import { CreditCard, Receipt, Wallet } from "lucide-react";

interface FeeSummary {
  totalFees: number;
  totalPaid: number;
  outstanding: number;
  transactions: number;
}

interface FeeSummaryCardsProps {
  summary: FeeSummary;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function FeeSummaryCards({ summary }: FeeSummaryCardsProps) {
  const totalFees = summary.totalFees ?? 0;
  const totalPaid = summary.totalPaid ?? 0;
  const outstanding = summary.outstanding ?? 0;
  const transactions = summary.transactions ?? 0;

  const paymentPercentage =
    totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;

  const cards = [
    {
      title: "Total Fees",
      value: formatCurrency(totalFees),
      subtitle: "Assigned Fees",
      icon: Wallet,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Outstanding",
      value: formatCurrency(outstanding),
      subtitle: outstanding > 0 ? "Pending Amount" : "No Pending Fees",
      icon: CreditCard,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Payments",
      value: transactions.toString(),
      subtitle: `${paymentPercentage}% Collection`,
      icon: Receipt,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-xl border border-slate-200 ${card.bg} p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
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
