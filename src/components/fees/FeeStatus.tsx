import type { InvoiceStatus } from "@/lib/fees";

const styles: Record<InvoiceStatus, string> = {
  PAID: "bg-green-100 text-green-700",
  PART_PAID: "bg-sky-100 text-sky-700",
  UNPAID: "bg-gray-100 text-gray-600",
  OVERDUE: "bg-red-100 text-red-700",
};

const labels: Record<InvoiceStatus, string> = {
  PAID: "Paid",
  PART_PAID: "Part paid",
  UNPAID: "Unpaid",
  OVERDUE: "Overdue",
};

export const FeeStatusBadge = ({ status }: { status: InvoiceStatus }) => (
  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${styles[status]}`}>
    {labels[status]}
  </span>
);

export const StatCard = ({
  label,
  value,
  tone = "default",
  hint,
}: {
  label: string;
  value: string;
  tone?: "default" | "danger" | "good";
  hint?: string;
}) => (
  <div className="card p-4 flex-1 min-w-[150px]">
    <p className="text-xs text-gray-500">{label}</p>
    <p
      className={`text-xl font-semibold mt-1 ${
        tone === "danger" ? "text-red-600" : tone === "good" ? "text-green-700" : "text-gray-800"
      }`}
    >
      {value}
    </p>
    {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
  </div>
);
