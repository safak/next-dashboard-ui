"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CreditCard,
  History,
  IndianRupee,
  ReceiptText,
  Smartphone,
} from "lucide-react";
import { toast } from "react-toastify";

import Drawer from "@/components/ui/Drawer";

import { getPaymentHistory } from "../actions";
import type { FeeWithRelations } from "../types";

interface PaymentHistoryDrawerProps {
  open: boolean;
  fee: FeeWithRelations | null;
  onClose: () => void;
}

interface PaymentRecord {
  id: number;
  amount: number;
  paidAt: string;
  referenceId: string | null;
  mode: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER";
}

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInstallmentLabel(fee: FeeWithRelations) {
  switch (fee.installment) {
    case "ADMISSION":
      return "Admission";

    case "TERM_1":
      return "Term 1";

    case "TERM_2":
      return "Term 2";

    default:
      return "Installment";
  }
}

function getModeLabel(mode: PaymentRecord["mode"]) {
  switch (mode) {
    case "BANK_TRANSFER":
      return "Bank Transfer";

    case "UPI":
      return "UPI";

    case "CARD":
      return "Card";

    case "CASH":
      return "Cash";

    default:
      return mode;
  }
}

function getModeIcon(mode: PaymentRecord["mode"]) {
  switch (mode) {
    case "UPI":
      return Smartphone;

    case "CARD":
      return CreditCard;

    case "BANK_TRANSFER":
      return Banknote;

    case "CASH":
    default:
      return Banknote;
  }
}

function getModeStyles(mode: PaymentRecord["mode"]) {
  switch (mode) {
    case "UPI":
      return {
        wrapper: "bg-violet-50 text-violet-600",
        badge: "bg-violet-50 text-violet-700",
      };

    case "CARD":
      return {
        wrapper: "bg-blue-50 text-blue-600",
        badge: "bg-blue-50 text-blue-700",
      };

    case "BANK_TRANSFER":
      return {
        wrapper: "bg-orange-50 text-orange-600",
        badge: "bg-orange-50 text-orange-700",
      };

    case "CASH":
    default:
      return {
        wrapper: "bg-emerald-50 text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700",
      };
  }
}

export default function PaymentHistoryDrawer({
  open,
  fee,
  onClose,
}: PaymentHistoryDrawerProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !fee) {
      return;
    }

    let cancelled = false;

    const loadHistory = async () => {
      setLoading(true);

      try {
        const result = await getPaymentHistory(fee.id);

        if (cancelled) {
          return;
        }

        if (!result.success) {
          toast.error(result.error || "Failed to load payment history.");

          setPayments([]);
          return;
        }

        setPayments(result.payments);
      } catch (error) {
        console.error("Payment history error:", error);

        if (!cancelled) {
          toast.error("Failed to load payment history.");

          setPayments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [open, fee]);

  const totalPaid = useMemo(
    () =>
      payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments],
  );

  if (!fee) {
    return null;
  }

  const totalAmount = Number(fee.totalAmount || 0);

  const currentPaidAmount = Number(fee.paidAmount || 0);

  const balance = Math.max(totalAmount - currentPaidAmount, 0);

  const installmentLabel = getInstallmentLabel(fee);

  const studentName = `${fee.student.name} ${fee.student.surname}`.trim();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Payment History"
      description={`Payment records for ${installmentLabel.toLowerCase()}.`}
      width="md"
      icon={<History className="h-6 w-6" />}
      footer={null}
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ReceiptText className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {studentName}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {fee.student.class?.name ?? "—"}
              </p>

              <div className="mt-2">
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                  {installmentLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            <div className="p-3">
              <p className="text-[11px] text-slate-400">Total</p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="p-3">
              <p className="text-[11px] text-slate-400">Paid</p>

              <p className="mt-1 text-sm font-bold text-emerald-600">
                {formatCurrency(currentPaidAmount)}
              </p>
            </div>

            <div className="p-3">
              <p className="text-[11px] text-slate-400">Balance</p>

              <p
                className={`mt-1 text-sm font-bold ${
                  balance > 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Payment Records
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                {payments.length}{" "}
                {payments.length === 1 ? "payment" : "payments"} recorded
              </p>
            </div>

            {!loading && payments.length > 0 && (
              <span className="text-sm font-bold text-emerald-600">
                {formatCurrency(totalPaid)}
              </span>
            )}
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center">
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

              <p className="mt-3 text-xs text-slate-500">
                Loading payment history...
              </p>
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <History className="h-5 w-5" />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-slate-800">
                No Payments Yet
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                No payment has been recorded for this installment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, index) => {
                const ModeIcon = getModeIcon(payment.mode);

                const styles = getModeStyles(payment.mode);

                return (
                  <div
                    key={payment.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.wrapper}`}
                      >
                        <ModeIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {formatCurrency(payment.amount)}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {formatDate(payment.paidAt)} ·{" "}
                              {formatTime(payment.paidAt)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.badge}`}
                          >
                            {getModeLabel(payment.mode)}
                          </span>
                        </div>

                        {payment.referenceId && (
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                            <span className="text-[11px] font-medium text-slate-400">
                              Reference
                            </span>

                            <span className="min-w-0 truncate text-xs font-medium text-slate-700">
                              {payment.referenceId}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                          <span className="text-[11px] text-slate-400">
                            Payment #{payments.length - index}
                          </span>

                          <span className="text-[11px] font-medium text-emerald-600">
                            Recorded
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!loading && payments.length > 0 && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-700">
                  Total Payments Recorded
                </p>

                <p className="mt-1 text-lg font-bold text-emerald-800">
                  {formatCurrency(totalPaid)}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
          </div>
        )}

        {fee.dueDate && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-3">
            <CalendarDays className="h-4 w-4 text-slate-400" />

            <span className="text-xs text-slate-500">Due date</span>

            <span className="ml-auto text-xs font-semibold text-slate-700">
              {new Date(fee.dueDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </Drawer>
  );
}
