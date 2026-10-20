"use client";

import { Control } from "react-hook-form";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormDatePicker from "@/components/ui/form/FormDatePicker";

import type { Student } from "@/types/student";

import FormImageUpload from "@/components/ui/form/FormImageUpload";

interface PersonalSectionProps {
  control: Control<Student>;
}

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export default function PersonalSection({ control }: PersonalSectionProps) {
  return (
    <div className="space-y-6">
      {/* Photo */}
      <FormImageUpload
        control={control}
        name="image"
        label="Student Photo"
        description="Upload a student profile picture"
      />

      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Update the student&apos;s basic information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          control={control}
          name="fullName"
          label="Full Name"
          placeholder="Enter full name"
          required
        />

        <FormSelect
          control={control}
          name="gender"
          label="Gender"
          placeholder="Select Gender"
          options={genderOptions}
          required
        />

        <FormSelect
          control={control}
          name="bloodType"
          label="Blood Group"
          placeholder="Select Blood Group"
          options={bloodGroupOptions}
        />

        <FormDatePicker
          control={control}
          name="birthday"
          label="Date of Birth"
        />
      </div>
    </div>
  );
}
