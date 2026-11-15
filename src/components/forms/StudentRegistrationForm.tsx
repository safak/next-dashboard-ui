"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import {
  studentRegistrationSchema,
  StudentRegistrationSchema,
} from "@/lib/formValidationSchemas";
import { registerStudent } from "@/lib/registrationActions";
import { Section, SelectField, TextAreaField, TextField } from "./RegistrationFields";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

type Props = {
  grades: { id: number; level: number }[];
  subjects: { id: number; name: string }[];
  schoolName: string;
  terms: { title: string; body: string }[];
};

const StudentRegistrationForm = ({ grades, subjects, schoolName, terms }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentRegistrationSchema>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: { subjects: [] },
  });

  const [state, formAction, pending] = useActionState(registerStudent, {
    success: false,
    error: false,
  });

  const fullName = [watch("name"), watch("surname")].filter(Boolean).join(" ");
  const today = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date());

  if (state.success && state.studentNumber) {
    return <RegistrationReceived studentNumber={state.studentNumber} />;
  }

  const onSubmit = handleSubmit((values) =>
    startTransition(() => formAction(values))
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Section
        title="Account"
        description="You'll sign in with this username and password once the school approves your registration."
      >
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

      <Section title="Personal details">
        <TextField label="First name" registration={register("name")} error={errors.name} />
        <TextField label="Last name" registration={register("surname")} error={errors.surname} />
        <TextField
          label="Date of birth"
          type="date"
          registration={register("birthday")}
          error={errors.birthday}
        />
        <SelectField
          label="Sex"
          placeholder="Select"
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
          ]}
          registration={register("sex")}
          error={errors.sex}
        />
        <SelectField
          label="Blood type"
          placeholder="Select"
          options={BLOOD_TYPES.map((b) => ({ value: b, label: b }))}
          registration={register("bloodType")}
          error={errors.bloodType}
        />
        <TextField
          label="Phone"
          type="tel"
          optional
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

      <Section title="School information">
        <SelectField
          label="Grade you are enrolling into"
          placeholder="Select a grade"
          options={grades.map((g) => ({ value: g.id, label: `Grade ${g.level}` }))}
          registration={register("gradeId")}
          error={errors.gradeId}
          hint="The school will place you in a class within this grade."
        />
        <TextField
          label="Last grade completed"
          optional
          registration={register("lastGradeCompleted")}
          error={errors.lastGradeCompleted}
          inputProps={{ placeholder: "e.g. Grade 4" }}
        />
        <TextField
          label="Previous school"
          optional
          registration={register("previousSchool")}
          error={errors.previousSchool}
          wide
        />
        <TextAreaField
          label="Medical conditions, allergies or special needs"
          optional
          placeholder="Anything the school should know to keep you safe and support your learning"
          registration={register("medicalNotes")}
          error={errors.medicalNotes}
          wide
        />
      </Section>

      <fieldset className="card p-5 md:p-6 flex flex-col gap-4">
        <div>
          <legend className="text-base font-semibold text-gray-800">Subjects</legend>
          <p className="text-sm text-gray-500 mt-1">
            Choose every subject you are registering for.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {subjects.map((s) => (
            <label
              key={s.id}
              className="flex items-center gap-2 rounded-lg ring-1 ring-gray-200 px-3 py-2 text-sm cursor-pointer has-[:checked]:ring-2 has-[:checked]:ring-indigo-400 has-[:checked]:bg-indigo-50"
            >
              <input
                type="checkbox"
                value={String(s.id)}
                className="accent-indigo-500"
                {...register("subjects")}
              />
              {s.name}
            </label>
          ))}
        </div>
        {errors.subjects?.message && (
          <p className="text-xs text-red-500">{errors.subjects.message}</p>
        )}
      </fieldset>

      <Section
        title="Parent or guardian"
        description="Who the school should contact about you. Your parent or guardian can also create their own account later using your student number."
      >
        <TextField
          label="Full name"
          registration={register("guardianName")}
          error={errors.guardianName}
        />
        <TextField
          label="Relationship to you"
          registration={register("guardianRelationship")}
          error={errors.guardianRelationship}
          inputProps={{ placeholder: "e.g. Mother, Uncle, Guardian" }}
        />
        <TextField
          label="Phone"
          type="tel"
          registration={register("guardianPhone")}
          error={errors.guardianPhone}
        />
        <TextField
          label="Email"
          type="email"
          optional
          registration={register("guardianEmail")}
          error={errors.guardianEmail}
        />
      </Section>

      <fieldset className="card p-5 md:p-6 flex flex-col gap-4">
        <div>
          <legend className="text-base font-semibold text-gray-800">
            Enrolment agreement
          </legend>
          <p className="text-sm text-gray-500 mt-1">
            Read the agreement with {schoolName}, then sign by typing your full name.
          </p>
        </div>
        <ol className="max-h-64 overflow-y-auto rounded-lg bg-gray-50 ring-1 ring-gray-200 p-4 flex flex-col gap-3 text-sm text-gray-600 list-decimal list-inside">
          {terms.map((t) => (
            <li key={t.title}>
              <span className="font-medium text-gray-800">{t.title}.</span> {t.body}
            </li>
          ))}
        </ol>
        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 accent-indigo-500"
            {...register("acceptContract")}
          />
          I have read and agree to the enrolment agreement.
        </label>
        {errors.acceptContract?.message && (
          <p className="text-xs text-red-500 -mt-2">{errors.acceptContract.message}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Signature (type your full name)"
            registration={register("contractSignature")}
            error={errors.contractSignature}
            inputProps={{
              placeholder: fullName || "First and last name",
              className: "form-control font-serif italic text-base",
            }}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600">Date</span>
            <span className="text-sm text-gray-700 py-2">{today}</span>
          </div>
        </div>
      </fieldset>

      {state.error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {state.message ?? "Something went wrong. Please try again."}
        </p>
      )}
      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-600">
          Some details are missing or need fixing. Check the fields marked in red.
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Already have an account? Sign in
        </Link>
        <button className="btn-primary" disabled={pending}>
          {pending ? "Submitting..." : "Submit registration"}
        </button>
      </div>
    </form>
  );
};

const RegistrationReceived = ({ studentNumber }: { studentNumber: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="card p-6 md:p-8 flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-gray-800">Registration received</h2>
      <p className="text-sm text-gray-600 max-w-md">
        The school will review your registration and place you in a class. You
        can sign in once it has been approved.
      </p>
      <div className="flex flex-col items-center gap-1 my-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Your student number
        </span>
        <span className="text-3xl font-semibold tracking-wider text-indigo-600">
          {studentNumber}
        </span>
        <button
          type="button"
          className="text-xs text-indigo-500 hover:underline"
          onClick={() => {
            navigator.clipboard?.writeText(studentNumber).then(() => setCopied(true));
          }}
        >
          {copied ? "Copied" : "Copy number"}
        </button>
      </div>
      <p className="text-sm text-gray-600 max-w-md bg-lamaYellowLight rounded-lg px-4 py-3">
        Write this number down and give it to your parent or guardian. They need
        it, along with your date of birth, to create their parent account.
      </p>
      <Link href="/" className="btn-primary mt-2">
        Back to sign in
      </Link>
    </div>
  );
};

export default StudentRegistrationForm;
