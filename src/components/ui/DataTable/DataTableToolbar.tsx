"use client";

import { ReactNode } from "react";
import {
  Search,
  RotateCw,
  Download,
  Plus,
} from "lucide-react";

interface DataTableToolbarProps {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  onRefresh?: () => void;
  onExport?: () => void;
  onCreate?: () => void;

  createLabel?: string;

  filters?: ReactNode;

  loading?: boolean;
}

export default function DataTableToolbar({
  searchValue = "",
  searchPlaceholder = "Search...",

  onSearchChange,

  onRefresh,
  onExport,
  onCreate,

  createLabel = "New",

  filters,

  loading = false,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={searchValue}
            onChange={(e) =>
              onSearchChange?.(e.target.value)
            }
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Filters */}
        {filters}
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RotateCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        )}

        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium transition hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        )}

        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            {createLabel}
          </button>
        )}
      </div>
    </div>
  );
}