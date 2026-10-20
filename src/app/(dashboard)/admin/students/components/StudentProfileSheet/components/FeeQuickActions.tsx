"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FileSpreadsheet,
  Printer,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface FeeQuickActionsProps {
  studentId: string;
}

export default function FeeQuickActions({
  studentId,
}: FeeQuickActionsProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b bg-slate-50 px-6 py-4">
        <h3 className="font-semibold text-slate-900">
          Quick Actions
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Open fee management tools for this student.
        </p>
      </div>

      {/* Actions */}

      <div className="space-y-3 p-6">

        {/* Fee Ledger */}

        <Button
          variant="outline"
          className="h-14 w-full justify-between"
          onClick={() =>
            router.push(`/admin/fees/student/${studentId}`)
          }
        >
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-blue-600" />

            <span>View Complete Fee Ledger</span>
          </div>

          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Download Statement */}

        <Button
          variant="outline"
          className="h-14 w-full justify-between"
        >
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />

            <span>Download Fee Statement</span>
          </div>

          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Print Receipt */}

        <Button
          variant="outline"
          className="h-14 w-full justify-between"
        >
          <div className="flex items-center gap-3">
            <Printer className="h-5 w-5 text-violet-600" />

            <span>Print Latest Receipt</span>
          </div>

          <ArrowRight className="h-4 w-4" />
        </Button>

      </div>
    </div>
  );
}