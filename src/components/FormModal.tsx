"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import FormDelete from "./FormDelete";
import {
  deleteAnnouncement,
  deleteAssignment,
  deleteAttendance,
  deleteClass,
  deleteEvent,
  deleteExtraClass,
  deleteExam,
  deleteLesson,
  deleteMessage,
  deleteParent,
  deleteResult,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "@/lib/actions";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
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
const ExtraClassForm = dynamic(() => import("./forms/ExtraClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const MessageForm = dynamic(() => import("./forms/MessageForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    data: any,
    setOpen: Dispatch<SetStateAction<boolean>>,
    relatedData?: any
  ) => JSX.Element;
} = {
  teacher: (type, data, setOpen, relatedData) => (
    <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  student: (type, data, setOpen, relatedData) => (
    <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  subject: (type, data, setOpen, relatedData) => (
    <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  class: (type, data, setOpen, relatedData) => (
    <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  exam: (type, data, setOpen, relatedData) => (
    <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  parent: (type, data, setOpen, relatedData) => (
    <ParentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  lesson: (type, data, setOpen, relatedData) => (
    <LessonForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  assignment: (type, data, setOpen, relatedData) => (
    <AssignmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  result: (type, data, setOpen, relatedData) => (
    <ResultForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  attendance: (type, data, setOpen, relatedData) => (
    <AttendanceForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  event: (type, data, setOpen, relatedData) => (
    <EventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  extraClass: (type, data, setOpen, relatedData) => (
    <ExtraClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  message: (type, data, setOpen, relatedData) => (
    <MessageForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  announcement: (type, data, setOpen, relatedData) => (
    <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
};

const deleteActions: {
  [key: string]: (
    currentState: { success: boolean; error: boolean },
    formData: FormData
  ) => Promise<{ success: boolean; error: boolean; message?: string }>;
} = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  parent: deleteParent,
  lesson: deleteLesson,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
  event: deleteEvent,
  announcement: deleteAnnouncement,
  message: deleteMessage,
  extraClass: deleteExtraClass,
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "message"
    | "extraClass";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  relatedData?: any;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const deleteAction = deleteActions[table];

  const Form = () => {
    if (type === "delete" && id) {
      if (!deleteAction) {
        return (
          <p className="p-4 text-center text-sm text-gray-500">
            Delete is not available for {table} yet.
          </p>
        );
      }

      return (
        <FormDelete
          table={table}
          id={id}
          deleteAction={deleteAction}
          onClose={() => setOpen(false)}
        />
      );
    }

    if (type === "create" || type === "update") {
      if (!forms[table]) {
        return (
          <p className="p-4 text-center text-sm text-gray-500">
            Form for {table} is not available yet.
          </p>
        );
      }

      return forms[table](type, data, setOpen, relatedData);
    }

    return <p className="p-4 text-center text-sm text-gray-500">Form not found!</p>;
  };

  return (
    <>
      <button
        type="button"
        title={`${type.charAt(0).toUpperCase() + type.slice(1)} ${table}`}
        className={`${size} flex items-center justify-center rounded-full ${bgColor} transition hover:brightness-95 hover:shadow-sm`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white p-6 rounded-2xl shadow-xl relative w-full md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto"
          >
            <Form />
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
