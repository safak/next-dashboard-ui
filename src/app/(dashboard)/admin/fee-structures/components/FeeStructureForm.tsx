"use client";

import { useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FeeStructureFormInput,
  FeeStructureFormValues,
  feeStructureSchema,
} from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect, { SelectOption } from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

interface FeeStructureFormProps {
  mode: "create" | "edit";
  initialData?: FeeStructureFormValues;
  classOptions: SelectOption[];
  loading?: boolean;
  onSubmit: (values: FeeStructureFormValues) => void | Promise<void>;
}

const defaultValues: FeeStructureFormInput = {
  classId: 0,
  title: "",
  annualFee: 0,
  admissionFee: 11500,
  isActive: true,
};

export default function FeeStructureForm({
  mode,
  initialData,
  classOptions,
  loading = false,
  onSubmit,
}: FeeStructureFormProps) {
  const [isPending, startTransition] = useTransition();

  const disabled = loading || isPending;

  const form = useForm<FeeStructureFormInput, any, FeeStructureFormValues>({
    resolver: zodResolver(feeStructureSchema),

    defaultValues: initialData ?? defaultValues,
  });

  useEffect(() => {
    form.reset(initialData ?? defaultValues);
  }, [initialData, form]);

  const handleSubmit = (values: FeeStructureFormValues) => {
    if (disabled) return;

    startTransition(async () => {
      try {
        await onSubmit(values);
      } catch {
        toast.error("Failed to save fee structure.");
      }
    });
  };

  return (
    <form
      id="fee-structure-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-2 pb-1"
    >
      <FormSection
        title="Fee Structure"
        description={
          mode === "create"
            ? "Create the annual fee structure for a class."
            : "Update the annual fee structure for this class."
        }
      >
        <FormSelect
          control={form.control}
          name="classId"
          label="Class"
          placeholder="Select class"
          required
          options={classOptions}
          emptyTitle="No Classes Available"
          emptyDescription="Create a class before creating a fee structure."
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="title"
          label="Fee Title"
          placeholder="e.g. Nursery Annual Fee"
          required
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="annualFee"
          label="Annual Fee"
          type="number"
          min={1}
          placeholder="40000"
          required
          disabled={disabled}
        />

        <FormInput
          control={form.control}
          name="admissionFee"
          label="Admission Fee"
          type="number"
          min={0}
          placeholder="11500"
          required
          disabled={disabled}
        />

        <div className="col-span-full rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> The
            annual fee is used during admission. The admission fee is fixed at
            ₹11,500 by default, and the remaining amount is split between Term 1
            and Term 2.
          </p>
        </div>
      </FormSection>
    </form>
  );
}
