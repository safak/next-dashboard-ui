import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

function formatPhoneNumber(phone: string) {
  const cleaned = phone.trim().replace(/\D/g, "");

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  throw new Error(`Invalid phone number: ${phone}`);
}

export async function sendWhatsApp(to: string, message: string) {
  const formattedNumber = formatPhoneNumber(to);

  if (!process.env.TWILIO_WHATSAPP_FROM) {
    throw new Error("TWILIO_WHATSAPP_FROM is not configured.");
  }

  console.log("Sending WhatsApp through Twilio:", {
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: formattedNumber,
    messageLength: message.length,
  });

  const response = await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${formattedNumber}`,
    body: message,
  });

  console.log("Twilio WhatsApp created successfully:", {
    sid: response.sid,
    status: response.status,
    to: response.to,
    from: response.from,
  });

  return response;
}
