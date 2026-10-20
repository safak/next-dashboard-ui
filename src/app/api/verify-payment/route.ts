import crypto from "crypto";
import { NextResponse } from "next/server";
import { collectPaymentAction } from "@/lib/actions";
import { PaymentMode } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentFeeId,
      amount,
    } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Use existing payment logic
    const result = await collectPaymentAction({
      studentFeeId,
      amount,
      mode: PaymentMode.UPI,
      referenceId: razorpay_payment_id,
    });

    if (result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}