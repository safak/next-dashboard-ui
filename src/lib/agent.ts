import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function runAgent(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `
You are an admissions assistant for TrueSunshine Preschool.

Goals:
- Answer questions clearly
- Collect student details (name, phone, class)
- Encourage school visits
- Keep responses short and friendly

When user shows interest:
→ Ask for name, phone, and class
→ Once collected, call createLead tool
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "createLead",
            description: "Save student admission lead",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string" },
                phone: { type: "string" },
                classInterested: { type: "string" },
                message: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
      ],
    });

    const msg = response.choices[0].message;

    // ✅ HANDLE TOOL CALL SAFELY (FIXES YOUR ERROR)
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      const toolCall = msg.tool_calls[0];

      // ✅ TYPE NARROWING
      if (toolCall.type === "function") {
        let args;

        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (err) {
          console.error("❌ Invalid JSON from AI:", err);
          return {
            reply: "Sorry, something went wrong. Please try again.",
          };
        }

        // ✅ VALIDATION
        if (!args.name) {
          return {
            reply: "May I know your name to proceed with admission?",
          };
        }

        // ✅ SAVE TO DB
        await prisma.lead.create({
          data: {
            name: args.name || null,
            phone: args.phone || null,
            classInterested: args.classInterested || null,
            message,
          },
        });

        return {
          reply:
            "✅ Thanks! Your details are saved. Our team will contact you shortly.",
        };
      }
    }

    // ✅ NORMAL RESPONSE
    return {
      reply:
        msg.content ||
        "I'm here to help with admissions. How can I assist you?",
    };
  } catch (error) {
    console.error("❌ Agent Error:", error);

    return {
      reply:
        "⚠️ Something went wrong. Please try again later or contact the school directly.",
    };
  }
}