"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import {
  CalendarDays,
  ClipboardCheck,
  Clock3,
  SlidersHorizontal,
} from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface TeacherLeavesFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;

  leaveTypeFilter: string;
  onLeaveTypeFilterChange: (value: string) => void;

  durationFilter: string;
  onDurationFilterChange: (value: string) => void;
}

const statuses: FilterOption[] = [
  {
    value: "ALL",
    label: "All Statuses",
  },
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

const leaveTypes: FilterOption[] = [
  {
    value: "ALL",
    label: "All Leave Types",
  },
  {
    value: "CASUAL",
    label: "Casual Leave",
  },
  {
    value: "SICK",
    label: "Sick Leave",
  },
  {
    value: "PERSONAL",
    label: "Personal Leave",
  },
  {
    value: "EMERGENCY",
    label: "Emergency Leave",
  },
];

const durations: FilterOption[] = [
  {
    value: "ALL",
    label: "All Durations",
  },
  {
    value: "FULL_DAY",
    label: "Full Day",
  },
  {
    value: "HALF_DAY",
    label: "Half Day",
  },
];

export default function TeacherLeavesFiltersDrawer({
  open,
  onOpenChange,
  statusFilter,
  onStatusFilterChange,
  leaveTypeFilter,
  onLeaveTypeFilterChange,
  durationFilter,
  onDurationFilterChange,
}: TeacherLeavesFiltersDrawerProps) {
  const handleReset = () => {
    onStatusFilterChange("ALL");
    onLeaveTypeFilterChange("ALL");
    onDurationFilterChange("ALL");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Teacher Leave Filters"
      description="Narrow down the teacher leave requests using the filters below."
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
        {/* STATUS */}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-emerald-500" />

            <label className="text-sm font-semibold text-slate-700">
              Status
            </label>
          </div>

          <RadixSelect
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statuses}
            placeholder="Select status"
          />
        </div>

        {/* LEAVE TYPE */}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />

            <label className="text-sm font-semibold text-slate-700">
              Leave Type
            </label>
          </div>

          <RadixSelect
            value={leaveTypeFilter}
            onChange={onLeaveTypeFilterChange}
            options={leaveTypes}
            placeholder="Select leave type"
          />
        </div>

        {/* DURATION */}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-violet-500" />

            <label className="text-sm font-semibold text-slate-700">
              Duration
            </label>
          </div>

          <RadixSelect
            value={durationFilter}
            onChange={onDurationFilterChange}
            options={durations}
            placeholder="Select duration"
          />
        </div>

        {/* TIP */}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-700">Filter tip</p>

          <p className="mt-1 text-xs leading-5 text-blue-600">
            Use the filters above to quickly view leave requests by status,
            leave type, or duration.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
