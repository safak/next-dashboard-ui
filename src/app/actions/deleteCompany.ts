'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema to validate the ID
const DeleteCompanySchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function deleteCompany(
  companyId: number
): Promise<{ success: boolean; error?: string }> {
  // Validate the ID
  const validatedId = DeleteCompanySchema.safeParse({ id: companyId });

  if (!validatedId.success) {
    console.error('Invalid ID for deletion:', validatedId.error);
    return { success: false, error: 'Invalid company ID provided.' };
  }

  const { id } = validatedId.data;

  try {
    // Attempt to delete the company
    await prisma.company.delete({
      where: { id: id },
    });

    // Revalidate the path to update the UI
    revalidatePath('/list/companys'); // Adjust if your path is different
    return { success: true };
  } catch (error: any) {
    console.error('Database Error deleting company:', error);

    // Check for specific Prisma errors, like foreign key constraints
    if (error.code === 'P2003') {
      // Foreign key constraint failed
      return {
        success: false,
        error: 'Cannot delete company because it has associated designs or notes.',
      };
    }
    if (error.code === 'P2025') {
      // Record to delete not found
      return { success: false, error: 'Company not found.' };
    }

    // General database error
    return { success: false, error: 'Database Error: Failed to delete company.' };
  }
}
