"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import type { ExamSchema } from "@/lib/formValidationSchemas";
import type { ExamActionState } from "./types";

const EXAMS_PATH = "/admin/exams";

/* ============================================================
   CREATE EXAM
============================================================ */

export async function createExam(
  _prevState: ExamActionState,
  data: ExamSchema,
): Promise<ExamActionState> {
  try {
    /* ========================================================
       VALIDATE BASIC DATA
    ======================================================== */

    if (!data.title?.trim()) {
      return {
        success: false,
        error: "Exam title is required",
      };
    }

    if (!data.totalMarks || data.totalMarks <= 0) {
      return {
        success: false,
        error: "Total marks must be greater than 0",
      };
    }

    if (!data.examDate) {
      return {
        success: false,
        error: "Exam date is required",
      };
    }

    if (!data.classId) {
      return {
        success: false,
        error: "Class is required",
      };
    }

    if (!data.subjectId) {
      return {
        success: false,
        error: "Subject is required",
      };
    }

    if (!data.teacherId) {
      return {
        success: false,
        error: "Teacher is required",
      };
    }

    /* ========================================================
       VERIFY RELATED RECORDS
    ======================================================== */

    const [classItem, subject, teacher] = await Promise.all([
      prisma.class.findUnique({
        where: {
          id: data.classId,
        },
        select: {
          id: true,
        },
      }),

      prisma.subject.findUnique({
        where: {
          id: data.subjectId,
        },
        select: {
          id: true,
        },
      }),

      prisma.teacher.findUnique({
        where: {
          id: data.teacherId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!classItem) {
      return {
        success: false,
        error: "Selected class was not found",
      };
    }

    if (!subject) {
      return {
        success: false,
        error: "Selected subject was not found",
      };
    }

    if (!teacher) {
      return {
        success: false,
        error: "Selected teacher was not found",
      };
    }

    /* ========================================================
       CREATE EXAM
    ======================================================== */

    await prisma.exam.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        totalMarks: data.totalMarks,
        examDate: data.examDate,
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
      },
    });

    /* ========================================================
       REVALIDATE
    ======================================================== */

    revalidatePath(EXAMS_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Create Exam Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create exam",
    };
  }
}

/* ============================================================
   UPDATE EXAM
============================================================ */

export async function updateExam(
  _prevState: ExamActionState,
  data: ExamSchema,
): Promise<ExamActionState> {
  try {
    /* ========================================================
       VALIDATE EXAM ID
    ======================================================== */

    if (!data.id) {
      return {
        success: false,
        error: "Exam ID is required",
      };
    }

    /* ========================================================
       VALIDATE BASIC DATA
    ======================================================== */

    if (!data.title?.trim()) {
      return {
        success: false,
        error: "Exam title is required",
      };
    }

    if (!data.totalMarks || data.totalMarks <= 0) {
      return {
        success: false,
        error: "Total marks must be greater than 0",
      };
    }

    if (!data.examDate) {
      return {
        success: false,
        error: "Exam date is required",
      };
    }

    if (!data.classId) {
      return {
        success: false,
        error: "Class is required",
      };
    }

    if (!data.subjectId) {
      return {
        success: false,
        error: "Subject is required",
      };
    }

    if (!data.teacherId) {
      return {
        success: false,
        error: "Teacher is required",
      };
    }

    /* ========================================================
       VERIFY RELATED RECORDS
    ======================================================== */

    const [classItem, subject, teacher] = await Promise.all([
      prisma.class.findUnique({
        where: {
          id: data.classId,
        },
        select: {
          id: true,
        },
      }),

      prisma.subject.findUnique({
        where: {
          id: data.subjectId,
        },
        select: {
          id: true,
        },
      }),

      prisma.teacher.findUnique({
        where: {
          id: data.teacherId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!classItem) {
      return {
        success: false,
        error: "Selected class was not found",
      };
    }

    if (!subject) {
      return {
        success: false,
        error: "Selected subject was not found",
      };
    }

    if (!teacher) {
      return {
        success: false,
        error: "Selected teacher was not found",
      };
    }

    /* ========================================================
       UPDATE EXAM
    ======================================================== */

    await prisma.exam.update({
      where: {
        id: data.id,
      },

      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        totalMarks: data.totalMarks,
        examDate: data.examDate,
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
      },
    });

    /* ========================================================
       REVALIDATE
    ======================================================== */

    revalidatePath(EXAMS_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update Exam Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update exam",
    };
  }
}

/* ============================================================
   DELETE EXAM
============================================================ */

export async function deleteExam(
  id: number,
): Promise<ExamActionState> {
  try {
    if (!id) {
      return {
        success: false,
        error: "Exam ID is required",
      };
    }

    /* ========================================================
       CHECK EXAM EXISTS
    ======================================================== */

    const exam = await prisma.exam.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            evaluations: true,
          },
        },
      },
    });

    if (!exam) {
      return {
        success: false,
        error: "Exam not found",
      };
    }

    /* ========================================================
       PREVENT DELETE IF EVALUATIONS EXIST
    ======================================================== */

    if (exam._count.evaluations > 0) {
      return {
        success: false,
        error: `Cannot delete "${exam.title}" because it has ${exam._count.evaluations} student evaluation(s).`,
      };
    }

    /* ========================================================
       DELETE EXAM
    ======================================================== */

    await prisma.exam.delete({
      where: {
        id,
      },
    });

    /* ========================================================
       REVALIDATE EXAMS PAGE
    ======================================================== */

    revalidatePath(EXAMS_PATH);

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Delete Exam Error:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete exam",
    };
  }
}