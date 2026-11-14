"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";
import SelectField from "../SelectField";
import {
  assignmentSchema,
  AssignmentSchema,
} from "@/lib/formValidationSchemas";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { useFormAction } from "./useFormAction";
import { toDateTimeInput } from "./formUtils";

const AssignmentForm = ({
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
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  const { submit, pending, errorMessage } = useFormAction(
    type === "create" ? createAssignment : updateAssignment,
    { entity: "Assignment", type, setOpen }
  );

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(submit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new assignment" : "Update the assignment"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startDate"
          type="datetime-local"
          defaultValue={toDateTimeInput(data?.startDate)}
          register={register}
          error={errors?.startDate}
        />
        <InputField
          label="Due Date"
          name="dueDate"
          type="datetime-local"
          defaultValue={toDateTimeInput(data?.dueDate)}
          register={register}
          error={errors?.dueDate}
        />
        <SelectField
          label="Lesson"
          name="lessonId"
          register={register}
          defaultValue={data?.lessonId}
          error={errors?.lessonId}
          options={lessons.map((l: { id: number; name: string }) => ({
            value: l.id,
            label: l.name,
          }))}
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

export default AssignmentForm;
