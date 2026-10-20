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

import TeacherAttendanceFiltersDrawer from "./TeacherAttendanceFiltersDrawer";

export type AttendanceFilter = "all" | "marked" | "pending";

export type AttendanceSortOption =
  | "name-asc"
  | "name-desc"
  | "status"
  | "marked-first"
  | "pending-first";

interface TeacherAttendanceToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  sortBy: AttendanceSortOption;
  onSortChange: (value: AttendanceSortOption) => void;

  attendanceFilter: AttendanceFilter;
  onAttendanceFilterChange: (value: AttendanceFilter) => void;

  total: number;

  onRefresh: () => void;

  activeFilterCount?: number;
}

const sortOptions: {
  value: AttendanceSortOption;
  label: string;
}[] = [
  {
    value: "name-asc",
    label: "Name (A–Z)",
  },
  {
    value: "name-desc",
    label: "Name (Z–A)",
  },
  {
    value: "status",
    label: "Attendance Status",
  },
  {
    value: "marked-first",
    label: "Marked First",
  },
  {
    value: "pending-first",
    label: "Pending First",
  },
];

export default function TeacherAttendanceToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  attendanceFilter,
  onAttendanceFilterChange,
  total,
  onRefresh,
  activeFilterCount = 0,
}: TeacherAttendanceToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedSort =
    sortOptions.find((option) => option.value === sortBy)?.label ??
    "Name (A–Z)";

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1 xl:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search teacher..."
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-9
                  pr-9
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-indigo-300
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-100
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
                    h-7
                    w-7
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-600
                  "
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">{total}</span>{" "}
              {total === 1 ? "teacher" : "teachers"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRefresh}
              className="h-10 w-10 rounded-xl border-slate-200"
              aria-label="Refresh teacher attendance"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl border-slate-200 px-3"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4 text-slate-500" />

                  <span className="hidden sm:inline">{selectedSort}</span>

                  <span className="sm:hidden">Sort</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[190px] rounded-xl">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className="flex items-center justify-between"
                  >
                    <span>{option.label}</span>

                    {sortBy === option.value && (
                      <Check className="h-4 w-4 text-indigo-600" />
                    )}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onSortChange("name-asc")}>
                  Reset Sort
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              variant="outline"
              onClick={() => setFiltersOpen(true)}
              className="
                relative
                h-10
                rounded-xl
                border-slate-200
                px-3
              "
            >
              <SlidersHorizontal className="mr-2 h-4 w-4 text-slate-500" />

              <span>Filters</span>

              {activeFilterCount > 0 && (
                <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <TeacherAttendanceFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        attendanceFilter={attendanceFilter}
        onAttendanceFilterChange={onAttendanceFilterChange}
      />
    </>
  );
}
