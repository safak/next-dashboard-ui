'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth';

// Define the base schema parts
const BaseUserSchema = z.object({
  userId: z.string().optional(), // Added for identifying user to update
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  name: z.string().optional(),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  role: z.nativeEnum(Role, { errorMap: () => ({ message: 'Invalid role selected.' }) }),
});

// Schema for adding a user (password required)
const AddUserSchema = BaseUserSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

// Schema for updating a user (password optional, but validated if present)
const UpdateUserSchema = BaseUserSchema.extend({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .optional()
    .or(z.literal('')), // Optional, allow empty string, but validate length if provided
});

// Define the state structure for useFormState
export interface UserFormState {
  // Renamed for clarity
  message: string | null;
  errors?: {
    username?: string[];
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    // Removed duplicate database field, keeping the one below
    database?: string[]; // For general database/authorization errors
  };
}

// Combined function to handle both adding and updating users
export async function upsertUser( // Renamed for clarity
  prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  console.log('[upsertUser Action] Received form data:', rawFormData);

  const userId = formData.get('userId') as string | null;
  const isUpdate = !!userId;
  const actionVerb = isUpdate ? 'update' : 'add';
  const actionGerund = isUpdate ? 'updating' : 'adding';

  // 1. Authorization Check (Admin only)
  const session = await getServerSession(authOptions);
  console.log(`[upsertUser Action] Session check for ${actionGerund} user:`, session);
  if (session?.user?.role !== Role.ADMIN) {
    console.error(`[upsertUser Action] Authorization failed. User role: ${session?.user?.role}`);
    return {
      message: `Unauthorized: Only admins can ${actionVerb} users.`,
      errors: { database: ['Permission denied.'] },
    };
  }

  // 2. Validate form data based on mode (Add vs Update)
  const SchemaToUse = isUpdate ? UpdateUserSchema : AddUserSchema;
  const validatedFields = SchemaToUse.safeParse({
    userId: userId, // Include userId for validation context if needed
    username: formData.get('username'),
    name: formData.get('name') || undefined,
    email: formData.get('email') || undefined,
    password: formData.get('password'), // Will be validated based on schema
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    console.error(
      `[upsertUser Action] Validation Errors (${actionGerund}):`,
      validatedFields.error.flatten().fieldErrors
    );
    return {
      message: `Failed to ${actionVerb} user. Please check the fields.`,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, name, email, password, role } = validatedFields.data;
  const finalEmail = email || null; // Use null for empty/undefined email

  // 3. Database Operation (Create or Update)
  try {
    if (isUpdate && userId) {
      // --- UPDATE LOGIC ---
      console.log(`[upsertUser Action] Attempting to update user ID: ${userId}`);

      // Check if email is being changed and if the new email conflicts with another user
      if (finalEmail) {
        const conflictingUser = await prisma.user.findFirst({
          where: {
            email: finalEmail,
            id: { not: userId }, // Exclude the current user being updated
          },
          select: { id: true },
        });
        if (conflictingUser) {
          console.warn(`[upsertUser Action] Email conflict detected for user ID: ${userId}`);
          return {
            message: 'Failed to update user.',
            errors: { email: ['Email already in use by another user.'] },
          };
        }
      }

      // Prepare update data - only include fields that are being changed
      const updateData: {
        name?: string | null;
        email?: string | null;
        password?: string;
        role?: Role;
      } = {};
      if (name !== undefined) updateData.name = name || null;
      if (email !== undefined) updateData.email = finalEmail; // Use finalEmail (can be null)
      if (password) {
        // Only update password if a new one is provided
        updateData.password = await bcrypt.hash(password, 10);
      }
      if (role) updateData.role = role;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
      console.log('[upsertUser Action] User updated successfully:', updatedUser);
    } else {
      // --- CREATE LOGIC ---
      console.log('[upsertUser Action] Attempting to create new user...');

      // Check for existing username or email
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: username }, ...(finalEmail ? [{ email: finalEmail }] : [])],
        },
        select: { username: true, email: true },
      });

      if (existingUser) {
        const errors: UserFormState['errors'] = {};
        if (existingUser.username === username) errors.username = ['Username already taken.'];
        if (finalEmail && existingUser.email === finalEmail)
          errors.email = ['Email already in use.'];
        console.warn('[upsertUser Action] User already exists:', errors);
        return { message: 'Failed to add user.', errors: errors };
      }

      // Hash password (required for add)
      const hashedPassword = await bcrypt.hash(password!, 10); // Non-null assertion ok due to AddUserSchema validation

      const newUser = await prisma.user.create({
        data: {
          username: username,
          name: name || null,
          email: finalEmail,
          password: hashedPassword,
          role: role,
        },
      });
      console.log('[upsertUser Action] User created successfully:', newUser);
    }
  } catch (error) {
    console.error(`[upsertUser Action] Database Error during ${actionGerund}:`, error);
    return {
      message: `Database Error: Failed to ${actionVerb} user.`,
      errors: { database: ['An unexpected database error occurred.'] },
    };
  }

  // 4. Revalidate Path
  try {
    console.log(`[upsertUser Action] Revalidating path: /employees after ${actionGerund}`);
    revalidatePath('/(dashboard)/employees');
    console.log('[upsertUser Action] Path revalidated.');
  } catch (revalError) {
    console.error('[upsertUser Action] Failed to revalidate path:', revalError);
    // Log error but proceed
  }

  // 5. Return Success
  const successMessage = isUpdate ? 'User updated successfully!' : 'User added successfully!';
  console.log(`[upsertUser Action] Returning success state: ${successMessage}`);
  return { message: successMessage };
}
