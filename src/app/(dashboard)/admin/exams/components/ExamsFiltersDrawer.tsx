"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import {
  BookOpen,
  GraduationCap,
  SlidersHorizontal,
} from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface ExamsFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;

  classOptions?: FilterOption[];
  subjectOptions?: FilterOption[];
}

export default function ExamsFiltersDrawer({
  open,
  onOpenChange,

  classFilter,
  onClassFilterChange,

  subjectFilter,
  onSubjectFilterChange,

  statusFilter,
  onStatusFilterChange,

  classOptions = [],
  subjectOptions = [],
}: ExamsFiltersDrawerProps) {
  const reset = () => {
    onClassFilterChange("all");
    onSubjectFilterChange("all");
    onStatusFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Exam Filters"
      description="Narrow down the exam list using the filters below."
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
            <GraduationCap className="h-4 w-4 text-violet-500" />

            <span>Class</span>
          </label>

          <RadixSelect
            value={classFilter}
            onChange={onClassFilterChange}
            placeholder="All Classes"
            options={[
              {
                value: "all",
                label: "All Classes",
              },
              ...classOptions,
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <BookOpen className="h-4 w-4 text-blue-500" />

            <span>Subject</span>
          </label>

          <RadixSelect
            value={subjectFilter}
            onChange={onSubjectFilterChange}
            placeholder="All Subjects"
            options={[
              {
                value: "all",
                label: "All Subjects",
              },
              ...subjectOptions,
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />

            <span>Status</span>
          </label>

          <RadixSelect
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="All Statuses"
            options={[
              {
                value: "all",
                label: "All Statuses",
              },
              {
                value: "upcoming",
                label: "Upcoming",
              },
              {
                value: "ongoing",
                label: "Ongoing",
              },
              {
                value: "completed",
                label: "Completed",
              },
            ]}
          />
        </div>

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">
              Tip:
            </span>{" "}
            Combine multiple filters to quickly find the exams you
            need.
          </p>
        </div>
      </div>
    </Drawer>
  );
}