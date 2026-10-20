import prisma from "@/lib/prisma";

import ClassesDashboard from "./components/ClassesDashboard";

export default async function ClassesPage() {
  const [teachers, classes] = await Promise.all([

    prisma.teacher.findMany({
      orderBy: [
        {
          name: "asc",
        },
        {
          surname: "asc",
        },
      ],

      select: {
        id: true,
        name: true,
        surname: true,
      },
    }),

    // --------------------------------------------------
    // Classes
    // --------------------------------------------------

    prisma.class.findMany({
      orderBy: {
        name: "asc",
      },

      include: {
        supervisor: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },

        _count: {
          select: {
            students: true,
          },
        },
      },
    }),
  ]);

  // --------------------------------------------------
  // Teacher Select Options
  // --------------------------------------------------

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher.id,
    label: `${teacher.name} ${teacher.surname}`,
  }));

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const summary = {
    totalClasses: classes.length,

    totalStudents: classes.reduce((sum, cls) => sum + cls._count.students, 0),

    totalCapacity: classes.reduce((sum, cls) => sum + cls.capacity, 0),

    assignedTeachers: classes.filter((cls) => Boolean(cls.supervisorId)).length,
  };

  return (
    <ClassesDashboard
      classes={classes}
      summary={summary}
      teacherOptions={teacherOptions}
    />
  );
}
