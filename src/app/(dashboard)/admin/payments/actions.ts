"use server";

import prisma from "@/lib/prisma";
import { PaymentMode, FeeStatus } from "@prisma/client";

interface CollectPaymentInput {
  studentFeeId: number;
  amount: number;
  mode: PaymentMode;
  referenceId?: string;
}

export async function collectPaymentAction(input: CollectPaymentInput) {
  try {
    const { studentFeeId, amount, mode, referenceId } = input;

    if (!studentFeeId) {
      return {
        success: false,
        error: "Student fee is required.",
      };
    }

    if (!amount || amount <= 0) {
      return {
        success: false,
        error: "Payment amount must be greater than 0.",
      };
    }

    const studentFee = await prisma.studentFee.findUnique({
      where: {
        id: studentFeeId,
      },
      include: {
        payments: true,
      },
    });

    if (!studentFee) {
      return {
        success: false,
        error: "Fee assignment not found.",
      };
    }

    const totalPaid = studentFee.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const balance = studentFee.totalAmount - totalPaid;

    if (amount > balance) {
      return {
        success: false,
        error: `Payment cannot exceed the outstanding balance of ₹${balance}.`,
      };
    }

    await prisma.payment.create({
      data: {
        studentFeeId,
        amount,
        mode,
        referenceId: referenceId?.trim() || null,
      },
    });

    const updatedTotalPaid = totalPaid + amount;

    let status: FeeStatus = "PENDING";

    if (updatedTotalPaid >= studentFee.totalAmount) {
      status = "PAID";
    } else if (updatedTotalPaid > 0) {
      status = "PARTIAL";
    }

    await prisma.studentFee.update({
      where: {
        id: studentFeeId,
      },
      data: {
        paidAmount: updatedTotalPaid,
        status,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Collect payment error:", error);

    return {
      success: false,
      error: "Failed to collect payment.",
    };
  }
}

export async function deletePayment(id: number) {
  try {
    if (!id || Number.isNaN(id)) {
      return {
        success: false,
        error: "Invalid payment ID.",
      };
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
    });

    if (!payment) {
      return {
        success: false,
        error: "Payment not found.",
      };
    }

    await prisma.payment.delete({
      where: {
        id,
      },
    });

    const studentFee = await prisma.studentFee.findUnique({
      where: {
        id: payment.studentFeeId,
      },
      include: {
        payments: true,
      },
    });

    if (studentFee) {
      const totalPaid = studentFee.payments.reduce(
        (sum, item) => sum + item.amount,
        0,
      );

      let status: FeeStatus = "PENDING";

      if (totalPaid >= studentFee.totalAmount) {
        status = "PAID";
      } else if (totalPaid > 0) {
        status = "PARTIAL";
      }

      await prisma.studentFee.update({
        where: {
          id: studentFee.id,
        },
        data: {
          paidAmount: totalPaid,
          status,
        },
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete payment error:", error);

    return {
      success: false,
      error: "Failed to delete payment.",
    };
  }
}
