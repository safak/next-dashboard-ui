"use client";

import { deleteAssignment, deleteClass, deleteEvent, deleteExam, deleteLesson, deleteParent, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  parent: deleteParent,
  lesson: deleteLesson,
  assignment: deleteAssignment,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteEvent,
  announcement: deleteSubject,
};

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ParentForm = dynamic(() => import("./forms/ParentForm "), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});
const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?:any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
    //TODO OTHER LIST ITEMS
  ),
  parent: (setOpen, type, data, relatedData) => (
    <ParentForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
  ),
  lesson: (setOpen, type, data, relatedData) => (
    <LessonForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
  ),
  assignment: (setOpen, type, data, relatedData) => (
    <AssignmentForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
    setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}

    />
  )
};
const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData
}: FormContainerProps & {relatedData?:any}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const Form = () => {

    const [state, formAction] = useFormState(deleteActionMap[table], { success: false, error: false });
    const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`${table} has been deleted`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router])
    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" defaultValue={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };
  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
