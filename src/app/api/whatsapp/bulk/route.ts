
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pending = await prisma.studentFee.findMany({
      where: {
        status: {
          in: ["PENDING", "PARTIAL"],
        },
      },
      include: {
        student: {
          include: {
            parent: true,
          },
        },
        plan: {
          include: {
            feeStructure: true,
          },
        },
        payments: true,
      },
    });

    const list = pending
      .map((item) => {
        const total = item.totalAmount;
        const paid = item.payments.reduce(
          (sum, payment) => sum + payment.amount,
          0,
        );
        const due = total - paid;

        if (due <= 0 || !item.student.parent?.phone) {
          return null;
        }

        return `• ${item.student.name} ${item.student.surname} — ₹${due.toLocaleString("en-IN")}`;
      })
      .filter((item): item is string => item !== null)
      .join("\n");

    if (!list) {
      return NextResponse.redirect(
        "https://wa.me/?text=All%20fees%20are%20clear.",
      );
    }

    const message = [
      "Dear Parent,",
      "The following fee dues are pending:",
      "",
      list,
      "",
      "Please clear them at the earliest.",
      "- TrueSunshine School",
    ].join("\n");

    return NextResponse.redirect(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
    );
  } catch (error) {
    console.error("Failed to prepare bulk fee reminder:", error);

    return NextResponse.json(
      { error: "Failed to prepare fee reminders." },
      { status: 500 },
    );
  }
}
