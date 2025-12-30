import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  try {
    const date = params.date; // e.g., "2025-10-28"

    // Create a date range for the *entire day*
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // 1. Find all posts from that day
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 2. Find all comments from that day
    const comments = await prisma.comment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        author: true, // Also get the comment's author
      },
    });

    return NextResponse.json({ posts, comments });
  } catch (error) {
    console.error('Failed to fetch data for date:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
