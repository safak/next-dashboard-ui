import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// It's often better to create a single, shared Prisma instance
// Create a file in `lib/prisma.ts` with `export const prisma = new PrismaClient()`
// Then import it here: import { prisma } from '@/lib/prisma'
// For now, this is fine:
const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all posts from your database
    const posts = await prisma.post.findMany({
      // 2. Also include the comments for each post
      include: {
        comments: {
          include: {
            author: true, // Also include the author of each comment
          },
        },
        keywords: true, // Also include the keywords for each post
      },
      orderBy: {
        createdAt: 'desc', // 3. Get the newest posts first
      },
    });

    // 4. Send the posts back to the front end as JSON
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  } finally {
    // In a serverless environment, it's good practice to disconnect
    await prisma.$disconnect();
  }
}
