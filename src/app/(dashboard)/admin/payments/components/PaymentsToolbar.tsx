"use client";

import {
  ArrowUpDown,
  Check,
  Plus,
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

interface PaymentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  sortBy: string;
  onSortChange: (value: string) => void;

  total: number;

  activeFilterCount?: number;

  onCreate: () => void;
  onRefresh: () => void;
  onOpenFilters: () => void;
}

const sortOptions = [
  {
    value: "newest",
    label: "Payment Date — Newest",
  },
  {
    value: "oldest",
    label: "Payment Date — Oldest",
  },
  {
    value: "amount-high",
    label: "Amount — Highest",
  },
  {
    value: "amount-low",
    label: "Amount — Lowest",
  },
  {
    value: "student-asc",
    label: "Student A–Z",
  },
  {
    value: "student-desc",
    label: "Student Z–A",
  },
];

export default function PaymentsToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  total,
  activeFilterCount = 0,
  onCreate,
  onRefresh,
  onOpenFilters,
}: PaymentsToolbarProps) {
  const getSortLabel = () =>
    sortOptions.find((option) => option.value === sortBy)?.label ??
    "Payment Date — Newest";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 p-3 sm:p-3.5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative min-w-0 flex-1 xl:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search payments..."
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
                outline-none
                transition
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
                  hover:bg-slate-100
                  hover:text-slate-600
                "
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-50 px-2.5 py-2 text-xs sm:flex">
            <span className="text-slate-400">Showing</span>

            <span className="font-semibold text-slate-700">
              {total.toLocaleString()}
            </span>

            <span className="text-slate-400">
              {total === 1 ? "payment" : "payments"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            title="Refresh payments"
            className="h-10 w-10 rounded-xl border-slate-200 bg-white p-0 shadow-none"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="
                  h-10
                  gap-2
                  rounded-xl
                  border-slate-200
                  bg-white
                  px-3
                  font-medium
                  text-slate-700
                  shadow-none
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
              <div className="px-2.5 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Sort Payments
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Choose how payments are ordered
                </p>
              </div>

              <DropdownMenuSeparator />

              <div className="max-h-[160px] overflow-y-auto">
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
                          ${
                            isActive
                              ? "bg-violet-50 font-medium text-violet-700"
                              : "text-slate-700"
                          }
                        `}
                    >
                      <span className="flex-1">{option.label}</span>

                      {isActive && (
                        <Check className="h-4 w-4 text-violet-600" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenFilters}
            className={`
              relative
              h-10
              gap-2
              rounded-xl
              px-3
              font-medium
              shadow-none
              ${
                activeFilterCount > 0
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              }
            `}
          >
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />

            <span className="hidden md:inline">Filters</span>

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button
            type="button"
            onClick={onCreate}
            size="sm"
            className="
              h-10
              gap-2
              rounded-xl
              bg-slate-900
              px-4
              font-semibold
              text-white
              shadow-sm
              hover:bg-slate-800
            "
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">Collect Payment</span>

            <span className="sm:hidden">Collect</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
