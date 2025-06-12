// app/actions/updateStatus.ts (or any other location)
'use server'; // Mark this module as containing Server Actions

import { revalidatePath } from 'next/cache'; // To refresh data on the page
import { PrismaClient } from '@prisma/client';
import { STATUSES } from '../../components/Statuses'; // Adjust the import path as needed

const prisma = new PrismaClient(); // Or import your singleton instance

// Define the expected input type for better safety
interface UpdateStatusInput {
  itemId: string;
  newStatus: string;
}

export async function updateItemStatus(
  input: UpdateStatusInput
): Promise<{ success: boolean; message: string; data?: any }> {
  const { itemId: itemIdString, newStatus } = input; // Rename itemId to avoid confusion

  const itemId = parseInt(itemIdString, 10); // Convert string ID to number

  if (isNaN(itemId)) {
    // Check if parsing resulted in NaN
    return { success: false, message: 'Invalid item ID format.' };
  }
  if (typeof newStatus !== 'string' || !newStatus) {
    return { success: false, message: 'Status is required.' };
  }

  const allowedStatuses = STATUSES.map((s) => s.value);
  if (!allowedStatuses.includes(newStatus.toUpperCase())) {
    return { success: false, message: `Invalid status value: ${newStatus}` };
  }

  try {
    const updatedItem = await prisma.design.update({
      // Use the parsed numeric ID
      where: { id: itemId },
      data: { status: newStatus.toUpperCase() },
    });

    // Revalidate the path where the table is displayed to refresh data
    // Adjust the path as needed, e.g., '/dashboard/items'
    revalidatePath('/your-table-page'); // Or use revalidateTag if using tags

    return { success: true, message: 'Status updated successfully.', data: updatedItem };
  } catch (error: any) {
    console.error('Failed to update status:', error);
    if (error.code === 'P2025') {
      // Use the original string ID for the error message if needed, or the parsed ID
      return { success: false, message: `Item with ID ${itemIdString} not found.` };
    }
    return { success: false, message: 'Database error: Failed to update status.' };
  }
}
