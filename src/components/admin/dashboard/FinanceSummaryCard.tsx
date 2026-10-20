"use client";

import { useEffect, useState } from "react";
import { IndianRupee, Wallet, X, TrendingUp } from "lucide-react";

import FinanceChart from "@/components/FinanceChart";

interface FinanceSummaryCardProps {
  collected: number;
  pending: number;
  totalFee: number;
  collectionRate: number;
  chartData: {
    month: string;
    fees: number;
  }[];
}

export default function FinanceSummaryCard({
  collected,
  pending,
  totalFee,
  collectionRate,
  chartData,
}: FinanceSummaryCardProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);

  const stats = [
    {
      title: "Total Fees",
      value: `₹${totalFee.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconColor: "#4B517D",
      iconBg: "#EEF2FF",
    },
    {
      title: "Collected",
      value: `₹${collected.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      iconColor: "#16A34A",
      iconBg: "#ECFDF3",
    },
    {
      title: "Pending",
      value: `₹${pending.toLocaleString("en-IN")}`,
      icon: Wallet,
      iconColor: "#F59A23",
      iconBg: "#FFF4E4",
    },
  ];

  const safeCollectionRate = Math.min(100, Math.max(0, collectionRate));

  useEffect(() => {
    if (!showAnalytics) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAnalytics(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [showAnalytics]);

  return (
    <>
      <div className="flex h-full min-h-[235px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(75,81,125,0.06)]">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-sm font-bold text-[#303552]">Fee Collection</h3>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Collection performance for the current academic year
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[9px] font-semibold text-green-600 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Live
            </div>

            <div className="rounded-full bg-[#FFF8EC] px-2.5 py-1 text-[9px] font-bold text-[#B87938]">
              {safeCollectionRate}% collected
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 gap-2.5 p-4 sm:grid-cols-3 sm:px-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex min-w-0 items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-medium text-slate-400">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-base font-bold leading-none text-[#303552]">
                    {item.value}
                  </p>
                </div>

                <div
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: item.iconBg,
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={2}
                    style={{
                      color: item.iconColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ANALYTICS BUTTON */}
        <div className="mt-auto border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAnalytics(true)}
            className="group flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50 sm:px-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <TrendingUp className="h-3.5 w-3.5 text-[#4B517D]" />
              </div>

              <div className="text-left">
                <h4 className="text-[10px] font-semibold text-[#303552]">
                  Monthly Collection Analytics
                </h4>

                <p className="text-[9px] text-slate-400">
                  View fee collection trend
                </p>
              </div>
            </div>

            <span className="rounded-md bg-[#EEF2FF] px-2 py-1 text-[9px] font-semibold text-[#4B517D] transition-colors group-hover:bg-[#E4E8FA]">
              View
            </span>
          </button>
        </div>
      </div>

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAnalytics(false);
            }
          }}
        >
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF]">
                    <TrendingUp className="h-4 w-4 text-[#4B517D]" />
                  </div>

                  <h2 className="text-base font-bold text-[#303552]">
                    Monthly Collection Analytics
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Fee collection trend for the current academic year
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAnalytics(false)}
                aria-label="Close analytics"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#4B517D]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] text-slate-400">Total Fees</p>

                <p className="mt-1 text-sm font-bold text-[#303552]">
                  ₹{totalFee.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Collected</p>

                <p className="mt-1 text-sm font-bold text-green-600">
                  ₹{collected.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Pending</p>

                <p className="mt-1 text-sm font-bold text-[#F59A23]">
                  ₹{pending.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* CHART */}
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <FinanceChart data={chartData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
