"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import {
  BookOpen,
  GraduationCap,
  SlidersHorizontal,
  Users,
} from "lucide-react";

interface SubjectOption {
  value: string;
  label: string;
}

interface TeacherFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;

  classFilter: string;
  onClassFilterChange: (value: string) => void;

  lessonFilter: string;
  onLessonFilterChange: (value: string) => void;

  subjectOptions: SubjectOption[];
}

export default function TeacherFiltersDrawer({
  open,
  onOpenChange,

  subjectFilter,
  onSubjectFilterChange,

  classFilter,
  onClassFilterChange,

  lessonFilter,
  onLessonFilterChange,

  subjectOptions,
}: TeacherFiltersDrawerProps) {
  // Reset Filters

  const reset = () => {
    onSubjectFilterChange("all");
    onClassFilterChange("all");
    onLessonFilterChange("all");
  };

  // Render

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Teacher Filters"
      description="Narrow down the teacher list using the filters below."
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
        {/* Subject */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <BookOpen className="h-4 w-4 text-violet-500" />

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

              {
                value: "has-subjects",
                label: "Has Subjects",
              },

              {
                value: "no-subjects",
                label: "No Subjects",
              },

              ...subjectOptions,
            ]}
          />
        </div>

        {/* Classes */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users className="h-4 w-4 text-blue-500" />

            <span>Classes</span>
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

              {
                value: "has-classes",
                label: "Supervising Classes",
              },

              {
                value: "no-classes",
                label: "No Classes",
              },
            ]}
          />
        </div>

        {/* Lessons */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <GraduationCap className="h-4 w-4 text-emerald-500" />

            <span>Lessons</span>
          </label>

          <RadixSelect
            value={lessonFilter}
            onChange={onLessonFilterChange}
            placeholder="All Lessons"
            options={[
              {
                value: "all",
                label: "All Lessons",
              },

              {
                value: "has-lessons",
                label: "Has Lessons",
              },

              {
                value: "no-lessons",
                label: "No Lessons",
              },
            ]}
          />
        </div>

        {/* Information */}

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Combine
            multiple filters to quickly find teachers based on their subjects,
            classes, and lessons.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
