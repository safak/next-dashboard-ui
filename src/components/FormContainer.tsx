import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type FormType = "create" | "update" | "delete" | "assign" | "view";

export type FormContainerProps = {
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
    | "holiday"
    | "fee"
    | "payment"
    | "profile";
  type: FormType;
  data?: any;
  id?: number | string;
  relatedData?: {
    subjects?: { id: number; name: string }[];
    classes?: { id: number; name: string }[];
    lessons?: {
      id: number;
      name: string;
      classId: number;
      className: string;
    }[];
  };
  trigger?: React.ReactNode;
  tooltip?: string;
  query?: string;
};

const FormContainer = async ({
  table,
  type,
  data,
  id,
  trigger,
  tooltip,
  query,
}: FormContainerProps) => {
  let relatedData: any = {};

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  /* ================= BUILD RELATED DATA ================= */
  if (type !== "delete") {
    switch (table) {
      case "subject":
        relatedData = {
          teachers: await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
        };
        break;

      case "class":
        relatedData = {
          teachers: await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
          grades: await prisma.grade.findMany({
            select: { id: true, level: true },
          }),
        };
        break;

      case "teacher":
        relatedData = {
          subjects: await prisma.subject.findMany({
            select: { id: true, name: true },
          }),
        };
        break;

      case "student":
        relatedData = {
          classes: await prisma.class.findMany({
            include: { _count: { select: { students: true } } },
          }),
          grades: await prisma.grade.findMany({
            select: { id: true, level: true },
          }),
          parents: await prisma.parent.findMany({
            select: { id: true, name: true, surname: true, phone: true },
          }),
        };
        break;

      case "exam": {
        const lessonFilter: Prisma.LessonWhereInput = {};

        if (role === "teacher") {
          const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUserId! },
          });

          if (teacher) {
            lessonFilter.teacherId = teacher.id;
          }
        }

        const lessons = await prisma.lesson.findMany({
          where: lessonFilter,
          include: { class: true },
          orderBy: { name: "asc" },
        });

        relatedData = {
          lessons: lessons.map((l) => ({
            id: l.id,
            name: l.name,
            classId: l.classId,
            className: l.class.name,
          })),
        };
        break;
      }

      case "lesson":
        relatedData = {
          subjects: await prisma.subject.findMany({
            select: { id: true, name: true },
          }),
          classes: await prisma.class.findMany({
            select: { id: true, name: true },
          }),
          teachers: await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
        };
        break;

      case "assignment": {
        const teacher =
          role === "teacher"
            ? await prisma.teacher.findUnique({
                where: { userId: currentUserId! },
                select: { id: true },
              })
            : null;

        relatedData = {
          classes: await prisma.class.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
          }),

          subjects: await prisma.subject.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
          }),

          teachers: teacher
            ? await prisma.teacher.findMany({
                where: { id: teacher.id },
                select: { id: true, name: true, surname: true },
              })
            : await prisma.teacher.findMany({
                select: { id: true, name: true, surname: true },
                orderBy: { name: "asc" },
              }),
        };

        break;
      }

      case "result": {
        let teacherFilter: Prisma.LessonWhereInput = {};

        if (role === "teacher") {
          const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUserId! },
          });

          if (teacher) {
            teacherFilter.teacherId = teacher.id;
          }
        }

        const lessons = await prisma.lesson.findMany({
          where: teacherFilter,
          include: { class: true },
        });

        const classIds = [...new Set(lessons.map((l) => l.classId))];

        const students = await prisma.student.findMany({
          where: {
            ...(role === "teacher" ? { classId: { in: classIds } } : {}),
          },
          include: { class: true },
        });

        const exams = await prisma.exam.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          include: {
            class: true,
          },
        });

        const assignments = await prisma.assignment.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          include: {
            class: true,
          },
        });

        relatedData = {
          students: students.map((s) => ({
            id: s.id,
            name: s.name,
            surname: s.surname,
            classId: s.classId,
            className: s.class.name,
          })),

          exams: exams.map((e) => ({
            id: e.id,
            title: e.title,
            classId: e.classId,
          })),

          assignments: assignments.map((a) => ({
            id: a.id,
            title: a.title,
            classId: a.classId,
          })),
        };

        break;
      }

      case "event":
      case "announcement":
        relatedData = {
          classes: await prisma.class.findMany({
            select: { id: true, name: true },
          }),
        };
        break;

      case "holiday":
        relatedData = {};
        break;

      case "attendance": {
        let lessonFilter: Prisma.LessonWhereInput = {};

        if (role === "teacher") {
          const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUserId! },
          });

          if (teacher) {
            lessonFilter.teacherId = teacher.id;
          }
        }

        const lessons = await prisma.lesson.findMany({
          where: lessonFilter,
          include: {
            subject: true,
            class: true,
          },
          orderBy: { id: "asc" },
        });

        const classIds = [...new Set(lessons.map((l) => l.classId))];

        const students = await prisma.student.findMany({
          where: {
            ...(role === "teacher" ? { classId: { in: classIds } } : {}),
          },
          include: { class: true },
        });

        relatedData = {
          lessons: lessons.map((l) => ({
            id: l.id,
            subjectName: l.subject.name,
            classId: l.classId,
            className: l.class.name,
          })),

          students: students.map((s) => ({
            id: s.id,
            name: s.name,
            surname: s.surname,
            classId: s.classId,
            className: s.class.name,
          })),
        };

        break;
      }

      case "fee":
        relatedData = {
          classes: await prisma.class.findMany({
            select: { id: true, name: true },
          }),
          students: await prisma.student.findMany({
            select: { id: true, name: true },
          }),
          feeStructures: await prisma.feeStructure.findMany({
            where: { isActive: true },
            select: { id: true, title: true },
          }),
        };
        break;

      case "payment":
        relatedData = {
          students: await prisma.student.findMany({
            select: { id: true, name: true, surname: true },
          }),
        };
        break;

      case "profile":
        if (!currentUserId || !role) break;

        if (role === "admin") {
          relatedData = {
            profile: await prisma.admin.findUnique({
              where: { id: currentUserId },
            }),
          };
        }

        if (role === "teacher") {
          relatedData = {
            profile: await prisma.teacher.findUnique({
              where: { id: currentUserId },
            }),
          };
        }

        if (role === "student") {
          relatedData = {
            profile: await prisma.student.findUnique({
              where: { id: currentUserId },
              include: { class: { select: { name: true } } },
            }),
          };
        }

        if (role === "parent") {
          relatedData = {
            profile: await prisma.parent.findUnique({
              where: { id: currentUserId },
              include: {
                students: { select: { name: true, surname: true } },
              },
            }),
          };
        }
        break;
    }
  }

  const content = (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      relatedData={relatedData}
      trigger={trigger}
      query={query}
    />
  );

  return tooltip ? (
    <div className="relative inline-block group">
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 hidden whitespace-nowrap rounded-md bg-black px-2 py-1 text-[10px] text-white group-hover:block">
        {tooltip}
      </span>
      {content}
    </div>
  ) : (
    <>{content}</>
  );
};

export default FormContainer;
