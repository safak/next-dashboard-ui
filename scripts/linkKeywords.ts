import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting keyword linking process...');

  // 1. Get all keywords from the database
  const keywords = await prisma.keyword.findMany();
  console.log(`Found ${keywords.length} keywords to check.`);

  // 2. Get all posts from the database
  const posts = await prisma.post.findMany({
    select: { id: true, content: true }, // Only get what we need
  });
  console.log(`Found ${posts.length} posts to analyze.`);

  let totalLinksCreated = 0;

  // 3. Loop over every post
  for (const post of posts) {
    const keywordsToConnect: { id: number }[] = [];

    // 4. Loop over every keyword and check if it's in the post content
    for (const keyword of keywords) {
      // This is a simple, case-insensitive check
      if (post.content.toLowerCase().includes(keyword.name.toLowerCase())) {
        keywordsToConnect.push({ id: keyword.id });
      }
    }

    // 5. If we found any matches, update the post in the database
    if (keywordsToConnect.length > 0) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          keywords: {
            connect: keywordsToConnect, // This creates the links
          },
        },
      });
      console.log(
        `Linked ${keywordsToConnect.length} keywords to post ${post.id}`
      );
      totalLinksCreated += keywordsToConnect.length;
    }
  }

  console.log(`Linking finished. Created ${totalLinksCreated} total links.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
