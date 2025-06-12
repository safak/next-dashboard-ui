'use server';

import { getServerSession } from 'next-auth/next'; // Use getServerSession for v4
import { authOptions } from '@/lib/auth'; // Import authOptions
import { prisma } from '@/lib/prisma'; // Use named import for prisma
import { revalidatePath } from 'next/cache'; // To potentially refresh data display

// Define the expected shape of the update data
interface UserUpdateData {
  name?: string;
  email?: string;
  image?: string;
}

export async function updateUserProfile(formData: UserUpdateData) {
  // Get session using getServerSession with authOptions
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const userId = session.user.id;

  // Basic validation (can be expanded with libraries like Zod)
  if (!formData.name && !formData.email && !formData.image) {
    return { success: false, error: 'No data provided for update.' };
  }
  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    return { success: false, error: 'Invalid email format.' };
  }
  // Add validation for image URL if needed

  // Prepare data for Prisma, converting empty strings to null for optional fields
  const dataToUpdate: { name?: string | null; email?: string | null; image?: string | null } = {};
  if (formData.name !== undefined) {
    dataToUpdate.name = formData.name === '' ? null : formData.name;
  }
  if (formData.email !== undefined) {
    // Handle empty string for unique email field carefully. Setting to null if empty.
    dataToUpdate.email = formData.email === '' ? null : formData.email;
  }
  if (formData.image !== undefined) {
    dataToUpdate.image = formData.image === '' ? null : formData.image;
  }

  // Only proceed if there's actually something to update
  if (Object.keys(dataToUpdate).length === 0) {
    return { success: false, error: 'No changes detected.' };
  }

  try {
    console.log(`[updateUserProfile] Attempting to update user ${userId} with data:`, dataToUpdate);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
    console.log(`[updateUserProfile] Successfully updated user ${userId}. Result:`, updatedUser);

    // Revalidate the dashboard layout path to ensure updated user info is fetched on navigation
    revalidatePath('/(dashboard)', 'layout');

    // console.log('User profile updated successfully:', updatedUser.id); // Redundant log
    return { success: true, user: updatedUser };
  } catch (error: any) {
    // Catch specific error type if possible
    console.error(`[updateUserProfile] Error updating user ${userId}:`, error);
    // Handle specific Prisma errors
    if (error?.code === 'P2002') {
      // Prisma unique constraint violation code
      // Check which field caused the violation (likely email)
      const target = (error.meta?.target as string[])?.join(', ');
      console.error(`[updateUserProfile] Unique constraint violation on field(s): ${target}`);
      return {
        success: false,
        error: `Unique constraint failed on ${target || 'field'}. The value might already be in use.`,
      };
    }
    return { success: false, error: 'Failed to update profile. Please try again.' };
  }
}
