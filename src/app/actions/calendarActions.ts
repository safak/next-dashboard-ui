'use server';

import { revalidatePath } from 'next/cache';
import { Prisma, Event, EventType, User } from '@prisma/client'; // Removed PrismaClient
import { prisma } from '@/lib/prisma'; // Reverted import
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth'; // Import authOptions from the correct location

// Helper to get authenticated user ID using getServerSession
async function getUserId() {
  const session = await getServerSession(authOptions); // Use getServerSession
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }
  return session.user.id;
}

// Helper function to calculate duration in days (inclusive)
function calculateDurationInDays(startDate: Date, endDate: Date): number {
  // Ensure dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid start or end date provided.');
  }
  // Normalize dates to midnight UTC to avoid timezone issues affecting day count
  const startUTC = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  );
  const endUTC = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

  // Calculate difference in milliseconds and convert to days
  const diffTime = Math.abs(endUTC - startUTC);
  // Add 1 because the end date is inclusive
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Ensure duration is at least 1 day
  return Math.max(1, diffDays);
}

// More explicit type definition for event data coming from the client
// Includes fields needed for create/update, plus optional id
type CalendarEventInput = {
  id?: number; // Optional: only for updates/deletes
  title: string;
  startDate: Date | string; // Allow string initially, convert to Date in actions
  endDate: Date | string; // Allow string initially, convert to Date in actions
  type: EventType;
  description?: string | null; // Added description
  allDay?: boolean | null;
  color?: string | null;
  // userId is added automatically based on session
};

// Fetch Events for the authenticated user
export async function getCalendarEvents() {
  try {
    const userId = await getUserId();
    // Select all fields needed by the frontend explicitly
    const events = await prisma.event.findMany({
      where: { userId: userId },
      orderBy: { startDate: 'asc' },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        description: true, // Fetch description
        allDay: true,
        color: true,
        type: true,
        userId: true,
      }, // Removed 'as any' cast - let's see if TS resolves it now
    });
    // Map DB field names to frontend prop names
    return events.map((event) => ({
      ...event,
      start: event.startDate,
      end: event.endDate,
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return []; // Return empty array on error
  }
}

// Add a new Event
export async function addCalendarEvent(eventData: CalendarEventInput) {
  const userId = await getUserId();

  // Basic validation
  if (!eventData.title || !eventData.startDate || !eventData.endDate || !eventData.type) {
    throw new Error('Missing required event fields: title, startDate, endDate, type');
  }

  // TODO: Add vacation day deduction logic here if eventData.type === 'VACATION'
  // - Fetch user's current vacation days
  // - Calculate duration of vacation
  // - Check if sufficient days remain
  // - Update user's vacation days within a transaction with event creation

  try {
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);

    // Use a transaction to ensure atomicity, explicitly typing 'tx'
    const newEvent = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let vacationDaysToDeduct = 0;

      // Handle vacation day deduction
      if (eventData.type === EventType.VACATION) {
        // Fetch user without 'as any'
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { vacationDays: true }, // Removed cast
        });

        if (!user) {
          throw new Error('User not found for vacation calculation.');
        }

        vacationDaysToDeduct = calculateDurationInDays(startDate, endDate);

        // Use optional chaining
        const currentVacationDays = user.vacationDays ?? 0; // Access directly, TS should infer type

        if (currentVacationDays < vacationDaysToDeduct) {
          throw new Error('Insufficient vacation days.');
        }

        // Update user's vacation days without 'as any'
        await tx.user.update({
          where: { id: userId },
          data: { vacationDays: { decrement: vacationDaysToDeduct } }, // Removed cast
        });
      }

      // Create the event
      const createdEvent = await tx.event.create({
        data: {
          title: eventData.title,
          startDate: startDate, // Use Date objects
          endDate: endDate,
          description: eventData.description, // Save description
          allDay: eventData.allDay,
          color: eventData.color,
          type: eventData.type,
          userId: userId,
        },
        // Select the fields needed for the return object
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          description: true,
          allDay: true,
          color: true,
          type: true,
          userId: true, // Select description
        },
      });

      return createdEvent; // Return the created event from the transaction
    });

    revalidatePath('/calendar');
    // Return data matching the structure used in the frontend state
    return {
      id: newEvent.id,
      title: newEvent.title,
      start: newEvent.startDate,
      end: newEvent.endDate,
      description: newEvent.description, // Return description
      allDay: newEvent.allDay,
      color: newEvent.color,
      type: newEvent.type,
      userId: newEvent.userId, // Include userId if needed elsewhere, though not directly in MyEvent usually
    };
  } catch (error) {
    console.error('Error adding calendar event:', error);
    // Check if the error is the specific "Insufficient vacation days" error
    if (error instanceof Error && error.message === 'Insufficient vacation days.') {
      throw error; // Re-throw the specific error for the frontend to catch
    }
    throw new Error('Failed to add event.'); // Throw a generic error otherwise
  }
}

