import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { getUserSessionInfo } from "@/lib/session";

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
 const { role, currentUserId } = await getUserSessionInfo();
  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        
        relatedData = { teachers: subjectTeachers };

        break;
         case "lesson":
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        
        relatedData = { teachers: lessonTeachers };

        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, label: true 

          },
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
          select: { id: true,label: true 
          },
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
         case "result":
        const examLessonsExams = await prisma.lesson.findMany({
           where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          }, 
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessonsExams };
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
