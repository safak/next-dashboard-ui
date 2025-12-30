import { PrismaClient } from '@prisma/client';
// 1. Import NextRequest to read URL parameters
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// 2. Define the allowed keys for sorting to keep it secure
const allowedSortKeys: ('reactionsCount' | 'commentsCount' | 'sharesCount')[] =
  ['reactionsCount', 'commentsCount', 'sharesCount'];

export async function GET(request: NextRequest) {
  try {
    // 3. Get the sort parameter from the URL (e.g., /api/top-messages?sort=commentsCount)
    const { searchParams } = new URL(request.url);
    const sortQuery = searchParams.get('sort');

    // 4. Determine a valid sort key
    let sortBy: 'reactionsCount' | 'commentsCount' | 'sharesCount' =
      'reactionsCount'; // Default
    if (sortQuery && allowedSortKeys.includes(sortQuery as any)) {
      sortBy = sortQuery as 'reactionsCount' | 'commentsCount' | 'sharesCount';
    }

    // 5. Create the dynamic orderBy object for Prisma
    const orderBy = {
      [sortBy]: 'desc',
    };

    // 6. Fetch the top 5 posts using the dynamic sort
    const posts = await prisma.post.findMany({
      orderBy: orderBy,
      take: 5,
      include: {
        // Include relations your front-end needs (like for the 'View Post' button)
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch top posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top posts' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
