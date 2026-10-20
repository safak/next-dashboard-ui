"use client";

import { Database } from "lucide-react";

interface NoDataProps {
  message?: string;
}

export default function NoData({
  message = "No data available.",
}: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10">
      <Database className="mb-3 h-10 w-10 text-slate-400" />

      <p className="text-sm font-medium text-slate-600">
        {message}
      </p>
    </div>
  );
}