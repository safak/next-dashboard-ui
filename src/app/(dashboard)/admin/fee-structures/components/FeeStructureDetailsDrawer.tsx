"use client";

import {
  CheckCircle2,
  IndianRupee,
  ReceiptText,
  School,
  X,
} from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import type { FeeStructureRow } from "./FeeStructuresTable";

interface FeeStructureDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeStructure: FeeStructureRow | null;
}

export default function FeeStructureDetailsDrawer({
  open,
  onOpenChange,
  feeStructure,
}: FeeStructureDetailsDrawerProps) {
  if (!feeStructure) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Fee Structure Details"
      description="View the details of this fee structure."
      width="sm"
      icon={<ReceiptText className="h-6 w-6" />}
      footer={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {/* FEE STRUCTURE OVERVIEW */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ReceiptText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">
                {feeStructure.title}
              </h2>

              <p className="text-sm text-slate-500">
                {feeStructure.class.name} Fee Structure
              </p>
            </div>
          </div>
        </div>

        {/* FEE STRUCTURE INFORMATION */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Fee Structure Information
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Basic information about this fee structure.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Class */}

            <div className="rounded-lg bg-indigo-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <School className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Class
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {feeStructure.class.name}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Academic Class
              </p>
            </div>

            {/* Status */}

            <div className="rounded-lg bg-emerald-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    feeStructure.isActive
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {feeStructure.isActive ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <ReceiptText className="h-3.5 w-3.5" />
                  )}
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Status
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {feeStructure.isActive ? "Active" : "Inactive"}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Fee structure status
              </p>
            </div>
          </div>
        </div>

        {/* FEE BREAKDOWN */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Fee Breakdown
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Annual and admission fee details.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3">
            {/* Annual Fee */}

            <div className="flex items-center justify-between rounded-lg bg-blue-50/60 p-3">
              <div>
                <p className="text-xs font-medium text-slate-500">Annual Fee</p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Total yearly fee
                </p>
              </div>

              <p className="text-base font-bold text-slate-900">
                {formatCurrency(feeStructure.annualFee)}
              </p>
            </div>

            {/* Admission Fee */}

            <div className="flex items-center justify-between rounded-lg bg-amber-50/60 p-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Admission Fee
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  One-time admission amount
                </p>
              </div>

              <p className="text-base font-bold text-slate-900">
                {formatCurrency(feeStructure.admissionFee)}
              </p>
            </div>

            {/* Remaining Fee */}

            <div className="flex items-center justify-between rounded-lg bg-violet-50/60 p-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Remaining Fee
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Available for term payments
                </p>
              </div>

              <p className="text-base font-bold text-slate-900">
                {formatCurrency(
                  Math.max(
                    feeStructure.annualFee - feeStructure.admissionFee,
                    0,
                  ),
                )}
              </p>
            </div>
          </div>
        </div>

        {/* QUICK STATS */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-indigo-600" />

              <span className="text-xs font-medium text-slate-500">
                Annual Fee
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatCurrency(feeStructure.annualFee)}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-emerald-600" />

              <span className="text-xs font-medium text-slate-500">
                Admission Fee
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatCurrency(feeStructure.admissionFee)}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
