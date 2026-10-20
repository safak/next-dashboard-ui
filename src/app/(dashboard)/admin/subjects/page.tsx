// src/app/(dashboard)/admin/subjects/page.tsx

import prisma from "@/lib/prisma";

import SubjectsDashboard from "./components/SubjectsDashboard";

export default async function SubjectsPage() {
  const [subjects, teachers] = await Promise.all([
    prisma.subject.findMany({
      select: {
        id: true,
        name: true,

        teachers: {
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
        },

        _count: {
          select: {
            lessons: true,
            teachers: true,
          },
        },
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
    <SubjectsDashboard
      subjects={subjects}
      teachers={teachers}
    />
  );
}