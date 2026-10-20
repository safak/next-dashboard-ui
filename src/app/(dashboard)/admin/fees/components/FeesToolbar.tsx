"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronDown,
  Filter,
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

import FeeFiltersDrawer from "./FeeFiltersDrawer";

interface FilterOption {
  value: string;
  label: string;
}

interface FeesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  sortBy: string;
  onSortChange: (value: string) => void;

  total: number;

  onCreate: () => void;

  onRefresh?: () => void;

  activeFilterCount?: number;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  academicYearFilter: string;
  onAcademicYearFilterChange: (value: string) => void;

  studentFilter: string;
  onStudentFilterChange: (value: string) => void;

  installmentFilter: string;
  onInstallmentFilterChange: (value: string) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;

  feeStructureFilter: string;
  onFeeStructureFilterChange: (value: string) => void;

  classOptions: FilterOption[];
  academicYearOptions: FilterOption[];
  studentOptions: FilterOption[];
  feeStructureOptions: FilterOption[];
}

export default function FeesToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  total,
  onCreate,
  onRefresh,
  activeFilterCount = 0,

  classFilter,
  onClassFilterChange,

  academicYearFilter,
  onAcademicYearFilterChange,

  studentFilter,
  onStudentFilterChange,

  installmentFilter,
  onInstallmentFilterChange,

  statusFilter,
  onStatusFilterChange,

  feeStructureFilter,
  onFeeStructureFilterChange,

  classOptions,
  academicYearOptions,
  studentOptions,
  feeStructureOptions,
}: FeesToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getSortLabel = () => {
    switch (sortBy) {
      case "due-date":
        return "Due Date";

      case "due-date-latest":
        return "Latest Due Date";

      case "student-asc":
        return "Student A–Z";

      case "student-desc":
        return "Student Z–A";

      case "installment":
        return "Installment";

      case "amount-high":
        return "Highest Amount";

      case "amount-low":
        return "Lowest Amount";

      case "balance-high":
        return "Highest Balance";

      case "balance-low":
        return "Lowest Balance";

      case "paid-high":
        return "Highest Paid";

      case "status":
        return "Status";

      case "newest":
        return "Newest";

      case "oldest":
        return "Oldest";

      default:
        return "Sort";
    }
  };

  const sortOptions = [
    {
      value: "due-date",
      label: "Due Date",
      icon: CalendarDays,
    },
    {
      value: "due-date-latest",
      label: "Latest Due Date",
      icon: CalendarDays,
    },
    {
      value: "student-asc",
      label: "Student A–Z",
    },
    {
      value: "student-desc",
      label: "Student Z–A",
    },
    {
      value: "installment",
      label: "Installment",
    },
    {
      value: "amount-high",
      label: "Highest Amount",
    },
    {
      value: "amount-low",
      label: "Lowest Amount",
    },
    {
      value: "balance-high",
      label: "Highest Balance",
    },
    {
      value: "balance-low",
      label: "Lowest Balance",
    },
    {
      value: "paid-high",
      label: "Highest Paid",
    },
    {
      value: "status",
      label: "Status",
    },
    {
      value: "newest",
      label: "Newest First",
    },
    {
      value: "oldest",
      label: "Oldest First",
    },
  ];

  return (
    <>
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
          {/* SEARCH + RESULT COUNT */}

          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* SEARCH */}

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
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search students, classes or installments..."
                aria-label="Search fee installments"
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

            {/* DESKTOP RESULT COUNT */}

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
                {total === 1 ? "installment" : "installments"}
              </span>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap items-center gap-2">
            {/* MOBILE RESULT COUNT */}

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

              <span>{total === 1 ? "installment" : "installments"}</span>
            </div>

            {/* REFRESH */}

            {onRefresh && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRefresh}
                aria-label="Refresh fees"
                title="Refresh fees"
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
            )}

            {/* SORT */}

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

                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
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
                    Sort Fee Installments
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Choose how installments are ordered
                  </p>
                </div>

                <DropdownMenuSeparator className="my-1" />

                <div
                  className="
                    max-h-[240px]
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

                    const Icon = option.icon;

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
                        {Icon && (
                          <Icon
                            className={`
                              mr-2
                              h-4
                              w-4
                              ${isActive ? "text-violet-500" : "text-slate-500"}
                            `}
                          />
                        )}

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

            {/* FILTERS */}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
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

            {/* ASSIGN FEE PLAN */}

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

              <span className="hidden sm:inline">Assign Fee Plan</span>

              <span className="sm:hidden">Assign</span>
            </Button>
          </div>
        </div>
      </div>

      <FeeFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        classFilter={classFilter}
        onClassFilterChange={onClassFilterChange}
        academicYearFilter={academicYearFilter}
        onAcademicYearFilterChange={onAcademicYearFilterChange}
        studentFilter={studentFilter}
        onStudentFilterChange={onStudentFilterChange}
        installmentFilter={installmentFilter}
        onInstallmentFilterChange={onInstallmentFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        feeStructureFilter={feeStructureFilter}
        onFeeStructureFilterChange={onFeeStructureFilterChange}
        classOptions={classOptions}
        academicYearOptions={academicYearOptions}
        studentOptions={studentOptions}
        feeStructureOptions={feeStructureOptions}
      />
    </>
  );
}
