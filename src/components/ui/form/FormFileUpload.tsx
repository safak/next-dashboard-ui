"use client";

import { ChangeEvent } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { UploadCloud, ImageIcon } from "lucide-react";

import FormField from "./FormField";
import { cn } from "@/lib/utils";

type FormFileUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;

  label: string;
  required?: boolean;
  description?: string;

  accept?: string;
  className?: string;
};

export default function FormFileUpload<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  accept = "image/*",
  className,
}: FormFileUploadProps<T>) {
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
          <label
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-8 transition",
              "hover:border-sky-500 hover:bg-sky-50",
              className
            )}
          >
            {field.value ? (
              <>
                <ImageIcon className="mb-2 h-10 w-10 text-emerald-600" />
                <p className="text-sm font-medium text-slate-700">
                  Image Selected
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="mb-2 h-10 w-10 text-slate-500" />

                <p className="text-sm font-medium text-slate-700">
                  Click to upload
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPG or JPEG
                </p>
              </>
            )}

            <input
              type="file"
              accept={accept}
              hidden
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];

                field.onChange(file ?? null);
              }}
            />
          </label>
        </FormField>
      )}
    />
  );
}