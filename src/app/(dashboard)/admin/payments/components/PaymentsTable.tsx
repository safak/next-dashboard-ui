"use client";

import {
  Banknote,
  CreditCard,
  IndianRupee,
  Smartphone,
  UserRound,
  CalendarDays,
  Receipt,
} from "lucide-react";

import type { PaymentWithRelations } from "../types";

import PaymentRowActions from "./PaymentRowActions";

interface PaymentsTableProps {
  payments: PaymentWithRelations[];
  onDelete: (payment: PaymentWithRelations) => void;
}

function formatPaymentMode(mode: string) {
  switch (mode) {
    case "UPI":
      return "UPI";

    case "CARD":
      return "Card";

    case "BANK_TRANSFER":
      return "Bank Transfer";

    case "CASH":
    default:
      return "Cash";
  }
}

function getPaymentModeIcon(mode: string) {
  switch (mode) {
    case "CASH":
      return Banknote;

    case "UPI":
      return Smartphone;

    case "CARD":
    case "BANK_TRANSFER":
    default:
      return CreditCard;
  }
}

function getPaymentModeStyles(mode: string) {
  switch (mode) {
    case "CASH":
      return "bg-amber-50 text-amber-700";

    case "UPI":
      return "bg-emerald-50 text-emerald-700";

    case "CARD":
      return "bg-blue-50 text-blue-700";

    case "BANK_TRANSFER":
      return "bg-violet-50 text-violet-700";

    default:
      return "bg-slate-50 text-slate-600";
  }
}

export default function PaymentsTable({
  payments,
  onDelete,
}: PaymentsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Amount
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Payment Mode
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Reference
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Paid At
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => {
              const mode = formatPaymentMode(payment.mode);
              const ModeIcon = getPaymentModeIcon(payment.mode);
              const modeStyles = getPaymentModeStyles(payment.mode);

              const paidAt = new Date(payment.paidAt);

              return (
                <tr
                  key={payment.id}
                  className="
                    group
                    border-b
                    border-slate-100
                    last:border-b-0
                    transition-colors
                    duration-150
                    hover:bg-indigo-50/30
                  "
                >
                  {/* Student */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-indigo-50
                          text-indigo-600
                          transition-transform
                          duration-150
                          group-hover:scale-105
                        "
                      >
                        <UserRound className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                          {payment.studentFee.student.name}{" "}
                          {payment.studentFee.student.surname}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          bg-emerald-50
                          text-emerald-600
                        "
                      >
                        <IndianRupee className="h-3.5 w-3.5" />
                      </div>

                      <span className="text-sm font-bold text-slate-900">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </td>

                  {/* Payment Mode */}

                  <td className="px-5 py-2.5">
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${modeStyles}
                      `}
                    >
                      <ModeIcon className="h-3.5 w-3.5" />
                      {mode}
                    </span>
                  </td>

                  {/* Reference */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                        <Receipt className="h-3.5 w-3.5" />
                      </div>

                      <span className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                        {payment.referenceId || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Paid At */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          bg-slate-100
                          text-slate-500
                        "
                      >
                        <CalendarDays className="h-3.5 w-3.5" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {paidAt.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        <p className="text-[11px] leading-4 text-slate-400">
                          {paidAt.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-5 py-2.5 text-center">
                    <div className="flex justify-center">
                      <PaymentRowActions
                        payment={payment}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Empty Table State */}

            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <IndianRupee className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No payments found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no payment records to display.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
