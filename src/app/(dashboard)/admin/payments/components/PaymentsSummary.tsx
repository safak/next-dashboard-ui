"use client";

import { Banknote, CreditCard, IndianRupee, Receipt } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface Props {
  totalPayments: number;
  totalCollected: number;
  cashPayments: number;
  digitalPayments: number;
}

export default function PaymentsSummary({
  totalPayments,
  totalCollected,
  cashPayments,
  digitalPayments,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <SummaryCard
        title="Payments"
        value={totalPayments}
        icon={Receipt}
        color="blue"
        compact
      />

      <SummaryCard
        title="Collected"
        value={`₹${totalCollected.toLocaleString("en-IN")}`}
        icon={IndianRupee}
        color="green"
        compact
      />

      <SummaryCard
        title="Cash"
        value={cashPayments}
        icon={Banknote}
        color="yellow"
        compact
      />

      <SummaryCard
        title="Digital"
        value={digitalPayments}
        icon={CreditCard}
        color="purple"
        compact
      />
    </div>
  );
}
