"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { ParentFormValues, parentSchema } from "@/lib/formValidationSchemas";

import FormInput from "@/components/ui/form/FormInput";
import FormSection from "@/components/ui/form/FormSection";

interface ParentFormProps {
  mode: "create" | "edit";

  initialData?: ParentFormValues;

  loading?: boolean;

  onSubmit: (values: ParentFormValues) => void | Promise<void>;

  onSuccess?: () => void;
}

export default function ParentForm({
  mode,
  initialData,
  loading = false,
  onSubmit,
  onSuccess,
}: ParentFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // ParentDrawer loading + internal form submission state
  const isSubmitting = loading || isPending;

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),

    defaultValues: initialData ?? {
      username: "",
      password: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // ==================================================
  // IMPORTANT:
  // Update form values whenever the selected parent
  // changes.
  // ==================================================

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      return;
    }

    form.reset({
      username: "",
      password: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
    });
  }, [initialData, form]);

  // ==================================================
  // Submit
  // ==================================================

  const handleSubmit = (values: ParentFormValues) => {
    if (isSubmitting) return;

    startTransition(async () => {
      try {
        await onSubmit(values);

        toast.success(
          mode === "create"
            ? "Parent created successfully."
            : "Parent updated successfully.",
        );

        form.reset();

        onSuccess?.();

        router.refresh();
      } catch (error) {
        console.error("Parent form submission failed:", error);

        toast.error(
          error instanceof Error ? error.message : "Operation failed.",
        );
      }
    });
  };

  return (
    <form
      id="parent-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-2 pb-1"
    >
      {/* ==================================================
          ACCOUNT INFORMATION
      ================================================== */}

      <FormSection
        title="Account Information"
        description={
          mode === "create"
            ? "Set up the parent's login credentials."
            : "Update the parent's login credentials."
        }
      >
        {/* Username */}

        <FormInput
          control={form.control}
          name="username"
          label="Username"
          placeholder="e.g. johnparent"
          required
          disabled={isSubmitting}
        />

        {/* Password */}

        <FormInput
          control={form.control}
          name="password"
          label={mode === "create" ? "Password" : "New Password"}
          type="password"
          placeholder={
            mode === "edit"
              ? "Leave blank to keep current password"
              : "Enter password"
          }
          required={mode === "create"}
          disabled={isSubmitting}
        />
      </FormSection>

      {/* ==================================================
          PERSONAL INFORMATION
      ================================================== */}

      <FormSection
        title="Personal Information"
        description={
          mode === "create"
            ? "Enter the parent's personal and contact details."
            : "Update the parent's personal and contact details."
        }
      >
        {/* First Name */}

        <FormInput
          control={form.control}
          name="name"
          label="First Name"
          placeholder="John"
          required
          disabled={isSubmitting}
        />

        {/* Last Name */}

        <FormInput
          control={form.control}
          name="surname"
          label="Last Name"
          placeholder="Doe"
          required
          disabled={isSubmitting}
        />

        {/* Email */}

        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          disabled={isSubmitting}
        />

        {/* Phone */}

        <FormInput
          control={form.control}
          name="phone"
          label="Phone"
          placeholder="9876543210"
          required
          disabled={isSubmitting}
        />

        {/* Address */}

        <FormInput
          control={form.control}
          name="address"
          label="Address"
          placeholder="Enter address"
          required
          disabled={isSubmitting}
        />

        {/* ==================================================
            FORM INFORMATION
        ================================================== */}

        <div className="col-span-full mt-1 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
          <p className="text-xs leading-5 text-slate-500">
            <span className="font-semibold text-indigo-600">Tip:</span>{" "}
            {mode === "create"
              ? "Enter the parent's account and contact details. The username and password will be used for parent login."
              : "Update the parent's details as needed. Leave the password blank if you do not want to change it."}
          </p>
        </div>
      </FormSection>
    </form>
  );
}
