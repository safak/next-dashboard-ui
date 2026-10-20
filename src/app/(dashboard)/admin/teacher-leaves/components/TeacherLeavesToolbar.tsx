"use client";

import { useState } from "react";

import {
  ArrowUpDown,
  Check,
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

import TeacherLeavesFiltersDrawer from "./TeacherLeavesFiltersDrawer";

interface TeacherLeavesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  sortBy: string;
  onSortChange: (value: string) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;

  leaveTypeFilter: string;
  onLeaveTypeFilterChange: (value: string) => void;

  durationFilter: string;
  onDurationFilterChange: (value: string) => void;

  total: number;

  onRefresh: () => void;

  activeFilterCount?: number;
}

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  {
    value: "date-desc",
    label: "Leave Date — Newest",
  },
  {
    value: "date-asc",
    label: "Leave Date — Oldest",
  },
  {
    value: "teacher-asc",
    label: "Teacher A–Z",
  },
  {
    value: "teacher-desc",
    label: "Teacher Z–A",
  },
  {
    value: "leaveType-asc",
    label: "Leave Type A–Z",
  },
  {
    value: "leaveType-desc",
    label: "Leave Type Z–A",
  },
  {
    value: "status-asc",
    label: "Status A–Z",
  },
  {
    value: "status-desc",
    label: "Status Z–A",
  },
];

export default function TeacherLeavesToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  leaveTypeFilter,
  onLeaveTypeFilterChange,
  durationFilter,
  onDurationFilterChange,
  total,
  onRefresh,
  activeFilterCount = 0,
}: TeacherLeavesToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getSortLabel = () => {
    switch (sortBy) {
      case "date-desc":
        return "Date — Newest";

      case "date-asc":
        return "Date — Oldest";

      case "teacher-asc":
        return "Teacher A–Z";

      case "teacher-desc":
        return "Teacher Z–A";

      case "leaveType-asc":
        return "Leave Type A–Z";

      case "leaveType-desc":
        return "Leave Type Z–A";

      case "status-asc":
        return "Status A–Z";

      case "status-desc":
        return "Status Z–A";

      default:
        return "Sort";
    }
  };

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
          <div className="flex min-w-0 flex-1 items-center gap-3">
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
                placeholder="Search teacher, leave type or status..."
                aria-label="Search teacher leave requests"
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
                {total === 1 ? "leave request" : "leave requests"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

              <span>{total === 1 ? "leave request" : "leave requests"}</span>
            </div>

            {/* Refresh */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              aria-label="Refresh teacher leave requests"
              title="Refresh teacher leave requests"
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

            {/* Sort */}
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
                <div className="px-2.5 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sort Leave Requests
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Choose how leave requests are ordered
                  </p>
                </div>

                <DropdownMenuSeparator className="my-1" />

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

            {/* Filters */}
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
                  h-4
                  w-4
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
          </div>
        </div>
      </div>

      <TeacherLeavesFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        leaveTypeFilter={leaveTypeFilter}
        onLeaveTypeFilterChange={onLeaveTypeFilterChange}
        durationFilter={durationFilter}
        onDurationFilterChange={onDurationFilterChange}
      />
    </>
  );
}
