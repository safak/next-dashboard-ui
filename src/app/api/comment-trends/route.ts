import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all comments AND their related post info
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
        post: {
          // --- ADD THIS ---
          select: {
            id: true,
            permalink: true,
          },
        },
      },
    });

    // 2. Process for "Sentiment Over Time" (Area Chart)
    const sentimentByDate: {
      [key: string]: { Positive: number; Neutral: number; Negative: number };
    } = {};
    const categoryCounts: { [key: string]: number } = {};

    for (const comment of comments) {
      const date = comment.createdAt.toISOString().split('T')[0];
      const sentiment = comment.sentiment || 'Neutral';

      if (!sentimentByDate[date]) {
        sentimentByDate[date] = { Positive: 0, Neutral: 0, Negative: 0 };
      }
      if (
        sentiment === 'Positive' ||
        sentiment === 'Neutral' ||
        sentiment === 'Negative'
      ) {
        sentimentByDate[date][sentiment]++;
      }

      const category = comment.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    const trendData = Object.keys(sentimentByDate).map((date) => ({
      date,
      ...sentimentByDate[date],
    }));

    const categoryColors: { [key: string]: string } = {
      Complaint: '#ef4444',
      Inquiry: '#3b82f6',
      Suggestion: '#eab308',
      Gratitude: '#22c55e',
      Informational: '#8b5cf6',
      Tagging: '#9ca3af',
      'Status Update': '#0ea5e9',
      'Interest/Following': '#f97316',
      Uncategorized: '#cbd5e1',
    };

    const categoryData = Object.entries(categoryCounts).map(
      ([name, count]) => ({
        name,
        count,
        fill: categoryColors[name] || '#9ca3af',
      })
    );

    const categoryConfig = {
      count: { label: 'Comments' },
      ...Object.fromEntries(
        Object.keys(categoryCounts).map((name) => [
          name.toLowerCase().replace(/[\/\s]/g, '-'),
          { label: name, color: categoryColors[name] || '#9ca3af' },
        ])
      ),
    };

    return NextResponse.json({
      trendData,
      categoryData,
      categoryConfig,
      // Return the comments with the post data included
      recentComments: comments.reverse().slice(0, 50),
    });
  } catch (error) {
    console.error('Failed to fetch comment trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
