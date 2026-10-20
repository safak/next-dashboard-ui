"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
  Controller,
  Control,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
  ControllerFieldState,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import FormField from "./FormField";

interface FormImageUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  description?: string;
}

interface ImageDropzoneProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  fieldState: ControllerFieldState;
  label: string;
  required?: boolean;
  description?: string;
}

function ImageDropzone<T extends FieldValues>({
  field,
  fieldState,
  label,
  required,
  description,
}: ImageDropzoneProps<T>) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Maximum file size is 5 MB.");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        field.onChange(data.url);
        toast.success("Photo uploaded successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Image upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [field],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    onDrop,
    disabled: uploading,
  });

  return (
    <FormField
      label={label}
      required={required}
      description={description}
      error={fieldState.error?.message}
    >
      <div className="space-y-2">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed px-5 py-4 transition-all ${
            isDragActive
              ? "border-blue-600 bg-blue-50"
              : "border-slate-300 hover:border-blue-500 hover:bg-slate-50"
          } ${uploading ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <input {...getInputProps()} />

          {field.value ? (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={field.value}
                alt="Student Photo"
                width={120}
                height={120}
                className="h-28 w-28 rounded-xl object-cover"
              />

              {!uploading && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Uploaded Successfully</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-3">
              <UploadCloud className="mb-3 h-10 w-10 text-slate-500" />

              <h3 className="text-sm font-medium">Upload Student Photo</h3>

              <p className="mt-1 text-xs text-slate-500">
                Drag &amp; drop an image here or click to browse
              </p>

              <p className="mt-2 text-xs text-slate-400">JPG • PNG • WEBP</p>

              <p className="text-xs text-slate-400">Maximum size: 5 MB</p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading image...
          </div>
        )}

        {field.value && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              disabled={uploading}
              onClick={() => field.onChange("")}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Photo
            </Button>
          </div>
        )}
      </div>
    </FormField>
  );
}

export default function FormImageUpload<T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
}: FormImageUploadProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <ImageDropzone
          field={field}
          fieldState={fieldState}
          label={label}
          required={required}
          description={description}
        />
      )}
    />
  );
}
