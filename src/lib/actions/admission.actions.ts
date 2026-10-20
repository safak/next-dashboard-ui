"use server";

import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { clerkAdmin } from "@/lib/clerkAdmin";
import { generateRollNumber } from "@/lib/generateRollNumber";
import { generateAdmissionNumber } from "@/lib/generateAdmissionNumber";
import type { StudentRegistrationFormValues } from "@/lib/formValidationSchemas";
import { saveStudentDocuments } from "@/lib/saveStudentDocuments";

export type ActionState = {
  success: boolean;
  error?: string;
  studentId?: string;
};

function normalizeDate(value: Date | string | undefined | null): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? new Date(value) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getFeeStatus(
  totalAmount: number,
  paidAmount: number,
): "PENDING" | "PARTIAL" | "PAID" {
  if (paidAmount <= 0) {
    return totalAmount === 0 ? "PAID" : "PENDING";
  }

  if (paidAmount >= totalAmount) {
    return "PAID";
  }

  return "PARTIAL";
}

export async function registerStudent(
  data: StudentRegistrationFormValues,
): Promise<ActionState> {
  let clerkUserId: string | null = null;

  try {
    const { student, parent, academic } = data;

    /* ============================================================
       NORMALIZE DUE DATES
    ============================================================ */

    const admissionDueDate = normalizeDate(academic.admissionDueDate);

    const term1DueDate = normalizeDate(academic.term1DueDate);

    const term2DueDate = normalizeDate(academic.term2DueDate);

    /* ============================================================
       VALIDATIONS
    ============================================================ */

    const existingUsername = await prisma.parent.findUnique({
      where: {
        username: parent.username,
      },
    });

    if (existingUsername) {
      return {
        success: false,
        error: "Username already exists.",
      };
    }

    const existingPhone = await prisma.parent.findUnique({
      where: {
        phone: parent.phone,
      },
    });

    if (existingPhone) {
      return {
        success: false,
        error: "Phone number already exists.",
      };
    }

    if (parent.email) {
      const existingEmail = await prisma.parent.findUnique({
        where: {
          email: parent.email,
        },
      });

      if (existingEmail) {
        return {
          success: false,
          error: "Email already exists.",
        };
      }
    }

    /* ============================================================
       ACTIVE ACADEMIC YEAR
    ============================================================ */

    const academicYear = await prisma.academicYear.findFirst({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        label: true,
      },
    });

    if (!academicYear) {
      return {
        success: false,
        error: "No active academic year found.",
      };
    }

    /* ============================================================
       CLASS VALIDATION
    ============================================================ */

    const classItem = await prisma.class.findUnique({
      where: {
        id: academic.classId,
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!classItem) {
      return {
        success: false,
        error: "Selected class not found.",
      };
    }

    if (classItem.capacity <= classItem._count.students) {
      return {
        success: false,
        error: "Selected class is already full.",
      };
    }

    /* ============================================================
       FEE STRUCTURE VALIDATION
    ============================================================ */

    const feeStructure = await prisma.feeStructure.findUnique({
      where: {
        classId: academic.classId,
      },
      select: {
        id: true,
        classId: true,
        title: true,
        annualFee: true,
        admissionFee: true,
        isActive: true,
      },
    });

    if (!feeStructure || !feeStructure.isActive) {
      return {
        success: false,
        error: `No active fee structure is configured for ${classItem.name}.`,
      };
    }

    /* ============================================================
       VERIFY SELECTED FEE STRUCTURE
    ============================================================ */

    if (feeStructure.id !== academic.feeStructureId) {
      return {
        success: false,
        error:
          "The selected fee structure does not belong to the selected class.",
      };
    }

    /* ============================================================
       FEE CALCULATION
    ============================================================ */

    const originalFee = Number(feeStructure.annualFee);

    const discount = Math.max(Number(academic.discount) || 0, 0);

    if (discount > originalFee) {
      return {
        success: false,
        error: "Discount cannot be greater than the annual fee.",
      };
    }

    const finalFee = Math.max(originalFee - discount, 0);

    const admissionAmount = Math.min(
      Number(feeStructure.admissionFee),
      finalFee,
    );

    const remainingAmount = Math.max(finalFee - admissionAmount, 0);

    const term1Amount = Math.floor(remainingAmount / 2);

    const term2Amount = remainingAmount - term1Amount;

    const paidAmount = Math.min(
      Math.max(Number(academic.paidAmount) || 0, 0),
      finalFee,
    );

    /* ============================================================
       PAYMENT DISTRIBUTION
    ============================================================ */

    const admissionPaid = Math.min(paidAmount, admissionAmount);

    const remainingPaidAfterAdmission = Math.max(paidAmount - admissionPaid, 0);

    const term1Paid = Math.min(remainingPaidAfterAdmission, term1Amount);

    const term2Paid = Math.min(
      Math.max(remainingPaidAfterAdmission - term1Paid, 0),
      term2Amount,
    );

    /* ============================================================
       CREATE CLERK PARENT USER
    ============================================================ */

    try {
      const clerkUser = await clerkAdmin.users.createUser({
        username: parent.username,
        password: parent.password,
        firstName: parent.name,
        lastName: parent.surname,

        ...(parent.email
          ? {
              emailAddress: [parent.email],
            }
          : {}),

        publicMetadata: {
          role: "parent",
        },
      });

      clerkUserId = clerkUser.id;
    } catch (error: any) {
      console.error("CLERK USER CREATION ERROR:", error);

      console.error("Status:", error?.status);

      console.error("Errors:", JSON.stringify(error?.errors, null, 2));

      throw error;
    }

    let createdStudentId = "";

    /* ============================================================
       DATABASE TRANSACTION
    ============================================================ */

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      /* ========================================================
           GENERATE ROLL NUMBER
        ======================================================== */

      const rollNo = await generateRollNumber(
        academic.classId,
        academicYear.id,
      );

      /* ========================================================
           CREATE PARENT
        ======================================================== */

      await tx.parent.create({
        data: {
          id: clerkUserId!,
          username: parent.username,

          name: parent.name,
          surname: parent.surname,

          email: parent.email || null,
          phone: parent.phone,

          address: parent.address,
        },
      });

      /* ========================================================
           CREATE STUDENT
        ======================================================== */

      const admissionNo = await generateAdmissionNumber();

      const createdStudent = await tx.student.create({
        data: {
          admissionNo,

          name: student.name,
          surname: student.surname,

          rollNo,

          email: null,
          phone: null,

          address: parent.address,

          img: student.img || null,

          bloodType: student.bloodType,

          sex: student.sex,

          birthday: student.birthday,

          parent: {
            connect: {
              id: clerkUserId!,
            },
          },

          class: {
            connect: {
              id: academic.classId,
            },
          },

          academicYear: {
            connect: {
              id: academicYear.id,
            },
          },
        },
      });

      /* ========================================================
           CREATE FEE PLAN
        ======================================================== */

      const feePlan = await tx.studentFeePlan.create({
        data: {
          studentId: createdStudent.id,

          academicYearId: academicYear.id,

          feeStructureId: feeStructure.id,

          originalFee,

          discount,

          finalFee,

          admissionAmount,

          term1Amount,

          term2Amount,
        },
      });

      /* ========================================================
           CREATE FEE INSTALLMENTS
        ======================================================== */

      await tx.studentFee.createMany({
        data: [
          {
            studentId: createdStudent.id,

            planId: feePlan.id,

            installment: "ADMISSION",

            dueDate: admissionDueDate,

            totalAmount: admissionAmount,

            paidAmount: admissionPaid,

            status: getFeeStatus(admissionAmount, admissionPaid),
          },

          {
            studentId: createdStudent.id,

            planId: feePlan.id,

            installment: "TERM_1",

            dueDate: term1DueDate,

            totalAmount: term1Amount,

            paidAmount: term1Paid,

            status: getFeeStatus(term1Amount, term1Paid),
          },

          {
            studentId: createdStudent.id,

            planId: feePlan.id,

            installment: "TERM_2",

            dueDate: term2DueDate,

            totalAmount: term2Amount,

            paidAmount: term2Paid,

            status: getFeeStatus(term2Amount, term2Paid),
          },
        ],
      });

      /* ========================================================
           SAVE DOCUMENTS
        ======================================================== */

      await saveStudentDocuments(
        tx,
        createdStudent.id,
        data.documents,
        clerkUserId!,
      );

      createdStudentId = createdStudent.id;
    });

    /* ============================================================
       SUCCESS
    ============================================================ */

    return {
      success: true,
      studentId: createdStudentId,
    };
  } catch (error) {
    console.error("REGISTER STUDENT ERROR:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create admission.",
    };
  }
}
