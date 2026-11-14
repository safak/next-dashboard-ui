"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";
import SelectField from "../SelectField";
import {
  attendanceSchema,
  AttendanceSchema,
} from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useFormAction } from "./useFormAction";
import { toDateInput } from "./formUtils";

const AttendanceForm = ({
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
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });

  const { submit, pending, errorMessage } = useFormAction(
    type === "create" ? createAttendance : updateAttendance,
    { entity: "Attendance", type, setOpen }
  );

  const { students, lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(submit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Record attendance" : "Update attendance"}
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
        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={toDateInput(data?.date ?? new Date())}
          register={register}
          error={errors?.date}
        />
        <SelectField
          label="Status"
          name="present"
          register={register}
          defaultValue={data ? String(data.present) : "true"}
          error={errors?.present}
          options={[
            { value: "true", label: "Present" },
            { value: "false", label: "Absent" },
          ]}
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

export default AttendanceForm;
