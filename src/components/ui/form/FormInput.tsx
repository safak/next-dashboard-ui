"use client";

import { InputHTMLAttributes, ReactNode } from "react";

import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import FormField from "./FormField";
import { cn } from "@/lib/utils";

type FormInputProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = undefined,
> = {
  control: Control<TFieldValues, unknown, TTransformedValues>;

  name: FieldPath<TFieldValues>;

  label: string;
  required?: boolean;
  description?: string;

  className?: string;

  valueAsNumber?: boolean;

  icon?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name">;

export default function FormInput<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  control,
  name,
  label,
  required,
  description,
  className,
  valueAsNumber,
  icon,
  ...props
}: FormInputProps<TFieldValues, TTransformedValues>) {
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
          <div className="relative">
            {icon && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                {icon}
              </span>
            )}

            <input
              {...field}
              {...props}
              value={
                field.value === undefined || field.value === null
                  ? ""
                  : field.value
              }
              onChange={(event) => {
                if (valueAsNumber) {
                  const value = event.target.value;

                  field.onChange(value === "" ? undefined : Number(value));

                  return;
                }

                field.onChange(event.target.value);
              }}
              className={cn(
                "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm transition",
                "focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100",
                "disabled:cursor-not-allowed disabled:bg-slate-100",
                icon && "pl-10",
                fieldState.error &&
                  "border-red-500 focus:border-red-500 focus:ring-red-100",
                className,
              )}
            />
          </div>
        </FormField>
      )}
    />
  );
}
