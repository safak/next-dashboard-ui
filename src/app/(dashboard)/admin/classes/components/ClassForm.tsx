"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { createClass, updateClass } from "@/lib/actions";

import {
  classSchema,
  ClassFormInput,
  ClassSchema,
} from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormSelect, { SelectOption } from "@/components/ui/form/FormSelect";
import FormSection from "@/components/ui/form/FormSection";

interface ClassFormProps {
  mode: "create" | "edit";

  teacherOptions: SelectOption[];

  initialData?: ClassSchema;

  onSuccess?: () => void;
}

export default function ClassForm({
  mode,
  teacherOptions,
  initialData,
  onSuccess,
}: ClassFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ClassFormInput, any, ClassSchema>({
    resolver: zodResolver(classSchema),

    defaultValues: initialData ?? {
      name: "",
      capacity: 30,
      rollPrefix: 101,
      supervisorId: "",
    },
  });

  // ==================================================
  // IMPORTANT:
  // Update form values whenever the selected class
  // changes.
  // ==================================================

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      return;
    }

    form.reset({
      name: "",
      capacity: 30,
      rollPrefix: 101,
      supervisorId: "",
    });
  }, [initialData, form]);

  // ==================================================
  // Submit
  // ==================================================

  const onSubmit = (values: ClassSchema) => {
    if (isPending) return;

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createClass({ success: false }, values)
          : await updateClass({ success: false }, values);

      if (!result.success) {
        toast.error(result.error ?? "Operation failed.");
        return;
      }

      toast.success(
        mode === "create"
          ? "Class created successfully."
          : "Class updated successfully.",
      );

      form.reset();

      onSuccess?.();

      router.refresh();
    });
  };

  return (
    <form
      id="class-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2 pb-1"
    >
      <FormSection
        title="Class Information"
        description={
          mode === "create"
            ? "Set up the basic details for this academic class."
            : "Update the basic details for this academic class."
        }
      >
        {/* ==================================================
            CLASS NAME
        ================================================== */}

        <FormInput
          control={form.control}
          name="name"
          label="Class Name"
          placeholder="e.g. Nursery"
          required
          disabled={isPending}
        />

        {/* ==================================================
            CLASS TEACHER
        ================================================== */}

        <FormSelect
          control={form.control}
          name="supervisorId"
          label="Class Teacher"
          placeholder="Select teacher"
          required
          options={teacherOptions}
          emptyTitle="No Teachers Available"
          emptyDescription={
            mode === "create"
              ? "All available teachers are already assigned to a class."
              : "No other teachers are currently available."
          }
          disabled={isPending}
        />

        {/* ==================================================
            CAPACITY
        ================================================== */}

        <FormInput
          control={form.control}
          name="capacity"
          label="Capacity"
          type="number"
          min={1}
          placeholder="30"
          required
          disabled={isPending}
        />

        {/* ==================================================
            ROLL PREFIX
        ================================================== */}

        <FormInput
          control={form.control}
          name="rollPrefix"
          label="Roll Prefix"
          type="number"
          min={1}
          placeholder="101"
          required
          disabled={isPending}
        />

        {/* ==================================================
            FORM INFORMATION
        ================================================== */}

        <div className="col-span-full mt-1 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span> Choose a
            class teacher and set the maximum number of students this class can
            accommodate.
          </p>
        </div>
      </FormSection>
    </form>
  );
}
