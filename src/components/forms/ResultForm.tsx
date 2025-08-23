"use client";

import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ExamSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createExam, updateExam } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReactSelectField from "../select2";
import { normalizeError } from "@/lib/utils";

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
  const { lessons = [] } = relatedData || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<ResultSchema>({
    defaultValues: {
      title: data?.title ?? "",
      startTime: data?.startTime
        ? new Date(data.startTime).toISOString().split("T")[0]
        : "",
      dueDate: data?.dueDate
        ? new Date(data.endTime).toISOString().split("T")[0]
        : "",
      lessonId: data?.lessonId ?? "",

    },
  });

  const [state, setState] = useState({ success: false, error: false });
  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result =
        type === "create"
          ? await createExam(state, { ...formData })
          : await updateExam(state, { ...formData });

      setState({ success: result.success, error: result.error });

      if (result.success) {
        toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      setState({ success: false, error: true });
    }
  });

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router, type, setOpen]);

  // Sync gradeId and classId values (if data changes)
  useEffect(() => {
    if (data?.lessonId) {
      const defaultGrade = lessons.find((l: any) => l.id === data.lessonId);
      if (defaultGrade) {
        setValue("lessonId", defaultGrade.id);
      }
    }
  }, [data, lessons, setValue]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new exam" : "Update the exam"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          register={register}
          error={errors?.title}
        />
        <InputField
          label="startTime"
          name="startTime"
          register={register}
          error={errors.startTime}
          type="date"
        />
        <InputField
          label="dueDate"
          name="dueDate"
          register={register}
          error={errors.dueDate}
          type="date"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <ReactSelectField
            name="lessonId"
            label="lesson"
            options={lessons.map((lesson: any) => ({
              value: lesson.id,
              label: lesson.name,
            }))}
            control={control}
            error={normalizeError(errors.lessonId)}
          />
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
