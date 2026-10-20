import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import ParentMobileBottomNav from "@/components/mobile/parent/ParentMobileBottomNav";
import MobileStudentDropdown from "@/components/mobile/common/MobileStudentDropdown";

import { ArrowLeft, IndianRupee, WalletCards } from "lucide-react";

import ParentFeesClient from "./ParentFeesClient";

type Props = {
  searchParams: Promise<{
    studentId?: string;
  }>;
};

export default async function ParentFeesPage({ searchParams }: Props) {
  const params = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const parent = await prisma.parent.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      surname: true,
      email: true,
      phone: true,
    },
  });

  const parentName = parent ? `${parent.name} ${parent.surname}`.trim() : null;

  const parentMobile = parent?.phone ?? null;
  const parentEmail = parent?.email ?? null;

  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
    include: {
      class: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] pb-24">
        <main className="px-4 pt-5">
          <Link
            href="/parent"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-[#4B517D]
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              transition
              active:scale-95
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div
            className="
              mt-6
              rounded-[22px]
              border
              border-slate-100
              bg-white
              px-5
              py-12
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#E7ECF8]
                text-[#4B517D]
              "
            >
              <WalletCards className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-sm font-bold text-[#4B517D]">
              No children found
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              No student profiles are linked to your account.
            </p>
          </div>
        </main>

        <ParentMobileBottomNav />
      </div>
    );
  }

  const activeStudentId = params.studentId || students[0].id;

  const student =
    students.find((item) => item.id === activeStudentId) || students[0];

  const studentFees = await prisma.studentFee.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      plan: {
        include: {
          feeStructure: true,
        },
      },
      payments: {
        orderBy: {
          paidAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const fees = studentFees.map((fee) => {
    const paid = fee.payments.reduce((sum, payment) => sum + payment.amount, 0);

    const due = Math.max(fee.totalAmount - paid, 0);

    const installmentLabel =
      fee.installment === "ADMISSION"
        ? "Admission Fee"
        : fee.installment === "TERM_1"
          ? "Term 1 Fee"
          : fee.installment === "TERM_2"
            ? "Term 2 Fee"
            : fee.plan.feeStructure.title;

    return {
      id: fee.id,
      title: fee.plan.feeStructure.title,
      installment: installmentLabel,
      totalAmount: fee.totalAmount,
      paidAmount: paid,
      dueAmount: due,
      status: fee.status,
      dueDate: fee.dueDate ? fee.dueDate.toISOString() : null,
      receiptNo: fee.receiptNo,
      createdAt: fee.createdAt.toISOString(),

      payments: fee.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        paidAt: payment.paidAt.toISOString(),
        mode: payment.mode,
        referenceId: payment.referenceId,
      })),
    };
  });

  const totalAmount = fees.reduce((sum, fee) => sum + fee.totalAmount, 0);

  const totalPaid = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);

  const totalDue = Math.max(totalAmount - totalPaid, 0);

  const paidFees = fees.filter((fee) => fee.dueAmount === 0).length;

  const pendingFees = fees.filter((fee) => fee.dueAmount > 0).length;

  const studentOptions = students.map((item) => ({
    id: item.id,
    name: item.name,
    surname: item.surname,
    img: item.img,
    className: item.class?.name || "Class",
  }));

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      <main className="px-4 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <Link
            href={`/parent?studentId=${encodeURIComponent(student.id)}`}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-slate-700
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              transition
              active:scale-95
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <MobileStudentDropdown
            students={studentOptions}
            selectedStudentId={student.id}
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2.5">
            <h1
              className="
                text-[24px]
                font-extrabold
                leading-tight
                tracking-tight
                text-slate-950
              "
            >
              {student.name}&apos;s Fees
            </h1>

            <IndianRupee className="h-5 w-5 text-[#4B517D]" />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Fee details and payment history
          </p>
        </div>

        <ParentFeesClient
          fees={fees}
          totalAmount={totalAmount}
          totalPaid={totalPaid}
          totalDue={totalDue}
          paidFees={paidFees}
          pendingFees={pendingFees}
          parentMobile={parentMobile}
          parentName={parentName}
          parentEmail={parentEmail}
        />
      </main>

      <ParentMobileBottomNav studentId={student.id} />
    </div>
  );
}
