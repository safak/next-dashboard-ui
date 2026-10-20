"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import {
  createLesson,
  updateLesson,
} from "@/lib/actions";

import {
  lessonSchema,
  LessonFormValues,
} from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect, {
  SelectOption,
} from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

interface LessonFormProps {
  mode: "create" | "edit";

  subjectOptions: SelectOption[];
  classOptions: SelectOption[];
  teacherOptions: SelectOption[];

  initialData?: LessonFormValues;

  onSuccess?: () => void;
}

function dateToTimeValue(date?: Date) {
  if (!date) return "";

  const value = new Date(date);

  const hours = String(
    value.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    value.getMinutes(),
  ).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function timeValueToDate(value: string) {
  const [hours, minutes] = value
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

function getDayFromDate(date: Date) {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return days[date.getDay()];
}

export default function LessonForm({
  mode,
  subjectOptions,
  classOptions,
  teacherOptions,
  initialData,
  onSuccess,
}: LessonFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),

    defaultValues: initialData ?? {
      name: "",
      scheduleDate: new Date(),
      day: getDayFromDate(new Date()) as
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY",
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 0,
      classId: 0,
      teacherId: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData);
      return;
    }

    const today = new Date();

    form.reset({
      name: "",
      scheduleDate: today,
      day: getDayFromDate(today) as
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY",
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 0,
      classId: 0,
      teacherId: "",
    });
  }, [
    initialData,
    mode,
    form,
  ]);

  const onSubmit = (
    values: LessonFormValues,
  ) => {
    if (isPending) return;

    if (
      values.endTime.getTime() <=
      values.startTime.getTime()
    ) {
      toast.error(
        "End time must be after start time.",
      );

      return;
    }

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createLesson(
              { success: false },
              values,
            )
          : await updateLesson(
              { success: false },
              values,
            );

      if (!result.success) {
        toast.error(
          result.error ??
            "Operation failed.",
        );

        return;
      }

      toast.success(
        mode === "create"
          ? "Lesson created successfully."
          : "Lesson updated successfully.",
      );

      form.reset();

      onSuccess?.();

      router.refresh();
    });
  };

  return (
    <form
      id="lesson-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormSection
        title="Lesson Information"
        description="Enter the lesson details."
      >
        <FormInput
          control={form.control}
          name="name"
          label="Lesson Name"
          placeholder="e.g. Mathematics"
          required
          disabled={isPending}
        />

        <FormSelect
          control={form.control}
          name="subjectId"
          label="Subject"
          placeholder="Select subject"
          required
          options={subjectOptions}
          valueAsNumber
          emptyTitle="No Subjects Available"
          emptyDescription="Please create a subject before creating a lesson."
          disabled={isPending}
        />

        <FormSelect
          control={form.control}
          name="classId"
          label="Class"
          placeholder="Select class"
          required
          options={classOptions}
          valueAsNumber
          emptyTitle="No Classes Available"
          emptyDescription="Please create a class before creating a lesson."
          disabled={isPending}
        />

        <FormSelect
          control={form.control}
          name="teacherId"
          label="Teacher"
          placeholder="Select teacher"
          required
          options={teacherOptions}
          emptyTitle="No Teachers Available"
          emptyDescription="Please create a teacher before creating a lesson."
          disabled={isPending}
        />
      </FormSection>

      <FormSection
        title="Lesson Schedule"
        description="Set the date and lesson timing."
      >
        <Controller
          control={form.control}
          name="scheduleDate"
          render={({
            field,
            fieldState,
          }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Schedule Date
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <DatePicker
                selected={field.value}
                onChange={(date: Date | null) => {
                  if (!date) {
                    field.onChange(null);
                    return;
                  }

                  field.onChange(date);

                  const day =
                    getDayFromDate(date);

                  if (
                    day !== "SUNDAY"
                  ) {
                    form.setValue(
                      "day",
                      day as
                        | "MONDAY"
                        | "TUESDAY"
                        | "WEDNESDAY"
                        | "THURSDAY"
                        | "FRIDAY"
                        | "SATURDAY",
                      {
                        shouldValidate: true,
                      },
                    );
                  }
                }}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Schedule Date"
                disabled={isPending}
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                popperClassName="z-[9999]"
                className="
                  h-[42px]
                  w-full
                  rounded-md
                  border
                  border-input
                  bg-background
                  px-3
                  py-2
                  text-sm
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-ring
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
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
          name="day"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Day
              </label>

              <input
                type="text"
                value={
                  field.value
                    ? field.value
                        .charAt(0)
                        .toUpperCase() +
                      field.value
                        .slice(1)
                        .toLowerCase()
                    : ""
                }
                readOnly
                className="
                  flex
                  h-10
                  w-full
                  rounded-md
                  border
                  border-input
                  bg-slate-50
                  px-3
                  py-2
                  text-sm
                  text-slate-600
                  outline-none
                "
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="startTime"
            render={({
              field,
              fieldState,
            }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Start Time
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="time"
                  value={dateToTimeValue(
                    field.value,
                  )}
                  onChange={(event) => {
                    field.onChange(
                      timeValueToDate(
                        event.target.value,
                      ),
                    );
                  }}
                  disabled={isPending}
                  className="
                    flex
                    h-10
                    w-full
                    rounded-md
                    border
                    border-input
                    bg-background
                    px-3
                    py-2
                    text-sm
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-ring
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {
                      fieldState.error
                        .message
                    }
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="endTime"
            render={({
              field,
              fieldState,
            }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  End Time
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="time"
                  value={dateToTimeValue(
                    field.value,
                  )}
                  onChange={(event) => {
                    field.onChange(
                      timeValueToDate(
                        event.target.value,
                      ),
                    );
                  }}
                  disabled={isPending}
                  className="
                    flex
                    h-10
                    w-full
                    rounded-md
                    border
                    border-input
                    bg-background
                    px-3
                    py-2
                    text-sm
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-ring
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

                {fieldState.error && (
                  <p className="text-xs text-red-500">
                    {
                      fieldState.error
                        .message
                    }
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </FormSection>
    </form>
  );
}