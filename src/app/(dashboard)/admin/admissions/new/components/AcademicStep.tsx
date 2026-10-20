"use client";

import { useEffect, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CheckCircle2, Info, IndianRupee } from "lucide-react";
import { StudentRegistrationFormInput } from "@/lib/formValidationSchemas";
import { FormInput, FormSection, FormSelect } from "@/components/ui/form";

interface FeeStructureOption {
  id: number;
  title: string;
  annualFee: number;
  admissionFee: number;
  classId: number;
}

interface AcademicStepProps {
  classes: {
    id: number;
    name: string;
  }[];

  academicYear: string;

  feeStructures: FeeStructureOption[];

  admissionNumber?: string;

  rollNumber?: string;
}

function DisplayField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <input
        type="text"
        value={value}
        readOnly
        disabled
        className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-700 shadow-sm disabled:cursor-default disabled:opacity-100"
      />
    </div>
  );
}

function AmountRow({
  label,
  amount,
  highlight = false,
  danger = false,
}: {
  label: string;
  amount: number;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between border-b border-slate-200 py-3 last:border-0 ${
        highlight ? "font-semibold" : ""
      }`}
    >
      <span
        className={
          danger
            ? "text-red-600"
            : highlight
              ? "text-slate-900"
              : "text-slate-600"
        }
      >
        {label}
      </span>

      <span
        className={
          danger
            ? "font-semibold text-red-600"
            : highlight
              ? "font-bold text-slate-900"
              : "font-semibold text-slate-700"
        }
      >
        ₹{amount.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function normalizeDate(value: Date | string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function DueDateField({
  control,
  name,
  description,
  minDate,
}: {
  control: any;
  name:
    | "academic.admissionDueDate"
    | "academic.term1DueDate"
    | "academic.term2DueDate";
  description: string;
  minDate?: Date;
}) {
  return (
    <Controller
      control={control}
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
              placeholderText="Select due date"
              minDate={minDate}
              disabled={field.disabled}
              popperPlacement="bottom-start"
              popperClassName="!z-[9999]"
              wrapperClassName="w-full"
              showPopperArrow={false}
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
}

export default function AcademicStep({
  classes,
  academicYear,
  feeStructures,
  admissionNumber,
  rollNumber,
}: AcademicStepProps) {
  const { control, setValue } = useFormContext<StudentRegistrationFormInput>();

  const selectedClassId = useWatch({
    control,
    name: "academic.classId",
  });

  const selectedFeeStructureId = useWatch({
    control,
    name: "academic.feeStructureId",
  });

  const discount =
    useWatch({
      control,
      name: "academic.discount",
    }) ?? 0;

  const paidAmount =
    useWatch({
      control,
      name: "academic.paidAmount",
    }) ?? 0;

  const admissionDueDate = useWatch({
    control,
    name: "academic.admissionDueDate",
  });

  const term1DueDate = useWatch({
    control,
    name: "academic.term1DueDate",
  });

  const previousClassId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const currentClassId = Number(selectedClassId);

    if (
      previousClassId.current !== undefined &&
      previousClassId.current !== currentClassId
    ) {
      setValue("academic.feeStructureId", 0, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("academic.discount", 0, {
        shouldValidate: true,
      });

      setValue("academic.paidAmount", 0, {
        shouldValidate: true,
      });

      setValue("academic.admissionDueDate", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("academic.term1DueDate", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("academic.term2DueDate", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    previousClassId.current = currentClassId;
  }, [selectedClassId, setValue]);

  const availableFeeStructures = feeStructures.filter(
    (fee) => fee.classId === Number(selectedClassId),
  );

  const selectedFee = feeStructures.find(
    (fee) => fee.id === Number(selectedFeeStructureId),
  );

  const annualFee = selectedFee?.annualFee ?? 0;

  const admissionFee = selectedFee?.admissionFee ?? 0;

  const discountAmount = Math.max(Number(discount) || 0, 0);

  const amountPaid = Math.max(Number(paidAmount) || 0, 0);

  const finalFee = Math.max(annualFee - discountAmount, 0);

  const effectiveAdmissionFee = Math.min(admissionFee, finalFee);

  const remainingAmount = Math.max(finalFee - effectiveAdmissionFee, 0);

  const term1Amount = Math.floor(remainingAmount / 2);

  const term2Amount = remainingAmount - term1Amount;

  const balance = Math.max(finalFee - amountPaid, 0);

  const paymentStatus =
    amountPaid <= 0 ? "PENDING" : amountPaid >= finalFee ? "PAID" : "PARTIAL";

  const admissionDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const admissionDateValue = normalizeDate(admissionDueDate);

  const term1DateValue = normalizeDate(term1DueDate);

  return (
    <div className="space-y-6">
      <FormSection
        title="Academic Information"
        description="Assign the student to a class and review admission details."
      >
        <FormSelect
          control={control}
          name="academic.classId"
          label="Class"
          required
          valueAsNumber
          placeholder="Select Class"
          options={classes.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          emptyTitle="No classes available"
          emptyDescription="Please create a class before admitting students."
        />

        <DisplayField label="Academic Year" value={academicYear} />

        <DisplayField label="Admission Date" value={admissionDate} />

        <DisplayField
          label="Admission Number"
          value={admissionNumber ?? "Auto Generated"}
        />

        <DisplayField
          label="Roll Number"
          value={rollNumber ?? "Auto Generated"}
        />
      </FormSection>

      <FormSection
        title="Fee Information"
        description="Select the applicable fee structure and configure the student's payment plan."
      >
        <FormSelect
          control={control}
          name="academic.feeStructureId"
          label="Fee Structure"
          required
          valueAsNumber
          placeholder={
            selectedClassId ? "Select Fee Structure" : "Select Class First"
          }
          options={availableFeeStructures.map((fee) => ({
            value: fee.id,
            label: `${fee.title} - ₹${fee.annualFee.toLocaleString("en-IN")}`,
          }))}
          disabled={!selectedClassId || availableFeeStructures.length === 0}
          emptyTitle="No fee structure available"
          emptyDescription="Create an active fee structure for this class first."
        />

        <FormInput
          control={control}
          name="academic.discount"
          label="Discount"
          type="number"
          min={0}
          valueAsNumber
          placeholder="0"
          description="Enter the discount amount, if applicable."
        />

        <FormInput
          control={control}
          name="academic.paidAmount"
          label="Amount Paid"
          type="number"
          min={0}
          valueAsNumber
          placeholder="0"
          description="Enter the amount received during admission."
        />
      </FormSection>

      {selectedFee && (
        <FormSection
          title="Fee Calculation"
          description="Review the fee before continuing to the next step."
        >
          <div className="md:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-sky-600" />

                  <div>
                    <p className="font-semibold text-slate-900">
                      {selectedFee.title}
                    </p>

                    <p className="text-xs text-slate-500">Fee calculation</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    paymentStatus === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : paymentStatus === "PARTIAL"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {paymentStatus}
                </span>
              </div>

              <AmountRow label="Annual Fee" amount={annualFee} />

              <AmountRow label="Admission Fee" amount={effectiveAdmissionFee} />

              <AmountRow
                label="Discount"
                amount={discountAmount}
                danger={discountAmount > 0}
              />

              <AmountRow label="Final Fee" amount={finalFee} highlight />

              <AmountRow label="Amount Paid" amount={amountPaid} />

              <div className="mt-1 rounded-lg bg-white px-3">
                <AmountRow
                  label="Balance"
                  amount={balance}
                  highlight
                  danger={balance > 0}
                />
              </div>
            </div>
          </div>
        </FormSection>
      )}

      {selectedFee && (
        <FormSection
          title="Payment Plan"
          description="Set the due date for each installment. These dates will be saved with the student's admission."
          fullWidth
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Info className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-amber-800">
                  Due dates are optional
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-amber-700">
                  You can leave any due date empty and add it later if required.
                  <br className="hidden sm:block" />
                  Due dates can be used for parent payment reminders.
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
              <div className="min-w-0 overflow-visible rounded-lg border border-slate-200 border-t-2 border-t-violet-500 bg-white">
                <div className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                      <IndianRupee className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        Admission Fee
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-violet-600">
                        ₹{effectiveAdmissionFee.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="my-3 border-t border-dashed border-slate-200" />

                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-medium text-slate-700">
                      Due Date{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </p>

                    <DueDateField
                      control={control}
                      name="academic.admissionDueDate"
                      description="Payment deadline for admission fee."
                    />
                  </div>
                </div>
              </div>

              <div className="min-w-0 overflow-visible rounded-lg border border-slate-200 border-t-2 border-t-blue-500 bg-white">
                <div className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                      <span className="text-[11px] font-bold">T1</span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        Term 1
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-blue-600">
                        ₹{term1Amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="my-3 border-t border-dashed border-slate-200" />

                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-medium text-slate-700">
                      Due Date{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </p>

                    <DueDateField
                      control={control}
                      name="academic.term1DueDate"
                      description="Payment deadline for Term 1."
                      minDate={admissionDateValue ?? undefined}
                    />
                  </div>
                </div>
              </div>

              <div className="min-w-0 overflow-visible rounded-lg border border-slate-200 border-t-2 border-t-orange-500 bg-white">
                <div className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-600">
                      <span className="text-[11px] font-bold">T2</span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        Term 2
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-orange-600">
                        ₹{term2Amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="my-3 border-t border-dashed border-slate-200" />

                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-medium text-slate-700">
                      Due Date{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </p>

                    <DueDateField
                      control={control}
                      name="academic.term2DueDate"
                      description="Payment deadline for Term 2."
                      minDate={term1DateValue ?? undefined}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Payment plan calculated
                </p>

                <p className="mt-1 text-xs text-emerald-700">
                  Admission fee is collected first. The remaining annual fee is
                  divided between Term 1 and Term 2. Each installment has its
                  own optional due date.
                </p>
              </div>
            </div>
          </div>
        </FormSection>
      )}

      <FormSection
        title="Admission Information"
        description="System generated details after successful admission."
      >
        <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />

            <span className="font-medium text-slate-800">System Generated</span>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li>
              • Admission Number is generated automatically after successful
              admission.
            </li>

            <li>
              • Roll Number is assigned automatically based on the selected
              class.
            </li>

            <li>• Academic Year is taken from the active academic session.</li>

            <li>• Fee amounts are taken from the selected fee structure.</li>

            <li>
              • Payment due dates are assigned separately for Admission, Term 1,
              and Term 2.
            </li>
          </ul>
        </div>
      </FormSection>
    </div>
  );
}
