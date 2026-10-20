"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CalendarDays, Clock3 } from "lucide-react";

import {
  createHoliday,
  updateHoliday,
} from "@/lib/actions";

import {
  holidaySchema,
  type HolidayFormInput,
  type HolidayFormValues,
} from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

interface HolidayFormProps {
  mode: "create" | "edit";
  initialData?: HolidayFormValues;
  onSuccess?: () => void;
}

export default function HolidayForm({
  mode,
  initialData,
  onSuccess,
}: HolidayFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const form = useForm<
    HolidayFormInput,
    unknown,
    HolidayFormValues
  >({
    resolver: zodResolver(holidaySchema),

    defaultValues: initialData ?? {
      title: "",
      date: new Date(),
      isFullDay: "FULL",
    },
  });

  // =========================================================
  // RESET FORM WHEN CREATE / EDIT CHANGES
  // =========================================================

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData);
      return;
    }

    form.reset({
      title: "",
      date: new Date(),
      isFullDay: "FULL",
    });
  }, [initialData, mode, form]);

  // =========================================================
  // SUBMIT
  // =========================================================

  const onSubmit = (
    values: HolidayFormValues,
  ) => {
    if (isPending) return;

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createHoliday(
              { success: false },
              {
                title: values.title,
                date: values.date,
                isFullDay:
                  values.isFullDay === "FULL",
              },
            )
          : await updateHoliday(
              { success: false },
              {
                id: values.id!,
                title: values.title,
                date: values.date,
                isFullDay:
                  values.isFullDay === "FULL",
              },
            );

      if (!result.success) {
        toast.error(
          result.error ??
            "Failed to save holiday.",
        );
        return;
      }

      toast.success(
        mode === "create"
          ? "Holiday created successfully."
          : "Holiday updated successfully.",
      );

      form.reset();

      onSuccess?.();

      router.refresh();
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <form
      id="holiday-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* =====================================================
          HOLIDAY INFORMATION
      ===================================================== */}

      <FormSection
        title="Holiday Information"
        description="Enter the holiday details."
      >
        <FormInput
          control={form.control}
          name="title"
          label="Holiday Title"
          placeholder="e.g. Independence Day"
          required
          disabled={isPending}
        />

        <Controller
          control={form.control}
          name="date"
          render={({
            field,
            fieldState,
          }) => (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarDays className="h-4 w-4 text-violet-500" />

                <span>
                  Holiday Date
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </span>
              </label>

              <DatePicker
                selected={
                  field.value instanceof Date
                    ? field.value
                    : null
                }
                onChange={(
                  date: Date | null,
                ) => {
                  if (date) {
                    field.onChange(date);
                  }
                }}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select holiday date"
                disabled={isPending}
                popperPlacement="bottom-start"
                popperClassName="event-datepicker-popper"
                calendarClassName="event-datepicker-calendar"
                className="event-datepicker"
              />

              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="isFullDay"
          render={({
            field,
            fieldState,
          }) => (
            <FormSelect
              control={form.control}
              name="isFullDay"
              label="Holiday Duration"
              placeholder="Select duration"
              options={[
                {
                  value: "FULL",
                  label: "Full Day",
                },
                {
                  value: "HALF",
                  label: "Half Day",
                },
              ]}
              disabled={isPending}
            />
          )}
        />
      </FormSection>

      {/* =====================================================
          INFORMATION NOTE
      ===================================================== */}

      <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
            <Clock3 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-violet-900">
              Holiday Duration
            </p>

            <p className="mt-1 text-xs leading-5 text-violet-700">
              Choose Full Day for a complete school
              holiday or Half Day when the school is
              closed for only part of the day.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}