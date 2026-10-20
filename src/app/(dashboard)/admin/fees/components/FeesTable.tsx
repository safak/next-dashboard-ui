"use client";

import {
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  MoreHorizontal,
  ReceiptText,
} from "lucide-react";

import FeeRowActions from "./FeeRowActions";

import type { FeeWithRelations } from "../types";

interface FeesTableProps {
  fees: FeeWithRelations[];

  onEdit: (fee: FeeWithRelations) => void;
  onPayment: (fee: FeeWithRelations) => void;
  onHistory: (fee: FeeWithRelations) => void;
  onDelete: (fee: FeeWithRelations) => void;
}

function formatAmount(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDueDate(date: Date | null) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAcademicYear(
  academicYear:
    | {
        id: number;
        name?: string;
        label?: string;
      }
    | null
    | undefined,
) {
  if (!academicYear) return "—";

  return academicYear.name ?? academicYear.label ?? "—";
}

function getInstallmentInfo(fee: FeeWithRelations) {
  switch (fee.installment) {
    case "ADMISSION":
      return {
        label: "Admission Fee",
        shortLabel: "Admission",
        className: "bg-violet-100 text-violet-700",
        amountClassName: "text-violet-700",
        icon: "₹",
      };

    case "TERM_1":
      return {
        label: "Term 1",
        shortLabel: "Term 1",
        className: "bg-blue-100 text-blue-700",
        amountClassName: "text-blue-700",
        icon: "T1",
      };

    case "TERM_2":
      return {
        label: "Term 2",
        shortLabel: "Term 2",
        className: "bg-orange-100 text-orange-700",
        amountClassName: "text-orange-700",
        icon: "T2",
      };

    default:
      return {
        label: fee.plan?.feeStructure?.title ?? "Fee",
        shortLabel: fee.plan?.feeStructure?.title ?? "Fee",
        className: "bg-slate-100 text-slate-700",
        amountClassName: "text-slate-700",
        icon: "₹",
      };
  }
}

function getStatus(fee: FeeWithRelations) {
  if (fee.status === "PAID" || fee.paidAmount >= fee.totalAmount) {
    return {
      label: "PAID",
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
      dotClassName: "bg-emerald-500",
    };
  }

  if (fee.status === "PARTIAL" && fee.paidAmount > 0) {
    return {
      label: "PARTIAL",
      className:
        "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100",
      dotClassName: "bg-blue-500",
    };
  }

  if (fee.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(fee.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (
      dueDate.getTime() < today.getTime() &&
      fee.paidAmount < fee.totalAmount
    ) {
      return {
        label: "OVERDUE",
        className:
          "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100",
        dotClassName: "bg-red-500",
      };
    }
  }

  return {
    label: "PENDING",
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100",
    dotClassName: "bg-amber-500",
  };
}

function getDueDateState(fee: FeeWithRelations) {
  if (!fee.dueDate) {
    return {
      label: "Not set",
      className: "text-slate-400",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(fee.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (
    dueDate.getTime() < today.getTime() &&
    fee.paidAmount < fee.totalAmount
  ) {
    return {
      label: formatDueDate(fee.dueDate) ?? "—",
      className: "font-semibold text-red-600",
    };
  }

  return {
    label: formatDueDate(fee.dueDate) ?? "—",
    className: "text-slate-700",
  };
}

export default function FeesTable({
  fees,
  onEdit,
  onPayment,
  onHistory,
  onDelete,
}: FeesTableProps) {
  if (fees.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <ReceiptText className="h-6 w-6" />
          </div>

          <h3 className="text-sm font-semibold text-slate-900">
            No Fee Installments
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Create an annual fee plan for a student to generate Admission,
            Term 1, and Term 2 installments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="hide-scrollbar overflow-x-auto">
        <table className="min-w-[1450px] border-separate border-spacing-0">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs font-semibold text-slate-600">
              <th
                className="
                  sticky left-0 z-40
                  w-[235px] min-w-[235px]
                  border-b border-slate-200
                  bg-slate-50
                  px-5 py-4
                "
              >
                Student
              </th>

              <th
                className="
                  sticky left-[235px] z-40
                  w-[130px] min-w-[130px]
                  border-b border-slate-200
                  bg-slate-50
                  px-5 py-4
                "
              >
                Class
              </th>

              <th className="w-[145px] min-w-[145px] border-b border-slate-200 px-5 py-4">
                Academic Year
              </th>

              <th className="w-[190px] min-w-[190px] border-b border-slate-200 px-5 py-4">
                Installment
              </th>

              <th className="w-[150px] min-w-[150px] border-b border-slate-200 px-5 py-4">
                Annual Fee
              </th>

              <th className="w-[145px] min-w-[145px] border-b border-slate-200 px-5 py-4">
                Amount
              </th>

              <th className="w-[135px] min-w-[135px] border-b border-slate-200 px-5 py-4">
                Paid
              </th>

              <th className="w-[145px] min-w-[145px] border-b border-slate-200 px-5 py-4">
                Balance
              </th>

              <th className="w-[175px] min-w-[175px] border-b border-slate-200 px-5 py-4">
                Due Date
              </th>

              <th className="w-[130px] min-w-[130px] border-b border-slate-200 px-5 py-4">
                Status
              </th>

              <th className="w-[120px] min-w-[120px] border-b border-slate-200 px-5 py-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {fees.map((fee) => {
              const installment = getInstallmentInfo(fee);
              const status = getStatus(fee);

              const balance = Math.max(
                fee.totalAmount - fee.paidAmount,
                0,
              );

              const dueDate = getDueDateState(fee);

              const annualAmount = fee.plan?.finalFee ?? null;

              const academicYear = formatAcademicYear(
                fee.plan?.academicYear ??
                  fee.student.academicYear,
              );

              const feeStructureTitle =
                fee.plan?.feeStructure?.title ?? "Fee Structure";

              const hasPayments =
                fee.paidAmount > 0 ||
                fee._count.payments > 0;

              return (
                <tr
                  key={fee.id}
                  className="group transition-colors hover:bg-slate-50"
                >
                  <td
                    className="
                      sticky left-0 z-30
                      w-[235px] min-w-[235px]
                      border-b border-slate-100
                      bg-white
                      px-5 py-4
                      group-hover:bg-slate-50
                    "
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {fee.student.name?.charAt(0)?.toUpperCase()}
                        {fee.student.surname?.charAt(0)?.toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {fee.student.name} {fee.student.surname}
                        </p>

                        
                      </div>
                    </div>
                  </td>

                  <td
                    className="
                      sticky left-[235px] z-30
                      w-[130px] min-w-[130px]
                      border-b border-slate-100
                      bg-white
                      px-5 py-4
                      group-hover:bg-slate-50
                    "
                  >
                    <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                      {fee.student.class?.name ?? "—"}
                    </span>
                  </td>

                  <td className="w-[145px] min-w-[145px] border-b border-slate-100 px-5 py-4">
                    <span className="inline-flex whitespace-nowrap rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {academicYear}
                    </span>
                  </td>

                  <td className="w-[190px] min-w-[190px] border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg
                          text-[10px] font-bold
                          ${installment.className}
                        `}
                      >
                        {installment.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {installment.label}
                        </p>

                        {feeStructureTitle &&
                          feeStructureTitle !== installment.label && (
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {feeStructureTitle}
                            </p>
                          )}
                      </div>
                    </div>
                  </td>

                  <td className="w-[150px] min-w-[150px] border-b border-slate-100 px-5 py-4">
                    {annualAmount !== null ? (
                      <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
                        {formatAmount(annualAmount)}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-400">
                        —
                      </span>
                    )}
                  </td>

                  <td className="w-[145px] min-w-[145px] border-b border-slate-100 px-5 py-4">
                    <span
                      className={`
                        inline-flex items-center gap-1
                        whitespace-nowrap
                        text-sm font-semibold
                        ${installment.amountClassName}
                      `}
                    >
                      <IndianRupee className="h-3.5 w-3.5" />

                      {fee.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td className="w-[135px] min-w-[135px] border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {fee.paidAmount > 0 && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}

                      <span className="whitespace-nowrap text-sm font-semibold text-emerald-600">
                        {formatAmount(fee.paidAmount)}
                      </span>
                    </div>
                  </td>

                  <td className="w-[145px] min-w-[145px] border-b border-slate-100 px-5 py-4">
                    <span
                      className={`
                        whitespace-nowrap
                        text-sm font-semibold
                        ${
                          balance > 0
                            ? "text-red-600"
                            : "text-emerald-600"
                        }
                      `}
                    >
                      {formatAmount(balance)}
                    </span>
                  </td>

                  <td className="w-[175px] min-w-[175px] border-b border-slate-100 px-5 py-4">
                    {fee.dueDate ? (
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          className={`h-4 w-4 ${dueDate.className}`}
                        />

                        <span
                          className={`
                            whitespace-nowrap
                            text-sm
                            ${dueDate.className}
                          `}
                        >
                          {dueDate.label}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-300" />

                        <span className="text-xs font-medium text-slate-400">
                          Not set
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="w-[130px] min-w-[130px] border-b border-slate-100 px-5 py-4">
                    <span
                      className={`
                        inline-flex items-center gap-1.5
                        whitespace-nowrap
                        rounded-full
                        px-2.5 py-1
                        text-xs font-semibold
                        ${status.className}
                      `}
                    >
                      <span
                        className={`
                          h-1.5 w-1.5 rounded-full
                          ${status.dotClassName}
                        `}
                      />

                      {status.label}
                    </span>
                  </td>

                  <td className="w-[120px] min-w-[120px] border-b border-slate-100 px-5 py-4 text-center">
                    <FeeRowActions
                      onEdit={() => onEdit(fee)}
                      onPayment={() => onPayment(fee)}
                      onHistory={() => onHistory(fee)}
                      onDelete={() => onDelete(fee)}
                      deleteDisabled={hasPayments}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {fees.length}
          </span>{" "}
          installment{fees.length !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MoreHorizontal className="h-4 w-4" />

          <span>
            Each installment has its own payment status and due date.
          </span>
        </div>
      </div>
    </div>
  );
}