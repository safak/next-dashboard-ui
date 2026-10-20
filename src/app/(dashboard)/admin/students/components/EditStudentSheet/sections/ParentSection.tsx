"use client";

import { Control } from "react-hook-form";

import FormInput from "@/components/ui/form/FormInput";
import FormTextarea from "@/components/ui/form/FormTextarea";

import type { Student } from "@/types/student";

interface ParentSectionProps {
  control: Control<Student>;
}

export default function ParentSection({
  control,
}: ParentSectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Parent Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Update the parent or guardian details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          control={control}
          name="parentName"
          label="Parent Name"
          placeholder="Enter parent name"
          required
        />

        <FormInput
          control={control}
          name="parentPhone"
          label="Phone Number"
          placeholder="Enter phone number"
          type="tel"
          required
        />

        <div className="md:col-span-2">
          <FormInput
            control={control}
            name="parentEmail"
            label="Email Address"
            placeholder="Enter email address"
            type="email"
          />
        </div>

        <div className="md:col-span-2 pb-6">
          <FormTextarea
            control={control}
            name="address"
            label="Residential Address"
            placeholder="Enter residential address"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}