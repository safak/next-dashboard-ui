import prisma from "@/lib/prisma";

import ParentsDashboard from "./components/ParentsDashboard";

export default async function ParentsPage() {
  const parents = await prisma.parent.findMany({
    orderBy: [
      {
        name: "asc",
      },
      {
        surname: "asc",
      },
    ],

    include: {
      // --------------------------------------------------
      // Students linked to parent
      // --------------------------------------------------

      students: {
        select: {
          id: true,
          name: true,
          surname: true,

          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      },

      // --------------------------------------------------
      // Related counts
      // --------------------------------------------------

      _count: {
        select: {
          students: true,
        },
      },
    },
  });

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const summary = {
    totalParents: parents.length,

    parentsWithStudents: parents.filter((parent) => parent.students.length > 0)
      .length,

    linkedStudents: parents.reduce(
      (sum, parent) => sum + parent._count.students,
      0,
    ),
  };

  return <ParentsDashboard parents={parents} summary={summary} />;
}
