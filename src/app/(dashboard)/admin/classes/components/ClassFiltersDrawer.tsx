"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";
import { SlidersHorizontal, UserCheck, Users } from "lucide-react";

interface TeacherOption {
  value: string;
  label: string;
}

interface ClassFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  teacherFilter: string;
  onTeacherFilterChange: (value: string) => void;

  studentFilter: string;
  onStudentFilterChange: (value: string) => void;

  capacityFilter: string;
  onCapacityFilterChange: (value: string) => void;

  teacherOptions: TeacherOption[];
}

export default function ClassFiltersDrawer({
  open,
  onOpenChange,

  teacherFilter,
  onTeacherFilterChange,

  studentFilter,
  onStudentFilterChange,

  capacityFilter,
  onCapacityFilterChange,

  teacherOptions,
}: ClassFiltersDrawerProps) {
  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const reset = () => {
    onTeacherFilterChange("all");
    onStudentFilterChange("all");
    onCapacityFilterChange("all");
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Class Filters"
      description="Narrow down the class list using the filters below."
      icon={<SlidersHorizontal className="h-4 w-4" />}
      footer={
        <>
          <Button type="button" variant="outline" onClick={reset}>
            Reset
          </Button>

          <Button type="button" onClick={() => onOpenChange(false)}>
            Apply Filters
          </Button>
        </>
      }
    >
      <div className="space-y-6">

        {/* --------------------------------------------------
            Class Teacher
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <UserCheck className="h-4 w-4 text-violet-500" />

            <span>Class Teacher</span>
          </label>

          <RadixSelect
            value={teacherFilter}
            onChange={onTeacherFilterChange}
            placeholder="All Teachers"
            options={[
              {
                value: "all",
                label: "All Teachers",
              },
              ...teacherOptions,
            ]}
          />
        </div>

        {/* --------------------------------------------------
            Students
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users className="h-4 w-4 text-blue-500" />

            <span>Students</span>
          </label>

          <RadixSelect
            value={studentFilter}
            onChange={onStudentFilterChange}
            placeholder="All Students"
            options={[
              {
                value: "all",
                label: "All Students",
              },
              {
                value: "empty",
                label: "No Students",
              },
              {
                value: "has-students",
                label: "Has Students",
              },
              {
                value: "full",
                label: "At Capacity",
              },
            ]}
          />
        </div>

        {/* --------------------------------------------------
            Capacity
        -------------------------------------------------- */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />

            <span>Capacity</span>
          </label>

          <RadixSelect
            value={capacityFilter}
            onChange={onCapacityFilterChange}
            placeholder="Any Capacity"
            options={[
              {
                value: "all",
                label: "Any Capacity",
              },
              {
                value: "small",
                label: "Up to 15 Seats",
              },
              {
                value: "medium",
                label: "16–25 Seats",
              },
              {
                value: "large",
                label: "26+ Seats",
              },
            ]}
          />
        </div>

        {/* --------------------------------------------------
            Information
        -------------------------------------------------- */}

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Combine
            multiple filters to quickly find the classes you need.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
