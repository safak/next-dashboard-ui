import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse'; // Import the CSV parser

const prisma = new PrismaClient();

// Define a type for the row from the CSV
type CsvRow = {
  post_id: string;
  content: string;
  created_time: string;
  permalink: string;
  reactions_count: string; // CSVs read numbers as strings
  shares_count: string;
  comments_count: string;
  comments: string; // Comments are a JSON string in the CSV
  'Predicted Sentiment': string; // This is your category
};

type JsonComment = {
  comment_id: string;
  from: {
    name?: string;
    id?: string;
  };
  message: string;
  created_time: string;
  like_count: number;
  reply_count: number;
};

async function main() {
  console.log('Starting CSV data ingestion script...');

  // 1. Read the CSV file
  const filePath = path.join(
    process.cwd(),
    'merged_facebook_sentiment_results.csv'
  );
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // 2. Parse the CSV file
  const parseResult = Papa.parse<CsvRow>(fileContent, {
    header: true, // This tells PapaParse to use the first row as keys
    skipEmptyLines: true,
  });

  const data = parseResult.data;
  console.log(`Found ${data.length} posts to insert.`);

  for (const post of data) {
    // 3. Skip posts with no content or no ID
    if (!post.content || !post.post_id) {
      console.log(`Skipping post with no content or ID.`);
      continue;
    }

    // 4. Parse the comments string from the CSV
    let comments: JsonComment[] = [];
    try {
      // The 'comments' column is a string '[]' or '[{...}]'
      comments = JSON.parse(post.comments || '[]');
    } catch (e) {
      console.warn(
        `Could not parse comments for post ${post.post_id}. Defaulting to empty array.`
      );
    }

    try {
      // 5. Create the post and comments in the database
      await prisma.post.create({
        data: {
          id: post.post_id,
          platform: 'Facebook',
          content: post.content,
          createdAt: new Date(post.created_time),
          permalink: post.permalink,
          reactionsCount: Number(post.reactions_count) || 0,
          sharesCount: Number(post.shares_count) || 0,
          commentsCount: Number(post.comments_count) || 0,
          category: post['Predicted Sentiment'], // Assign the category here

          // Handle nested comments and authors
          comments: {
            create: comments.map((comment: JsonComment) => ({
              id: comment.comment_id,
              message: comment.message,
              createdAt: new Date(comment.created_time),
              likeCount: Number(comment.like_count) || 0,
              replyCount: Number(comment.reply_count) || 0,

              author:
                comment.from && comment.from.id
                  ? {
                      connectOrCreate: {
                        where: { id: comment.from.id },
                        create: {
                          id: comment.from.id,
                          name: comment.from.name || 'Unknown User',
                        },
                      },
                    }
                  : undefined,
            })),
          },
        },
      });
      console.log(`Successfully inserted post: ${post.post_id}`);
    } catch (e: any) {
      if (e.code === 'P2002') {
        // This catches posts that already exist in the DB (Primary Key violation)
        console.log(`Skipping duplicate post: ${post.post_id}`);
      } else {
        console.error(`Failed to insert post ${post.post_id}:`, e.message);
      }
    }
  }

  console.log('CSV Data ingestion finished.');
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
