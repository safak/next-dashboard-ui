"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import type { FeeActionState, FeeFormData, PaymentFormData } from "./types";

const FEES_PATH = "/admin/fees";

const ADMISSION_FEE = 11500;

interface UpdateStudentFeePlanData {
  id: number;
  dueDate?: Date | string | null;
}

/* ============================================================
   CREATE STUDENT FEE PLAN
============================================================ */

export async function createStudentFeePlan(
  _prevState: FeeActionState,
  data: FeeFormData,
): Promise<FeeActionState> {
  try {
    /* ============================================================
       BASIC VALIDATION
    ============================================================ */

    if (!data.studentId) {
      return {
        success: false,
        error: "Student is required.",
      };
    }

    if (!data.academicYearId) {
      return {
        success: false,
        error: "Academic year is required.",
      };
    }

    const totalFee = Number(data.totalFee);

    if (!Number.isFinite(totalFee) || totalFee <= 0) {
      return {
        success: false,
        error: "Please enter a valid total fee.",
      };
    }

    if (totalFee < ADMISSION_FEE) {
      return {
        success: false,
        error: `Total fee must be at least ₹${ADMISSION_FEE.toLocaleString(
          "en-IN",
        )}.`,
      };
    }

    const academicYearId = Number(data.academicYearId);

    if (!Number.isInteger(academicYearId)) {
      return {
        success: false,
        error: "Invalid academic year.",
      };
    }

    /* ============================================================
       GET STUDENT
    ============================================================ */

    const student = await prisma.student.findUnique({
      where: {
        id: data.studentId,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        classId: true,
        academicYearId: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!student) {
      return {
        success: false,
        error: "Student not found.",
      };
    }

    /* ============================================================
       VERIFY ACADEMIC YEAR
    ============================================================ */

    const academicYear = await prisma.academicYear.findUnique({
      where: {
        id: academicYearId,
      },
      select: {
        id: true,
        label: true,
      },
    });

    if (!academicYear) {
      return {
        success: false,
        error: "Academic year not found.",
      };
    }

    if (student.academicYearId !== academicYearId) {
      return {
        success: false,
        error:
          "The selected student does not belong to the selected academic year.",
      };
    }

    /* ============================================================
       DUPLICATE PLAN CHECK
    ============================================================ */

    const existingPlan = await prisma.studentFeePlan.findUnique({
      where: {
        studentId_academicYearId: {
          studentId: student.id,
          academicYearId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingPlan) {
      return {
        success: false,
        error:
          "A fee plan already exists for this student for the selected academic year.",
      };
    }

    /* ============================================================
       FEE STRUCTURE
    ============================================================ */

    const feeStructure = await prisma.feeStructure.findUnique({
      where: {
        classId: student.classId,
      },
      select: {
        id: true,
        classId: true,
        title: true,
        annualFee: true,
        admissionFee: true,
        isActive: true,
      },
    });

    if (!feeStructure || !feeStructure.isActive) {
      return {
        success: false,
        error: `No active fee structure is configured for ${student.class?.name ?? "the selected class"}.`,
      };
    }

    /* ============================================================
       FEE CALCULATION
    ============================================================ */

    const originalFee = totalFee;

    const discount = 0;

    const finalFee = Math.max(originalFee - discount, 0);

    const admissionAmount = Math.min(
      Number(feeStructure.admissionFee ?? ADMISSION_FEE),
      finalFee,
    );

    const remainingAmount = Math.max(finalFee - admissionAmount, 0);

    const term1Amount = Math.floor(remainingAmount / 2);

    const term2Amount = remainingAmount - term1Amount;

    /* ============================================================
       CREATE COMPLETE FEE PLAN
    ============================================================ */

    await prisma.$transaction(async (tx) => {
      /* ----------------------------------------------------------
         CREATE PLAN
      ---------------------------------------------------------- */

      const plan = await tx.studentFeePlan.create({
        data: {
          studentId: student.id,

          academicYearId,

          feeStructureId: feeStructure.id,

          originalFee,

          discount,

          finalFee,

          admissionAmount,

          term1Amount,

          term2Amount,
        },
      });

      /* ----------------------------------------------------------
         ADMISSION INSTALLMENT
      ---------------------------------------------------------- */

      await tx.studentFee.create({
        data: {
          studentId: student.id,

          planId: plan.id,

          installment: "ADMISSION",

          totalAmount: admissionAmount,

          paidAmount: 0,

          status: admissionAmount === 0 ? "PAID" : "PENDING",

          dueDate: data.admissionDueDate
            ? normalizeDueDate(data.admissionDueDate)
            : null,
        },
      });

      /* ----------------------------------------------------------
         TERM 1 INSTALLMENT
      ---------------------------------------------------------- */

      await tx.studentFee.create({
        data: {
          studentId: student.id,

          planId: plan.id,

          installment: "TERM_1",

          totalAmount: term1Amount,

          paidAmount: 0,

          status: term1Amount === 0 ? "PAID" : "PENDING",

          dueDate: data.term1DueDate
            ? normalizeDueDate(data.term1DueDate)
            : null,
        },
      });

      /* ----------------------------------------------------------
         TERM 2 INSTALLMENT
      ---------------------------------------------------------- */

      await tx.studentFee.create({
        data: {
          studentId: student.id,

          planId: plan.id,

          installment: "TERM_2",

          totalAmount: term2Amount,

          paidAmount: 0,

          status: term2Amount === 0 ? "PAID" : "PENDING",

          dueDate: data.term2DueDate
            ? normalizeDueDate(data.term2DueDate)
            : null,
        },
      });
    });

    revalidatePath(FEES_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Create Student Fee Plan Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create student fee plan.",
    };
  }
}

/* ============================================================
   DATE NORMALIZATION
============================================================ */

function normalizeDueDate(value: Date | string): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error("Invalid due date.");
    }

    return value;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("Invalid due date format. Expected YYYY-MM-DD.");
  }

  const [, year, month, day] = match;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    12,
    0,
    0,
    0,
  );

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    throw new Error("Invalid due date.");
  }

  return date;
}

