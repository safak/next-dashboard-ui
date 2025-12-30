import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const prisma = new PrismaClient();

const SYSTEM_PROMPT = `You are an AI assistant specialized in text analysis. Your task is to extract the most relevant main keywords and sub-keywords from the given text. Respond *only* in JSON format. The JSON must have two keys: "mainKeywords" and "subKeywords". The value for each key should be an array of strings.

Example:
{
  "mainKeywords": ["Mahidol University", "Admission", "มหาวิทยาลัย"],
  "subKeywords": ["Salaya campus", "application requirements", "กองเทคโนโลยีสารสนเทศ"]
}`;

// Define the type for the AI's keyword response
type KeywordResponse = {
  mainKeywords: string[];
  subKeywords: string[];
};

// Define the type we will send to the front end
type KeywordWithStatus = {
  text: string;
  status: 'new' | 'existing' | 'linked';
};

export async function POST(request: Request) {
  try {
    const { text, postId } = await request.json(); // 1. Get text AND postId

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // --- 2. Call the Google API (same as before) ---
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: { responseMimeType: 'application/json' },
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(text);
    const aiResponse = result.response;

    if (!aiResponse || !aiResponse.text()) {
      throw new Error('AI returned an empty response.');
    }

    const extractedData: KeywordResponse = JSON.parse(aiResponse.text());
    const allExtractedNames = [
      ...(extractedData.mainKeywords || []),
      ...(extractedData.subKeywords || []),
    ];

    // --- 3. Check the Database ---
    // Find all keywords from our DB that match the extracted names
    const existingKeywords = await prisma.keyword.findMany({
      where: { name: { in: allExtractedNames } },
      include: {
        // Also include the 'posts' relation, but *only* for the current post
        posts: {
          where: { id: postId || undefined },
        },
      },
    });

    // 4. Create a "lookup map" for easy checking
    const keywordMap = new Map<string, { status: 'existing' | 'linked' }>();
    for (const kw of existingKeywords) {
      if (kw.posts.length > 0) {
        // This keyword is ALREADY linked to this post
        keywordMap.set(kw.name, { status: 'linked' });
      } else {
        // This keyword exists, but is NOT linked to this post
        keywordMap.set(kw.name, { status: 'existing' });
      }
    }

    // 5. Process the results to add the status
    const processKeywords = (names: string[]): KeywordWithStatus[] => {
      if (!names) return [];
      return names.map((name) => {
        const dbEntry = keywordMap.get(name);
        return {
          text: name,
          status: dbEntry ? dbEntry.status : 'new',
        };
      });
    };

    const mainKeywordsWithStatus = processKeywords(extractedData.mainKeywords);
    const subKeywordsWithStatus = processKeywords(extractedData.subKeywords);

    // 6. Send the enhanced data back to the front end
    return NextResponse.json({
      mainKeywords: mainKeywordsWithStatus,
      subKeywords: subKeywordsWithStatus,
    });
  } catch (error) {
    console.error('Failed to extract keywords:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
