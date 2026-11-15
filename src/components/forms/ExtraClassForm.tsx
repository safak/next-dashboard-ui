"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";
import SelectField from "../SelectField";
import {
  extraClassSchema,
  ExtraClassSchema,
} from "@/lib/formValidationSchemas";
import { createExtraClass, updateExtraClass } from "@/lib/actions";
import { useFormAction } from "./useFormAction";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

const ExtraClassForm = ({
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
  } = useForm<ExtraClassSchema>({
    resolver: zodResolver(extraClassSchema),
  });

  const { submit, pending, errorMessage } = useFormAction(
    type === "create" ? createExtraClass : updateExtraClass,
    { entity: "Extra class", type, setOpen }
  );

  const { subjects, teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(submit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create an extra class" : "Update the extra class"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
          inputProps={{ placeholder: "e.g. Algebra revision" }}
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
          type="time"
          defaultValue={data?.startTime ?? "15:00"}
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="time"
          defaultValue={data?.endTime ?? "16:00"}
          register={register}
          error={errors?.endTime}
        />
        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          defaultValue={data?.capacity ?? 20}
          register={register}
          error={errors?.capacity}
          inputProps={{ min: 1, max: 500 }}
        />
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs font-medium text-gray-500">
            Description (optional)
          </label>
          <textarea
            rows={3}
            className="form-control resize-y"
            defaultValue={data?.description ?? ""}
            {...register("description")}
          />
          {errors.description?.message && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>
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
      <button className="btn-primary" disabled={pending}>
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ExtraClassForm;
