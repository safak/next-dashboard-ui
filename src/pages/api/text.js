import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userResponse, question } = req.body;
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "developer", content: `You are an interviewer that is assessing a interviewee for a software engineering intern role. The question you asked was 
                    ${question}. In your assessment, ensure that they were thorough and had enough detail that you would be confident in hiring them. You will receive their response.` },
                    {
                        role: "user",
                        content: `${userResponse}}`,
                    },
                ],
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