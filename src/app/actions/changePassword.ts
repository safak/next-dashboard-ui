'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface ChangePasswordData {
  currentPassword?: string;
  newPassword?: string;
}

export async function changePassword(formData: ChangePasswordData) {
  // 1. Get Session & User ID
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }
  const userId = session.user.id;

  // 2. Validate Input
  if (!formData.currentPassword || !formData.newPassword) {
    return { success: false, error: 'Current and new passwords are required.' };
  }
  if (formData.newPassword.length < 6) {
    // Example: Enforce minimum length
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }
  if (formData.currentPassword === formData.newPassword) {
    return { success: false, error: 'New password cannot be the same as the current password.' };
  }

  try {
    // 3. Fetch Current User Password Hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user || !user.password) {
      // Should not happen for users logged in via credentials, but good practice to check
      return { success: false, error: 'User not found or password not set.' };
    }

    // 4. Verify Current Password
    const isCurrentPasswordValid = await bcrypt.compare(formData.currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return { success: false, error: 'Incorrect current password.' };
    }

    // 5. Hash New Password
    const hashedNewPassword = await bcrypt.hash(formData.newPassword, 10); // Salt rounds = 10

    // 6. Update Password in Database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    console.log(`[changePassword] Password updated successfully for user ${userId}`);
    // Note: We don't need to revalidate paths or update session here,
    // as the password change doesn't affect displayed data directly.
    // The user will use the new password next time they log in.
    return { success: true, message: 'Password updated successfully.' };
  } catch (error) {
    console.error(`[changePassword] Error changing password for user ${userId}:`, error);
    return { success: false, error: 'Failed to change password. Please try again.' };
  }
}
