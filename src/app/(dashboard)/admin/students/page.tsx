import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StudentStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import StudentManagementContent from "./components/StudentManagementContent";
import type { Student, StudentSummary } from "@/types/student";

export default async function StudentsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [totalStudents, newAdmissions, students] = await Promise.all([
    prisma.student.count({
      where: {
        status: {
          not: StudentStatus.ARCHIVED,
        },
      },
    }),

    prisma.student.count({
      where: {
        status: {
          not: StudentStatus.ARCHIVED,
        },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),

    prisma.student.findMany({
      where: {
        status: {
          not: StudentStatus.ARCHIVED,
        },
      },
      include: {
        class: true,
        academicYear: true,
        parent: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const studentList: Student[] = students.map((student) => ({
    id: student.id,

    admissionNo: student.admissionNo,
    rollNo: student.rollNo,

    name: student.name,
    surname: student.surname,
    fullName: `${student.name} ${student.surname}`,

    gender: student.sex,

    phone: student.parent.phone,
    email: student.parent.email,

    status: student.status,

    className: student.class.name,
    academicYear: student.academicYear.label,

    parentName: `${student.parent.name} ${student.parent.surname}`,
    parentPhone: student.parent.phone,
    parentEmail: student.parent.email,

    bloodType: student.bloodType,
    birthday: student.birthday,

    address: student.address,

    admissionDate: student.admissionDate,

    image: student.img,

    attendancePercentage: 0,
    dueAmount: 0,
  }));

  const boys = students.filter((student) => student.sex === "MALE").length;

  const girls = students.filter((student) => student.sex === "FEMALE").length;

  const summary: StudentSummary = {
    totalStudents,
    newAdmissions,
    boys,
    girls,
  };

  return <StudentManagementContent students={studentList} summary={summary} />;
}
