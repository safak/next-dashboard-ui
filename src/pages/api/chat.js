import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { message } = req.body;

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "developer", content: "You are a chatbot that will answer a user's questions regarding potential careers and career goals for a given major. The target audience is high school students. Answer succinctly under 50 words and without markdown." },
                    { role: "user", content: message }
                ],
                max_completion_tokens: 50
            });

            res.status(200).json({ message: completion.choices[0].message });
        } catch (error) {
            console.error("Error fetching response:", error);
            res.status(500).json({ error: "Failed to fetch response" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
