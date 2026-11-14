"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { useFormAction } from "./useFormAction";
import { toDateTimeInput } from "./formUtils";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

const LessonForm = ({
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
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const { submit, pending, errorMessage } = useFormAction(
    type === "create" ? createLesson : updateLesson,
    { entity: "Lesson", type, setOpen }
  );

  const { subjects, classes, teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(submit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Update the lesson"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <SelectField
          label="Day"
          name="day"
          register={register}
          defaultValue={data?.day}
          error={errors?.day}
          options={DAYS.map((day) => ({
            value: day,
            label: day.charAt(0) + day.slice(1).toLowerCase(),
          }))}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={toDateTimeInput(data?.startTime)}
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={toDateTimeInput(data?.endTime)}
          register={register}
          error={errors?.endTime}
        />
        <SelectField
          label="Subject"
          name="subjectId"
          register={register}
          defaultValue={data?.subjectId}
          error={errors?.subjectId}
          options={subjects.map((s: { id: number; name: string }) => ({
            value: s.id,
            label: s.name,
          }))}
        />
        <SelectField
          label="Class"
          name="classId"
          register={register}
          defaultValue={data?.classId}
          error={errors?.classId}
          options={classes.map((c: { id: number; name: string }) => ({
            value: c.id,
            label: c.name,
          }))}
        />
        <SelectField
          label="Teacher"
          name="teacherId"
          register={register}
          defaultValue={data?.teacherId}
          error={errors?.teacherId}
          options={teachers.map(
            (t: { id: string; name: string; surname: string }) => ({
              value: t.id,
              label: `${t.name} ${t.surname}`,
            })
          )}
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

export default LessonForm;
