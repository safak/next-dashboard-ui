"use client";

import { useFormContext } from "react-hook-form";

import { StudentRegistrationFormValues } from "@/lib/formValidationSchemas";

import {
  FormInput,
  FormSection,
  FormTextarea,
} from "@/components/ui/form";

export default function ParentStep() {
  const { control } =
    useFormContext<StudentRegistrationFormValues>();

  return (
    <div className="space-y-6">
      <FormSection
        title="Parent / Guardian Information"
        description="Enter the parent or guardian details."
      >
        <FormInput
          control={control}
          name="parent.name"
          label="First Name"
          required
          placeholder="Enter first name"
        />

        <FormInput
          control={control}
          name="parent.surname"
          label="Last Name"
          required
          placeholder="Enter last name"
        />

        <FormInput
          control={control}
          name="parent.username"
          label="Username"
          required
          placeholder="Enter username"
        />

        <FormInput
          control={control}
          name="parent.password"
          label="Password"
          required
          type="password"
          placeholder="Enter password"
        />

        <FormInput
          control={control}
          name="parent.phone"
          label="Mobile Number"
          required
          type="tel"
          placeholder="9876543210"
        />

        <FormInput
          control={control}
          name="parent.email"
          label="Email Address"
          type="email"
          placeholder="parent@example.com"
        />
      </FormSection>

      <FormSection
        title="Residential Address"
        description="Enter the parent's current residential address."
      >
        <div className="md:col-span-2">
          <FormTextarea
            control={control}
            name="parent.address"
            label="Address"
            required
            placeholder="Enter complete address"
            rows={4}
          />
        </div>
      </FormSection>
    </div>
  );
}