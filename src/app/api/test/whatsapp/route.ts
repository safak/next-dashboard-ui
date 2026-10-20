import { NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/sendWhatsApp";

export async function POST() {
  try {
    const response = await sendWhatsApp(
      "+916301367968",
      "Hello from TrueSunshine! This is a WhatsApp test message.",
    );

    return NextResponse.json({
      success: true,
      message: "WhatsApp message queued successfully.",
      sid: response.sid,
      status: response.status,
    });
  } catch (error: unknown) {
    console.error("WhatsApp test failed:", error);

    const twilioError = error as {
      code?: string | number;
      message?: string;
      status?: number;
    };

    return NextResponse.json(
      {
        success: false,
        message: twilioError?.message ?? "WhatsApp message failed.",
        code: twilioError?.code ?? null,
        status: twilioError?.status ?? null,
      },
      { status: 500 },
    );
  }
}
