"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Copy, CheckCircle2 } from "lucide-react";

import {
  academicYearSchema,
  AcademicYearFormInput,
} from "@/lib/formValidationSchemas";

import SearchableSelect from "@/components/ui/searchable-select";

interface AcademicYear {
  id: number;
  label: string;
}

interface Props {
  initialValues?: AcademicYearFormInput;

  academicYears: AcademicYear[];

  loading?: boolean;

  onSubmit: (
    values: AcademicYearFormInput,
  ) => Promise<void>;

  onFormReady?: (
    submit: () => void,
  ) => void;
}

export default function AcademicYearForm({
  initialValues,
  academicYears,
  loading = false,
  onSubmit,
  onFormReady,
}: Props) {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AcademicYearFormInput>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      label: "",
      cloneFromId: undefined,
      isActive: false,
    },
  });

  /* ==========================================
      Reset Form
  ========================================== */

  useEffect(() => {
    reset(
      initialValues ?? {
        label: "",
        cloneFromId: undefined,
        isActive: false,
      },
    );
  }, [initialValues, reset]);

  /* ==========================================
      Expose Submit to Drawer
  ========================================== */

  useEffect(() => {
    if (!onFormReady) return;

    onFormReady(
      handleSubmit(async (values) => {
        await onSubmit(values);
      }),
    );
  }, [handleSubmit, onSubmit, onFormReady]);

  return (
    <div className="space-y-6">
      {/* Information Card */}

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-900">
            Academic Year Information
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Configure the academic session details.
          </p>
        </div>

        <div className="space-y-6 p-6">
          {/* Academic Year */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <CalendarDays className="h-4 w-4 text-sky-600" />

              Academic Year
            </label>

            <input
              {...register("label")}
              placeholder="2027-2028"
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
            />

            {errors.label && (
              <p className="mt-2 text-sm text-red-600">
                {errors.label.message}
              </p>
            )}
          </div>

          {/* Clone */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Copy className="h-4 w-4 text-violet-600" />

              Clone Classes From
            </label>

            <SearchableSelect
              value={watch("cloneFromId")?.toString()}
              placeholder="Select Academic Year"
              searchPlaceholder="Search Academic Year..."
              emptyMessage="No Academic Years Found"
              disabled={loading}
              options={academicYears.map((year) => ({
                value: year.id.toString(),
                label: year.label,
              }))}
              onChange={(value) =>
                setValue("cloneFromId", Number(value), {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            />

            <p className="mt-2 text-xs text-slate-500">
              Existing classes will be copied into the new academic year.
            </p>
          </div>

          {/* Active */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("isActive")}
                disabled={loading}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />

              <div>
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                  Make Active Academic Year
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  This academic year will become the default for admissions,
                  attendance, fees, promotions, exams and all academic
                  operations.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}