"use client";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { createClass, updateClass } from "@/lib/actions";
import { useEffect, useActionState, startTransition, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ClassSchema } from "@/lib/formValidationSchemas";

const initialState = {
  success: false,
  error: false,
};

const ClassForm = ({type, data,setOpen,relatedData }: 
  { type: "create" | "update"; data?: any;  setOpen:Dispatch<SetStateAction<boolean>>;relatedData?:any}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
   defaultValues: {
    name: data?.name || "",
    id: data?.id,
    capacity: data?.capacity || "",
    },
  });

  const [state, formAction] = useActionState(
    type ==="create" ? createClass : updateClass, initialState);

  // ✅ Ajout ici : submit avec startTransition
  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      formAction(formData);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);
 const { teachers,grades } = relatedData;
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update the class"}
      </h1>
      
       <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          register={register}
          error={errors?.capacity}
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
          <label className="text-xs text-gray-500">Supervisor</label>
         <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("supervisorId")}
              defaultValue={data?.supervisorId || ""}
            >
              <option value="" disabled>Select supervisor</option>
              {teachers.map((teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              ))}
            </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("gradeId")}
              defaultValue={data?.gradeId || ""}
            >
              <option value="" disabled>Select grade</option>
              {grades.map((grade: { id: number; label: number }) => (
                <option value={grade.id} key={grade.id}>
                  {grade.label}
                </option>
              ))}
            </select>

          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
