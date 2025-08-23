"use client";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { createLesson, updateLesson } from "@/lib/actions";
import { useEffect, useActionState, startTransition, Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LessonSchema } from "@/lib/formValidationSchemas";

const initialState = {
  success: false,
  error: false,
};

const LessonForm = ({type, data,setOpen,relatedData }: 
  { type: "create" | "update"; data?: any;  setOpen:Dispatch<SetStateAction<boolean>>;relatedData?:any}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
   defaultValues: {
    name: data?.name || "",
    id: data?.id || "",
    teachers: data?.teachers?.map((t: any) => t.id) || [],
    },
  });

  
  const [state, formAction] = useActionState(
    type ==="create" ? createLesson : updateLesson, initialState);

  // ✅ Ajout ici : submit avec startTransition
  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      formAction(formData);
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);
  
const teachers = relatedData?.teachers || [];

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Update the subject"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson name"
          name="name"
          register={register}
          error={errors?.name}
        />
        {data &&(
          <InputField
          label="id"
          name="id"
          register={register}
          error={errors?.id}
          hidden
        />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teachers")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
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

export default LessonForm;
