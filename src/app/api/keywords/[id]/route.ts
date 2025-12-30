import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This 'params' object gets the [id] from the URL
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id); // Convert the ID from a string to a number

    await prisma.keyword.delete({
      where: { id: id },
    });

    // Send back a successful, empty response
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, type } = await request.json();

    const updatedKeyword = await prisma.keyword.update({
      where: { id: id },
      data: {
        name,
        type,
      },
    });

    return NextResponse.json(updatedKeyword);
  } catch (error) {
    console.error('Failed to update keyword:', error);
    return NextResponse.json(
      { error: 'Failed to update keyword' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
