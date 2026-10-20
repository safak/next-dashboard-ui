import { NextResponse } from "next/server";
import { mailer } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { parentEmail, studentName, dueAmount } = await req.json();

    if (!parentEmail) {
      return NextResponse.json(
        { error: "Parent email not found" },
        { status: 400 },
      );
    }

    await mailer.sendMail({
      from: `"TrueSunshine School" <${process.env.SMTP_USER}>`,
      to: parentEmail,
      subject: "Outstanding Fee Reminder",
      html: `
        <p>Dear Parent,</p>
        <p>Your child <strong>${studentName}</strong> has an outstanding fee of 
        <strong>₹${dueAmount}</strong>.</p>
        <p>Please clear it at the earliest.</p>
        <br/>
        <p>Regards,<br/>TrueSunshine School</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("EMAIL ERROR:", err);

    return NextResponse.json(
      { error: "Unable to send email reminder" },
      { status: 500 },
    );
  }
}
