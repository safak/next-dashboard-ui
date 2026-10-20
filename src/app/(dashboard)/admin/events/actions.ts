"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { eventSchema } from "./schema";
import type { ActionState, EventFormInput } from "./types";

const EVENTS_PATH = "/admin/events";

/* ============================================================
   CREATE EVENT
============================================================ */

export async function createEvent(
  _prevState: ActionState,
  data: EventFormInput,
): Promise<ActionState> {
  try {
    const parsed = eventSchema.parse(data);

    const { id: _id, ...eventData } = parsed;

    await prisma.event.create({
      data: {
        title: eventData.title.trim(),

        description: eventData.description.trim(),

        startTime: eventData.startTime,

        endTime: eventData.endTime,

        classId: eventData.classId ?? null,

        category: eventData.category?.trim() || null,
      },
    });

    revalidatePath(EVENTS_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Create Event Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event.",
    };
  }
}

/* ============================================================
   UPDATE EVENT
============================================================ */

export async function updateEvent(
  _prevState: ActionState,
  data: EventFormInput,
): Promise<ActionState> {
  try {
    const parsed = eventSchema.parse(data);

    if (!parsed.id) {
      return {
        success: false,
        error: "Event ID is required.",
      };
    }

    const { id, ...eventData } = parsed;

    await prisma.event.update({
      where: {
        id,
      },

      data: {
        title: eventData.title.trim(),

        description: eventData.description.trim(),

        startTime: eventData.startTime,

        endTime: eventData.endTime,

        classId: eventData.classId ?? null,

        category: eventData.category?.trim() || null,
      },
    });

    revalidatePath(EVENTS_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update Event Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event.",
    };
  }
}

/* ============================================================
   DELETE EVENT
============================================================ */

export async function deleteEvent(id: number): Promise<ActionState> {
  try {
    if (!id || !Number.isInteger(id)) {
      return {
        success: false,
        error: "Invalid event ID.",
      };
    }

    await prisma.event.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/events");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete Event Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event.",
    };
  }
}
