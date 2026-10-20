import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateVerifyHash } from "@/lib/receipt/generateVerifyHash";
import { generateReceiptNo } from "@/lib/receipt/generateReceiptNo";

export async function GET(_req: Request, context: any) {
  const { hash } = await context.params;

  const fees = await prisma.studentFee.findMany({
    include: {
      student: true,
      plan: {
        include: {
          feeStructure: true,
        },
      },
      payments: true,
    },
  });

  for (const fee of fees) {
    const receiptNo = generateReceiptNo(fee.id, new Date());

    const totalPaid = fee.payments.reduce((sum, p) => sum + p.amount, 0);

    const expectedHash = generateVerifyHash({
      studentFeeId: fee.id,
      totalPaid,
      receiptNo,
    });

    if (expectedHash === hash) {
      return NextResponse.json({ valid: true });
    }
  }

  return NextResponse.json({ valid: false }, { status: 404 });
}
