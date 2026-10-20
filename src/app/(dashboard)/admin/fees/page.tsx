import prisma from "@/lib/prisma";

import FeesDashboard from "./components/FeesDashboard";

export default async function FeesPage() {
  const [fees, students, classes, academicYears, feeStructures] =
    await Promise.all([
      prisma.studentFee.findMany({
        include: {
          student: {
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

              academicYear: {
                select: {
                  id: true,
                  label: true,
                },
              },
            },
          },

          plan: {
            select: {
              id: true,
              originalFee: true,
              discount: true,
              finalFee: true,
              admissionAmount: true,
              term1Amount: true,
              term2Amount: true,

              academicYear: {
                select: {
                  id: true,
                  label: true,
                },
              },

              feeStructure: {
                select: {
                  id: true,
                  title: true,
                  annualFee: true,
                  admissionFee: true,
                  classId: true,
                  isActive: true,
                },
              },
            },
          },

          payments: {
            select: {
              id: true,
              amount: true,
              paidAt: true,
              referenceId: true,
              mode: true,
            },

            orderBy: {
              paidAt: "desc",
            },
          },

          _count: {
            select: {
              payments: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.student.findMany({
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
      }),

      prisma.class.findMany({
        select: {
          id: true,
          name: true,
        },

        orderBy: {
          name: "asc",
        },
      }),

      prisma.academicYear.findMany({
        where: {
          isActive: true,
        },

        select: {
          id: true,
          label: true,
        },

        orderBy: {
          label: "desc",
        },
      }),

      prisma.feeStructure.findMany({
        where: {
          isActive: true,
        },

        select: {
          id: true,
          title: true,
          annualFee: true,
          admissionFee: true,
          classId: true,
          isActive: true,
        },

        orderBy: {
          title: "asc",
        },
      }),
    ]);

  return (
    <FeesDashboard
      fees={fees}
      students={students}
      classes={classes}
      academicYears={academicYears}
      feeStructures={feeStructures}
    />
  );
}