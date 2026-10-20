"use client";

import { Download, Plus, RefreshCw, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AcademicYearToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  total: number;

  onRefresh: () => void;
  onExport?: () => void;
  onCreate: () => void;
}

export default function AcademicYearToolbar({
  search,
  onSearchChange,
  total,
  onRefresh,
  onExport,
  onCreate,
}: AcademicYearToolbarProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          p-3
          sm:p-3.5
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Search */}

          <div className="relative min-w-0 flex-1 xl:max-w-xl">
            <Search
              aria-hidden="true"
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
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search academic year..."
              aria-label="Search academic years"
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-10
                text-sm
                font-medium
                text-slate-900
                placeholder:text-slate-400
                outline-none
                transition-all
                duration-150
                hover:border-slate-300
                hover:bg-white
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            />

            {/* Clear Search */}

            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                title="Clear search"
                className="
                  absolute
                  right-2
                  top-1/2
                  flex
                  h-6
                  w-6
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                "
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Showing Count - Desktop */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              rounded-lg
              bg-slate-50
              px-2.5
              py-2
              text-xs
              sm:flex
            "
          >
            <span className="text-slate-400">Showing</span>

            <span className="font-semibold text-slate-700">
              {total.toLocaleString()}
            </span>

            <span className="text-slate-400">
              {total === 1 ? "academic year" : "academic years"}
            </span>
          </div>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex flex-wrap items-center gap-2">
          {/* Showing Count - Mobile */}

          <div
            className="
              mr-auto
              flex
              items-center
              gap-1.5
              rounded-lg
              bg-slate-50
              px-2.5
              py-2
              text-xs
              text-slate-500
              sm:hidden
            "
          >
            <span>Showing</span>

            <span className="font-semibold text-slate-700">
              {total.toLocaleString()}
            </span>

            <span>{total === 1 ? "academic year" : "academic years"}</span>
          </div>

          {/* Refresh */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            aria-label="Refresh academic years"
            title="Refresh academic years"
            className="
              h-10
              w-10
              shrink-0
              rounded-xl
              border-slate-200
              bg-white
              p-0
              text-slate-500
              shadow-none
              transition-all
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Export */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExport}
            className="
              h-10
              shrink-0
              gap-2
              rounded-xl
              border-slate-200
              bg-white
              px-3
              font-medium
              text-slate-700
              shadow-none
              transition-all
              hover:border-emerald-200
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >
            <Download className="h-4 w-4 text-emerald-500" />

            <span className="hidden sm:inline">Export</span>
          </Button>

          {/* Create */}

          <Button
            type="button"
            onClick={onCreate}
            size="sm"
            className="
              h-10
              shrink-0
              gap-2
              rounded-xl
              bg-slate-900
              px-4
              font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-slate-800
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">Create</span>

            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
