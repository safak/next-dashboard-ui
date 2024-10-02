"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
    subjectname: z
    .string()
    .min(2, { message: "Subject Name must be at least 3 characters long!" })
    .max(20, { message: "Subject must be at most 20 characters long!" }),
    class: z.string()
    ,
    teacher: z
    .string()
    .min(1,{message: "Grade must be at least 1 characters long!"})
    ,
    date: z
    .string()
    .min(1,{message: "Grade must be at least 1 characters long!"})
    ,
    
    // date: z.string().min(1, { message: "supervisor name is required!" }),
 
});

type Inputs = z.infer<typeof schema>;

const ExamForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Add new class</h1>
      <span className="text-xs text-gray-400 font-medium">
         Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="subjectname"
          defaultValue={data?.subjectname}
          register={register}
          error={errors?.subjectname}
        />
        <InputField
          label="Class"
          name="class"
          defaultValue={data?.class}
          register={register}
          error={errors?.class}
        />
        <InputField
          label="Teacher"
          name="teacher"
          type="text"
          defaultValue={data?.teacher}
          register={register}
          error={errors?.teacher}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className=" ml-3 w-[90%]">
        <InputField
          label="Exam Date"
          name="date"
          type="text"
          defaultValue={data?.date}
          register={register}
          error={errors.date}
        />
    
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ExamForm;