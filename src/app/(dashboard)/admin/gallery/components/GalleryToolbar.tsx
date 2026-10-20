"use client";

import { RefreshCw, Search } from "lucide-react";

interface GalleryToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  total: number;
  onRefresh: () => void;
  loading?: boolean;
}

export default function GalleryToolbar({
  search,
  onSearchChange,
  total,
  onRefresh,
  loading = false,
}: GalleryToolbarProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search gallery events..."
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              pl-9
              pr-3
              text-sm
              text-slate-700
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#4B517D]
              focus:ring-2
              focus:ring-[#4B517D]/10
            "
          />
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <span className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{total}</span>{" "}
            {total === 1 ? "event" : "events"}
          </span>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
