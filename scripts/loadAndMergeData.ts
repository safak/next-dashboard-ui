import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

interface CsvRow {
  [key: string]: string;
}

async function main() {
  console.log('Starting data merge (POSTS + COMMENTS from CSV with COUNTS)...');

  // --- 1. Load POST Data (The Master Source) ---
  const postMap = new Map<
    string,
    {
      sentiment: string;
      category: string;
      content: string;
      permalink: string;
      createdAt: string;
      // NEW: Capture counts from CSV
      reactionsCount: string;
      sharesCount: string;
      commentsCount: string;
    }
  >();

  try {
    const postCsvPath = path.join(
      process.cwd(),
      'merged_facebook_sentiment_results.csv'
    );
    if (fs.existsSync(postCsvPath)) {
      const csvContent = fs.readFileSync(postCsvPath, 'utf8');
      const parsedPosts = Papa.parse<CsvRow>(csvContent, {
        header: true,
        skipEmptyLines: true,
      });

      parsedPosts.data.forEach((row) => {
        const id = row.id || row.post_id;
        if (id && !id.includes('e+') && !id.includes('.')) {
          postMap.set(id, {
            sentiment: row.sentiment || 'Neutral',
            category: row.category || 'Uncategorized',
            content: row.content || '',
            permalink: row.permalink || '',
            createdAt: row.createdAt || '',
            // CAPTURE COUNTS
            reactionsCount: row.reactionsCount || '0',
            sharesCount: row.sharesCount || '0',
            commentsCount: row.commentsCount || '0',
          });
        }
      });
      console.log(`✅ Loaded ${postMap.size} valid posts from CSV.`);
    }
  } catch (err) {
    console.error('Error loading Post CSV:', err);
  }

  // --- 2. Read JSON Data ---
  const jsonFilePath = path.join(process.cwd(), 'facebook_data.json');
  const rawData = fs.readFileSync(jsonFilePath, 'utf8');
  const posts = JSON.parse(rawData);

  // --- 3. Insert POSTS into Database ---
  let insertedCount = 0;

  for (const post of posts) {
    try {
      if (!postMap.has(post.post_id)) continue;

      const csvPost = postMap.get(post.post_id)!;

      const parseDate = (csvDate: string, jsonDate: string) => {
        if (csvDate) {
          const d = new Date(csvDate);
          if (!isNaN(d.getTime())) return d;
        }
        return new Date(jsonDate);
      };

      await prisma.post.create({
        data: {
          id: post.post_id,
          platform: 'Facebook',
          content: csvPost.content || post.message || '[No Content]',
          createdAt: parseDate(csvPost.createdAt, post.created_time),
          permalink:
            csvPost.permalink ||
            post.permalink_url ||
            `https://facebook.com/${post.post_id}`,

          // FIX: Use CSV counts (convert string to int)
          reactionsCount: parseInt(csvPost.reactionsCount) || 0,
          sharesCount: parseInt(csvPost.sharesCount) || 0,
          commentsCount: parseInt(csvPost.commentsCount) || 0,

          sentiment: csvPost.sentiment,
          category: csvPost.category,
        },
      });
      insertedCount++;
    } catch (error) {
      /* Ignore duplicates */
    }
  }
  console.log(`✅ Successfully inserted ${insertedCount} posts.`);

  // --- 4. Insert COMMENTS (Directly from CSV) ---
  console.log('--- Starting Comment Ingestion ---');
  let commentCount = 0;

  try {
    const commentCsvPath = path.join(process.cwd(), 'Comment_rows.csv');
    if (fs.existsSync(commentCsvPath)) {
      const csvContent = fs.readFileSync(commentCsvPath, 'utf8');
      const parsedComments = Papa.parse<CsvRow>(csvContent, {
        header: true,
        skipEmptyLines: true,
      });

      for (const row of parsedComments.data) {
        const commentId = row.id || row.comment_id;
        const linkedPostId = row.postId || row.post_id;

        if (!commentId || !linkedPostId) continue;
        if (!postMap.has(linkedPostId)) continue;

        try {
          await prisma.comment.create({
            data: {
              id: commentId,
              message: row.message || '[No Message]',
              createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),

              // FIX: Ensure these are parsed as integers
              likeCount: parseInt(row.likeCount || '0'),
              replyCount: parseInt(row.replyCount || '0'),

              post: { connect: { id: linkedPostId } },
              sentiment: row.sentiment || 'Neutral',
              category: row.category || 'Uncategorized',
              author: {
                connectOrCreate: {
                  where: { id: 'unknown_user' },
                  create: { id: 'unknown_user', name: 'Facebook User' },
                },
              },
            },
          });
          commentCount++;
        } catch (err: any) {}
      }
      console.log(
        `✅ Successfully inserted ${commentCount} comments from CSV.`
      );
    }
  } catch (err) {
    console.error('Error loading Comment CSV:', err);
  }

  console.log('Data ingestion finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
