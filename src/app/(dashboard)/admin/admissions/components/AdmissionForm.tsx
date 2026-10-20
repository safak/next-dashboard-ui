"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createStudent, updateStudent } from "@/lib/actions";

import {
  StudentFormInput,
  StudentFormValues,
  studentSchema,
} from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect, { SelectOption } from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

export interface FeeStructureOption {
  value: string;
  label: string;
  annualFee: number;
  admissionFee: number;
  classId: number;
}

interface AdmissionFormProps {
  mode: "create" | "edit";
  initialData?: StudentFormValues;

  classOptions: SelectOption[];
  parentOptions: SelectOption[];

  feeStructureOptions: FeeStructureOption[];

  loading?: boolean;

  onSuccess?: () => void;
}

const defaultValues: StudentFormInput = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  address: "",
  img: "",
  bloodType: "A_POSITIVE",
  sex: "MALE",
  birthday: undefined,
  classId: 0,
  parentId: "",
  feeStructureId: 0,
  discount: 0,
  paidAmount: 0,
};

export default function AdmissionForm({
  mode,
  initialData,
  classOptions,
  parentOptions,
  feeStructureOptions,
  loading = false,
  onSuccess,
}: AdmissionFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const disabled = loading || isPending;

  const form = useForm<StudentFormInput, unknown, StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData ?? defaultValues,
  });

  useEffect(() => {
    form.reset(initialData ?? defaultValues);
  }, [initialData, form]);

  const classId = form.watch("classId");
  const feeStructureId = form.watch("feeStructureId");
  const discount = Number(form.watch("discount")) || 0;
  const paidAmount = Number(form.watch("paidAmount")) || 0;

  const feeOptions = useMemo(() => {
    if (!classId) {
      return [];
    }

    return feeStructureOptions
      .filter((fee) => fee.classId === Number(classId))
      .map((fee) => ({
        value: fee.value,
        label: fee.label,
      }));
  }, [classId, feeStructureOptions]);

  const selectedFee = useMemo(() => {
    return feeStructureOptions.find(
      (fee) =>
        Number(fee.value) === Number(feeStructureId) &&
        fee.classId === Number(classId),
    );
  }, [feeStructureOptions, feeStructureId, classId]);

  useEffect(() => {
    if (!classId) {
      form.setValue("feeStructureId", 0);
      form.setValue("discount", 0);
      form.setValue("paidAmount", 0);
      return;
    }

    const currentFee = feeStructureOptions.find(
      (fee) =>
        Number(fee.value) === Number(feeStructureId) &&
        fee.classId === Number(classId),
    );

    if (!currentFee) {
      form.setValue("feeStructureId", 0);
      form.setValue("discount", 0);
      form.setValue("paidAmount", 0);
    }
  }, [classId, feeStructureId, feeStructureOptions, form]);

  const originalFee = selectedFee?.annualFee ?? 0;

  const admissionFee = selectedFee?.admissionFee ?? 0;

  const finalFee = Math.max(originalFee - discount, 0);

  const effectiveAdmissionFee = Math.min(admissionFee, finalFee);

  const remainingAmount = Math.max(finalFee - effectiveAdmissionFee, 0);

  const term1Amount = Math.floor(remainingAmount / 2);

  const term2Amount = remainingAmount - term1Amount;

  const balance = Math.max(finalFee - paidAmount, 0);

  const paymentStatus =
    paidAmount <= 0 ? "PENDING" : paidAmount >= finalFee ? "PAID" : "PARTIAL";

  const onSubmit = (values: StudentFormValues) => {
    if (disabled) {
      return;
    }

    if (!selectedFee) {
      toast.error("Please select a valid fee structure.");
      return;
    }

    if (Number(values.discount) > selectedFee.annualFee) {
      toast.error("Discount cannot be greater than the annual fee.");
      return;
    }

    if (Number(values.paidAmount) > finalFee) {
      toast.error("Paid amount cannot be greater than the final fee.");
      return;
    }

    startTransition(async () => {
      try {
        const result =
          mode === "create"
            ? await createStudent({ success: false }, values)
            : await updateStudent({ success: false }, values);

        if (!result.success) {
          toast.error(result.error ?? "Operation failed.");
          return;
        }

        toast.success(
          mode === "create"
            ? "Admission created successfully."
            : "Admission updated successfully.",
        );

        form.reset(defaultValues);

        onSuccess?.();

        router.refresh();
      } catch (error) {
        console.error("Admission submission error:", error);

        toast.error("Failed to save admission.");
      }
    });
  };

  return (
    <form
      id="admission-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2 pb-1"
    >
      <FormSection
        title="Student Information"
        description={
          mode === "create"
            ? "Enter the student's basic personal information."
            : "Update the student's personal information."
        }
      >
        <FormInput
          control={form.control}
          name="name"
          label="First Name"
          placeholder="e.g. Nishika"
          required
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="surname"
          label="Last Name"
          placeholder="e.g. Vadaboyena"
          required
          disabled={disabled}
        />

        <FormSelect
          control={form.control}
          name="sex"
          label="Gender"
          placeholder="Select gender"
          required
          options={[
            {
              value: "MALE",
              label: "Male",
            },
            {
              value: "FEMALE",
              label: "Female",
            },
          ]}
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="birthday"
          label="Date of Birth"
          type="date"
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="phone"
          label="Phone"
          placeholder="9876543210"
          required
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="student@example.com"
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="address"
          label="Address"
          placeholder="Enter student's address"
          required
          disabled={disabled}
        />

        <FormSelect
          control={form.control}
          name="bloodType"
          label="Blood Group"
          placeholder="Select blood group"
          required
          options={[
            {
              value: "A_POSITIVE",
              label: "A+",
            },
            {
              value: "A_NEGATIVE",
              label: "A-",
            },
            {
              value: "B_POSITIVE",
              label: "B+",
            },
            {
              value: "B_NEGATIVE",
              label: "B-",
            },
            {
              value: "AB_POSITIVE",
              label: "AB+",
            },
            {
              value: "AB_NEGATIVE",
              label: "AB-",
            },
            {
              value: "O_POSITIVE",
              label: "O+",
            },
            {
              value: "O_NEGATIVE",
              label: "O-",
            },
          ]}
          disabled={disabled}
        />
      </FormSection>

      <FormSection
        title="Academic Information"
        description="Assign the student to a class and parent account."
      >
        <FormSelect
          control={form.control}
          name="classId"
          label="Class"
          placeholder="Select class"
          required
          options={classOptions}
          emptyTitle="No Classes Available"
          emptyDescription="Create a class before adding an admission."
          disabled={disabled}
        />

        <FormSelect
          control={form.control}
          name="parentId"
          label="Parent"
          placeholder="Select parent"
          required
          options={parentOptions}
          emptyTitle="No Parents Available"
          emptyDescription="Create a parent account before adding an admission."
          disabled={disabled}
        />
      </FormSection>

      <FormSection
        title="Fee Information"
        description="Assign the annual fee and configure the student's payment plan."
      >
        <FormSelect
          control={form.control}
          name="feeStructureId"
          label="Fee Structure"
          placeholder={classId ? "Select fee structure" : "Select class first"}
          required
          options={feeOptions}
          emptyTitle="No Fee Structure Available"
          emptyDescription={
            classId
              ? "No active fee structure is configured for this class."
              : "Select a class to view its fee structure."
          }
          disabled={disabled || !classId}
        />

        <FormInput
          control={form.control}
          name="discount"
          label="Discount"
          type="number"
          min={0}
          placeholder="0"
          disabled={disabled || !selectedFee}
        />

        <FormInput
          control={form.control}
          name="paidAmount"
          label="Amount Paid"
          type="number"
          min={0}
          placeholder="0"
          disabled={disabled || !selectedFee}
        />

        {selectedFee && (
          <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Fee Calculation
                </h3>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Review the fee before saving the admission.
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  paymentStatus === "PAID"
                    ? "bg-emerald-50 text-emerald-600"
                    : paymentStatus === "PARTIAL"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {paymentStatus}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Annual Fee</span>

                <span className="text-sm font-semibold text-slate-800">
                  ₹{originalFee.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Discount</span>

                <span className="text-sm font-semibold text-amber-600">
                  - ₹{discount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Final Fee
                  </span>

                  <span className="text-base font-bold text-indigo-700">
                    ₹{finalFee.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Amount Paid</span>

                <span className="text-sm font-semibold text-slate-800">
                  ₹{paidAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Balance
                </span>

                <span className="text-sm font-bold text-emerald-600">
                  ₹{balance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-3 border-t border-slate-200 pt-3">
              <p className="mb-2 text-xs font-semibold text-slate-700">
                Payment Plan
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-2">
                  <p className="text-[10px] font-medium text-indigo-600">
                    Admission
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-indigo-700">
                    ₹{effectiveAdmissionFee.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-2">
                  <p className="text-[10px] font-medium text-blue-600">
                    Term 1
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-blue-700">
                    ₹{term1Amount.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-2">
                  <p className="text-[10px] font-medium text-violet-600">
                    Term 2
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-violet-700">
                    ₹{term2Amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </FormSection>

      <div className="col-span-full mt-1 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
        <p className="text-xs leading-5 text-slate-500">
          <span className="font-semibold text-indigo-600">Tip:</span> The annual
          fee comes from the selected class fee structure. After applying the
          discount, the configured admission fee is allocated first and the
          remaining amount is split between Term 1 and Term 2.
        </p>
      </div>
    </form>
  );
}
