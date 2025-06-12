'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Define the schema for form validation using Zod
const CompanySchema = z.object({
  id: z.coerce // Use coerce to convert string input to number
    .number({ invalid_type_error: 'ID must be a number.' })
    .int({ message: 'ID must be a whole number.' })
    .positive({ message: 'ID must be a positive number.' }),
  name: z.string().min(1, { message: 'Company name is required.' }),
  // Add other fields here if needed in the future, e.g., address, contact info
});

// Define the state structure for useFormState
export interface AddCompanyFormState {
  message?: string | null;
  errors?: {
    id?: string[]; // Add ID errors
    name?: string[];
    database?: string[]; // For general database errors
    // Add other field errors if needed
  };
}

export async function addCompany(
  prevState: AddCompanyFormState,
  formData: FormData
): Promise<AddCompanyFormState> {
  // Validate form fields
  const validatedFields = CompanySchema.safeParse({
    id: formData.get('companyId'), // Get ID from form
    name: formData.get('companyName'), // Match the input name in the modal form
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the company name.',
    };
  }

  const { id, name } = validatedFields.data; // Destructure id and name

  try {
    // Check if company ID already exists
    const existingCompanyById = await prisma.company.findUnique({
      where: { id: id },
    });
    if (existingCompanyById) {
      return {
        errors: { id: ['Company ID already exists.'] },
        message: 'Failed to add company.',
      };
    }

    // Check if company name already exists (case-insensitive)
    const existingCompanyByName = await prisma.company.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingCompanyByName) {
      return {
        errors: { name: ['Company name already exists.'] },
        message: 'Failed to add company.',
      };
    }

    // Create the new company in the database
    await prisma.company.create({
      data: {
        id: id, // Include the validated ID
        name: name,
        // Add other fields here if they are part of the schema and form
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create company.',
    };
  }

  // Revalidate the cache for the companies list page to show the new company
  revalidatePath('/list/companys'); // Adjust path if necessary

  // Return success message
  return { message: 'Company added successfully!' };
}
