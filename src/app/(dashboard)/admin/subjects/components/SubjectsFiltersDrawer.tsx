"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";
import { SlidersHorizontal, UserCheck } from "lucide-react";

interface TeacherOption {
  value: string;
  label: string;
}

interface SubjectsFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  teacherFilter: string;
  onTeacherFilterChange: (value: string) => void;

  teacherOptions: TeacherOption[];
}

export default function SubjectsFiltersDrawer({
  open,
  onOpenChange,
  teacherFilter,
  onTeacherFilterChange,
  teacherOptions,
}: SubjectsFiltersDrawerProps) {
  const reset = () => {
    onTeacherFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Subject Filters"
      description="Narrow down the subject list using the filters below."
      icon={<SlidersHorizontal className="h-4 w-4" />}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={reset}
          >
            Reset
          </Button>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Apply Filters
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <UserCheck className="h-4 w-4 text-violet-500" />

            <span>Teacher</span>
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

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">
              Tip:
            </span>{" "}
            Use the teacher filter to quickly find subjects assigned
            to a specific teacher.
          </p>
        </div>
      </div>
    </Drawer>
  );
}