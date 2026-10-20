"use client";

import { ReactNode } from "react";
import { SelectHTMLAttributes } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import RadixSelect from "@/components/ui/RadixSelect";
import FormField from "./FormField";

export interface SelectOption {
  label: string;
  value: string | number;
}

type FormSelectProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = undefined,
> = {
  control: Control<TFieldValues, unknown, TTransformedValues>;

  name: FieldPath<TFieldValues>;

  label: string;
  required?: boolean;
  description?: string;

  options: SelectOption[];

  placeholder?: string;

  className?: string;

  valueAsNumber?: boolean;

  icon?: ReactNode;

  emptyTitle?: string;
  emptyDescription?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name">;

export default function FormSelect<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  control,
  name,
  label,
  required,
  description,
  options,
  placeholder = "Select an option",
  className,
  valueAsNumber,
  icon,
  emptyTitle = "No options available",
  emptyDescription = "There are no options available to select.",
  ...props
}: FormSelectProps<TFieldValues, TTransformedValues>) {
  const mappedOptions =
    options.length > 0
      ? options.map((option) => ({
          value: String(option.value),
          label: option.label,
        }))
      : [
          {
            value: "__empty__",
            label: emptyTitle,
          },
        ];

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
          <RadixSelect
            value={
              field.value !== undefined &&
              field.value !== null &&
              field.value !== ""
                ? String(field.value)
                : ""
            }
            onChange={(value) => {
              if (valueAsNumber) {
                field.onChange(
                  value === undefined || value === "" || value === "__empty__"
                    ? undefined
                    : Number(value),
                );
              } else {
                field.onChange(value === "__empty__" ? "" : value);
              }
            }}
            placeholder={placeholder}
            disabled={props.disabled}
            options={mappedOptions}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            icon={icon}
            className={className}
          />
        </FormField>
      )}
    />
  );
}