/* ============================================================
   UPDATE INDIVIDUAL INSTALLMENT
============================================================ */

export async function updateStudentFeePlan(
  _prevState: FeeActionState,
  data: UpdateStudentFeePlanData,
): Promise<FeeActionState> {
  try {
    /* ============================================================
       VALIDATE ID
    ============================================================ */

    if (!data.id || !Number.isInteger(data.id)) {
      return {
        success: false,
        error: "Fee installment ID is required.",
      };
    }

    /* ============================================================
       NORMALIZE DUE DATE
    ============================================================ */

    let normalizedDueDate: Date | null = null;

    if (
      data.dueDate !== undefined &&
      data.dueDate !== null &&
      data.dueDate !== ""
    ) {
      try {
        normalizedDueDate = normalizeDueDate(data.dueDate);
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Invalid due date.",
        };
      }
    }

    /* ============================================================
       FIND INSTALLMENT
    ============================================================ */

    const fee = await prisma.studentFee.findUnique({
      where: {
        id: data.id,
      },
      select: {
        id: true,
        studentId: true,
        planId: true,
        installment: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
        dueDate: true,
      },
    });

    if (!fee) {
      return {
        success: false,
        error: "Fee installment not found.",
      };
    }

    /* ============================================================
       UPDATE INSTALLMENT
    ============================================================ */

    const updatedFee = await prisma.studentFee.update({
      where: {
        id: data.id,
      },

      data: {
        dueDate: normalizedDueDate,
      },

      select: {
        id: true,
        installment: true,
        dueDate: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
      },
    });

    console.log("Fee installment updated:", {
      id: updatedFee.id,
      installment: updatedFee.installment,
      dueDate: updatedFee.dueDate,
    });

    revalidatePath(FEES_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update Student Fee Plan Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update fee installment.",
    };
  }
}

/* ============================================================
   DELETE STUDENT FEE PLAN
============================================================ */

export async function deleteStudentFeePlan(
  planId: number,
): Promise<FeeActionState> {
  try {
    if (!planId) {
      return {
        success: false,
        error: "Fee plan ID is required.",
      };
    }

    const plan = await prisma.studentFeePlan.findUnique({
      where: {
        id: planId,
      },

      select: {
        id: true,

        installments: {
          select: {
            paidAmount: true,

            _count: {
              select: {
                payments: true,
              },
            },
          },
        },
      },
    });

    if (!plan) {
      return {
        success: false,
        error: "Fee plan not found.",
      };
    }

    const hasPayments = plan.installments.some(
      (installment) =>
        installment.paidAmount > 0 || installment._count.payments > 0,
    );

    if (hasPayments) {
      return {
        success: false,
        error:
          "This fee plan cannot be deleted because payment records already exist.",
      };
    }

    await prisma.studentFeePlan.delete({
      where: {
        id: planId,
      },
    });

    revalidatePath(FEES_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete Student Fee Plan Error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete fee plan.",
    };
  }
}

/* ============================================================
   RECORD PAYMENT
============================================================ */

export async function createPayment(
  data: PaymentFormData,
): Promise<FeeActionState> {
  try {
    if (!data.studentFeeId) {
      return {
        success: false,
        error: "Student fee is required.",
      };
    }

    if (!data.amount || data.amount <= 0) {
      return {
        success: false,
        error: "Payment amount must be greater than zero.",
      };
    }

    const fee = await prisma.studentFee.findUnique({
      where: {
        id: data.studentFeeId,
      },

      select: {
        id: true,
        totalAmount: true,
        paidAmount: true,
        status: true,
      },
    });

    if (!fee) {
      return {
        success: false,
        error: "Student fee not found.",
      };
    }

    if (fee.status === "PAID") {
      return {
        success: false,
        error: "This fee is already fully paid.",
      };
    }

    const balance = fee.totalAmount - fee.paidAmount;

    if (data.amount > balance) {
      return {
        success: false,
        error: `Payment cannot exceed the remaining balance of ₹${balance.toLocaleString(
          "en-IN",
        )}.`,
      };
    }

    const newPaidAmount = fee.paidAmount + data.amount;

    const newStatus = newPaidAmount >= fee.totalAmount ? "PAID" : "PARTIAL";

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          amount: data.amount,

          studentFeeId: data.studentFeeId,

          mode: data.mode,

          referenceId: data.referenceId?.trim() || null,
        },
      }),

      prisma.studentFee.update({
        where: {
          id: data.studentFeeId,
        },

        data: {
          paidAmount: newPaidAmount,

          status: newStatus,
        },
      }),
    ]);

    revalidatePath(FEES_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Create Payment Error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to record payment.",
    };
  }
}

export async function getPaymentHistory(studentFeeId: number) {
  try {
    if (!studentFeeId) {
      return {
        success: false,
        error: "Student fee is required.",
        payments: [],
      };
    }

    const payments = await prisma.payment.findMany({
      where: {
        studentFeeId,
      },
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
    });

    return {
      success: true,
      payments: payments.map((payment) => ({
        id: payment.id,
        amount: Number(payment.amount),
        paidAt: payment.paidAt.toISOString(),
        referenceId: payment.referenceId,
        mode: payment.mode,
      })),
    };
  } catch (error) {
    console.error("Get Payment History Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load payment history.",
      payments: [],
    };
  }
}
