import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const keyword = await prisma.keyword.findUnique({
      where: { id: id },
      include: {
        posts: true, // This is the magic! Get all connected posts.
      },
    });

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword not found' }, { status: 404 });
    }

    return NextResponse.json(keyword.posts);
  } catch (error) {
    console.error('Failed to fetch posts for keyword:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
