"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

import type { ActionState } from "@/lib/actions";

import { resultSchema, ResultFormValues } from "@/lib/formValidationSchemas";

/* CREATE RESULT */

export async function createResult(
  _prevState: ActionState,
  data: ResultFormValues,
): Promise<ActionState> {
  try {
    const parsed = resultSchema.parse(data);

    await prisma.result.create({
      data: {
        score: parsed.score,
        studentId: parsed.studentId,
        examId: parsed.examId ?? null,
        assignmentId: parsed.assignmentId ?? null,
      },
    });

    revalidatePath("/admin/results");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Create Result Error:", error);

    return {
      success: false,
      error: error.message ?? "Failed to create result",
    };
  }
}

/* UPDATE RESULT */

export async function updateResult(
  _prevState: ActionState,
  data: ResultFormValues,
): Promise<ActionState> {
  if (!data.id) {
    return {
      success: false,
      error: "Result ID is required",
    };
  }

  try {
    const parsed = resultSchema.parse(data);

    await prisma.result.update({
      where: {
        id: parsed.id,
      },
      data: {
        score: parsed.score,
        studentId: parsed.studentId,
        examId: parsed.examId ?? null,
        assignmentId: parsed.assignmentId ?? null,
      },
    });

    revalidatePath("/admin/results");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Update Result Error:", error);

    return {
      success: false,
      error: error.message ?? "Failed to update result",
    };
  }
}

/* DELETE RESULT */

export async function deleteResult(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    return {
      success: false,
      error: "Invalid result ID",
    };
  }

  try {
    await prisma.result.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/results");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Delete Result Error:", error);

    return {
      success: false,
      error: error.message ?? "Failed to delete result",
    };
  }
}
