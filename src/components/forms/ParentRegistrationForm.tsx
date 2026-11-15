"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import {
  parentRegistrationSchema,
  ParentRegistrationSchema,
} from "@/lib/formValidationSchemas";
import { registerParent } from "@/lib/registrationActions";
import { Section, TextField } from "./RegistrationFields";

const ParentRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentRegistrationSchema>({
    resolver: zodResolver(parentRegistrationSchema),
  });

  // On success the action signs the parent in and redirects
  const [state, formAction, pending] = useActionState(registerParent, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((values) =>
    startTransition(() => formAction(values))
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Section
        title="Your child"
        description="Enter the student number your child received when they registered, and their date of birth. Both must match the school's records."
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
      </Section>

      <Section title="Your details">
        <TextField label="First name" registration={register("name")} error={errors.name} />
        <TextField label="Last name" registration={register("surname")} error={errors.surname} />
        <TextField
          label="Phone"
          type="tel"
          registration={register("phone")}
          error={errors.phone}
        />
        <TextField
          label="Email"
          type="email"
          optional
          registration={register("email")}
          error={errors.email}
        />
        <TextField
          label="Home address"
          registration={register("address")}
          error={errors.address}
          wide
        />
      </Section>

      <Section title="Account">
        <TextField
          label="Username"
          registration={register("username")}
          error={errors.username}
          inputProps={{ autoComplete: "username" }}
          wide
        />
        <TextField
          label="Password"
          type="password"
          registration={register("password")}
          error={errors.password}
          hint="At least 8 characters."
          inputProps={{ autoComplete: "new-password" }}
        />
        <TextField
          label="Confirm password"
          type="password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword}
          inputProps={{ autoComplete: "new-password" }}
        />
      </Section>

      {state.error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {state.message ?? "Something went wrong. Please try again."}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Already have an account? Sign in
        </Link>
        <button className="btn-primary" disabled={pending}>
          {pending ? "Creating account..." : "Create parent account"}
        </button>
      </div>
    </form>
  );
};

export default ParentRegistrationForm;
