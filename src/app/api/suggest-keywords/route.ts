import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const prisma = new PrismaClient();

const getSystemPrompt = (trackedKeywords: string[]) => `
  You are a text analysis AI. You will be given a list of "trackedKeywords" and a "postContent".
  Your task is to return a JSON object with two keys:
  1. "matchedKeywords": An array of keywords from the "trackedKeywords" list that were found in the "postContent".
  2. "newSuggestions": An array of new, relevant keywords from the "postContent" that are NOT in the "trackedKeywords" list.

  Respond only with the JSON.

  My trackedKeywords are: ${JSON.stringify(trackedKeywords)}
`;

export async function POST(request: Request) {
  try {
    const { postContent } = await request.json();

    // 1. Fetch all existing keywords from your database
    const keywords = await prisma.keyword.findMany({
      select: { name: true }, // Only get the name
    });
    const trackedKeywords = keywords.map((kw) => kw.name);

    // 2. Set up the Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: { responseMimeType: 'application/json' },
      systemInstruction: getSystemPrompt(trackedKeywords), // Pass your keywords to the prompt
    });

    // 3. Call the Google API with the post content
    const result = await model.generateContent(postContent);
    const aiResponse = result.response;

    if (!aiResponse || !aiResponse.text) {
      throw new Error('AI returned an empty response.');
    }

    return NextResponse.json(JSON.parse(aiResponse.text()));
  } catch (error) {
    console.error('Failed to suggest keywords:', error);
    return NextResponse.json(
      { error: 'Failed to suggest keywords' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
