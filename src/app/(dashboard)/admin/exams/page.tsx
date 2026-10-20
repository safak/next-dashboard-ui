import prisma from "@/lib/prisma";

import ExamsDashboard from "./components/ExamsDashboard";

export default async function ExamsPage() {
  const [exams, classes, subjects, teachers] = await Promise.all([
    prisma.exam.findMany({
      include: {
        class: true,
        subject: true,
        teacher: true,

        _count: {
          select: {
            evaluations: true,
          },
        },
      },

      orderBy: {
        examDate: "asc",
      },
    }),

    prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },

      orderBy: {
        order: "asc",
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
    <ExamsDashboard
      exams={exams}
      classes={classes}
      subjects={subjects}
      teachers={teachers}
    />
  );
}
