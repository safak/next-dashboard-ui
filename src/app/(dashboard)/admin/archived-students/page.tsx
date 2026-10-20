import { prisma } from "@/lib/prisma";
import { StudentStatus } from "@prisma/client";

import StudentManagementDashboard from "../students/components/StudentManagementContent";
import { StudentSummary } from "@/types/student";

export default async function ArchivedStudentsPage() {
  const students = await prisma.student.findMany({
    where: {
      status: StudentStatus.ARCHIVED,
    },
    include: {
      class: true,
      parent: true,
      academicYear: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const formattedStudents = students.map((student) => ({
    id: student.id,

    admissionNo: student.admissionNo,
    rollNo: student.rollNo,

    name: student.name,
    surname: student.surname,
    fullName: `${student.name} ${student.surname}`,

    gender: student.sex,

    phone: student.phone,
    email: student.email,

    status: student.status,

    className: student.class.name,
    academicYear: student.academicYear.label,

    admissionDate: student.admissionDate,

    parentName: student.parent.name,
    parentPhone: student.parent.phone,
    parentEmail: student.parent.email,

    birthday: student.birthday,

    bloodType: student.bloodType,

    address: student.address,

    image: student.img,
  }));

  const summary: StudentSummary = {
    totalStudents: students.length,
    newAdmissions: 0,
    boys: students.filter((s) => s.sex === "MALE").length,
    girls: students.filter((s) => s.sex === "FEMALE").length,
  };

  return (
    <StudentManagementDashboard
      students={formattedStudents}
      summary={summary}
      archived
    />
  );
}
