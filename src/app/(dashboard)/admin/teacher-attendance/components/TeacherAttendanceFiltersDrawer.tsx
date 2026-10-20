"use client";

import { ClipboardCheck, SlidersHorizontal } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import type { AttendanceFilter } from "./TeacherAttendanceToolbar";

interface TeacherAttendanceFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  attendanceFilter: AttendanceFilter;
  onAttendanceFilterChange: (value: AttendanceFilter) => void;
}

const attendanceOptions = [
  {
    value: "all",
    label: "All Teachers",
  },
  {
    value: "marked",
    label: "Marked",
  },
  {
    value: "pending",
    label: "Pending",
  },
];

export default function TeacherAttendanceFiltersDrawer({
  open,
  onOpenChange,
  attendanceFilter,
  onAttendanceFilterChange,
}: TeacherAttendanceFiltersDrawerProps) {
  const handleReset = () => {
    onAttendanceFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Attendance Filters"
      description="Narrow down today's teacher attendance records."
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
            <ClipboardCheck className="h-4 w-4 text-indigo-500" />

            <label className="text-sm font-semibold text-slate-700">
              Attendance
            </label>
          </div>

          <RadixSelect
            value={attendanceFilter}
            onChange={(value) =>
              onAttendanceFilterChange(value as AttendanceFilter)
            }
            options={attendanceOptions}
            placeholder="Select attendance status"
          />
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
          <p className="text-xs font-semibold text-indigo-700">Filter tip</p>

          <p className="mt-1 text-xs leading-5 text-indigo-600">
            Use the attendance filter to quickly view teachers whose attendance
            is marked or still pending.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
