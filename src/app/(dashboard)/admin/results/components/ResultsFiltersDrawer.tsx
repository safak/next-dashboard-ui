"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  SlidersHorizontal,
} from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface ResultsFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  examFilter: string;
  onExamFilterChange: (value: string) => void;

  assignmentFilter: string;
  onAssignmentFilterChange: (value: string) => void;

  typeFilter: string;
  onTypeFilterChange: (value: string) => void;

  classOptions?: FilterOption[];
  examOptions?: FilterOption[];
  assignmentOptions?: FilterOption[];
}

export default function ResultsFiltersDrawer({
  open,
  onOpenChange,
  classFilter,
  onClassFilterChange,
  examFilter,
  onExamFilterChange,
  assignmentFilter,
  onAssignmentFilterChange,
  typeFilter,
  onTypeFilterChange,
  classOptions = [],
  examOptions = [],
  assignmentOptions = [],
}: ResultsFiltersDrawerProps) {
  const reset = () => {
    onClassFilterChange("all");
    onExamFilterChange("all");
    onAssignmentFilterChange("all");
    onTypeFilterChange("all");
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Result Filters"
      description="Narrow down the result list using the filters below."
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
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <GraduationCap className="h-4 w-4 text-violet-500" />
            Class
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
            <ClipboardList className="h-4 w-4 text-blue-500" />
            Exam
          </label>

          <RadixSelect
            value={examFilter}
            onChange={onExamFilterChange}
            placeholder="All Exams"
            options={[
              {
                value: "all",
                label: "All Exams",
              },
              ...examOptions,
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <BookOpen className="h-4 w-4 text-green-500" />
            Assignment
          </label>

          <RadixSelect
            value={assignmentFilter}
            onChange={onAssignmentFilterChange}
            placeholder="All Assignments"
            options={[
              {
                value: "all",
                label: "All Assignments",
              },
              ...assignmentOptions,
            ]}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />
            Result Type
          </label>

          <RadixSelect
            value={typeFilter}
            onChange={onTypeFilterChange}
            placeholder="All Result Types"
            options={[
              {
                value: "all",
                label: "All Result Types",
              },
              {
                value: "exam",
                label: "Exam Results",
              },
              {
                value: "assignment",
                label: "Assignment Results",
              },
            ]}
          />
        </div>
      </div>
    </Drawer>
  );
}
