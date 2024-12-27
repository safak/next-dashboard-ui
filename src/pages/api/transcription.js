import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
    api: {
        bodyParser: false
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        console.log('req received')
        const tempFilePath = path.join(process.cwd(), "uploads", "tempAudio.wav");

        if (!fs.existsSync(path.dirname(tempFilePath))) {
            fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
        }

        const writeStream = fs.createWriteStream(tempFilePath);

        req.pipe(writeStream);

        writeStream.on("finish", async () => {
            try {
                console.log('making req')
                const transcription = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(tempFilePath),
                    model: "whisper-1",
                    response_format: "text",
                });

                await unlinkAsync(tempFilePath);

                res.status(200).json({
                    message: "Text generated successfully!",
                    transcription: transcription,
                });
            } catch (error) {
                console.error("Error during transcription:", error);
                res.status(500).json({ error: error.message });
            }
        });

        writeStream.on("error", (error) => {
            console.error("Error writing file:", error);
            res.status(500).json({ error: "Error saving audio file." });
        });

        return;
    }

    res.status(405).json({ error: "Method not allowed" });
}
