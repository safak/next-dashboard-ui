import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Student ID is required.",
        },
        { status: 400 },
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        surname: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Student not found.",
        },
        { status: 404 },
      );
    }

    const studentFees = await prisma.studentFee.findMany({
      where: {
        studentId: id,
      },

      orderBy: {
        createdAt: "asc",
      },

      select: {
        id: true,
        studentId: true,
        planId: true,
        installment: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
        receiptNo: true,
        verifyHash: true,
        createdAt: true,
        updatedAt: true,

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
                classId: true,
                isActive: true,

                class: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
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

        payments: {
          orderBy: {
            paidAt: "desc",
          },

          select: {
            id: true,
            amount: true,
            mode: true,
            referenceId: true,
            paidAt: true,
          },
        },
      },
    });

    const totalFees = studentFees.reduce(
      (sum, fee) => sum + Number(fee.totalAmount),
      0,
    );

    const totalPaid = studentFees.reduce(
      (sum, fee) => sum + Number(fee.paidAmount),
      0,
    );

    const outstanding = Math.max(totalFees - totalPaid, 0);

    const assignedFees = studentFees.map((fee) => {
      const amount = Number(fee.totalAmount);
      const paidAmount = Number(fee.paidAmount);

      return {
        id: fee.id,

        name:
          fee.plan?.feeStructure?.title ??
          `${fee.installment} Fee`,

        installment: fee.installment,

        amount,

        paidAmount,

        outstanding: Math.max(amount - paidAmount, 0),

        assignedAt: fee.createdAt.toISOString(),

        dueDate: null,

        status: fee.status,

        receiptNo: fee.receiptNo,

        feeStructure: fee.plan?.feeStructure
          ? {
              id: fee.plan.feeStructure.id,
              title: fee.plan.feeStructure.title,
              annualFee: Number(
                fee.plan.feeStructure.annualFee,
              ),
              admissionFee: Number(
                fee.plan.feeStructure.admissionFee,
              ),
              classId: fee.plan.feeStructure.classId,
              isActive: fee.plan.feeStructure.isActive,

              class: fee.plan.feeStructure.class,
            }
          : null,

        plan: fee.plan
          ? {
              id: fee.plan.id,
              originalFee: Number(fee.plan.originalFee),
              discount: Number(fee.plan.discount),
              finalFee: Number(fee.plan.finalFee),
              admissionAmount: Number(
                fee.plan.admissionAmount,
              ),
              term1Amount: Number(fee.plan.term1Amount),
              term2Amount: Number(fee.plan.term2Amount),

              academicYear: fee.plan.academicYear,
            }
          : null,
      };
    });

    const recentTransactions = studentFees
      .flatMap((fee) =>
        fee.payments.map((payment) => ({
          id: payment.id,
          amount: Number(payment.amount),
          mode: payment.mode,
          referenceId: payment.referenceId,
          paidAt: payment.paidAt.toISOString(),

          feeName:
            fee.plan?.feeStructure?.title ??
            `${fee.installment} Fee`,

          installment: fee.installment,

          studentFeeId: fee.id,
        })),
      )
      .sort(
        (a, b) =>
          new Date(b.paidAt).getTime() -
          new Date(a.paidAt).getTime(),
      )
      .slice(0, 5);

    return NextResponse.json({
      success: true,

      student: {
        id: student.id,
        name: student.name,
        surname: student.surname,
      },

      summary: {
        totalFees,
        totalPaid,
        outstanding,
        transactions: recentTransactions.length,
      },

      assignedFees,

      recentTransactions,
    });
  } catch (error) {
    console.error(
      "Failed to load student fee details:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load fee details.",
      },
      { status: 500 },
    );
  }
}