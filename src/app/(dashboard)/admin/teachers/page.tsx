import prisma from "@/lib/prisma";

import TeachersDashboard from "./components/TeachersDashboard";

export default async function TeachersPage() {
  const [teachers, subjects] = await Promise.all([
    prisma.teacher.findMany({
      orderBy: [
        {
          name: "asc",
        },
        {
          surname: "asc",
        },
      ],

      include: {
        subjects: {
          select: {
            id: true,
            name: true,
          },

          orderBy: {
            name: "asc",
          },
        },

        supervisedClasses: {
          select: {
            id: true,
            name: true,
          },

          orderBy: {
            name: "asc",
          },
        },

        _count: {
          select: {
            lessons: true,
            supervisedClasses: true,
            subjects: true,
          },
        },
      },
    }),

    prisma.subject.findMany({
      select: {
        id: true,
        name: true,
      },

      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const subjectOptions = subjects.map((subject) => ({
    value: String(subject.id),
    label: subject.name,
  }));

  const summary = {
    totalTeachers: teachers.length,

    teachersWithClasses: teachers.filter(
      (teacher) => teacher.supervisedClasses.length > 0,
    ).length,

    teachersWithSubjects: teachers.filter(
      (teacher) => teacher.subjects.length > 0,
    ).length,

    totalLessons: teachers.reduce(
      (sum, teacher) => sum + teacher._count.lessons,
      0,
    ),
  };

  return (
    <TeachersDashboard
      teachers={teachers}
      subjects={subjects}
      subjectOptions={subjectOptions}
      summary={summary}
    />
  );
}
