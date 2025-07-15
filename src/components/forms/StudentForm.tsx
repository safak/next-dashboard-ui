"use client";

import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StudentSchema } from "@/lib/formValidationSchemas";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputFile from "../InputFile";
import ComboboxField from "../ComboBox";
import ReactSelectField from "../select2";
import { normalizeError } from "@/lib/utils";

const StudentForm = ({
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
  const { grades = [], classes = [] } = relatedData || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<StudentSchema>({
    defaultValues: {
      name: data?.name ?? "",
      surname: data?.surname ?? "",
      email: data?.email ?? "",
      username: data?.username ?? "",
      phone: data?.phone ?? "",
      address: data?.address ?? "",
      bloodType: data?.bloodType ?? "",
      birthday: data?.birthday
        ? new Date(data.birthday).toISOString().split("T")[0]
        : "",
      sex: data?.sex ?? "",
      id: data?.id ?? "",
      img: data?.img ?? "",
      parentId: data?.parentId ?? "",
      classId: data?.classId,
      gradeId: data?.gradeId,
    },
  });

  const [img, setImg] = useState<string | undefined>(data?.img);
  const [state, setState] = useState({ success: false, error: false });
  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result =
        type === "create"
          ? await createStudent(state, { ...formData, img })
          : await updateStudent(state, { ...formData, img });

      setState({ success: result.success, error: result.error });

      if (result.success) {
        toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      setState({ success: false, error: true });
    }
  });

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router, type, setOpen]);

  // Sync gradeId and classId values (if data changes)
  useEffect(() => {
    if (data?.gradeId) {
      const defaultGrade = grades.find((g: any) => g.id === data.gradeId);
      if (defaultGrade) {
        setValue("gradeId", defaultGrade.id);
      }
    }
    if (data?.classId) {
      const defaultClass = classes.find((c: any) => c.id === data.classId);
      if (defaultClass) {
        setValue("classId", defaultClass.id);
      }
    }
  }, [data, grades, classes, setValue]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <InputFile
          label="Upload photo"
          defaultValue={data?.img}
          onChange={(imgBase64OrUrl) => setImg(imgBase64OrUrl)}
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors?.password}
        />
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          register={register}
          error={errors.birthday}
          type="date"
        />
        <InputField
          label="Parent id"
          name="parentId"
          register={register}
          error={errors.parentId}
          hidden
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
          <ComboboxField
            name="sex"
            label="Sex"
            datas={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            value={watch("sex")}
            error={errors.sex}
            setValue={setValue}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
         <ReactSelectField
  name="gradeId"
  label="Grade"
  options={grades.map((grade: any) => ({
    value: grade.id,
    label: grade.label,
  }))}
  control={control}
  error={normalizeError(errors.gradeId)}
/>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <ReactSelectField
  name="classId"
  label="Class"
  options={classes.map((classItem: any) => ({
    value: classItem.id,
    label: `${classItem.name} - ${classItem._count.students}/${classItem.capacity} capacity`,
  }))}
  control={control}
  error={normalizeError(errors.classId)}
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

export default StudentForm;
