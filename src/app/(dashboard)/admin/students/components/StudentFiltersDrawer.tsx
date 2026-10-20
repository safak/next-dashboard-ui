"use client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";
import { SlidersHorizontal } from "lucide-react";

import { BLOOD_GROUP_OPTIONS, GENDER_OPTIONS } from "@/constants/student";

interface StudentFilters {
  className: string;
  academicYear: string;
  gender: string;
  bloodType: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  filters: StudentFilters;

  onFiltersChange: (filters: StudentFilters) => void;

  classes: string[];
  academicYears: string[];
}

export default function StudentFiltersDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  classes,
  academicYears,
}: Props) {
  // --------------------------------------------------
  // Update Filter
  // --------------------------------------------------

  const update = (key: keyof StudentFilters, value?: string) => {
    onFiltersChange({
      ...filters,
      [key]: value ?? "all",
    });
  };

  // --------------------------------------------------
  // Reset Filters
  // --------------------------------------------------

  const reset = () => {
    onFiltersChange({
      className: "all",
      academicYear: "all",
      gender: "all",
      bloodType: "all",
    });
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="sm"
      title="Student Filters"
      description="Narrow down the student list using the filters below."
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
      <div className="space-y-4">
        {/* Class */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Class
          </label>

          <RadixSelect
            value={filters.className}
            onChange={(value) => update("className", value)}
            placeholder="All Classes"
            options={[
              { value: "all", label: "All Classes" },
              ...classes.map((className) => ({
                value: className,
                label: className,
              })),
            ]}
          />
        </div>

        {/* Academic Year */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Academic Year
          </label>

          <RadixSelect
            value={filters.academicYear}
            onChange={(value) => update("academicYear", value)}
            placeholder="All Academic Years"
            options={[
              {
                value: "all",
                label: "All Academic Years",
              },
              ...academicYears.map((year) => ({
                value: year,
                label: year,
              })),
            ]}
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Gender
          </label>

          <RadixSelect
            value={filters.gender}
            onChange={(value) => update("gender", value)}
            placeholder="All Genders"
            options={GENDER_OPTIONS}
          />
        </div>

        {/* Blood Group */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Blood Group
          </label>

          <RadixSelect
            value={filters.bloodType}
            onChange={(value) => update("bloodType", value)}
            placeholder="All Blood Groups"
            options={BLOOD_GROUP_OPTIONS}
          />
        </div>

        {/* Tip */}
        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Combine
            multiple filters to quickly find the students you need.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
