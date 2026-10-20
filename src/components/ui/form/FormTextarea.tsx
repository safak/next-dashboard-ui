"use client";

import { TextareaHTMLAttributes } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import FormField from "./FormField";
import { cn } from "@/lib/utils";

type FormTextareaProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;

  label: string;
  required?: boolean;
  description?: string;

  className?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name">;

export default function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  className,
  ...props
}: FormTextareaProps<T>) {
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
          <textarea
            {...props}
            {...field}
            value={field.value ?? ""}
            rows={4}
            className={cn(
              "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition resize-none",
              "focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100",
              "disabled:cursor-not-allowed disabled:bg-slate-100",
              fieldState.error &&
                "border-red-500 focus:border-red-500 focus:ring-red-100",
              className
            )}
          />
        </FormField>
      )}
    />
  );
}