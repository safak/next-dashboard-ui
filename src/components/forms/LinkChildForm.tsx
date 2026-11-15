"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { linkChildSchema, LinkChildSchema } from "@/lib/formValidationSchemas";
import { linkChild } from "@/lib/registrationActions";
import { TextField } from "./RegistrationFields";

const LinkChildForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkChildSchema>({ resolver: zodResolver(linkChildSchema) });

  const [state, formAction, pending] = useActionState(linkChild, {
    success: false,
    error: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast("Your child has been linked to your account!");
      reset();
      router.refresh();
    }
  }, [state, reset, router]);

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => startTransition(() => formAction(values)))}
      className="flex flex-col gap-4"
    >
      <TextField
        label="Student number"
        registration={register("studentNumber")}
        error={errors.studentNumber}
        inputProps={{
          placeholder: "STU-2026-0001",
          className: "form-control uppercase tracking-wide",
        }}
      />
      <TextField
        label="Child's date of birth"
        type="date"
        registration={register("childBirthday")}
        error={errors.childBirthday}
      />
      {state.error && <p className="text-sm text-red-500">{state.message}</p>}
      <button className="btn-primary self-start" disabled={pending}>
        {pending ? "Linking..." : "Link child"}
      </button>
    </form>
  );
};

export default LinkChildForm;
