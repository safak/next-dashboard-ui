import {
  CircleDollarSign,
  Clock3,
  CreditCard,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface FeesSummaryProps {
  total: number;
  collected: number;
  pending: number;
  overdue: number;
}

export default function FeesSummary({
  total,
  collected,
  pending,
  overdue,
}: FeesSummaryProps) {
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const summaryCards = [
    {
      title: "Total Receivable",
      value: formatCurrency(total),
      icon: IndianRupee,
      color: "blue" as const,
    },
    {
      title: "Collected",
      value: formatCurrency(collected),
      icon: CreditCard,
      color: "green" as const,
    },
    {
      title: "Outstanding",
      value: formatCurrency(pending),
      icon: Clock3,
      color: "yellow" as const,
    },
    {
      title: "Overdue",
      value: formatCurrency(overdue),
      icon: AlertCircle,
      color: "red" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {summaryCards.map((card) => (
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
