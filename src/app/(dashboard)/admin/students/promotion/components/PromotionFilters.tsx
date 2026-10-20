"use client";

import { Calendar, GraduationCap } from "lucide-react";

import SearchableSelect from "@/components/ui/searchable-select";

interface AcademicYear {
  id: number;
  label: string;
  isActive: boolean;
}

interface Class {
  id: number;
  name: string;
}

interface PromotionFiltersProps {
  academicYears?: AcademicYear[];
  classes?: Class[];

  currentAcademicYearId?: number;
  nextAcademicYearId?: number;
  classId?: number;

  onCurrentAcademicYearChange?: (id: number) => void;
  onNextAcademicYearChange?: (id: number) => void;
  onClassChange?: (id: number) => void;

  destinationClasses?: Class[];

  destinationClassId?: number;

  onDestinationClassChange?: (id: number) => void;
}

export default function PromotionFilters({
  academicYears = [],
  classes = [],
  currentAcademicYearId,
  nextAcademicYearId,
  classId,
  onCurrentAcademicYearChange,
  onNextAcademicYearChange,
  onClassChange,
  destinationClasses = [],

  destinationClassId,

  onDestinationClassChange,
}: PromotionFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Promotion Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select the academic year and class to preview eligible students.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Current Academic Year */}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Calendar className="h-4 w-4 text-sky-600" />
            Current Academic Year
          </label>

          <SearchableSelect
            value={currentAcademicYearId?.toString()}
            placeholder="Select Academic Year"
            searchPlaceholder="Search academic year..."
            emptyMessage="No academic years found."
            options={academicYears.map((year) => ({
              value: year.id.toString(),
              label: year.label,
            }))}
            onChange={(value) => onCurrentAcademicYearChange?.(Number(value))}
          />
        </div>

        {/* Next Academic Year */}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Next Academic Year
          </label>

          <SearchableSelect
            value={nextAcademicYearId?.toString()}
            placeholder="Select Academic Year"
            searchPlaceholder="Search academic year..."
            emptyMessage="No academic years found."
            options={academicYears.map((year) => ({
              value: year.id.toString(),
              label: year.isActive ? `${year.label} (Active)` : year.label,
            }))}
            onChange={(value) => onNextAcademicYearChange?.(Number(value))}
          />
        </div>

        {/* Current Class */}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <GraduationCap className="h-4 w-4 text-violet-600" />
            Current Class
          </label>

          <SearchableSelect
            value={classId?.toString()}
            placeholder="Select Class"
            searchPlaceholder="Search class..."
            emptyMessage="No classes found."
            options={classes.map((cls) => ({
              value: cls.id.toString(),
              label: cls.name,
            }))}
            onChange={(value) => onClassChange?.(Number(value))}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            Destination Class
          </label>

          <SearchableSelect
            value={destinationClassId?.toString()}
            placeholder="Select Class"
            searchPlaceholder="Search class..."
            emptyMessage="No classes found."
            options={destinationClasses.map((cls) => ({
              value: cls.id.toString(),
              label: cls.name,
            }))}
            onChange={(value) => onDestinationClassChange?.(Number(value))}
          />
        </div>
      </div>
    </div>
  );
}
