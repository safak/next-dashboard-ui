"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import FormField from "./FormField";
import RadixDOBPicker from "@/components/ui/RadixDOBPicker";

type FormDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;

  label: string;
  required?: boolean;
  description?: string;

  className?: string;

  icon?: ReactNode;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "name"
>;

export default function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  className,
  icon,
  ...props
}: FormDatePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField
          label={label}
          required={required}
          description={description}
          error={fieldState.error?.message}
        >
          <RadixDOBPicker
            value={field.value as Date | undefined}
            onChange={(date) => field.onChange(date)}
            icon={icon}
          />
        </FormField>
      )}
    />
  );
}