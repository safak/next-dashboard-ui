import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/sendSMS";
import { sendWhatsApp } from "@/lib/sendWhatsApp";

type ReminderChannel = "whatsapp" | "sms";

interface RouteContext {
  params: Promise<{
    id: string;
    feeId: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id: studentId, feeId } = await params;

    if (!studentId || !feeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID and fee ID are required.",
        },
        { status: 400 },
      );
    }

    const studentFeeId = Number(feeId);

    if (!Number.isInteger(studentFeeId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid fee ID.",
        },
        { status: 400 },
      );
    }

    let body: {
      channel?: ReminderChannel;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const channel = body.channel;

    if (channel !== "whatsapp" && channel !== "sms") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reminder channel. Use whatsapp or sms.",
        },
        { status: 400 },
      );
    }

    const studentFee = await prisma.studentFee.findFirst({
      where: {
        id: studentFeeId,
        studentId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true,
            phone: true,
          },
        },
        plan: {
          include: {
            feeStructure: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

    if (!studentFee) {
      return NextResponse.json(
        {
          success: false,
          message: "Assigned fee not found.",
        },
        { status: 404 },
      );
    }

    const totalAmount = Number(studentFee.totalAmount);
    const paidAmount = Number(studentFee.paidAmount);

    const outstanding = Math.max(totalAmount - paidAmount, 0);

    if (studentFee.status === "PAID" || outstanding <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This fee has already been fully paid. A reminder cannot be sent.",
        },
        { status: 400 },
      );
    }

    const parentPhone = studentFee.student.phone;

    if (!parentPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "No parent phone number is available for this student.",
        },
        { status: 400 },
      );
    }

    const studentName = [studentFee.student.name, studentFee.student.surname]
      .filter(Boolean)
      .join(" ");

    const feeName = studentFee.plan?.feeStructure?.title ?? "School Fee";

    const dueDate = studentFee.dueDate
      ? new Date(studentFee.dueDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

    const isOverdue =
      studentFee.dueDate &&
      new Date(studentFee.dueDate) < new Date() &&
      outstanding > 0;

    const formattedAmount = `₹${outstanding.toLocaleString("en-IN")}`;

    const message =
      channel === "whatsapp"
        ? `Dear Parent,

*Fee Payment Reminder*

*Student:* ${studentName}
*Fee:* ${feeName}
*Amount Due:* ${formattedAmount}${dueDate ? `\n*Due Date:* ${dueDate}` : ""}${isOverdue ? `\n*Status:* OVERDUE` : ""}

${
  isOverdue
    ? "The above fee payment is overdue. Kindly make the payment at the earliest."
    : "Kindly make the payment on or before the due date."
}

Thank you,
*TrueSunshine Educational Society*`
        : `Dear Parent,

Fee Payment Reminder

Student: ${studentName}
Fee: ${feeName}
Amount Due: ${formattedAmount}${dueDate ? `\nDue Date: ${dueDate}` : ""}${isOverdue ? `\nStatus: OVERDUE` : ""}

${
  isOverdue
    ? "The fee payment is overdue. Kindly make the payment at the earliest."
    : "Kindly make the payment on or before the due date."
}

Thank you,
TrueSunshine Educational Society`;

    let twilioResponse;

    if (channel === "sms") {
      twilioResponse = await sendSMS(parentPhone, message);
    } else {
      twilioResponse = await sendWhatsApp(parentPhone, message);
    }

    const channelName = channel === "whatsapp" ? "WhatsApp" : "SMS";

    return NextResponse.json({
      success: true,
      message: `${channelName} reminder sent successfully.`,
      reminder: {
        channel,
        studentId,
        studentFeeId,
        studentName,
        feeName,
        amountDue: outstanding,
        dueDate,
        phone: parentPhone,
        messageSid: twilioResponse.sid,
        status: twilioResponse.status,
      },
    });
  } catch (error: unknown) {
    console.error("Fee reminder error:", error);

    const twilioError = error as {
      code?: string | number;
      message?: string;
      status?: number;
    };

    return NextResponse.json(
      {
        success: false,
        message: twilioError.message ?? "Failed to send fee reminder.",
        code: twilioError.code ?? null,
      },
      { status: 500 },
    );
  }
}
