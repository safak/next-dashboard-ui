'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth'; // Import authOptions from the correct location
import { Prisma } from '@prisma/client'; // For types

// Define the expected input structure for checklist items from the client
interface ChecklistItemInput {
  checklistItemId?: number;
  customText?: string;
  isChecked: boolean;
}

// Define the expected input structure for the design data
interface DesignInput {
  id?: number; // Present if updating
  companyId: number; // Can be existing or new ID
  companyName?: string; // Required if isNewCompany is true
  isNewCompany: boolean; // Flag from client
  templateName: string;
  partners?: string | null;
  status: string; // Consider using the Status enum if defined in types
  notes?: string | null; // Keep 'notes' here for the input, map to 'designNotes' below
  userId: string | null; // Assigned user ID (can be null)
  checklistItems: ChecklistItemInput[];
}

export async function saveDesign(data: DesignInput) {
  const session = await getServerSession(authOptions); // Use getServerSession
  if (!session?.user?.id) {
    // Although we allow assigning to other users, the action must be performed by an authenticated user
    throw new Error('User performing the action is not authenticated');
  }
  const actionUserId = session.user.id; // User performing the save action

  // Destructure validated data
  const {
    id,
    companyId,
    companyName,
    isNewCompany,
    templateName,
    partners,
    status,
    notes,
    userId: assignedUserId,
    checklistItems,
  } = data;

  let finalCompanyId: number;

  try {
    // --- Handle Company ---
    if (isNewCompany) {
      if (!companyName) {
        // This should ideally be caught by client-side validation, but double-check
        throw new Error('Company Name is required when adding a new company.');
      }
      try {
        const newCompany = await prisma.company.create({
          data: {
            id: companyId, // Use the provided ID
            name: companyName,
          },
        });
        finalCompanyId = newCompany.id;
        console.log(`Created new company: ${newCompany.name} (ID: ${newCompany.id})`);
      } catch (e: any) {
        // Handle potential unique constraint violations
        if (e.code === 'P2002') {
          const target = e.meta?.target as string[] | undefined;
          if (target?.includes('id')) {
            throw new Error(`Company with ID ${companyId} already exists.`);
          } else if (target?.includes('name')) {
            throw new Error(`Company with name "${companyName}" already exists.`);
          }
        }
        throw e; // Re-throw other errors
      }
    } else {
      // Verify existing company ID is valid (optional, but good practice)
      const existingCompany = await prisma.company.findUnique({ where: { id: companyId } });
      if (!existingCompany) {
        throw new Error(`Selected company with ID ${companyId} not found.`);
      }
      finalCompanyId = existingCompany.id;
    }

    // --- Save Design (Create or Update) ---
    if (id) {
      // --- Update Existing Design ---
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Update the Design itself
        await tx.design.update({
          where: { id },
          data: {
            companyId: finalCompanyId, // Use the determined company ID
            templateName,
            partners,
            status,
            designNotes: notes, // Map input 'notes' to schema field 'designNotes'
            userId: assignedUserId, // Update assigned user ID
            // updatedAt is handled automatically by Prisma @updatedAt
          },
        });

        // 2. Delete existing checklist items for this design
        await tx.designChecklistItem.deleteMany({
          where: { designId: id },
        });

        // 3. Create new checklist items based on the submitted state
        if (checklistItems && checklistItems.length > 0) {
          await tx.designChecklistItem.createMany({
            data: checklistItems.map((item) => ({
              designId: id,
              checklistItemId: item.checklistItemId,
              customText: item.customText,
              isChecked: item.isChecked,
              userId: actionUserId, // User who performed the save action
            })),
          });
        }
      });
      console.log(`Design ${id} updated successfully.`);
    } else {
      // --- Create New Design ---
      const newDesign = await prisma.design.create({
        data: {
          companyId: finalCompanyId, // Use the determined company ID
          templateName,
          partners,
          status,
          designNotes: notes, // Map input 'notes' to schema field 'designNotes'
          userId: assignedUserId, // Assign to the selected user
          // Create checklist items within the same transaction implicitly if needed,
          // or handle separately if createMany is preferred after creation.
          // For simplicity here, we'll create the design first, then the checklist items.
        },
      });
      console.log(`Design ${newDesign.id} created successfully.`);

      // Create associated checklist items
      if (checklistItems && checklistItems.length > 0) {
        await prisma.designChecklistItem.createMany({
          data: checklistItems.map((item) => ({
            designId: newDesign.id,
            checklistItemId: item.checklistItemId,
            customText: item.customText,
            isChecked: item.isChecked,
            userId: actionUserId, // User who performed the save action
          })),
        });
      }
    }
  } catch (error) {
    console.error('Database Error saving design:', error);
    // Consider returning a more specific error message
    throw new Error('Failed to save design.');
  }

  // Revalidate the designs list page cache
  revalidatePath('/list/designs');
  // Optionally revalidate the specific design page if one exists
  // if (id) revalidatePath(`/designs/${id}`);

  // Redirect to the designs list page after successful save/update
  // Note: Redirects must be called outside the try/catch block
  redirect('/list/designs');
}
