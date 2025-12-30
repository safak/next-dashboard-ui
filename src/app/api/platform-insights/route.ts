import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// --- 1. Define a type for your stats object ---
type PlatformStats = {
  totalPosts: number;
  totalComments: number;
  totalTrackedKeywords: number;
};

// --- 2. Define the type for the 'stats' dictionary ---
type StatsObject = {
  [key: string]: PlatformStats;
};

const platformColors: { [key: string]: string } = {
  Facebook: '#3b82f6', // blue-500
  Twitter: '#0ea5e9', // sky-500
  Instagram: '#f43f5e', // rose-500
};

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        keywords: true,
        comments: {
          select: { id: true },
        },
      },
    });

    // --- 3. Apply the 'StatsObject' type here ---
    const stats: StatsObject = {
      Facebook: { totalPosts: 0, totalComments: 0, totalTrackedKeywords: 0 },
      Twitter: { totalPosts: 0, totalComments: 0, totalTrackedKeywords: 0 },
      Instagram: { totalPosts: 0, totalComments: 0, totalTrackedKeywords: 0 },
    };

    for (const post of posts) {
      const platform = post.platform;

      // 4. This check is now type-safe
      if (stats[platform]) {
        stats[platform].totalPosts += 1;
        stats[platform].totalComments += post.comments.length;

        for (const keyword of post.keywords) {
          if (keyword.type === 'Main' || keyword.type === 'Sub') {
            stats[platform].totalTrackedKeywords += 1;
          }
        }
      }
    }

    // 5. Format the data to be sent
    const platformInsights = [
      {
        platform: 'Facebook',
        stats: stats.Facebook,
        color: platformColors.Facebook, // Add color
      },
      {
        platform: 'Twitter',
        stats: stats.Twitter,
        color: platformColors.Twitter, // Add color
      },
      {
        platform: 'Instagram',
        stats: stats.Instagram,
        color: platformColors.Instagram, // Add color
      },
    ];

    return NextResponse.json(platformInsights);
  } catch (error) {
    console.error('Failed to fetch platform insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform insights' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
