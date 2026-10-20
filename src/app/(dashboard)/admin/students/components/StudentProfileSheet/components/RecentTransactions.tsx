"use client";

import { CalendarDays, CreditCard, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RecentTransaction {
  id: number;
  amount: number;
  mode: string;
  referenceId?: string | null;
  paidAt: string;
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[];

  onViewAll?: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function modeColor(mode: string) {
  switch (mode) {
    case "CASH":
      return "bg-emerald-100 text-emerald-700";

    case "UPI":
      return "bg-violet-100 text-violet-700";

    case "CARD":
      return "bg-blue-100 text-blue-700";

    case "BANK_TRANSFER":
      return "bg-amber-100 text-amber-700";

    case "CHEQUE":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function RecentTransactions({
  transactions,
  onViewAll,
}: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Recent Transactions</h3>

          <p className="mt-1 text-sm text-slate-500">
            Latest fee payments received.
          </p>
        </div>

        <div className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {transactions.length}
        </div>
      </div>

      {/* Empty */}

      {transactions.length === 0 ? (
        <div className="py-12 text-center">
          <Receipt className="mx-auto mb-3 h-10 w-10 text-slate-300" />

          <h4 className="font-semibold text-slate-800">No Transactions</h4>

          <p className="mt-1 text-sm text-slate-500">
            No payments have been recorded yet.
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
              >
                {/* Left */}

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${modeColor(
                          transaction.mode,
                        )}`}
                      >
                        {transaction.mode.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4" />

                      {formatDate(transaction.paidAt)}
                    </div>

                    {transaction.referenceId && (
                      <p className="mt-1 text-xs text-slate-400">
                        Receipt: {transaction.referenceId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right */}

                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(transaction.amount)}
                  </p>

                  <p className="text-xs text-slate-400">Payment Received</p>
                </div>
              </div>
            ))}
          </div>

          {onViewAll && (
            <div className="border-t bg-slate-50 p-4">
              <Button variant="outline" className="w-full" onClick={onViewAll}>
                View Complete Transaction History
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
