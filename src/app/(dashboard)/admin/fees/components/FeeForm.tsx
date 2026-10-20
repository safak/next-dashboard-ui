"use client";

import { useEffect, useMemo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  CalendarDays,
  Calculator,
  GraduationCap,
  IndianRupee,
  Info,
} from "lucide-react";

import FormSelect, { SelectOption } from "@/components/ui/form/FormSelect";

import FormSection from "@/components/ui/form/FormSection";

import {
  assignFeeSchema,
  type AssignFeeFormInput,
  type AssignFeeValues,
} from "@/lib/formValidationSchemas";

import { createStudentFeePlan, updateStudentFeePlan } from "../actions";

import type { FeeWithRelations } from "../types";

/* TYPES */

interface FeeFormProps {
  mode: "create" | "edit";

  fee: FeeWithRelations | null;

  students: {
    id: string;
    name: string;
    surname: string;

    class: {
      id: number;
      name: string;
    } | null;
  }[];

  classes: {
    id: number;
    name: string;
  }[];

  academicYears: {
    id: number;
    label: string;
  }[];

  onSuccess: () => void;
}

/* CONFIGURATION */

const ADMISSION_FEE = 11500;

/* HELPERS */

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function normalizeDate(
  value: Date | string | number | null | undefined,
): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

const emptyValues: AssignFeeFormInput = {
  studentId: "",
  classId: undefined,
  academicYearId: undefined,
  totalFee: undefined,

  admissionDueDate: undefined,
  term1DueDate: undefined,
  term2DueDate: undefined,
};

/* COMPONENT */

