"use client";

import { useState } from "react";

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

import ParentFiltersDrawer from "./ParentFiltersDrawer";

interface ParentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  sortBy: string;
  onSortChange: (value: string) => void;

  total: number;

  onRefresh?: () => void;
  onCreate: () => void;

  activeFilterCount?: number;

  studentFilter: string;
  onStudentFilterChange: (value: string) => void;

  studentCountFilter: string;
  onStudentCountFilterChange: (value: string) => void;

  contactFilter: string;
  onContactFilterChange: (value: string) => void;
}

export default function ParentsToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  total,
  onRefresh,
  onCreate,
  activeFilterCount = 0,
  studentFilter,
  onStudentFilterChange,
  studentCountFilter,
  onStudentCountFilterChange,
  contactFilter,
  onContactFilterChange,
}: ParentsToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getSortLabel = () => {
    switch (sortBy) {
      case "name-asc":
        return "Name (A–Z)";
      case "name-desc":
        return "Name (Z–A)";
      case "students":
        return "Students";
      case "username":
        return "Username";
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
      value: "name-asc",
      label: "Parent Name (A–Z)",
    },
    {
      value: "name-desc",
      label: "Parent Name (Z–A)",
    },
    {
      value: "students",
      label: "Student Count",
    },
    {
      value: "username",
      label: "Username",
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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search parents..."
                aria-label="Search parents"
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
                {total === 1 ? "parent" : "parents"}
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

              <span>{total === 1 ? "parent" : "parents"}</span>
            </div>

            {onRefresh && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRefresh}
                aria-label="Refresh parents"
                title="Refresh parents"
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
                  rounded-xl
                  border-slate-200
                  bg-white
                  p-1.5
                  shadow-lg
                "
              >
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
                    Sort Parents
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Choose how parents are ordered
                  </p>
                </div>

                <DropdownMenuSeparator className="my-1" />

                <div className="max-h-64 overflow-y-auto">
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
                          outline-none
                          transition-colors
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

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
              aria-label="Open parent filters"
              title="Filter parents"
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

              <span className="hidden sm:inline">Create Parent</span>

              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>

      <ParentFiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        studentFilter={studentFilter}
        onStudentFilterChange={onStudentFilterChange}
        studentCountFilter={studentCountFilter}
        onStudentCountFilterChange={onStudentCountFilterChange}
        contactFilter={contactFilter}
        onContactFilterChange={onContactFilterChange}
      />
    </>
  );
}
