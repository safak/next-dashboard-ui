"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  Loader2,
  MessageCircle,
  ReceiptText,
  Smartphone,
  Wallet,
} from "lucide-react";

import type { Student } from "@/types/student";
import SummaryCard from "@/components/admin/SummaryCard";

interface Transaction {
  id: number;
  amount: number;
  mode: string;
  referenceId?: string | null;
  paidAt: string;
  feeName: string;
  installment: string;
  studentFeeId: number;
}

interface AssignedFee {
  id: number;
  name: string;
  installment: string;
  amount: number;
  paidAmount: number;
  outstanding: number;
  assignedAt: string;
  dueDate?: string | null;
  status: "PENDING" | "PARTIAL" | "PAID";
  receiptNo?: string | null;
}

interface FeeSummary {
  totalFees: number;
  totalPaid: number;
  outstanding: number;
  transactions: number;
}

interface FeesResponse {
  success: boolean;
  summary: FeeSummary;
  assignedFees: AssignedFee[];
  recentTransactions: Transaction[];
  message?: string;
  error?: string;
}

interface FeesTabProps {
  student: Student;
}

type ReminderChannel = "whatsapp" | "sms";
type FeeDisplayStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";

export default function FeesTab({ student }: FeesTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<FeesResponse | null>(null);

  const [reminderFee, setReminderFee] = useState<AssignedFee | null>(null);
  const [reminderLoading, setReminderLoading] =
    useState<ReminderChannel | null>(null);
  const [reminderMessage, setReminderMessage] = useState("");

  const reminderContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/admin/students/${student.id}/fees`, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Fee service returned an invalid response (${response.status}).`,
        );
      }

      const result: FeesResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ??
            result.message ??
            `Failed to load fee details (${response.status}).`,
        );
      }

      setData(result);
    } catch (error) {
      console.error("Fee details error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load fee details.",
      );
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => {
    void fetchFees();
  }, [fetchFees]);

  useEffect(() => {
    if (!reminderFee) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        reminderContainerRef.current &&
        !reminderContainerRef.current.contains(target)
      ) {
        setReminderFee(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [reminderFee]);

  async function sendReminder(fee: AssignedFee, channel: ReminderChannel) {
    setReminderFee(null);
    setReminderMessage("");

    try {
      setReminderLoading(channel);

      const response = await fetch(
        `/api/admin/students/${student.id}/fees/${fee.id}/reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            channel,
          }),
        },
      );

      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Reminder service returned an invalid response (${response.status}).`,
        );
      }

      const result: {
        success?: boolean;
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ??
            result.message ??
            `Failed to send ${channel} reminder.`,
        );
      }

      setReminderMessage(
        `${
          channel === "whatsapp" ? "WhatsApp" : "SMS"
        } reminder sent successfully for ${fee.name}.`,
      );
    } catch (error) {
      console.error("Fee reminder error:", error);

      setReminderMessage(
        error instanceof Error
          ? error.message
          : `Failed to send ${channel} reminder.`,
      );
    } finally {
      setReminderLoading(null);
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }

  function formatDate(date?: string | null) {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-600">
          Loading fee details...
        </p>

        <p className="mt-1 text-xs text-slate-400">Please wait</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/60 px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-red-700">
          Unable to Load Fee Details
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-red-600">
          {error ||
            "Something went wrong while loading the student's fee information."}
        </p>

        <button
          type="button"
          onClick={fetchFees}
          className="
            mt-4 rounded-lg border border-red-200 bg-white
            px-3 py-1.5 text-xs font-semibold text-red-700
            transition hover:bg-red-50
          "
        >
          Try Again
        </button>
      </div>
    );
  }

  const { summary, assignedFees = [], recentTransactions = [] } = data;

  if (
    summary.totalFees === 0 &&
    assignedFees.length === 0 &&
    recentTransactions.length === 0
  ) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <Wallet className="h-7 w-7 text-indigo-500" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No Fee Information
        </h3>

        <p className="mt-1.5 max-w-sm text-sm leading-5 text-slate-500">
          No fees have been assigned to this student yet. Once fees are
          assigned, the fee details and payment history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Fee Information
        </h3>

        <p className="mt-0.5 text-xs text-slate-500">
          View assigned fees, outstanding amounts, reminders, and recent
          payments.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Total Fees"
          value={formatCurrency(summary.totalFees)}
          subtitle="Assigned fees"
          icon={Wallet}
          color="blue"
          compact
        />

        <SummaryCard
          title="Outstanding"
          value={formatCurrency(summary.outstanding)}
          subtitle={
            summary.outstanding > 0 ? "Pending amount" : "Fully collected"
          }
          icon={IndianRupee}
          color={summary.outstanding > 0 ? "red" : "green"}
          compact
        />

        <SummaryCard
          title="Payments"
          value={String(summary.transactions)}
          subtitle={
            summary.totalFees > 0
              ? `${Math.round(
                  (summary.totalPaid / summary.totalFees) * 100,
                )}% collected`
              : "No payments"
          }
          icon={ReceiptText}
          color="green"
          compact
        />
      </section>

      {reminderMessage && (
        <div
          className={`
            rounded-lg border px-3 py-2 text-xs font-medium
            ${
              reminderMessage.toLowerCase().includes("successfully")
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }
          `}
        >
          {reminderMessage}
        </div>
      )}

      {assignedFees.length > 0 && (
        <section className="overflow-visible rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <IndianRupee className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900">
                  Assigned Fees
                </h4>

                <p className="text-xs text-slate-500">
                  Fees assigned to this student.
                </p>
              </div>

              <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                {assignedFees.length}{" "}
                {assignedFees.length === 1 ? "Fee" : "Fees"}
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {assignedFees.map((fee) => {
              const status = getFeeStatus(fee);
              const isPaid = status === "PAID";
              const isOverdue = status === "OVERDUE";
              const isPartial = status === "PARTIAL";
              const isReminderOpen = reminderFee?.id === fee.id;

              return (
                <div
                  key={fee.id}
                  className="relative px-4 py-3 transition-colors hover:bg-slate-50/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h5 className="truncate text-sm font-semibold text-slate-900">
                        {fee.installment === "ADMISSION"
                          ? "Admission Fee"
                          : fee.installment === "TERM_1"
                            ? "Term 1 Fee"
                            : fee.installment === "TERM_2"
                              ? "Term 2 Fee"
                              : fee.name}
                      </h5>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                        {fee.dueDate && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 text-slate-400" />
                            Due {formatDate(fee.dueDate)}
                          </span>
                        )}

                        <span>Paid {formatCurrency(fee.paidAmount)}</span>

                        <span>Assigned {formatDate(fee.assignedAt)}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold leading-5 text-slate-900">
                        {formatCurrency(fee.amount)}
                      </p>

                      <p
                        className={`
                          mt-0.5 text-[10px] font-medium
                          ${
                            fee.outstanding > 0
                              ? "text-red-600"
                              : "text-emerald-600"
                          }
                        `}
                      >
                        {fee.outstanding > 0
                          ? `${formatCurrency(fee.outstanding)} due`
                          : "Fully paid"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex min-h-7 items-center justify-between gap-2">
                    <span
                      className={`
                        inline-flex items-center gap-1.5 rounded-full
                        px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset
                        ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : isOverdue
                              ? "bg-red-50 text-red-700 ring-red-200"
                              : isPartial
                                ? "bg-amber-50 text-amber-700 ring-amber-200"
                                : "bg-slate-50 text-slate-600 ring-slate-200"
                        }
                      `}
                    >
                      {isPaid ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span
                          className={`
                            h-1.5 w-1.5 rounded-full
                            ${
                              isOverdue
                                ? "bg-red-500"
                                : isPartial
                                  ? "bg-amber-500"
                                  : "bg-slate-400"
                            }
                          `}
                        />
                      )}

                      {status}
                    </span>

                    {fee.receiptNo && isPaid && (
                      <span className="text-[10px] text-slate-400">
                        Receipt:{" "}
                        <span className="font-medium text-slate-600">
                          {fee.receiptNo}
                        </span>
                      </span>
                    )}

                    {!isPaid && fee.outstanding > 0 && (
                      <div
                        ref={isReminderOpen ? reminderContainerRef : undefined}
                        className="relative ml-auto"
                      >
                        <button
                          type="button"
                          disabled={reminderLoading !== null}
                          onClick={() => {
                            setReminderFee(isReminderOpen ? null : fee);
                            setReminderMessage("");
                          }}
                          className="
                            inline-flex h-7 items-center gap-1.5 rounded-lg
                            border border-blue-200 bg-blue-50 px-2.5
                            text-[10px] font-semibold text-blue-700
                            transition-all hover:border-blue-300
                            hover:bg-blue-100 active:scale-[0.98]
                            disabled:cursor-not-allowed disabled:opacity-60
                          "
                        >
                          <Bell className="h-3 w-3" />
                          Send Reminder
                        </button>

                        {isReminderOpen && (
                          <div
                            className="
                              absolute bottom-full right-0 z-50 mb-2 w-60
                              overflow-hidden rounded-xl border border-slate-200
                              bg-white shadow-xl shadow-slate-200/60
                            "
                          >
                            <div className="border-b border-slate-100 px-3 py-2.5">
                              <p className="text-xs font-semibold text-slate-900">
                                Send Fee Reminder
                              </p>

                              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                                {fee.name} · {formatCurrency(fee.outstanding)}{" "}
                                due
                              </p>

                              {student.parentPhone && (
                                <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                  <Smartphone className="h-3 w-3" />
                                  {student.parentPhone}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              disabled={reminderLoading !== null}
                              onClick={() => sendReminder(fee, "whatsapp")}
                              className="
                                group flex w-full items-center gap-3
                                px-3 py-2.5 text-left transition-colors
                                hover:bg-emerald-50
                                disabled:cursor-not-allowed disabled:opacity-60
                              "
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                {reminderLoading === "whatsapp" ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MessageCircle className="h-4 w-4" />
                                )}
                              </span>

                              <span className="min-w-0">
                                <span className="block text-xs font-semibold text-slate-800">
                                  {reminderLoading === "whatsapp"
                                    ? "Sending..."
                                    : "WhatsApp"}
                                </span>

                                <span className="mt-0.5 block text-[10px] text-slate-400">
                                  Send reminder via WhatsApp
                                </span>
                              </span>
                            </button>

                            <button
                              type="button"
                              disabled={reminderLoading !== null}
                              onClick={() => sendReminder(fee, "sms")}
                              className="
                                group flex w-full items-center gap-3
                                border-t border-slate-100 px-3 py-2.5
                                text-left transition-colors hover:bg-blue-50
                                disabled:cursor-not-allowed disabled:opacity-60
                              "
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                {reminderLoading === "sms" ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Smartphone className="h-4 w-4" />
                                )}
                              </span>

                              <span className="min-w-0">
                                <span className="block text-xs font-semibold text-slate-800">
                                  {reminderLoading === "sms"
                                    ? "Sending..."
                                    : "SMS"}
                                </span>

                                <span className="mt-0.5 block text-[10px] text-slate-400">
                                  Send reminder via SMS
                                </span>
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {recentTransactions.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ReceiptText className="h-4 w-4" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Recent Transactions
                </h4>

                <p className="text-xs text-slate-500">
                  Latest payments made by this student.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TransactionRow({
  transaction,
  formatCurrency,
  formatDate,
}: {
  transaction: Transaction;
  formatCurrency: (amount: number) => string;
  formatDate: (date?: string | null) => string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/60">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-800">
          {transaction.installment === "ADMISSION"
            ? "Admission Fee"
            : transaction.installment === "TERM_1"
              ? "Term 1 Fee"
              : transaction.installment === "TERM_2"
                ? "Term 2 Fee"
                : transaction.feeName}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-slate-400">
          <span>{formatDate(transaction.paidAt)}</span>

          <span>•</span>

          <span className="capitalize">
            {transaction.mode.toLowerCase().replace("_", " ")}
          </span>

          {transaction.referenceId && (
            <>
              <span>•</span>

              <span className="truncate">Ref: {transaction.referenceId}</span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-emerald-700">
          +{formatCurrency(transaction.amount)}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">Payment received</p>
      </div>
    </div>
  );
}

function getFeeStatus(fee: AssignedFee): FeeDisplayStatus {
  if (fee.status === "PAID" || fee.outstanding <= 0) {
    return "PAID";
  }

  if (
    fee.dueDate &&
    new Date(fee.dueDate).getTime() < Date.now() &&
    fee.outstanding > 0
  ) {
    return "OVERDUE";
  }

  if (fee.status === "PARTIAL") {
    return "PARTIAL";
  }

  return "PENDING";
}
