import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

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
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
      case "lesson":
        const [lessonSubjects, lessonClasses, lessonTeachers] =
          await prisma.$transaction([
            prisma.subject.findMany({ select: { id: true, name: true } }),
            prisma.class.findMany({ select: { id: true, name: true } }),
            prisma.teacher.findMany({
              select: { id: true, name: true, surname: true },
            }),
          ]);
        relatedData = {
          subjects: lessonSubjects,
          classes: lessonClasses,
          teachers: lessonTeachers,
        };
        break;
      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: assignmentLessons };
        break;
      case "result":
        // Teachers only see their own exams/assignments and the students
        // in the classes they teach
        const teacherLesson =
          role === "teacher" ? { teacherId: currentUserId! } : {};
        const [resultStudents, resultExams, resultAssignments] =
          await prisma.$transaction([
            prisma.student.findMany({
              where:
                role === "teacher"
                  ? { class: { lessons: { some: teacherLesson } } }
                  : {},
              select: { id: true, name: true, surname: true },
              orderBy: { name: "asc" },
            }),
            prisma.exam.findMany({
              where: { lesson: teacherLesson },
              select: { id: true, title: true },
            }),
            prisma.assignment.findMany({
              where: { lesson: teacherLesson },
              select: { id: true, title: true },
            }),
          ]);
        relatedData = {
          students: resultStudents,
          exams: resultExams,
          assignments: resultAssignments,
        };
        break;
      case "attendance":
        const attendanceLessonFilter =
          role === "teacher" ? { teacherId: currentUserId! } : {};
        const [attendanceStudents, attendanceLessons] =
          await prisma.$transaction([
            prisma.student.findMany({
              where:
                role === "teacher"
                  ? { class: { lessons: { some: attendanceLessonFilter } } }
                  : {},
              select: { id: true, name: true, surname: true },
              orderBy: { name: "asc" },
            }),
            prisma.lesson.findMany({
              where: attendanceLessonFilter,
              select: { id: true, name: true },
            }),
          ]);
        relatedData = {
          students: attendanceStudents,
          lessons: attendanceLessons,
        };
        break;
      case "event":
      case "announcement":
        const audienceClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        relatedData = { classes: audienceClasses };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
