import prisma from "@/lib/prisma";

import PaymentsDashboard from "./components/PaymentsDashboard";

export default async function PaymentsPage() {
  const [payments, studentFees] =
    await Promise.all([
      prisma.payment.findMany({
        include: {
          studentFee: {
            include: {
              student: true,
            },
          },
        },
        orderBy: {
          paidAt: "desc",
        },
      }),

      prisma.studentFee.findMany({
        include: {
          student: true,
        },
        orderBy: {
          id: "desc",
        },
      }),
    ]);

  return (
    <PaymentsDashboard
      payments={payments}
      studentFees={studentFees}
    />
  );
}