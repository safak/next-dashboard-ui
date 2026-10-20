"use client";

import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { createExam, updateExam } from "../actions";

import {
  examSchema,
  ExamFormInput,
  ExamSchema,
} from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect, { SelectOption } from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

/* ============================================================
   DATE HELPER
============================================================ */

function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/* ============================================================
   PROPS
============================================================ */

interface ExamFormProps {
  mode: "create" | "edit";

  classOptions: SelectOption[];

  subjectOptions: SelectOption[];

  teacherOptions: SelectOption[];

  initialData?: ExamSchema;

  onSuccess?: () => void;
}

/* ============================================================
   EMPTY VALUES
============================================================ */

const emptyValues: ExamFormInput = {
  title: "",
  description: "",
  totalMarks: 100,
  examDate: undefined,
  classId: 0,
  subjectId: 0,
  teacherId: "",
};

/* ============================================================
   COMPONENT
============================================================ */

export default function ExamForm({
  mode,
  classOptions,
  subjectOptions,
  teacherOptions,
  initialData,
  onSuccess,
}: ExamFormProps) {
  const [isPending, startTransition] = useTransition();

  /* ==========================================================
     FORM
  ========================================================== */

  const form = useForm<ExamFormInput, any, ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: initialData ?? emptyValues,
  });

  /* ==========================================================
     RESET FORM WHEN EDIT DATA CHANGES
  ========================================================== */

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData);
      return;
    }

    if (mode === "create") {
      form.reset(emptyValues);
    }
  }, [mode, initialData, form]);

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const onSubmit = (values: ExamSchema) => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        const result =
          mode === "create"
            ? await createExam(
                {
                  success: false,
                },
                values,
              )
            : await updateExam(
                {
                  success: false,
                },
                values,
              );

        if (!result.success) {
          toast.error(result.error ?? "Operation failed.");
          return;
        }

        toast.success(
          mode === "create"
            ? "Exam created successfully."
            : "Exam updated successfully.",
        );

        form.reset(emptyValues);

        onSuccess?.();
      } catch (error) {
        console.error("Exam submit error:", error);

        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <form
      id="exam-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormSection
        title="Exam Information"
        description="Enter the examination details."
      >
        {/* ====================================================
            EXAM TITLE
        ==================================================== */}

        <FormInput
          control={form.control}
          name="title"
          label="Exam Title"
          placeholder="e.g. Term 1 Mathematics Exam"
          required
          disabled={isPending}
        />

        {/* ====================================================
            DESCRIPTION
        ==================================================== */}

        <FormInput
          control={form.control}
          name="description"
          label="Description"
          placeholder="Optional exam description"
          disabled={isPending}
        />

        {/* ====================================================
            CLASS
        ==================================================== */}

        <FormSelect
          control={form.control}
          name="classId"
          label="Class"
          placeholder="Select class"
          required
          options={classOptions}
          emptyTitle="No Classes Available"
          emptyDescription="Please create a class before creating an exam."
          disabled={isPending}
          valueAsNumber
        />

        {/* ====================================================
            SUBJECT
        ==================================================== */}

        <FormSelect
          control={form.control}
          name="subjectId"
          label="Subject"
          placeholder="Select subject"
          required
          options={subjectOptions}
          emptyTitle="No Subjects Available"
          emptyDescription="Please create a subject before creating an exam."
          disabled={isPending}
          valueAsNumber
        />

        {/* ====================================================
            TEACHER
        ==================================================== */}

        <FormSelect
          control={form.control}
          name="teacherId"
          label="Exam Teacher"
          placeholder="Select teacher"
          required
          options={teacherOptions}
          emptyTitle="No Teachers Available"
          emptyDescription="Please create a teacher before creating an exam."
          disabled={isPending}
        />

        {/* ====================================================
            EXAM DATE & TIME
        ==================================================== */}

        <Controller
          control={form.control}
          name="examDate"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Exam Date & Time <span className="text-red-500">*</span>
              </label>

              <DatePicker
                selected={toDate(field.value)}
                onChange={(date: Date | null) => {
                  field.onChange(date);
                }}
                onBlur={field.onBlur}
                showTimeSelect
                timeIntervals={15}
                dateFormat="dd MMM yyyy, h:mm aa"
                placeholderText="Select exam date & time"
                disabled={isPending}
                popperPlacement="bottom-start"
                popperClassName="!z-[9999]"
                wrapperClassName="w-full"
                className={`
                  h-11
                  w-full
                  rounded-lg
                  border
                  bg-white
                  px-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                  ${fieldState.error ? "border-red-500" : "border-slate-300"}
                `}
              />

              {fieldState.error && (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* ====================================================
            TOTAL MARKS
        ==================================================== */}

        <FormInput
          control={form.control}
          name="totalMarks"
          label="Total Marks"
          type="number"
          min={1}
          placeholder="100"
          required
          disabled={isPending}
          valueAsNumber
        />
      </FormSection>
    </form>
  );
}
