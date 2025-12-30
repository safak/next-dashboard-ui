import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch all keywords
export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
      include: {
        _count: {
          select: { posts: true }, // Select the count of related posts
        },
      },
    });
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// --- THIS IS THE MODIFIED POST FUNCTION ---
export async function POST(request: Request) {
  try {
    // 1. Get the postId from the request body
    const { name, type, postId } = await request.json();

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // 2. Use 'upsert' to create the keyword or find it if it already exists
    // This prevents duplicate keywords
    const keyword = await prisma.keyword.upsert({
      where: { name: name },
      update: {}, // If it exists, do nothing...
      create: {
        // If it doesn't exist, create it
        name: name,
        type: type,
      },
    });

    // 3. If a postId was provided, connect it to the keyword
    if (postId) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          keywords: {
            connect: { id: keyword.id }, // This creates the link in the _KeywordToPost table
          },
        },
      });
    }

    return NextResponse.json(keyword, { status: 201 }); // 201 = Created (or found)
  } catch (error: any) {
    console.error('Failed to create/link keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create/link keyword' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