export default function FeeForm({
  mode,
  fee,
  students,
  classes,
  academicYears,
  onSuccess,
}: FeeFormProps) {
  const [isPending, startTransition] = useTransition();

  /* FORM */

  const form = useForm<AssignFeeFormInput, unknown, AssignFeeValues>({
    resolver: zodResolver(assignFeeSchema),

    defaultValues: emptyValues,
  });

  /* RESET FORM */

  useEffect(() => {
    if (mode === "create") {
      form.reset(emptyValues);
      return;
    }

    if (mode === "edit" && fee) {
      form.reset({
        studentId: fee.studentId,

        classId: fee.student.class?.id ?? undefined,

        academicYearId:
          fee.student.academicYear?.id ??
          fee.plan?.academicYear?.id ??
          undefined,

        totalFee: fee.plan?.finalFee ?? fee.totalAmount,

        admissionDueDate:
          fee.installment === "ADMISSION"
            ? (normalizeDate(fee.dueDate) ?? undefined)
            : undefined,

        term1DueDate:
          fee.installment === "TERM_1"
            ? (normalizeDate(fee.dueDate) ?? undefined)
            : undefined,

        term2DueDate:
          fee.installment === "TERM_2"
            ? (normalizeDate(fee.dueDate) ?? undefined)
            : undefined,
      });
    }
  }, [mode, fee, form]);

  /* WATCH */

  const selectedAcademicYearId = form.watch("academicYearId");

  const selectedClassId = form.watch("classId");

  const selectedStudentId = form.watch("studentId");

  const totalFeeValue = form.watch("totalFee");

  /* NORMALIZE TOTAL FEE */

  const totalFee = useMemo(() => {
    if (typeof totalFeeValue === "number" && Number.isFinite(totalFeeValue)) {
      return totalFeeValue;
    }

    if (typeof totalFeeValue === "string" && totalFeeValue.trim() !== "") {
      const parsed = Number(totalFeeValue);

      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }, [totalFeeValue]);

  /* OPTIONS */

  const academicYearOptions: SelectOption[] = useMemo(() => {
    return (academicYears ?? []).map((year) => ({
      value: String(year.id),
      label: year.label,
    }));
  }, [academicYears]);

  const classOptions: SelectOption[] = useMemo(() => {
    return (classes ?? []).map((item) => ({
      value: String(item.id),
      label: item.name,
    }));
  }, [classes]);

  /* FILTER STUDENTS BY CLASS */

  const filteredStudents = useMemo(() => {
    if (
      selectedClassId === undefined ||
      selectedClassId === null ||
      selectedClassId === 0 ||
      selectedClassId === ""
    ) {
      return [];
    }

    const classId = Number(selectedClassId);

    if (!Number.isFinite(classId) || classId <= 0) {
      return [];
    }

    return students.filter((student) => student.class?.id === classId);
  }, [students, selectedClassId]);

  /* STUDENT OPTIONS */

  const studentOptions: SelectOption[] = useMemo(() => {
    return filteredStudents.map((student) => ({
      value: student.id,
      label: `${student.name} ${student.surname}`,
    }));
  }, [filteredStudents]);

  /* SELECTED STUDENT */

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) {
      return null;
    }

    return students.find((student) => student.id === selectedStudentId) ?? null;
  }, [students, selectedStudentId]);

  /* SELECTED CLASS */

  const selectedClass = useMemo(() => {
    if (selectedClassId === undefined || selectedClassId === null) {
      return null;
    }

    const classId = Number(selectedClassId);

    if (!Number.isFinite(classId)) {
      return null;
    }

    return classes.find((item) => item.id === classId) ?? null;
  }, [classes, selectedClassId]);

  /* CLEAR STUDENT WHEN CLASS CHANGES */

  useEffect(() => {
    if (!selectedStudentId) {
      return;
    }

    const studentBelongsToClass = filteredStudents.some(
      (student) => student.id === selectedStudentId,
    );

    if (!studentBelongsToClass) {
      form.setValue("studentId", "");
    }
  }, [selectedClassId, selectedStudentId, filteredStudents, form]);

  /* FEE CALCULATION */

  const remainingFee = Math.max(0, totalFee - ADMISSION_FEE);

  const term1 = Math.floor(remainingFee / 2);

  const term2 = remainingFee - term1;

  const calculatedTotal =
    totalFee >= ADMISSION_FEE ? ADMISSION_FEE + term1 + term2 : 0;

  const isFeeTooLow = totalFee > 0 && totalFee < ADMISSION_FEE;

  /* DATE PICKER */

  const renderDatePicker = (
    name: "admissionDueDate" | "term1DueDate" | "term2DueDate",
    placeholder: string,
    description: string,
  ) => {
    return (
      <Controller
        control={form.control}
        name={name}
        render={({ field, fieldState }) => {
          const selectedDate = normalizeDate(field.value);

          return (
            <div className="space-y-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  field.onChange(date ?? undefined);
                }}
                onBlur={field.onBlur}
                dateFormat="dd MMM yyyy"
                placeholderText={placeholder}
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
                <p className="text-xs font-medium text-red-500">
                  {fieldState.error.message}
                </p>
              )}

              <p className="text-xs text-slate-500">{description}</p>
            </div>
          );
        }}
      />
    );
  };

  /* SUBMIT */

  const onSubmit = (values: AssignFeeValues) => {
    if (isPending) {
      return;
    }

    if (!values.academicYearId) {
      toast.error("Please select an academic year.");
      return;
    }

    if (!values.classId) {
      toast.error("Please select a class.");
      return;
    }

    if (!values.studentId) {
      toast.error("Please select a student.");
      return;
    }

    if (!Number.isFinite(values.totalFee) || values.totalFee < ADMISSION_FEE) {
      toast.error(
        `Total fee must be at least ${formatCurrency(ADMISSION_FEE)}.`,
      );
      return;
    }

    startTransition(async () => {
      /*
       * CREATE
       * ------------------------------------------------------------
       * Creation needs all three due dates.
       */
      if (mode === "create") {
        const result = await createStudentFeePlan(
          {
            success: false,
          },
          values,
        );

        if (!result.success) {
          toast.error(result.error ?? "Operation failed.");
          return;
        }

        toast.success("Fee plan created successfully.");

        form.reset(emptyValues);
        onSuccess();

        return;
      }

      if (!fee) {
        toast.error("Fee installment not found.");
        return;
      }

      const selectedDueDate =
        fee.installment === "ADMISSION"
          ? values.admissionDueDate
          : fee.installment === "TERM_1"
            ? values.term1DueDate
            : fee.installment === "TERM_2"
              ? values.term2DueDate
              : undefined;

      console.log("FEE UPDATE:", {
        id: fee.id,
        installment: fee.installment,
        selectedDueDate,
        isDate: selectedDueDate instanceof Date,
        iso:
          selectedDueDate instanceof Date
            ? selectedDueDate.toISOString()
            : null,
      });

      const result = await updateStudentFeePlan(
        {
          success: false,
        },
        {
          id: fee.id,
          dueDate: selectedDueDate,
        },
      );

      if (!result.success) {
        toast.error(result.error ?? "Operation failed.");
        return;
      }

      toast.success("Fee plan updated successfully.");

      form.reset(emptyValues);
      onSuccess();
    });
  };

  /* RENDER */

  return (
    <form
      id="fee-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* FEE ASSIGNMENT */}

      <FormSection
        title="Fee Assignment"
        description="Select the academic year, class, and student for this fee plan."
      >
        {/* Academic Year */}

        <FormSelect
          control={form.control}
          name="academicYearId"
          label="Academic Year"
          placeholder="Select academic year"
          required
          options={academicYearOptions}
          emptyTitle="No Academic Years Available"
          emptyDescription="Please create an academic year first."
          disabled={isPending}
          valueAsNumber
        />

        {/* Class */}

        <FormSelect
          control={form.control}
          name="classId"
          label="Class"
          placeholder="Select class"
          required
          options={classOptions}
          emptyTitle="No Classes Available"
          emptyDescription="Please create a class first."
          disabled={isPending}
          valueAsNumber
        />

        {/* Student */}

        <FormSelect
          control={form.control}
          name="studentId"
          label="Student"
          placeholder={
            selectedClassId ? "Select student" : "Select class first"
          }
          required
          options={studentOptions}
          emptyTitle="No Students Available"
          emptyDescription={
            selectedClassId
              ? "No students found in this class."
              : "Select a class first."
          }
          disabled={isPending || !selectedClassId}
        />

        {/* Class Preview */}

        {/* {selectedClass && (
          <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedClass.name}
                </p>

                <p className="text-xs text-slate-500">
                  {filteredStudents.length}{" "}
                  {filteredStudents.length === 1 ? "student" : "students"} in
                  this class
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Student Preview */}

        {/* {selectedStudent && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {selectedStudent.name} {selectedStudent.surname}
                </p>

                <p className="text-xs text-slate-500">
                  Class: {selectedStudent.class?.name ?? "No class"}
                </p>
              </div>
            </div>
          </div>
        )} */}
      </FormSection>

      {/* ANNUAL FEE */}

      <FormSection
        title="Annual Fee"
        description="Set the annual fee and review the installment breakdown."
        fullWidth
      >
        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid w-full min-w-0 grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            {/* ==================================================
          LEFT — ANNUAL FEE DETAILS
      ================================================== */}

            <div className="min-w-0 border-r border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <IndianRupee className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-5 text-slate-900">
                    Annual Fee Details
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Enter the student&apos;s total annual fee.
                  </p>
                </div>
              </div>

              {/* Total Annual Fee */}

              <Controller
                control={form.control}
                name="totalFee"
                render={({ field, fieldState }) => (
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-semibold text-slate-700">
                      Total Annual Fee <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />

                      <input
                        type="number"
                        min={ADMISSION_FEE}
                        step="1"
                        placeholder="55,000"
                        disabled={isPending}
                        value={
                          field.value === undefined ||
                          field.value === null ||
                          field.value === 0
                            ? ""
                            : String(field.value)
                        }
                        onChange={(event) => {
                          const value = event.target.value;

                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className={`
                    h-11
                    w-full
                    rounded-lg
                    border
                    bg-white
                    pl-9
                    pr-3
                    text-sm
                    font-semibold
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-violet-400
                    focus:ring-2
                    focus:ring-violet-100
                    ${fieldState.error ? "border-red-500" : "border-slate-300"}
                  `}
                      />
                    </div>

                    {fieldState.error && (
                      <p className="mt-1.5 text-[11px] font-medium text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Fee rule */}

              <div className="mt-4 rounded-lg bg-violet-50 px-3 py-2.5">
                <p className="text-[10px] leading-4 text-violet-700">
                  Admission fee is fixed at{" "}
                  <span className="font-bold">
                    {formatCurrency(ADMISSION_FEE)}
                  </span>
                  . The remaining amount is divided equally between Term 1 and
                  Term 2.
                </p>
              </div>

              {/* Validation */}

              {isFeeTooLow && (
                <p className="mt-2 text-[10px] font-medium text-red-500">
                  Total fee must be at least {formatCurrency(ADMISSION_FEE)}.
                </p>
              )}
            </div>

            {/* ==================================================
          RIGHT — FEE BREAKDOWN
      ================================================== */}

            <div className="min-w-0 bg-slate-50/40">
              {/* Header */}

              <div className="border-b border-slate-200 bg-emerald-50/60 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Calculator className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Fee Breakdown
                    </p>

                    <p className="text-[10px] text-emerald-600">
                      Automatically calculated
                    </p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}

              <div className="px-4">
                {/* Admission */}

                <div className="flex items-center justify-between gap-2 border-b border-slate-200 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">
                      ₹
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800">
                        Admission Fee
                      </p>

                      <p className="text-[9px] text-slate-400">Fixed amount</p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-slate-800">
                    {formatCurrency(ADMISSION_FEE)}
                  </span>
                </div>

                {/* Term 1 */}

                <div className="flex items-center justify-between gap-2 border-b border-slate-200 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[9px] font-bold text-sky-600">
                      T1
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800">
                        Term 1
                      </p>

                      <p className="text-[9px] text-slate-400">50% remaining</p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-slate-800">
                    {formatCurrency(term1)}
                  </span>
                </div>

                {/* Term 2 */}

                <div className="flex items-center justify-between gap-2 border-b border-slate-200 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[9px] font-bold text-orange-600">
                      T2
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800">
                        Term 2
                      </p>

                      <p className="text-[9px] text-slate-400">50% remaining</p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-slate-800">
                    {formatCurrency(term2)}
                  </span>
                </div>

                {/* Total */}

                <div className="flex items-center justify-between gap-2 py-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Total Annual Fee
                    </p>

                    <p className="text-[9px] text-slate-400">
                      Calculated total
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center text-base font-bold text-violet-600">
                    <IndianRupee className="mr-0.5 h-4 w-4" />
                    {calculatedTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Success summary */}

          {totalFee >= ADMISSION_FEE && (
            <div className="border-t border-emerald-100 bg-emerald-50 px-4 py-2.5">
              <p className="text-[10px] font-medium text-emerald-700">
                Admission{" "}
                <span className="font-semibold">
                  {formatCurrency(ADMISSION_FEE)}
                </span>
                {" + "}
                Term 1{" "}
                <span className="font-semibold">{formatCurrency(term1)}</span>
                {" + "}
                Term 2{" "}
                <span className="font-semibold">{formatCurrency(term2)}</span>
              </p>
            </div>
          )}
        </div>
      </FormSection>

      {/* PAYMENT DUE DATES */}
      {/* ========================================================
    PAYMENT DUE DATES
======================================================== */}

      <FormSection
        title="Payment Due Dates"
        description="Set when each installment should be paid. Dates can also be added later."
        fullWidth
      >
        <div className="space-y-4">
          {/* ======================================================
        OPTIONAL INFORMATION
    ====================================================== */}

          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Info className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-800">
                Due dates are optional
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-amber-700">
                You can create the fee plan now and add due dates later.
                <br className="hidden sm:block" />
                Due dates can be used for parent payment reminders.
              </p>
            </div>
          </div>

          {/* ======================================================
        INSTALLMENT CARDS
    ====================================================== */}

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {/* ====================================================
          ADMISSION FEE
      ==================================================== */}

            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 border-t-2 border-t-violet-500 bg-white">
              <div className="p-3.5">
                {/* Header */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                    <IndianRupee className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      Admission Fee
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-violet-600">
                      {formatCurrency(ADMISSION_FEE)}
                    </p>
                  </div>
                </div>

                {/* Divider */}

                <div className="my-3 border-t border-dashed border-slate-200" />

                {/* Due Date */}

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-medium text-slate-700">
                    Due Date{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </p>

                  {renderDatePicker(
                    "admissionDueDate",
                    "Select admission due date",
                    "Payment deadline for admission fee.",
                  )}
                </div>
              </div>
            </div>

            {/* ====================================================
          TERM 1
      ==================================================== */}

            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 border-t-2 border-t-blue-500 bg-white">
              <div className="p-3.5">
                {/* Header */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                    <span className="text-[11px] font-bold">T1</span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      Term 1
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-blue-600">
                      {formatCurrency(term1)}
                    </p>
                  </div>
                </div>

                {/* Divider */}

                <div className="my-3 border-t border-dashed border-slate-200" />

                {/* Due Date */}

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-medium text-slate-700">
                    Due Date{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </p>

                  {renderDatePicker(
                    "term1DueDate",
                    "Select Term 1 due date",
                    "Payment deadline for Term 1.",
                  )}
                </div>
              </div>
            </div>

            {/* ====================================================
          TERM 2
      ==================================================== */}

            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 border-t-2 border-t-orange-500 bg-white">
              <div className="p-3.5">
                {/* Header */}

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-600">
                    <span className="text-[11px] font-bold">T2</span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      Term 2
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-orange-600">
                      {formatCurrency(term2)}
                    </p>
                  </div>
                </div>

                {/* Divider */}

                <div className="my-3 border-t border-dashed border-slate-200" />

                {/* Due Date */}

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-medium text-slate-700">
                    Due Date{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </p>

                  {renderDatePicker(
                    "term2DueDate",
                    "Select Term 2 due date",
                    "Payment deadline for Term 2.",
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      {/* FINAL SUMMARY */}

      {selectedStudent && selectedClass && totalFee >= ADMISSION_FEE && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-violet-600" />

            <p className="text-sm font-semibold text-slate-900">
              Fee Plan Summary
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Student</span>

              <span className="text-right font-medium text-slate-900">
                {selectedStudent.name} {selectedStudent.surname}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Class</span>

              <span className="font-medium text-slate-900">
                {selectedClass.name}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Academic Year</span>

              <span className="font-medium text-slate-900">
                {academicYears.find(
                  (year) => year.id === Number(selectedAcademicYearId),
                )?.label ?? "—"}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
              <span className="font-medium text-slate-700">Annual Fee</span>

              <span className="font-bold text-violet-600">
                {formatCurrency(totalFee)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Admission</span>

              <span className="font-medium">
                {formatCurrency(ADMISSION_FEE)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Term 1</span>

              <span className="font-medium">{formatCurrency(term1)}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Term 2</span>

              <span className="font-medium">{formatCurrency(term2)}</span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
