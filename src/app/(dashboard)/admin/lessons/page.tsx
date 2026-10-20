import prisma from "@/lib/prisma";

import LessonsDashboard from "./components/LessonsDashboard";

export default async function LessonsPage() {
  const [lessons, subjects, classes, teachers] = await Promise.all([
    prisma.lesson.findMany({
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },

        class: {
          select: {
            id: true,
            name: true,
            academicYear: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },

        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },

      orderBy: {
        startTime: "asc",
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

    prisma.class.findMany({
      select: {
        id: true,
        name: true,
        academicYear: {
          select: {
            id: true,
            label: true,
          },
        },
      },

      orderBy: [
        {
          academicYearId: "desc",
        },
        {
          order: "asc",
        },
      ],
    }),

    prisma.teacher.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
      },

      orderBy: [
        {
          name: "asc",
        },
        {
          surname: "asc",
        },
      ],
    }),
  ]);

  return (
    <LessonsDashboard
      lessons={lessons}
      subjects={subjects}
      classes={classes}
      teachers={teachers}
    />
  );
}
