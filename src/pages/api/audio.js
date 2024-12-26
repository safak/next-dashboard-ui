import OpenAI from "openai";
import {writeFileSync} from "node:fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {

    console.log("boyd", req.body)
    if (req.method === "POST") {
        const { base64str, question } = req.body;
        try {

            const response = await openai.chat.completions.create({
                model: "gpt-4o-audio-preview",
                modalities: ["text", "audio"],
                audio: { voice: "alloy", format: "wav" },
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `${question}` },
                            { type: "input_audio", input_audio: { data: `${base64str}`, format: "wav" }}
                        ]
                    }
                ]
            });

            console.log(response.choices[0]);

            writeFileSync(
                "response.wav",
                Buffer.from(response.choices[0].message.audio.data, 'base64')
            );

            res.status(200).json({
                message: "Audio generated successfully!",
                audioUrl: "",
                transcript: response.choices[0].message.audio.transcript,
            });
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}