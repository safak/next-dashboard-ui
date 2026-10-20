"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

type ActionState = {
  success: boolean;
  error?: string;
};

type CreateHolidayInput = {
  title: string;
  date: Date;
  isFullDay: boolean;
};

type UpdateHolidayInput = CreateHolidayInput & {
  id: number;
};

export async function createHoliday(
  _prevState: ActionState,
  data: CreateHolidayInput,
): Promise<ActionState> {
  try {
    await prisma.holiday.create({
      data: {
        title: data.title,
        date: data.date,
        isFullDay: data.isFullDay,
      },
    });

    revalidatePath("/admin/holidays");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ createHoliday:", error);

    return {
      success: false,
      error: "Failed to create holiday",
    };
  }
}

export async function updateHoliday(
  _prevState: ActionState,
  data: UpdateHolidayInput,
): Promise<ActionState> {
  try {
    if (!data.id || Number.isNaN(data.id)) {
      return {
        success: false,
        error: "Invalid holiday id",
      };
    }

    await prisma.holiday.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        date: data.date,
        isFullDay: data.isFullDay,
      },
    });

    revalidatePath("/admin/holidays");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ updateHoliday:", error);

    return {
      success: false,
      error: "Failed to update holiday",
    };
  }
}

export async function deleteHoliday(id: number): Promise<ActionState> {
  try {
    if (!id || Number.isNaN(id)) {
      return {
        success: false,
        error: "Invalid holiday id",
      };
    }

    await prisma.holiday.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/holidays");

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ deleteHoliday:", error);

    return {
      success: false,
      error: "Failed to delete holiday",
    };
  }
}
