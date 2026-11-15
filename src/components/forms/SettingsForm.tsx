"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { settingsSchema, SettingsSchema } from "@/lib/formValidationSchemas";
import { updateSettings } from "@/lib/actions";

// Not in a modal, so it doesn't use useFormAction (which closes one)
const SettingsForm = ({
  data,
}: {
  data: { schoolName: string; academicYear: string };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
  } = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: data,
  });

  const [state, formAction, pending] = useActionState(updateSettings, {
    success: false,
    error: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast("Settings have been saved!");
      reset(getValues()); // the saved values become the new baseline
      router.refresh();
    }
  }, [state, router, reset, getValues]);

  const onSubmit = handleSubmit((values) =>
    startTransition(() => formAction(values))
  );

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="School name"
          name="schoolName"
          register={register}
          error={errors?.schoolName}
        />
        <InputField
          label="Academic year"
          name="academicYear"
          register={register}
          error={errors?.academicYear}
          inputProps={{ placeholder: "2025/26" }}
        />
      </div>
      {state.error && (
        <span className="text-sm text-red-500">
          {"message" in state && state.message
            ? state.message
            : "Something went wrong!"}
        </span>
      )}
      <button
        className="btn-primary self-start"
        disabled={pending || !isDirty}
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
};

export default SettingsForm;
