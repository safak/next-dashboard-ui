"use client";

import {
  CheckCircle2,
  CreditCard,
  TrendingUp,
} from "lucide-react";

interface PaymentProgressProps {
  totalFees: number;
  totalPaid: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function PaymentProgress({
  totalFees,
  totalPaid,
}: PaymentProgressProps) {
  const outstanding = Math.max(totalFees - totalPaid, 0);

  const percentage =
    totalFees > 0
      ? Math.min(
          Math.round((totalPaid / totalFees) * 100),
          100,
        )
      : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Payment Progress
            </h3>

            <p className="text-sm text-slate-500">
              Overall fee collection progress
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="space-y-6 p-6">

        {/* Percentage */}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Payment Progress
          </span>

          <span className="text-xl font-bold text-blue-600">
            {percentage}%
          </span>
        </div>

        {/* Progress */}

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        {/* Summary */}

        <div className="grid gap-4 md:grid-cols-2">

          {/* Paid */}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Collected
                </p>

                <h4 className="text-lg font-bold text-emerald-700">
                  {formatCurrency(totalPaid)}
                </h4>
              </div>
            </div>
          </div>

          {/* Remaining */}

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Outstanding
                </p>

                <h4 className="text-lg font-bold text-red-700">
                  {formatCurrency(outstanding)}
                </h4>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}

        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            Collected {formatCurrency(totalPaid)}
          </span>{" "}
           of{" "}
          <span className="font-semibold text-slate-900">
            {formatCurrency(totalFees)}
          </span>
          .
        </div>

      </div>
    </div>
  );
}