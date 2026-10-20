import prisma from "@/lib/prisma";

import AdmissionsDashboard from "./components/AdmissionsDashboard";

export default async function AdmissionsPage() {
  const [students, academicYears, classes, parents, feeStructures] =
    await Promise.all([
      prisma.student.findMany({
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },

          parent: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
              phone: true,
            },
          },

          academicYear: {
            select: {
              id: true,
              label: true,
              isActive: true,
            },
          },

          studentFees: {
            select: {
              id: true,
              planId: true,
              installment: true,
              totalAmount: true,
              paidAmount: true,
              status: true,
              dueDate: true,
              receiptNo: true,

              plan: {
                select: {
                  id: true,
                  originalFee: true,
                  discount: true,
                  finalFee: true,
                  admissionAmount: true,
                  term1Amount: true,
                  term2Amount: true,

                  feeStructure: {
                    select: {
                      id: true,
                      title: true,
                      annualFee: true,
                      admissionFee: true,
                    },
                  },
                },
              },
            },

            orderBy: {
              id: "asc",
            },
          },

          studentDocuments: {
            select: {
              id: true,
              documentType: true,
              originalFileName: true,
              fileUrl: true,
              mimeType: true,
              fileSize: true,
              uploadedAt: true,
            },
          },
        },

        orderBy: {
          admissionDate: "desc",
        },
      }),

      prisma.academicYear.findMany({
        orderBy: {
          id: "desc",
        },

        select: {
          id: true,
          label: true,
          isActive: true,
        },
      }),

      prisma.class.findMany({
        orderBy: {
          name: "asc",
        },

        select: {
          id: true,
          name: true,
        },
      }),

      prisma.parent.findMany({
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

      prisma.feeStructure.findMany({
        where: {
          isActive: true,
        },

        orderBy: [
          {
            classId: "asc",
          },
          {
            title: "asc",
          },
        ],

        select: {
          id: true,
          title: true,
          annualFee: true,
          admissionFee: true,
          classId: true,
          isActive: true,
        },
      }),
    ]);

  const academicYearOptions = academicYears.map((year) => ({
    value: String(year.id),
    label: year.label,
  }));

  const classOptions = classes.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const parentOptions = parents.map((parent) => ({
    value: String(parent.id),
    label: `${parent.name} ${parent.surname}`.trim(),
  }));

  const feeStructureOptions = feeStructures.map((fee) => ({
    value: String(fee.id),

    label: `${fee.title} - ₹${fee.annualFee.toLocaleString("en-IN")}`,

    annualFee: fee.annualFee,

    admissionFee: fee.admissionFee,

    classId: fee.classId,
  }));

  const serializedStudents = students.map((student) => ({
    ...student,

    birthday: student.birthday ? student.birthday.toISOString() : null,

    admissionDate: student.admissionDate.toISOString(),

    createdAt: student.createdAt.toISOString(),

    updatedAt: student.updatedAt.toISOString(),

    studentFees: student.studentFees.map((fee) => ({
      ...fee,

      dueDate: fee.dueDate ? fee.dueDate.toISOString() : null,

      totalAmount: Number(fee.totalAmount),

      paidAmount: Number(fee.paidAmount),

      plan: fee.plan
        ? {
            ...fee.plan,

            originalFee: Number(fee.plan.originalFee),

            discount: Number(fee.plan.discount),

            finalFee: Number(fee.plan.finalFee),

            admissionAmount: Number(fee.plan.admissionAmount),

            term1Amount: Number(fee.plan.term1Amount),

            term2Amount: Number(fee.plan.term2Amount),

            feeStructure: fee.plan.feeStructure
              ? {
                  ...fee.plan.feeStructure,

                  annualFee: Number(fee.plan.feeStructure.annualFee),

                  admissionFee: Number(fee.plan.feeStructure.admissionFee),
                }
              : null,
          }
        : null,
    })),
  }));

  const feesDue = students.reduce((total, student) => {
    const studentDue = student.studentFees.reduce((studentTotal, fee) => {
      const totalAmount = Number(fee.totalAmount);
      const paidAmount = Number(fee.paidAmount);

      return studentTotal + Math.max(totalAmount - paidAmount, 0);
    }, 0);

    return total + studentDue;
  }, 0);

  const summary = {
    totalAdmissions: students.length,

    thisYearAdmissions: students.filter(
      (student) => student.academicYear?.isActive === true,
    ).length,

    activeStudents: students.length,

    feesDue,
  };

  return (
    <AdmissionsDashboard
      admissions={serializedStudents as any}
      academicYearOptions={academicYearOptions}
      classOptions={classOptions}
      summary={summary}
    />
  );
}
