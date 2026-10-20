"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import { CalendarDays, SlidersHorizontal } from "lucide-react";

interface DayOption {
  value: string;
  label: string;
}

interface LessonsFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  dayFilter: string;
  onDayFilterChange: (value: string) => void;

  days: DayOption[];
}

export default function LessonsFiltersDrawer({
  open,
  onOpenChange,
  dayFilter,
  onDayFilterChange,
  days,
}: LessonsFiltersDrawerProps) {
  const handleReset = () => {
    onDayFilterChange("ALL");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Lesson Filters"
      description="Narrow down the lesson list using the filters below."
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
        {/* DAY */}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />

            <label className="text-sm font-semibold text-slate-700">Day</label>
          </div>

          <RadixSelect
            value={dayFilter}
            onChange={onDayFilterChange}
            options={days}
            placeholder="Select day"
          />
        </div>

        {/* TIP */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-700">Filter tip</p>

          <p className="mt-1 text-xs leading-5 text-blue-600">
            Use the day filter to quickly view lessons scheduled for a specific
            day.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
