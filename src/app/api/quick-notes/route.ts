import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'; // Use shared Prisma instance

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Use raw SQL query to fetch notes
    const notes = await prisma.$queryRaw`
      SELECT * FROM "Note"
      WHERE "userId" = ${userId} AND "quickNote" = true
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching quick notes:', error);
    return NextResponse.json({ message: 'Error fetching quick notes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await req.json();
    const { content } = body;

    // Try a simpler approach - create the note without the quickNote field first
    const note = await prisma.$transaction(async (tx) => {
      // First, create the note without the quickNote field
      await tx.$executeRawUnsafe(
        `
        INSERT INTO "Note" ("content", "userId", "personal", "temporary", "createdAt", "updatedAt")
        VALUES ($1, $2, true, true, NOW(), NOW())
      `,
        content,
        userId
      );

      // Then fetch the created note
      const notes = await tx.$queryRaw`
        SELECT * FROM "Note"
        WHERE "userId" = ${userId} AND "content" = ${content}
        ORDER BY "createdAt" DESC
        LIMIT 1
      `;

      if (!Array.isArray(notes) || notes.length === 0) {
        throw new Error('Failed to create note');
      }

      const createdNote = notes[0];

      // Update the note to set quickNote to true
      await tx.$executeRawUnsafe(
        `
        UPDATE "Note"
        SET "quickNote" = true
        WHERE "id" = $1
      `,
        createdNote.id
      );

      // Fetch the updated note
      const updatedNotes = await tx.$queryRaw`
        SELECT * FROM "Note"
        WHERE "id" = ${createdNote.id}
      `;

      if (!Array.isArray(updatedNotes) || updatedNotes.length === 0) {
        throw new Error('Failed to update note');
      }

      return updatedNotes[0];
    });

    console.log('Note created successfully:', note);
    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error saving quick note:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });

    // Return a more detailed error response
    return NextResponse.json(
      {
        message: 'Error saving quick note',
        error: error.message,
        details: {
          name: error.name,
          code: error.code,
          meta: error.meta,
        },
      },
      { status: 500 }
    );
  }
}
