import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // FEE STRUCTURES

    const fees = await prisma.feeStructure.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        feePlans: {
          select: {
            installments: {
              select: {
                id: true,
                paidAmount: true,
                totalAmount: true,
              },
            },
          },
        },
      },
    });

    // SUMMARY
    const total = fees.length;
    const active = fees.filter((fee) => fee.isActive).length;
    const inactive = fees.filter((fee) => !fee.isActive).length;

    let assigned = 0;
    let collected = 0;

    for (const fee of fees) {
      for (const plan of fee.feePlans) {
        assigned += plan.installments.length;

        for (const installment of plan.installments) {
          collected += installment.paidAmount;
        }
      }
    }

    // TABLE DATA
    const formattedFees = fees.map((fee) => {
      const installments = fee.feePlans.flatMap((plan) => plan.installments);

      return {
        id: fee.id,
        title: fee.title,
        annualFee: fee.annualFee,
        admissionFee: fee.admissionFee,
        classId: fee.classId,
        className: fee.class?.name ?? null,
        isActive: fee.isActive,
        assignedCount: installments.length,
        collectedAmount: installments.reduce(
          (sum, installment) => sum + installment.paidAmount,
          0,
        ),
        createdAt: fee.createdAt,
        updatedAt: fee.updatedAt,
      };
    });

    return NextResponse.json({
      summary: {
        total,
        active,
        inactive,
        assigned,
        collected,
      },

      fees: formattedFees,
    });
  } catch (error) {
    console.error("Failed to fetch fee structures:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch fee structures",
      },
      {
        status: 500,
      },
    );
  }
}