// Update an existing Event
export async function updateCalendarEvent(eventData: CalendarEventInput) {
  const userId = await getUserId();

  if (!eventData.id) {
    throw new Error('Event ID is required for update');
  }
  // Basic validation - description is optional
  if (!eventData.title || !eventData.startDate || !eventData.endDate || !eventData.type) {
    throw new Error('Missing required event fields: title, startDate, endDate, type');
  }

  // TODO: Add logic to handle changes in vacation days if type/dates change
  // This needs careful implementation: calculate old duration, new duration,
  // find the difference, and adjust user's vacation days accordingly within a transaction.

  try {
    // Use a transaction for updating event and potentially vacation days, explicitly typing 'tx'
    const updatedEvent = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);

      // Verify the event belongs to the user before updating
      const existingEvent = await tx.event.findUnique({
        where: { id: eventData.id },
      });

      if (!existingEvent || existingEvent.userId !== userId) {
        throw new Error('Event not found or user not authorized');
      }

      let vacationDayDifference = 0;

      // Calculate difference only if the event type *was* or *is* VACATION
      if (existingEvent.type === EventType.VACATION || eventData.type === EventType.VACATION) {
        const oldDuration =
          existingEvent.type === EventType.VACATION
            ? calculateDurationInDays(existingEvent.startDate, existingEvent.endDate)
            : 0;
        const newDuration =
          eventData.type === EventType.VACATION ? calculateDurationInDays(startDate, endDate) : 0;

        vacationDayDifference = oldDuration - newDuration; // Positive means refund, negative means deduct more

        if (vacationDayDifference !== 0) {
          // Fetch user without 'as any'
          const user = await tx.user.findUnique({
            where: { id: userId },
            select: { vacationDays: true }, // Removed cast
          });

          if (!user) {
            throw new Error('User not found for vacation adjustment.');
          }

          // Use optional chaining
          const currentVacationDays = user.vacationDays ?? 0; // Access directly
          const newVacationDays = currentVacationDays + vacationDayDifference;

          // Check if deducting more days is possible
          if (newVacationDays < 0) {
            throw new Error('Insufficient vacation days for the updated duration.');
          }

          // Update user's vacation days without 'as any'
          await tx.user.update({
            where: { id: userId },
            data: { vacationDays: newVacationDays }, // Removed cast
          });
        }
      }

      // Update the event itself
      const eventAfterUpdate = await tx.event.update({
        where: { id: eventData.id },
        data: {
          title: eventData.title,
          startDate: startDate,
          endDate: endDate,
          description: eventData.description, // Update description
          allDay: eventData.allDay,
          color: eventData.color,
          type: eventData.type,
          // userId should not change
        },
        // Select the fields needed for the return object
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          description: true,
          allDay: true,
          color: true,
          type: true,
          userId: true, // Select description
        },
      });

      return eventAfterUpdate; // Return the updated event from the transaction
    });

    revalidatePath('/calendar');
    // Return data matching the structure used in the frontend state
    return {
      id: updatedEvent.id,
      title: updatedEvent.title,
      start: updatedEvent.startDate,
      end: updatedEvent.endDate,
      description: updatedEvent.description, // Return description
      allDay: updatedEvent.allDay,
      color: updatedEvent.color,
      type: updatedEvent.type,
      userId: updatedEvent.userId,
    };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    // Check for specific error
    if (error instanceof Error && error.message.includes('Insufficient vacation days')) {
      throw error;
    }
    throw new Error('Failed to update event.');
  }
}

// Delete an Event
export async function deleteCalendarEvent(eventId: number) {
  const userId = await getUserId();

  // TODO: Add logic to refund vacation days if a VACATION event is deleted

  try {
    // Use a transaction for deleting event and potentially refunding vacation days, explicitly typing 'tx'
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Verify the event belongs to the user before deleting
      const existingEvent = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!existingEvent || existingEvent.userId !== userId) {
        throw new Error('Event not found or user not authorized');
      }

      // --- START: Vacation Day Refund Logic for Delete ---
      if (existingEvent.type === EventType.VACATION) {
        const durationToRefund = calculateDurationInDays(
          existingEvent.startDate,
          existingEvent.endDate
        );

        if (durationToRefund > 0) {
          // Fetch the user to ensure they exist before updating
          const user = await tx.user.findUnique({
            where: { id: userId },
            select: { id: true }, // Select minimal field just to check existence
          });

          if (!user) {
            // This case should ideally not happen if the event exists, but good practice to check
            throw new Error('User not found for vacation refund.');
          }

          await tx.user.update({
            where: { id: userId },
            // Increment vacation days. Prisma handles null correctly with increment.
            data: {
              vacationDays: {
                increment: durationToRefund,
              },
            }, // Removed cast
          });
        }
      }
      // --- END: Vacation Day Refund Logic for Delete ---

      // Delete the event
      await tx.event.delete({
        where: { id: eventId },
      });
    });

    revalidatePath('/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw new Error('Failed to delete event.');
  }
}

// Fetch User Vacation Days
export async function getUserVacationDays() {
  try {
    const userId = await getUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Explicitly select only vacationDays
      select: { vacationDays: true }, // Removed cast
    });
    // Use optional chaining directly
    return user?.vacationDays ?? 0;
  } catch (error) {
    console.error('Error fetching vacation days:', error);
    return 0; // Return 0 on error
  }
}
