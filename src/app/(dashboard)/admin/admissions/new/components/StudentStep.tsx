"use client";

import {
  CalendarDays,
  Calculator,
  Droplets,
  User,
  Users,
} from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { StudentRegistrationFormValues } from "@/lib/formValidationSchemas";

import {
  FormSection,
  FormInput,
  FormSelect,
  FormDatePicker,
  FormImageUpload,
} from "@/components/ui/form";

const genderOptions = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
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

function calculateAge(date?: Date | string) {
  if (!date) return "";

  const birthDate =
    date instanceof Date ? date : new Date(date);

  if (isNaN(birthDate.getTime())) return "";

  const today = new Date();

  let years =
    today.getFullYear() - birthDate.getFullYear();

  let months =
    today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} Years ${months} Months`;
}

export default function StudentStep() {
  const { control, watch } =
    useFormContext<StudentRegistrationFormValues>();

  const birthday = useWatch({
    control,
    name: "student.birthday",
  });

  const studentImage = watch("student.img");

  return (
    <FormSection
      title="Basic Information"
      description="Enter the student's personal details."
    >
      <FormInput
        control={control}
        name="student.name"
        label="First Name"
        required
        placeholder="Enter first name"
        icon={<User className="h-4 w-4" />}
      />

      <FormInput
        control={control}
        name="student.surname"
        label="Last Name"
        required
        placeholder="Enter last name"
        icon={<User className="h-4 w-4" />}
      />

      <FormSelect
        control={control}
        name="student.sex"
        label="Gender"
        required
        options={genderOptions}
        placeholder="Select gender"
        icon={<Users className="h-4 w-4" />}
      />

      <FormSelect
        control={control}
        name="student.bloodType"
        label="Blood Group"
        required
        options={bloodGroupOptions}
        placeholder="Select blood group"
        icon={<Droplets className="h-4 w-4" />}
      />

      <FormDatePicker
        control={control}
        name="student.birthday"
        label="Date of Birth"
        required
        icon={<CalendarDays className="h-4 w-4" />}
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Age
        </label>

        <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-600">
          <Calculator className="h-4 w-4 text-slate-500" />

          <span>
            {calculateAge(birthday) || "Select date of birth"}
          </span>
        </div>
      </div>

      <div className="md:col-span-2">
        <FormImageUpload
          control={control}
          name="student.img"
          label="Student Photo"
          description={
            studentImage
              ? ""
              : "Upload a recent passport-size photograph."
          }
        />
      </div>
    </FormSection>
  );
}