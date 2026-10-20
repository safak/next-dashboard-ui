import type { FeeStatus } from "@prisma/client";

export function getFeeStatus(status: FeeStatus, dueDate: Date | string | null) {
  if (status === "PAID") {
    return {
      label: "Paid",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (
    dueDate &&
    new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
  ) {
    return {
      label: "Overdue",
      className: "bg-red-50 text-red-700",
    };
  }

  if (status === "PARTIAL") {
    return {
      label: "Partial",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Pending",
    className: "bg-slate-100 text-slate-700",
  };
}
