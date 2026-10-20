"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import { CalendarDays, SlidersHorizontal } from "lucide-react";

interface HolidayFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  typeFilter: "all" | "FULL" | "HALF";
  onTypeFilterChange: (value: "all" | "FULL" | "HALF") => void;

  dateFilter: "all" | "upcoming" | "past";
  onDateFilterChange: (value: "all" | "upcoming" | "past") => void;

  activeFilterCount?: number;
  onResetFilters: () => void;
}

export default function HolidayFiltersDrawer({
  open,
  onOpenChange,
  typeFilter,
  onTypeFilterChange,
  dateFilter,
  onDateFilterChange,
  activeFilterCount = 0,
  onResetFilters,
}: HolidayFiltersDrawerProps) {
  const handleReset = () => {
    onResetFilters();
  };

  const durationOptions = [
    { value: "all", label: "All Durations" },
    { value: "FULL", label: "Full Day" },
    { value: "HALF", label: "Half Day" },
  ];

  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
  ];

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={
        activeFilterCount > 0
          ? `Holiday Filters (${activeFilterCount} active)`
          : "Holiday Filters"
      }
      description="Narrow down the holiday list using the filters below."
      width="sm"
      icon={<SlidersHorizontal className="h-6 w-6" />}
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>

          <Button type="button" onClick={() => onOpenChange(false)}>
            Apply Filters
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />

            <label className="text-sm font-semibold text-slate-700">
              Holiday Duration
            </label>
          </div>

          <RadixSelect
            value={typeFilter}
            onChange={(value) =>
              onTypeFilterChange(value as "all" | "FULL" | "HALF")
            }
            options={durationOptions}
            placeholder="Select duration"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />

            <label className="text-sm font-semibold text-slate-700">Date</label>
          </div>

          <RadixSelect
            value={dateFilter}
            onChange={(value) =>
              onDateFilterChange(value as "all" | "upcoming" | "past")
            }
            options={dateOptions}
            placeholder="Select date"
          />
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-700">Filter tip</p>

          <p className="mt-1 text-xs leading-5 text-blue-600">
            Use the duration and date filters to quickly find specific holidays.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
