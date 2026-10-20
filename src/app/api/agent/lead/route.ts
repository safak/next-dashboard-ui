import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/sendSMS";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const rawPhone = body.phone?.toString().trim();
    const classInterested = body.classInterested?.trim();

    // Validate required fields
    if (!name || !rawPhone || !classInterested) {
      return Response.json(
        {
          success: false,
          error: "Name, phone number, and class are required",
        },
        {
          status: 400,
        }
      );
    }

    // Remove spaces and special characters from phone number
    const cleanedPhone = rawPhone.replace(/\D/g, "");

    // Validate Indian mobile number
    if (cleanedPhone.length !== 10) {
      return Response.json(
        {
          success: false,
          error: "Invalid phone number",
        },
        {
          status: 400,
        }
      );
    }

    // Add India country code
    const formattedPhone = cleanedPhone.startsWith("91")
      ? `+${cleanedPhone}`
      : `+91${cleanedPhone}`;

    const lead = await prisma.lead.create({
      data: {
        name,
        phone: formattedPhone,
        classInterested,
        source: "CHATBOT",
        status: "NEW",
      },
    });

    // Parent SMS
    try {
      await sendSMS(
        formattedPhone,
        `Dear ${name}, thank you for contacting TrueSunshine Preschool regarding ${classInterested}. Our admissions team will contact you shortly. - TrueSunshine Preschool`
      );

      console.log("Parent SMS sent successfully to:", formattedPhone);
    } catch (smsError) {
      console.error("Failed to send parent SMS:", smsError);
    }

    // School/Admin SMS
    try {
      const adminPhone =
        process.env.SCHOOL_PHONE_NUMBER || "+919848022338";

      await sendSMS(
        adminPhone,
        `New Admission Enquiry Received. Name: ${name}, Phone: ${formattedPhone}, Class: ${classInterested}, Source: CHATBOT, Status: NEW`
      );

      console.log("Admin SMS sent successfully");
    } catch (adminSmsError) {
      console.error("Failed to send admin SMS:", adminSmsError);
    }

    return Response.json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Lead API Error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to create lead",
      },
      {
        status: 500,
      }
    );
  }
}