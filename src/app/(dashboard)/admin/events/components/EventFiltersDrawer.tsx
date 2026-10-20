"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import { CalendarDays, SlidersHorizontal } from "lucide-react";

import type { ClassOption } from "../types";

interface EventFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;

  classes: ClassOption[];
}

export default function EventFiltersDrawer({
  open,
  onOpenChange,
  classFilter,
  onClassFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  classes,
}: EventFiltersDrawerProps) {
  const categoryOptions = [
    {
      value: "all",
      label: "All Categories",
    },
    {
      value: "Academic",
      label: "Academic",
    },
    {
      value: "Cultural",
      label: "Cultural",
    },
    {
      value: "Sports",
      label: "Sports",
    },
    {
      value: "Holiday",
      label: "Holiday",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];

  const classOptions = [
    {
      value: "all",
      label: "All Classes",
    },
    ...classes.map((item) => ({
      value: String(item.id),
      label: item.name,
    })),
  ];

  const handleReset = () => {
    onClassFilterChange("all");
    onCategoryFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Event Filters"
      description="Narrow down the event list using the filters below."
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
        {/* CLASS */}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />

            <label className="text-sm font-semibold text-slate-700">
              Class
            </label>
          </div>

          <RadixSelect
            value={classFilter}
            onChange={onClassFilterChange}
            options={classOptions}
            placeholder="Select class"
          />
        </div>

        {/* CATEGORY */}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-500" />

            <label className="text-sm font-semibold text-slate-700">
              Category
            </label>
          </div>

          <RadixSelect
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            options={categoryOptions}
            placeholder="Select category"
          />
        </div>

        {/* TIP */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-700">Filter tip</p>

          <p className="mt-1 text-xs leading-5 text-blue-600">
            Use the class and category filters to quickly find events for a
            specific class or type of school activity.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
