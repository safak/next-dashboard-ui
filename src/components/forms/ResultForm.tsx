"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { useFormAction } from "./useFormAction";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const { submit, pending, errorMessage } = useFormAction(
    type === "create" ? createResult : updateResult,
    { entity: "Result", type, setOpen }
  );

  const { students, exams, assignments } = relatedData;

  const assessmentOptions = [
    ...exams.map((e: { id: number; title: string }) => ({
      value: `exam-${e.id}`,
      label: `Exam: ${e.title}`,
    })),
    ...assignments.map((a: { id: number; title: string }) => ({
      value: `assignment-${a.id}`,
      label: `Assignment: ${a.title}`,
    })),
  ];

  const currentAssessment = data?.examId
    ? `exam-${data.examId}`
    : data?.assignmentId
    ? `assignment-${data.assignmentId}`
    : undefined;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(submit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <SelectField
          label="Student"
          name="studentId"
          register={register}
          defaultValue={data?.studentId}
          error={errors?.studentId}
          placeholder="Select a student"
          options={students.map(
            (s: { id: string; name: string; surname: string }) => ({
              value: s.id,
              label: `${s.name} ${s.surname}`,
            })
          )}
        />
        <SelectField
          label="Exam / Assignment"
          name="assessment"
          register={register}
          defaultValue={currentAssessment}
          error={errors?.assessment}
          placeholder="Select an exam or assignment"
          options={assessmentOptions}
        />
        <InputField
          label="Score (0-100)"
          name="score"
          type="number"
          defaultValue={data?.score}
          register={register}
          error={errors?.score}
          inputProps={{ min: 0, max: 100 }}
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
      </div>
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      <button
        className="btn-primary"
        disabled={pending}
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
