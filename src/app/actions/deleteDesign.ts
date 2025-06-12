'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteDesign(id: number) {
  try {
    await prisma.design.delete({
      where: { id },
    });
    // Revalidate the path to refresh the data on the page
    revalidatePath('/list/designs');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete design:', error);
    return { success: false, error: 'Failed to delete design' };
  }
}
