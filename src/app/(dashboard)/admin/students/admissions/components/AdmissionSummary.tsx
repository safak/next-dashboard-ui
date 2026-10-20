import { ClipboardList, Clock3, BadgeCheck, XCircle } from "lucide-react";

import SummaryCard from "@/components/ui/SummaryCard";

import { AdmissionRegisterSummary } from "@/services/admissions.service";

interface AdmissionSummaryProps {
  summary: AdmissionRegisterSummary;
}

export default function AdmissionSummary({ summary }: AdmissionSummaryProps) {
  const cards = [
    {
      title: "Total Admissions",
      value: summary.total.toLocaleString(),
      icon: ClipboardList,
      variant: "primary" as const,
      badge: "Total",
    },
    {
      title: "Pending",
      value: summary.pending.toLocaleString(),
      icon: Clock3,
      variant: "warning" as const,
      badge: "Pending",
    },
    {
      title: "Approved",
      value: summary.approved.toLocaleString(),
      icon: BadgeCheck,
      variant: "success" as const,
      badge: "Approved",
    },
    {
      title: "Rejected",
      value: summary.rejected.toLocaleString(),
      icon: XCircle,
      variant: "danger" as const,
      badge: "Rejected",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          layout="compact"
        />
      ))}
    </div>
  );
}
