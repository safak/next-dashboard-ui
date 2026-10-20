"use client";

import {
  ArrowUpDown,
  Check,
  Download,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  sortBy: string;
  onSortChange: (value: string) => void;

  total: number;

  onRefresh: () => void;
  onExport: () => void;

  onOpenFilters: () => void;

  activeFilterCount?: number;
}

export default function StudentToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  total,
  onRefresh,
  onExport,
  onOpenFilters,
  activeFilterCount = 0,
}: StudentToolbarProps) {
  // --------------------------------------------------
  // Sort Label
  // --------------------------------------------------

  const getSortLabel = () => {
    switch (sortBy) {
      case "name-asc":
        return "Name (A–Z)";

      case "name-desc":
        return "Name (Z–A)";

      case "class":
        return "Class";

      case "admission":
        return "Admission No";

      case "roll":
        return "Roll No";

      case "newest":
        return "Newest";

      case "oldest":
        return "Oldest";

      default:
        return "Sort";
    }
  };

  // --------------------------------------------------
  // Sort Options
  // --------------------------------------------------

  const sortOptions = [
    {
      value: "name-asc",
      label: "Name (A–Z)",
    },
    {
      value: "name-desc",
      label: "Name (Z–A)",
    },
    {
      value: "class",
      label: "Class",
    },
    {
      value: "admission",
      label: "Admission No",
    },
    {
      value: "roll",
      label: "Roll No",
    },
    {
      value: "newest",
      label: "Newest",
    },
    {
      value: "oldest",
      label: "Oldest",
    },
  ];

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
        {/* ==================================================
            SEARCH + RESULT COUNT
        ================================================== */}

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
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student name, admission no or roll no..."
              aria-label="Search students"
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

          {/* Desktop Result Count */}

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
              {total === 1 ? "student" : "students"}
            </span>
          </div>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Result Count */}

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

            <span>{total === 1 ? "student" : "students"}</span>
          </div>

          {/* ==================================================
              REFRESH
          ================================================== */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            aria-label="Refresh students"
            title="Refresh students"
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

          {/* ==================================================
              SORT
          ================================================== */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
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
                  hover:border-violet-200
                  hover:bg-violet-50
                  hover:text-violet-700
                "
              >
                <ArrowUpDown className="h-4 w-4 text-violet-500" />

                <span className="hidden md:inline">{getSortLabel()}</span>

                <span className="md:hidden">Sort</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={5}
              className="
                w-60
                overflow-hidden
                rounded-xl
                border-slate-200
                bg-white
                p-1.5
                shadow-lg
              "
            >
              {/* Dropdown Header */}

              <div className="px-2.5 py-2">
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Sort Students
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Choose how students are ordered
                </p>
              </div>

              <DropdownMenuSeparator className="my-1" />

              {/* ==================================================
                  SCROLLABLE SORT OPTIONS
              ================================================== */}

              <div
                className="
                  max-h-[120px]
                  overflow-y-auto
                  pr-0.5
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-slate-100
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-slate-300
                  hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
                "
              >
                {sortOptions.map((option) => {
                  const isActive = sortBy === option.value;

                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`
                        mb-0.5
                        cursor-pointer
                        rounded-lg
                        px-2.5
                        py-2
                        text-sm
                        transition-colors
                        focus:outline-none
                        ${
                          isActive
                            ? "bg-violet-50 font-medium text-violet-700"
                            : "text-slate-700"
                        }
                      `}
                    >
                      <span className="flex-1">{option.label}</span>

                      {isActive && (
                        <Check className="h-4 w-4 shrink-0 text-violet-600" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ==================================================
              FILTERS
          ================================================== */}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenFilters}
            className={`
              relative
              h-10
              shrink-0
              gap-2
              rounded-xl
              px-3
              font-medium
              shadow-none
              transition-all
              ${
                activeFilterCount > 0
                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              }
            `}
          >
            <SlidersHorizontal
              className={`
                h-4 w-4
                ${activeFilterCount > 0 ? "text-amber-600" : "text-amber-500"}
              `}
            />

            <span className="hidden md:inline">Filters</span>

            {activeFilterCount > 0 && (
              <span
                className="
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-amber-500
                  px-1.5
                  text-[10px]
                  font-bold
                  text-white
                "
              >
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* ==================================================
              EXPORT
          ================================================== */}

          <Button
            type="button"
            onClick={onExport}
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
            <Download className="h-4 w-4" />

            <span className="hidden sm:inline">Export</span>

            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
