"use client";

import { Control } from "react-hook-form";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormDatePicker from "@/components/ui/form/FormDatePicker";

import type { Student } from "@/types/student";

interface AcademicSectionProps {
  control: Control<Student>;
}

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Graduated", value: "GRADUATED" },
  { label: "Transferred", value: "TRANSFERRED" },
];

export default function AcademicSection({
  control,
}: AcademicSectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Academic Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Update the student&apos;s academic details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          control={control}
          name="admissionNo"
          label="Admission Number"
          placeholder="Enter admission number"
          required
        />

        <FormInput
          control={control}
          name="rollNo"
          label="Roll Number"
          placeholder="Enter roll number"
          required
        />

        <FormInput
          control={control}
          name="className"
          label="Class"
          placeholder="Enter class"
          required
        />

        <FormInput
          control={control}
          name="academicYear"
          label="Academic Year"
          placeholder="2026-2027"
          required
        />

        <FormDatePicker
          control={control}
          name="admissionDate"
          label="Admission Date"
        />

        <FormSelect
          control={control}
          name="status"
          label="Status"
          options={statusOptions}
          placeholder="Select Status"
          required
        />
      </div>
    </div>
  );
}