import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userResponse, question } = req.body;
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: `You are an interviewer assessing a software engineering intern. The question you asked is provided below. Analyze the candidate's response and determine if they provided sufficient detail and clarity. Write your evaluation as if it will be shared with the end user.` },
                    { role: "user", content: `Question: ${question}` },
                    { role: "user", content: `Candidate Response: ${userResponse}` }
                ],
                max_completion_tokens: 150
            });

            res.status(200).json({
                messages: completion.choices[0].message
            });
        } catch (error) {
            console.error("Error fetching response:", error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({error: "Method not allowed"});
    }
}