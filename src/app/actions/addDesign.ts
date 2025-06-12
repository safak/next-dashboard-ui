'use server';

import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client'; // Use the correct Status enum
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for input validation using Zod
const AddDesignSchema = z.object({
  companyNumber: z.coerce // Coerce to number for lookup
    .number({ invalid_type_error: 'Company Number must be a number.' })
    .int({ message: 'Company Number must be an integer.' }) // Ensure integer
    .positive({ message: 'Company Number must be positive.' }),
  companyName: z
    .string()
    .min(1, { message: 'Company Name is required when company number is new.' }), // Added back, validation logic handled below
  templateName: z.string().min(1, { message: 'Template Name is required.' }),
  userId: z.string().cuid({ message: 'Invalid User ID format.' }), // Changed from employeeId (number) to userId (string/cuid)
  status: z.nativeEnum(Status, {
    // Add status validation
    errorMap: () => ({ message: 'Invalid status selected.' }),
  }),
  partners: z.string().optional(), // Add optional partners
});

export type AddDesignFormState = {
  message: string | null;
  errors?: {
    companyNumber?: string[];
    companyName?: string[]; // Added back
    templateName?: string[];
    userId?: string[]; // Changed from employeeId
    status?: string[]; // Add status errors
    partners?: string[]; // Add partners errors
    database?: string[]; // For general database errors
  };
};

export async function addDesign(
  prevState: AddDesignFormState,
  formData: FormData
): Promise<AddDesignFormState> {
  // Validate form data
  const validatedFields = AddDesignSchema.safeParse({
    companyNumber: formData.get('companyNumber'),
    companyName: formData.get('companyName'), // Added back
    templateName: formData.get('templateName'),
    userId: formData.get('userId'), // Changed from employeeId
    status: formData.get('status'), // Get status
    partners: formData.get('partners'), // Get partners
  });

  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Destructure validated fields
  const { companyNumber, companyName, templateName, userId, status, partners } =
    validatedFields.data;

  try {
    // 1. Find or Create Company
    // Try to find the company first
    let company = await prisma.company.findUnique({
      where: { id: companyNumber },
    });

    // If company not found, create it (requires companyName)
    if (!company) {
      if (!companyName) {
        // Double-check name is provided if creating
        return {
          message: 'Company Name is required when adding a new company number.',
          errors: { companyName: ['Company Name cannot be empty for a new company.'] },
        };
      }
      try {
        company = await prisma.company.create({
          data: {
            id: companyNumber, // Use the provided number as ID
            name: companyName,
          },
        });
      } catch (e: any) {
        // Handle potential unique constraint violation if ID already exists but wasn't found initially (race condition?)
        if (e.code === 'P2002' && e.meta?.target?.includes('id')) {
          return {
            message: 'Database Error: Company number might already exist.',
            errors: { companyNumber: ['This company number is already taken.'] },
          };
        }
        if (e.code === 'P2002' && e.meta?.target?.includes('name')) {
          return {
            message: 'Database Error: Company name might already exist.',
            errors: { companyName: ['This company name is already taken.'] },
          };
        }
        throw e; // Re-throw other errors
      }
    }

    // 2. Verify User exists (using the directly provided userId)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }, // Only need to confirm existence
    });

    if (!user) {
      return {
        message: 'Selected user not found.',
        errors: { userId: ['The selected user does not exist.'] },
      };
    }

    // 3. Create the new design using the validated userId
    await prisma.design.create({
      data: {
        companyId: company.id, // Use the found or created company's ID
        templateName: templateName,
        status: status, // Use the status from the form
        userId: user.id, // Use the validated userId directly
        partners: partners || null, // Use partners from form, or null if empty/not provided
      },
    });

    // Revalidate the designs list page cache
    revalidatePath('/list/designs');

    return { message: 'Design added successfully!' };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to add design.',
      errors: { database: ['An unexpected error occurred.'] },
    };
  }
}
