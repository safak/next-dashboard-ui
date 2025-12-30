import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all posts with keywords
    const posts = await prisma.post.findMany({
      include: { keywords: true },
      orderBy: { createdAt: 'asc' }, // Important for the area chart
    });

    // 2. Calculate "Mentions by Category" (for SentimentAreaChart)
    // We group by date and count categories
    const mentionsByDate: { [key: string]: { [key: string]: number } } = {};

    for (const post of posts) {
      const date = post.createdAt.toISOString().split('T')[0];
      // Use category as the key (e.g., "Events", "Guides")
      const category = post.category || 'Uncategorized';

      if (!mentionsByDate[date]) {
        mentionsByDate[date] = {};
      }
      if (!mentionsByDate[date][category]) {
        mentionsByDate[date][category] = 0;
      }
      mentionsByDate[date][category]++;
    }

    // Convert to array format for Recharts
    const analyticData = Object.keys(mentionsByDate).map((date) => ({
      date,
      ...mentionsByDate[date], // e.g. { date: "2023-10-01", Events: 5, Guides: 2 }
    }));

    // 3. Calculate "Platform Performance"
    const platformDataMap: { [key: string]: number } = {};
    for (const post of posts) {
      const platform = post.platform;
      platformDataMap[platform] = (platformDataMap[platform] || 0) + 1;
    }
    const platformPerformance = Object.keys(platformDataMap).map((name) => ({
      name,
      mentions: platformDataMap[name],
    }));

    // 4. Calculate "Top Keywords"
    const keywordDataMap: { [key: string]: number } = {};
    for (const post of posts) {
      for (const keyword of post.keywords) {
        keywordDataMap[keyword.name] = (keywordDataMap[keyword.name] || 0) + 1;
      }
    }

    const topKeywords = Object.keys(keywordDataMap)
      .map((name) => ({ name, mentions: keywordDataMap[name] }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 5); // Top 5

    // 5. Calculate Summary Card Stats
    const totalMentions = posts.length;
    // Calculate average sentiment if you had a score, or just count something else
    // For now, we'll just return the total count.

    return NextResponse.json({
      analyticData,
      platformPerformance,
      topKeywords,
      summary: {
        totalMentions,
      },
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
