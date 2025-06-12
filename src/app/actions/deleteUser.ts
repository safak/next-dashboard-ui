'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth'; // Import authOptions
import { Role } from '@prisma/client';

// Define the state structure for potential feedback (though often not needed for simple delete)
export interface DeleteUserFormState {
  message: string | null;
  errors?: {
    database?: string[];
    authorization?: string[];
  };
}

export async function deleteUser(userId: string): Promise<DeleteUserFormState> {
  // 1. Check if the current user is an Admin
  const session = await getServerSession(authOptions); // Use getServerSession
  if (session?.user?.role !== Role.ADMIN) {
    return {
      message: 'Unauthorized: Only admins can delete users.',
      errors: { authorization: ['Permission denied.'] },
    };
  }

  // Prevent admin from deleting themselves (optional but good practice)
  if (session.user.id === userId) {
    return {
      message: 'Action Forbidden: Admins cannot delete their own account.',
      errors: { authorization: ['Cannot delete self.'] },
    };
  }

  // 2. Delete the user from the database
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error('Database Error:', error);
    // Handle potential errors, e.g., user not found (though delete is often idempotent)
    // Or foreign key constraints if relations aren't set to cascade delete properly
    return {
      message: 'Database Error: Failed to delete user.',
      errors: { database: ['An unexpected error occurred during deletion.'] },
    };
  }

  // 3. Revalidate the cache for the employees page
  revalidatePath('/(dashboard)/employees'); // Adjust path as needed

  // 4. Return success state
  // Note: For simple deletes, often no message is needed on success,
  // as the UI will update via revalidation. Returning null is fine.
  return { message: 'User deleted successfully.' }; // Or return { message: null }
}
