import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all posts and comments creation dates
    const posts = await prisma.post.findMany({
      select: { createdAt: true },
    });
    const comments = await prisma.comment.findMany({
      select: { createdAt: true },
    });

    const allEvents = [
      ...posts.map((p) => ({ ...p, type: 'post' })),
      ...comments.map((c) => ({ ...c, type: 'comment' })),
    ];

    // 2. Group them by date
    const eventsByDate: { [key: string]: { posts: number; comments: number } } =
      {};

    for (const event of allEvents) {
      const date = event.createdAt.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      if (!eventsByDate[date]) {
        eventsByDate[date] = { posts: 0, comments: 0 };
      }
      if (event.type === 'post') {
        eventsByDate[date].posts++;
      } else {
        eventsByDate[date].comments++;
      }
    }

    // 3. Send the data to the front end
    return NextResponse.json(eventsByDate);
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
