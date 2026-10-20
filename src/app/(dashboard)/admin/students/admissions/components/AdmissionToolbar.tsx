"use client";

import {
  ArrowUpDown,
  Download,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdmissionToolbarProps {
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

export default function AdmissionToolbar({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  total,
  onRefresh,
  onExport,
  onOpenFilters,
  activeFilterCount = 0,
}: AdmissionToolbarProps) {
  const getSortLabel = () => {
    switch (sortBy) {
      case "name-asc":
        return "Student Name (A–Z)";

      case "name-desc":
        return "Student Name (Z–A)";

      case "admission":
        return "Admission No";

      case "newest":
        return "Newest First";

      case "oldest":
        return "Oldest First";

      default:
        return "Sort";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-1 lg:flex-row lg:items-center">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student, admission no..."
              className="h-9 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 
              text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <span className="whitespace-nowrap text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {total}
            </span>{" "}
            {total === 1 ? "Admission" : "Admissions"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {getSortLabel()}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onSortChange("name-asc")}>
                Student Name (A–Z)
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onSortChange("name-desc")}>
                Student Name (Z–A)
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onSortChange("admission")}>
                Admission Number
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onSortChange("newest")}>
                Newest First
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onSortChange("oldest")}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={onOpenFilters}
            className="relative"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters

            {activeFilterCount > 0 && (
              <span className="ml-2 flex h-5 min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}