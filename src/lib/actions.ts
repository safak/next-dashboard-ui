"use server";

import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { clerkAdmin } from "./clerkAdmin";
import { auth } from "@clerk/nextjs/server";
import { generateRollNumber } from "@/lib/generateRollNumber";
import { generateAdmissionNumber } from "./generateAdmissionNumber";
import {
  PaymentMode,
  FeeStatus,
  Prisma,
  AnnouncementPriority,
} from "@prisma/client";
import {
  SubjectSchema,
  ClassSchema,
  TeacherFormValues,
  StudentFormValues,
  ExamFormValues,
  LessonFormValues,
  AssignmentFormValues,
  ResultFormValues,
  EventFormInput,
  eventSchema,
  AnnouncementFormValues,
  attendanceSchema,
  AttendanceFormInput,
  ParentFormValues,
  FeeSchemaType,
  AssignFeeValues,
  academicYearSchema,
  AcademicYearSchema,
  FeeStructureFormValues,
  feeStructureSchema,
} from "./formValidationSchemas";
import { sendAnnouncementWhatsApp } from "@/lib/sendAnnouncementWhatsApp";
import { getAttendanceCalendarBlock } from "@/lib/attendanceLock";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { HomeworkFormValues } from "./formValidationSchemas";
import type { MonthlyAttendanceDay } from "@/app/(dashboard)/admin/student-attendance/components/types";

export type ActionState = {
  success: boolean;
  error?: string;
  message?: string;
  ts?: number;
};

type AnnouncementCreateData = {
  title: string;
  description: string;
  priority: AnnouncementPriority;
  publishDate: Date;
  expiryDate: Date | null;
  isPublished: boolean;
  classId: number | null;
};

// ClassForm
export const createClass = async (
  _prevState: ActionState,
  data: ClassSchema,
): Promise<ActionState> => {
  try {
    const academicYear = await prisma.academicYear.findFirst({
      where: { isActive: true },
      select: { id: true },
    });

    if (!academicYear) {
      return {
        success: false,
        error: "No active academic year found",
      };
    }

    // Get the highest order
    const lastClass = await prisma.class.findFirst({
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const nextOrder = (lastClass?.order ?? 0) + 1;

    await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        rollPrefix: data.rollPrefix,
        supervisorId: data.supervisorId,
        gradeId: data.gradeId,
        academicYearId: academicYear.id,
        order: nextOrder,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A class with this name already exists for this academic year",
      };
    }

    console.error(error);

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
};

export const updateClass = async (
  _prevState: ActionState,
  data: ClassSchema,
): Promise<ActionState> => {
  try {
    await prisma.class.update({
      where: { id: data.id! },
      data: {
        name: data.name,
        capacity: data.capacity,
        rollPrefix: data.rollPrefix,
        supervisorId: data.supervisorId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to update class",
    };
  }
};

export const deleteClass = async (id: number): Promise<ActionState> => {
  try {
    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!cls) {
      return {
        success: false,
        error: "Class not found.",
      };
    }

    if (cls._count.students > 0) {
      return {
        success: false,
        error: "Cannot delete a class that has students assigned.",
      };
    }

    await prisma.class.delete({
      where: { id },
    });

    revalidatePath("/admin/classes");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to delete class.",
    };
  }
};

// LessonForm
export const createLesson = async (
  _prevState: ActionState,
  data: LessonFormValues,
): Promise<ActionState> => {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        scheduleDate: data.scheduleDate,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("createLesson error:", error);

    return {
      success: false,
      error: "Failed to create lesson",
    };
  }
};

export const updateLesson = async (
  _prevState: ActionState,
  data: LessonFormValues,
): Promise<ActionState> => {
  if (!data.id) {
    return {
      success: false,
      error: "Lesson ID missing",
    };
  }

  try {
    await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        scheduleDate: data.scheduleDate,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("updateLesson error:", error);

    return {
      success: false,
      error: "Failed to update lesson",
    };
  }
};

export const deleteLesson = async (id: number): Promise<ActionState> => {
  if (!id) {
    return {
      success: false,
      error: "Lesson ID missing",
    };
  }

  try {
    await prisma.lesson.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteLesson error:", error);

    return {
      success: false,
      error: "Failed to delete lesson",
    };
  }
};

// SubjectForm
export const createSubject = async (
  _prevState: ActionState,
  data: SubjectSchema,
): Promise<ActionState> => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((id) => ({ id })),
        },
      },
    });

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A subject with this name already exists",
      };
    }

    console.error("createSubject error:", error);
    return {
      success: false,
      error: "Failed to create subject",
    };
  }
};

export const updateSubject = async (
  _prevState: ActionState,
  data: SubjectSchema,
): Promise<ActionState> => {
  if (!data.id) {
    return {
      success: false,
      error: "Subject ID missing",
    };
  }

  try {
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((id) => ({ id })),
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updateSubject error:", error);
    return {
      success: false,
      error: "Failed to update subject",
    };
  }
};

export const deleteSubject = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const id = Number(formData.get("id"));

  if (!id) {
    return {
      success: false,
      error: "Subject ID missing",
    };
  }

  try {
    await prisma.subject.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("deleteSubject error:", error);
    return {
      success: false,
      error: "Failed to delete subject",
    };
  }
};

// TeacherForm
export const createTeacher = async (
  _prevState: ActionState,
  data: TeacherFormValues,
): Promise<ActionState> => {
  try {
    const user = await clerkAdmin.users.createUser({
      username: data.username,
      password: data.password || undefined,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    // ✅ BUILD PRISMA DATA OBJECT SAFELY
    const teacherData: Prisma.TeacherCreateInput = {
      id: user.id,
      userId: user.id,
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
    };

    // ✅ add birthday ONLY if defined
    if (data.birthday) {
      teacherData.birthday = data.birthday;
    }

    // ✅ add subjects ONLY if present
    if (data.subjects && data.subjects.length > 0) {
      teacherData.subjects = {
        connect: data.subjects.map((id) => ({
          id: Number(id),
        })),
      };
    }

    await prisma.teacher.create({
      data: teacherData,
    });

    return { success: true };
  } catch (error: any) {
    console.error("createTeacher error:", error);
    return {
      success: false,
      error: error?.errors?.[0]?.message ?? "Failed to create teacher",
    };
  }
};

export const updateTeacher = async (
  _prevState: ActionState,
  data: TeacherFormValues,
): Promise<ActionState> => {
  if (!data.id) {
    return { success: false, error: "Teacher ID missing" };
  }

  try {
    await clerkAdmin.users.updateUser(data.id, {
      username: data.username,
      ...(data.password ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    const teacherData: Prisma.TeacherUpdateInput = {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
    };

    if (data.birthday) {
      teacherData.birthday = data.birthday;
    }

    if (data.subjects) {
      teacherData.subjects = {
        set: data.subjects.map((id) => ({
          id: Number(id),
        })),
      };
    }

    await prisma.teacher.update({
      where: { id: data.id },
      data: teacherData,
    });

    return { success: true };
  } catch (error) {
    console.error("updateTeacher error:", error);
    return {
      success: false,
      error: "Failed to update teacher",
    };
  }
};

export const deleteTeacher = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const id = String(formData.get("id") || "");

  if (!id) {
    return { success: false, error: "Teacher ID missing" };
  }

  try {
    try {
      await clerkAdmin.users.deleteUser(id);
    } catch (err: any) {
      if (err?.status !== 404) throw err;
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("deleteTeacher error:", error);
    return {
      success: false,
      error: "Failed to delete teacher",
    };
  }
};

// StudentForm
export const createStudent = async (
  _prevState: ActionState,
  data: StudentFormValues,
): Promise<ActionState> => {
  try {
    if (data.phone) {
      const existingPhone = await prisma.student.findFirst({
        where: {
          phone: data.phone,
        },
        select: {
          id: true,
        },
      });

      if (existingPhone) {
        return {
          success: false,
          error: "A student with this phone number already exists",
        };
      }
    }

    const academicYear = await prisma.academicYear.findFirst({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!academicYear) {
      return {
        success: false,
        error: "No active academic year found",
      };
    }

    const classItem = await prisma.class.findUnique({
      where: {
        id: data.classId,
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
        error: "Class not found",
      };
    }

    if (classItem.capacity <= classItem._count.students) {
      return {
        success: false,
        error: "Class capacity is already full",
      };
    }

    const feeStructure = await prisma.feeStructure.findFirst({
      where: {
        id: data.feeStructureId,
        classId: data.classId,
        isActive: true,
      },
      select: {
        id: true,
        classId: true,
        annualFee: true,
        admissionFee: true,
      },
    });

    if (!feeStructure) {
      return {
        success: false,
        error: "No valid fee structure found for this class",
      };
    }

    const discount = Math.max(Number(data.discount) || 0, 0);

    const paidAmount = Math.max(Number(data.paidAmount) || 0, 0);

    if (discount > feeStructure.annualFee) {
      return {
        success: false,
        error: "Discount cannot be greater than the annual fee",
      };
    }

    const originalFee = feeStructure.annualFee;

    const finalFee = Math.max(originalFee - discount, 0);

    if (paidAmount > finalFee) {
      return {
        success: false,
        error: "Paid amount cannot be greater than the final fee",
      };
    }

    const admissionAmount = Math.min(feeStructure.admissionFee, finalFee);

    const remainingAmount = Math.max(finalFee - admissionAmount, 0);

    const term1Amount = Math.floor(remainingAmount / 2);

    const term2Amount = remainingAmount - term1Amount;

    const rollNo = await generateRollNumber(data.classId, academicYear.id);

    const admissionNo = await generateAdmissionNumber();

    const admissionPaidAmount = Math.min(paidAmount, admissionAmount);

    const remainingPaidAfterAdmission = Math.max(
      paidAmount - admissionPaidAmount,
      0,
    );

    const term1PaidAmount = Math.min(remainingPaidAfterAdmission, term1Amount);

    const term2PaidAmount = Math.min(
      Math.max(remainingPaidAfterAdmission - term1PaidAmount, 0),
      term2Amount,
    );

    const getFeeStatus = (
      totalAmount: number,
      paidAmount: number,
    ): "PENDING" | "PARTIAL" | "PAID" => {
      if (paidAmount <= 0) {
        return "PENDING";
      }

      if (paidAmount >= totalAmount) {
        return "PAID";
      }

      return "PARTIAL";
    };

    await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          name: data.name,
          surname: data.surname,

          rollNo,
          admissionNo,

          email: data.email || null,
          phone: data.phone || null,
          address: data.address,

          img: data.img || null,

          bloodType: data.bloodType,
          sex: data.sex,

          birthday: data.birthday ?? null,

          class: {
            connect: {
              id: data.classId,
            },
          },

          parent: {
            connect: {
              id: data.parentId,
            },
          },

          academicYear: {
            connect: {
              id: academicYear.id,
            },
          },
        },
      });

      const feePlan = await tx.studentFeePlan.create({
        data: {
          studentId: student.id,
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

      await tx.studentFee.createMany({
        data: [
          {
            studentId: student.id,
            planId: feePlan.id,

            installment: "ADMISSION",

            totalAmount: admissionAmount,
            paidAmount: admissionPaidAmount,

            status: getFeeStatus(admissionAmount, admissionPaidAmount),
          },
          {
            studentId: student.id,
            planId: feePlan.id,

            installment: "TERM_1",

            totalAmount: term1Amount,
            paidAmount: term1PaidAmount,

            status: getFeeStatus(term1Amount, term1PaidAmount),
          },
          {
            studentId: student.id,
            planId: feePlan.id,

            installment: "TERM_2",

            totalAmount: term2Amount,
            paidAmount: term2PaidAmount,

            status: getFeeStatus(term2Amount, term2PaidAmount),
          },
        ],
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("createStudent error:", error);

    return {
      success: false,
      error: "Failed to create student admission",
    };
  }
};

export const updateStudent = async (
  _prevState: ActionState,
  data: StudentFormValues,
): Promise<ActionState> => {
  if (!data.id) {
    return {
      success: false,
      error: "Student ID missing",
    };
  }

  const studentId = data.id;

  try {
    if (data.phone) {
      const existingPhone = await prisma.student.findFirst({
        where: {
          phone: data.phone,
          NOT: {
            id: studentId,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingPhone) {
        return {
          success: false,
          error: "A student with this phone number already exists",
        };
      }
    }

    const classItem = await prisma.class.findUnique({
      where: {
        id: data.classId,
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
        error: "Class not found",
      };
    }

    const currentStudent = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        classId: true,
      },
    });

    if (!currentStudent) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    if (
      currentStudent.classId !== data.classId &&
      classItem.capacity <= classItem._count.students
    ) {
      return {
        success: false,
        error: "Class capacity is already full",
      };
    }

    const academicYear = await prisma.academicYear.findFirst({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!academicYear) {
      return {
        success: false,
        error: "No active academic year found",
      };
    }

    const feeStructure = await prisma.feeStructure.findFirst({
      where: {
        id: data.feeStructureId,
        classId: data.classId,
        isActive: true,
      },
      select: {
        id: true,
        classId: true,
        annualFee: true,
        admissionFee: true,
      },
    });

    if (!feeStructure) {
      return {
        success: false,
        error: "No valid fee structure found for this class",
      };
    }

    const discount = Math.max(Number(data.discount) || 0, 0);

    const paidAmount = Math.max(Number(data.paidAmount) || 0, 0);

    if (discount > feeStructure.annualFee) {
      return {
        success: false,
        error: "Discount cannot be greater than the annual fee",
      };
    }

    const originalFee = feeStructure.annualFee;

    const finalFee = Math.max(originalFee - discount, 0);

    if (paidAmount > finalFee) {
      return {
        success: false,
        error: "Paid amount cannot be greater than the final fee",
      };
    }

    const admissionAmount = Math.min(feeStructure.admissionFee, finalFee);

    const remainingAmount = Math.max(finalFee - admissionAmount, 0);

    const term1Amount = Math.floor(remainingAmount / 2);

    const term2Amount = remainingAmount - term1Amount;

    const admissionPaidAmount = Math.min(paidAmount, admissionAmount);

    const remainingPaidAfterAdmission = Math.max(
      paidAmount - admissionPaidAmount,
      0,
    );

    const term1PaidAmount = Math.min(remainingPaidAfterAdmission, term1Amount);

    const term2PaidAmount = Math.min(
      Math.max(remainingPaidAfterAdmission - term1PaidAmount, 0),
      term2Amount,
    );

    const getFeeStatus = (
      totalAmount: number,
      paidAmount: number,
    ): "PENDING" | "PARTIAL" | "PAID" => {
      if (paidAmount <= 0) {
        return "PENDING";
      }

      if (paidAmount >= totalAmount) {
        return "PAID";
      }

      return "PARTIAL";
    };

    await prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: {
          id: studentId,
        },

        data: {
          name: data.name,
          surname: data.surname,

          email: data.email || null,
          phone: data.phone || null,
          address: data.address,

          img: data.img || null,

          bloodType: data.bloodType,
          sex: data.sex,

          birthday: data.birthday ?? null,

          class: {
            connect: {
              id: data.classId,
            },
          },

          parent: {
            connect: {
              id: data.parentId,
            },
          },
        },
      });

      const existingPlan = await tx.studentFeePlan.findUnique({
        where: {
          studentId_academicYearId: {
            studentId,
            academicYearId: academicYear.id,
          },
        },
        select: {
          id: true,
        },
      });

      let feePlanId: number;

      if (existingPlan) {
        feePlanId = existingPlan.id;

        await tx.studentFeePlan.update({
          where: {
            id: existingPlan.id,
          },

          data: {
            feeStructureId: feeStructure.id,

            originalFee,
            discount,
            finalFee,

            admissionAmount,
            term1Amount,
            term2Amount,
          },
        });

        await tx.studentFee.deleteMany({
          where: {
            planId: existingPlan.id,
          },
        });
      } else {
        const newPlan = await tx.studentFeePlan.create({
          data: {
            studentId,
            academicYearId: academicYear.id,
            feeStructureId: feeStructure.id,

            originalFee,
            discount,
            finalFee,

            admissionAmount,
            term1Amount,
            term2Amount,
          },
          select: {
            id: true,
          },
        });

        feePlanId = newPlan.id;
      }

      await tx.studentFee.createMany({
        data: [
          {
            studentId,
            planId: feePlanId,

            installment: "ADMISSION",

            totalAmount: admissionAmount,
            paidAmount: admissionPaidAmount,

            status: getFeeStatus(admissionAmount, admissionPaidAmount),
          },
          {
            studentId,
            planId: feePlanId,

            installment: "TERM_1",

            totalAmount: term1Amount,
            paidAmount: term1PaidAmount,

            status: getFeeStatus(term1Amount, term1PaidAmount),
          },
          {
            studentId,
            planId: feePlanId,

            installment: "TERM_2",

            totalAmount: term2Amount,
            paidAmount: term2PaidAmount,

            status: getFeeStatus(term2Amount, term2PaidAmount),
          },
        ],
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("updateStudent error:", error);

    return {
      success: false,
      error: "Failed to update student",
    };
  }
};

export const deleteStudent = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const id = String(formData.get("id") || "");

  if (!id) {
    return {
      success: false,
      error: "Student ID missing",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const feePlans = await tx.studentFeePlan.findMany({
        where: {
          studentId: id,
        },
        select: {
          id: true,
        },
      });

      const planIds = feePlans.map((plan) => plan.id);

      if (planIds.length > 0) {
        await tx.studentFee.deleteMany({
          where: {
            planId: {
              in: planIds,
            },
          },
        });

        await tx.studentFeePlan.deleteMany({
          where: {
            id: {
              in: planIds,
            },
          },
        });
      }

      await tx.student.delete({
        where: {
          id,
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteStudent error:", error);

    return {
      success: false,
      error: "Failed to delete student",
    };
  }
};

// ParentForm
export const createParent = async (
  _prevState: ActionState,
  data: ParentFormValues,
): Promise<ActionState> => {
  try {
    const user = await clerkAdmin.users.createUser({
      username: data.username,
      password: data.password || undefined,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: {
        role: "parent",
      },
    });

    const parentData: Prisma.ParentCreateInput = {
      id: user.id,
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone,
      address: data.address,
    };

    await prisma.parent.create({
      data: parentData,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("createParent error:", error);

    return {
      success: false,
      error:
        error?.errors?.[0]?.message ??
        error?.message ??
        "Failed to create parent",
    };
  }
};

export const updateParent = async (
  _prevState: ActionState,
  data: ParentFormValues,
): Promise<ActionState> => {
  if (!data.id) {
    return {
      success: false,
      error: "Parent ID missing",
    };
  }

  try {
    await clerkAdmin.users.updateUser(data.id, {
      username: data.username,
      ...(data.password ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    const parentData: Prisma.ParentUpdateInput = {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone,
      address: data.address,
    };

    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: parentData,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("updateParent error:", error);

    return {
      success: false,
      error:
        error?.errors?.[0]?.message ??
        error?.message ??
        "Failed to update parent",
    };
  }
};

export const deleteParent = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const id = String(formData.get("id") || "");

  if (!id) {
    return {
      success: false,
      error: "Parent ID missing",
    };
  }

  try {
    await clerkAdmin.users.deleteUser(id);

    await prisma.parent.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("deleteParent error:", error);

    return {
      success: false,
      error:
        error?.errors?.[0]?.message ??
        error?.message ??
        "Failed to delete parent",
    };
  }
};

// ExamForm
export async function createExam(
  _prevState: ActionState,
  data: ExamFormValues,
): Promise<ActionState> {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        description: data.description || null,
        totalMarks: data.totalMarks,
        examDate: data.examDate,

        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Create Exam Error:", error);

    return {
      success: false,
      error: error.message ?? "Failed to create exam",
    };
  }
}

export async function updateExam(
  _prevState: ActionState,
  data: ExamFormValues,
): Promise<ActionState> {
  if (!data.id) {
    return {
      success: false,
      error: "Exam ID is required",
    };
  }

  try {
    await prisma.exam.update({
      where: {
        id: data.id,
      },

      data: {
        title: data.title,
        description: data.description || null,
        totalMarks: data.totalMarks,
        examDate: data.examDate,

        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Update Exam Error:", error);

    return {
      success: false,
      error: error.message ?? "Failed to update exam",
    };
  }
}

export async function deleteExam(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  if (!id) {
    return { success: false, error: "Exam ID missing" };
  }

  try {
    await prisma.exam.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Delete Exam Error:", error);
    return {
      success: false,
      error: error.message ?? "Failed to delete exam",
    };
  }
}

// AssignmentForm

export async function createAssignment(
  _prevState: ActionState,
  data: AssignmentFormValues,
): Promise<ActionState> {
  try {
    const { id, ...formData } = data;

    await prisma.assignment.create({
      data: {
        title: formData.title,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        totalMarks: formData.totalMarks,
        classId: formData.classId,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Create Assignment Error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create assignment",
    };
  }
}

export async function updateAssignment(
  _prevState: ActionState,
  data: AssignmentFormValues,
): Promise<ActionState> {
  if (!data.id) {
    return { success: false, error: "Assignment ID is required" };
  }

  try {
    const { id, ...updateData } = data;

    await prisma.assignment.update({
      where: { id },
      data: updateData,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Update Assignment Error:", error);
    return {
      success: false,
      error: error.message ?? "Failed to update assignment",
    };
  }
}

export async function deleteAssignment(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: "Invalid assignment ID" };
  }

  try {
    await prisma.assignment.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Delete Assignment Error:", error);
    return {
      success: false,
      error: error.message ?? "Failed to delete assignment",
    };
  }
}

// Results
export async function createResult(
  _prevState: ActionState,
  data: ResultFormValues,
): Promise<ActionState> {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId ?? null,
        assignmentId: data.assignmentId ?? null,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Create Result Error:", error);
    return {
      success: false,
      error: error.message ?? "Failed to create result",
    };
  }
}

export async function updateResult(
  _prevState: ActionState,
  data: ResultFormValues,
): Promise<ActionState> {
  if (!data.id) {
    return { success: false, error: "Result ID is required" };
  }

  try {
    await prisma.result.update({
      where: { id: data.id },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId ?? null,
        assignmentId: data.assignmentId ?? null,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Update Result Error:", error);
    return {
      success: false,
      error: error.message ?? "Failed to update result",
    };
  }
}

export async function deleteResult(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    return { success: false, error: "Invalid result ID" };
  }

  try {
    await prisma.result.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Delete Result Error:", error);
    return {
      success: false,
      error: error.message ?? "Failed to delete result",
    };
  }
}

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Attendance
export async function createAttendance(
  _prevState: ActionState,
  data: AttendanceFormInput,
): Promise<ActionState> {
  try {
    const parsed = attendanceSchema.parse(data);
    const normalizedDate = normalizeDate(parsed.date);

    await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: parsed.studentId,
          date: normalizedDate,
        },
      },

      update: {
        status: parsed.present ? "PRESENT" : "ABSENT", // ✅ FIX
      },

      create: {
        studentId: parsed.studentId,
        date: normalizedDate,
        status: parsed.present ? "PRESENT" : "ABSENT", // ✅ FIX
      },
    });

    revalidatePath("/admin/student-attendance");

    return {
      success: true,
      ts: Date.now(),
    };
  } catch (error: any) {
    console.error("Create Attendance Error:", error);

    if (error.code === "P2002") {
      return {
        success: false,
        error: "Attendance already exists for this student on this day",
        ts: Date.now(),
      };
    }

    return {
      success: false,
      error: error?.message ?? "Failed to create attendance",
      ts: Date.now(),
    };
  }
}

export async function updateAttendance(
  _prevState: ActionState,
  data: AttendanceFormInput,
): Promise<ActionState> {
  try {
    const parsed = attendanceSchema.parse(data);

    if (!parsed.id) {
      return {
        success: false,
        error: "Attendance ID is missing",
        ts: Date.now(),
      };
    }

    await prisma.attendance.update({
      where: { id: parsed.id },
      data: {
        status: parsed.present ? "PRESENT" : "ABSENT",
        studentId: parsed.studentId,
        date: normalizeDate(parsed.date),
      },
    });

    revalidatePath("/admin/student-attendance");

    return {
      success: true,
      ts: Date.now(),
    };
  } catch (error: any) {
    console.error("Update Attendance Error:", error);

    return {
      success: false,
      error: error?.message ?? "Failed to update attendance",
      ts: Date.now(),
    };
  }
}

export async function deleteAttendance(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = Number(formData.get("id"));

  if (!id || Number.isNaN(id)) {
    return {
      success: false,
      error: "Invalid attendance ID",
      ts: Date.now(),
    };
  }

  await prisma.attendance.delete({
    where: { id },
  });

  revalidatePath("/admin/student-attendance");

  return {
    success: true,
    ts: Date.now(),
  };
}

// FeeForm
export async function createFee(
  _prevState: ActionState,
  data: FeeStructureFormValues,
): Promise<ActionState> {
  try {
    await prisma.feeStructure.create({
      data: {
        classId: data.classId,
        title: data.title,
        annualFee: data.annualFee,
        admissionFee: data.admissionFee,
        isActive: data.isActive,
      },
    });

    return { success: true };
  } catch (e) {
    console.error("Create Fee Structure Error:", e);

    return {
      success: false,
      error: "Failed to create fee structure",
    };
  }
}

export async function updateFee(
  _prevState: ActionState,
  data: FeeStructureFormValues & { id: number },
): Promise<ActionState> {
  try {
    await prisma.feeStructure.update({
      where: {
        id: data.id,
      },
      data: {
        classId: data.classId,
        title: data.title,
        annualFee: data.annualFee,
        admissionFee: data.admissionFee,
        isActive: data.isActive,
      },
    });

    return { success: true };
  } catch (e) {
    console.error("Update Fee Structure Error:", e);

    return {
      success: false,
      error: "Failed to update fee structure",
    };
  }
}

export async function deleteFee(_prevState: ActionState, formData: FormData) {
  const id = Number(formData.get("id"));

  try {
    await prisma.feeStructure.delete({
      where: { id },
    });

    return {
      success: true,
      error: false,
    };
  } catch (e) {
    console.error("Delete Fee Structure Error:", e);

    return {
      success: false,
      error: true,
    };
  }
}

// Fee Structure
export const createFeeStructure = async (
  _prevState: ActionState,
  data: FeeStructureFormValues,
): Promise<ActionState> => {
  try {
    const existing = await prisma.feeStructure.findFirst({
      where: {
        classId: data.classId,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "An active fee structure already exists for this class.",
      };
    }

    await prisma.feeStructure.create({
      data: {
        classId: data.classId,
        title: data.title,
        annualFee: data.annualFee,
        admissionFee: data.admissionFee,
        isActive: data.isActive,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("createFeeStructure error:", error);

    return {
      success: false,
      error: "Failed to create fee structure.",
    };
  }
};

export const updateFeeStructure = async (
  _prevState: ActionState,
  data: FeeStructureFormValues,
): Promise<ActionState> => {
  if (!data.id) {
    return {
      success: false,
      error: "Fee structure ID missing.",
    };
  }

  try {
    const existing = await prisma.feeStructure.findFirst({
      where: {
        classId: data.classId,
        isActive: true,
        NOT: {
          id: data.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Another active fee structure already exists for this class.",
      };
    }

    await prisma.feeStructure.update({
      where: {
        id: data.id,
      },
      data: {
        classId: data.classId,
        title: data.title,
        annualFee: data.annualFee,
        admissionFee: data.admissionFee,
        isActive: data.isActive,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("updateFeeStructure error:", error);

    return {
      success: false,
      error: "Failed to update fee structure.",
    };
  }
};

export const deleteFeeStructure = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const id = Number(formData.get("id"));

  if (!id) {
    return {
      success: false,
      error: "Fee structure ID missing.",
    };
  }

  try {
    const usage = await prisma.studentFeePlan.findFirst({
      where: {
        feeStructureId: id,
      },
      select: {
        id: true,
      },
    });

    if (usage) {
      return {
        success: false,
        error:
          "This fee structure is already assigned to students and cannot be deleted.",
      };
    }

    await prisma.feeStructure.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteFeeStructure error:", error);

    return {
      success: false,
      error: "Failed to delete fee structure.",
    };
  }
};

// AssignFee
export async function assignFeeAction(
  _prev: { success: boolean; error?: string },
  input: AssignFeeValues,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const {
      studentId,
      classId,
      academicYearId,
      totalFee,
      admissionDueDate,
      term1DueDate,
      term2DueDate,
    } = input;

    /* ============================================================
       VALIDATION
    ============================================================ */

    if (!studentId) {
      return {
        success: false,
        error: "Student is required.",
      };
    }

    if (!classId) {
      return {
        success: false,
        error: "Class is required.",
      };
    }

    if (!academicYearId) {
      return {
        success: false,
        error: "Academic year is required.",
      };
    }

    const feeAmount = Number(totalFee);

    if (!Number.isFinite(feeAmount) || feeAmount <= 0) {
      return {
        success: false,
        error: "Please enter a valid total fee.",
      };
    }

    /* ============================================================
       GET STUDENT
    ============================================================ */

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        classId: true,
        academicYearId: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!student) {
      return {
        success: false,
        error: "Student not found.",
      };
    }

    /* ============================================================
       VERIFY CLASS
    ============================================================ */

    if (student.classId !== Number(classId)) {
      return {
        success: false,
        error: "Selected student does not belong to this class.",
      };
    }

    /* ============================================================
       VERIFY ACADEMIC YEAR
    ============================================================ */

    const academicYear = await prisma.academicYear.findUnique({
      where: {
        id: Number(academicYearId),
      },
      select: {
        id: true,
        label: true,
      },
    });

    if (!academicYear) {
      return {
        success: false,
        error: "Academic year not found.",
      };
    }

    if (student.academicYearId !== Number(academicYearId)) {
      return {
        success: false,
        error:
          "The selected student does not belong to the selected academic year.",
      };
    }

    /* ============================================================
       CHECK DUPLICATE PLAN
    ============================================================ */

    const existingPlan = await prisma.studentFeePlan.findUnique({
      where: {
        studentId_academicYearId: {
          studentId: student.id,
          academicYearId: Number(academicYearId),
        },
      },
      select: {
        id: true,
      },
    });

    if (existingPlan) {
      return {
        success: false,
        error:
          "A fee plan already exists for this student for the selected academic year.",
      };
    }

    /* ============================================================
       GET FEE STRUCTURE FOR CLASS
    ============================================================ */

    const feeStructure = await prisma.feeStructure.findUnique({
      where: {
        classId: Number(classId),
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
        error: `No active fee structure is configured for ${
          student.class?.name ?? "the selected class"
        }.`,
      };
    }

    /* ============================================================
       CALCULATE FEE
    ============================================================ */

    const originalFee = feeAmount;
    const discount = 0;

    const finalFee = Math.max(originalFee - discount, 0);

    const admissionAmount = Math.min(
      Number(feeStructure.admissionFee ?? 11500),
      finalFee,
    );

    const remainingAmount = Math.max(finalFee - admissionAmount, 0);

    const term1Amount = Math.floor(remainingAmount / 2);

    const term2Amount = remainingAmount - term1Amount;

    /* ============================================================
       CREATE PLAN + INSTALLMENTS
    ============================================================ */

    await prisma.$transaction(async (tx) => {
      const plan = await tx.studentFeePlan.create({
        data: {
          studentId: student.id,
          academicYearId: Number(academicYearId),
          feeStructureId: feeStructure.id,

          originalFee,
          discount,
          finalFee,

          admissionAmount,
          term1Amount,
          term2Amount,
        },
      });

      /* ----------------------------------------------------------
         ADMISSION
      ---------------------------------------------------------- */

      await tx.studentFee.create({
        data: {
          studentId: student.id,
          planId: plan.id,

          installment: "ADMISSION",

          totalAmount: admissionAmount,
          paidAmount: 0,

          status: admissionAmount === 0 ? "PAID" : "PENDING",

          dueDate: admissionDueDate ?? null,
        },
      });

      /* ----------------------------------------------------------
         TERM 1
      ---------------------------------------------------------- */

      await tx.studentFee.create({
        data: {
          studentId: student.id,
          planId: plan.id,

          installment: "TERM_1",

          totalAmount: term1Amount,
          paidAmount: 0,

          status: term1Amount === 0 ? "PAID" : "PENDING",

          dueDate: term1DueDate ?? null,
        },
      });

      /* ----------------------------------------------------------
         TERM 2
      ---------------------------------------------------------- */

      await tx.studentFee.create({
        data: {
          studentId: student.id,
          planId: plan.id,

          installment: "TERM_2",

          totalAmount: term2Amount,
          paidAmount: 0,

          status: term2Amount === 0 ? "PAID" : "PENDING",

          dueDate: term2DueDate ?? null,
        },
      });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Assign Fee Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to assign fee.",
    };
  }
}

// Payment
export async function collectPaymentAction(input: {
  studentFeeId: number;
  amount: number;
  mode: PaymentMode;
  referenceId?: string;
}) {
  try {
    const { studentFeeId, amount, mode, referenceId } = input;

    // Create payment
    await prisma.payment.create({
      data: {
        studentFeeId,
        amount,
        mode,
        referenceId,
      },
    });

    // Recalculate totals
    const studentFee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
      include: { payments: true },
    });

    if (!studentFee) {
      return { error: "Fee assignment not found" };
    }

    const totalPaid = studentFee.payments.reduce((sum, p) => sum + p.amount, 0);

    let status: FeeStatus = "PENDING";
    if (totalPaid >= studentFee.totalAmount) {
      status = "PAID";
    } else if (totalPaid > 0) {
      status = "PARTIAL";
    }

    await prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        paidAmount: totalPaid,
        status,
      },
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to collect payment" };
  }
}

// AnnouncementForm
export const createAnnouncement = async (
  _prev: ActionState,
  data: AnnouncementFormValues,
): Promise<ActionState> => {
  try {
    const createData: AnnouncementCreateData = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      publishDate: data.publishDate,
      expiryDate: data.expiryDate ?? null,
      isPublished: data.isPublished,
      classId:
        data.classId && data.classId !== "ALL" ? Number(data.classId) : null,
    };

    const announcement = await prisma.announcement.create({
      data: createData,
    });

    if (data.isPublished) {
      const whatsappResult = await sendAnnouncementWhatsApp(announcement.id);

      if (whatsappResult.sentCount > 0 && whatsappResult.failedCount === 0) {
        return {
          success: true,
          message: `Announcement created successfully and sent to ${whatsappResult.sentCount} parent(s) on WhatsApp.`,
        };
      }

      if (whatsappResult.sentCount > 0 && whatsappResult.failedCount > 0) {
        return {
          success: true,
          message: `Announcement created successfully. ${whatsappResult.sentCount} WhatsApp message(s) sent and ${whatsappResult.failedCount} failed.`,
        };
      }

      return {
        success: true,
        message:
          "Announcement created successfully, but no parents with phone numbers were found.",
      };
    }

    return {
      success: true,
      message: "Announcement created successfully.",
    };
  } catch (err) {
    console.error("❌ createAnnouncement:", err);

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to create announcement",
    };
  }
};

export const updateAnnouncement = async (
  _prev: ActionState,
  data: AnnouncementFormValues,
): Promise<ActionState> => {
  try {
    const updateData = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      publishDate: data.publishDate,
      expiryDate: data.expiryDate ?? null,
      isPublished: data.isPublished,
      classId:
        data.classId && data.classId !== "ALL" ? Number(data.classId) : null,
    };

    const announcement = await prisma.announcement.update({
      where: {
        id: data.id!,
      },
      data: updateData,
    });

    if (data.isPublished && !announcement.whatsappSent) {
      const whatsappResult = await sendAnnouncementWhatsApp(announcement.id);

      if (whatsappResult.sentCount > 0 && whatsappResult.failedCount === 0) {
        return {
          success: true,
          message: `Announcement updated successfully and sent to ${whatsappResult.sentCount} parent(s) on WhatsApp.`,
        };
      }

      if (whatsappResult.sentCount > 0 && whatsappResult.failedCount > 0) {
        return {
          success: true,
          message: `Announcement updated successfully. ${whatsappResult.sentCount} WhatsApp message(s) sent and ${whatsappResult.failedCount} failed.`,
        };
      }

      return {
        success: true,
        message:
          "Announcement updated successfully, but no parents with phone numbers were found.",
      };
    }

    return {
      success: true,
      message: "Announcement updated successfully.",
    };
  } catch (err) {
    console.error("❌ updateAnnouncement:", err);

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to update announcement",
    };
  }
};

export const deleteAnnouncement = async (
  _prevState: ActionState,
  formData: FormData,
) => {
  try {
    const id = Number(formData.get("id"));

    await prisma.announcement.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log("❌ deleteAnnouncement error:", err);
    return { success: false, error: true };
  }
};

// EventForm
export async function createEvent(
  _prevState: ActionState,
  data: EventFormInput,
): Promise<ActionState> {
  try {
    const parsed = eventSchema.parse(data);

    const { id, ...createData } = parsed;

    await prisma.event.create({
      data: {
        ...createData,
        classId: createData.classId ?? null,
        category: createData.category ?? "default",
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Create Event Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateEvent(
  _prevState: ActionState,
  data: EventFormInput,
): Promise<ActionState> {
  try {
    const parsed = eventSchema.parse(data);

    if (!parsed.id) {
      return { success: false, error: "Event ID is required" };
    }

    const { id, ...updateData } = parsed;

    await prisma.event.update({
      where: { id },
      data: {
        ...updateData,
        classId: updateData.classId ?? null,
        category: updateData.category ?? "default",
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Update Event Error:", error);
    return { success: false, error: error.message };
  }
}

export const deleteEvent = async (_prevState: ActionState, data: FormData) => {
  try {
    const id = Number(data.get("id"));

    if (!id || Number.isNaN(id)) {
      throw new Error("Invalid event ID");
    }

    await prisma.event.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Delete Event Error:", err);
    return { success: false, error: true };
  }
};

// HolidayForm
type CreateHolidayInput = {
  title: string;
  date: Date;
  isFullDay: boolean;
};

type UpdateHolidayInput = CreateHolidayInput & {
  id: number;
};

export async function createHoliday(
  _prev: ActionState,
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

    return { success: true };
  } catch (err) {
    console.error("❌ createHoliday:", err);
    return {
      success: false,
      error: "Failed to create holiday",
    };
  }
}

export async function updateHoliday(
  _prev: ActionState,
  data: UpdateHolidayInput,
): Promise<ActionState> {
  try {
    await prisma.holiday.update({
      where: { id: data.id },
      data: {
        title: data.title,
        date: data.date,
        isFullDay: data.isFullDay,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("❌ updateHoliday:", err);
    return {
      success: false,
      error: "Failed to update holiday",
    };
  }
}

export const deleteHoliday = async (_: any, formData: FormData) => {
  const rawId = formData.get("id");
  const id = Number(rawId);

  if (!id || Number.isNaN(id)) {
    return { success: false, error: "Invalid holiday id" };
  }

  await prisma.holiday.deleteMany({
    where: { id },
  });

  return { success: true, error: false };
};

// Other Internal things
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

export async function updateAdminProfile(_: any, formData: FormData) {
  try {
    const id = String(formData.get("id"));
    const username = String(formData.get("username"));

    let img: string | undefined;
    const file = formData.get("image") as File | null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop();
      const fileName = `admin-${id}-${Date.now()}.${ext}`;

      const uploadDir = await ensureUploadDir();
      const uploadPath = path.join(uploadDir, fileName);

      await writeFile(uploadPath, buffer);
      img = `/uploads/${fileName}`;
    }

    await prisma.admin.update({
      where: { id },
      data: {
        username,
        ...(img && { img }),
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("ADMIN PROFILE UPDATE ERROR:", error);
    return { success: false, error: true };
  }
}

export async function updateTeacherProfile(_: any, formData: FormData) {
  try {
    const id = String(formData.get("id"));
    const name = String(formData.get("name"));
    const surname = String(formData.get("surname"));
    const phone = String(formData.get("phone") || "");

    let img: string | undefined;
    const file = formData.get("image") as File | null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop();
      const fileName = `teacher-${id}-${Date.now()}.${ext}`;

      const uploadDir = await ensureUploadDir();
      const uploadPath = path.join(uploadDir, fileName);

      await writeFile(uploadPath, buffer);
      img = `/uploads/${fileName}`;
    }

    await prisma.teacher.update({
      where: { id },
      data: {
        name,
        surname,
        phone,
        ...(img && { img }),
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("TEACHER PROFILE UPDATE ERROR:", error);
    return { success: false, error: true };
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const id = String(formData.get("id"));
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) return;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const fileName = `admin-${id}-${Date.now()}.${ext}`;

    const uploadDir = await ensureUploadDir();
    await writeFile(path.join(uploadDir, fileName), buffer);

    await prisma.admin.update({
      where: { id },
      data: { img: `/uploads/${fileName}` },
    });

    revalidatePath("/profile");
  } catch (error) {
    console.error("AVATAR UPLOAD ERROR:", error);
  }
}

export async function updateAdminLastActive(userId: string) {
  try {
    await prisma.admin.upsert({
      where: { id: userId },
      update: {
        lastActiveAt: new Date(),
      },
      create: {
        id: userId,
        username: "admin",
        lastActiveAt: new Date(),
      },
    });
  } catch (error) {
    console.error("LAST ACTIVE UPDATE FAILED:", error);
  }
}

export const createHomework = async (
  _prevState: ActionState,
  data: HomeworkFormValues,
): Promise<ActionState> => {
  try {
    await prisma.homework.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("createHomework error:", error);

    return {
      success: false,
      error: "Failed to create homework",
    };
  }
};

export const updateHomework = async (
  _prevState: ActionState,
  data: HomeworkFormValues,
): Promise<ActionState> => {
  try {
    await prisma.homework.update({
      where: {
        id: data.id,
      },

      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("updateHomework error:", error);

    return {
      success: false,
      error: "Failed to update homework",
    };
  }
};

export const deleteHomework = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const id = Number(formData.get("id"));

    await prisma.homework.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteHomework error:", error);

    return {
      success: false,
      error: "Failed to delete homework",
    };
  }
};

// Academic-year
export const createAcademicYear = async (
  _prevState: ActionState,
  data: AcademicYearSchema,
): Promise<ActionState> => {
  try {
    await prisma.$transaction(async (tx) => {
      // Create Academic Year
      const newYear = await tx.academicYear.create({
        data: {
          label: data.label,
          isActive: data.isActive,
        },
      });

      // Clone Classes
      if (data.cloneFromId) {
        const classes = await tx.class.findMany({
          where: {
            academicYearId: data.cloneFromId,
          },
        });

        if (classes.length > 0) {
          await tx.class.createMany({
            data: classes.map((cls) => ({
              name: cls.name,
              capacity: cls.capacity,
              rollPrefix: cls.rollPrefix,
              supervisorId: cls.supervisorId,
              gradeId: cls.gradeId,
              order: cls.order,
              academicYearId: newYear.id,
            })),
          });
        }
      }

      // If Active selected
      if (data.isActive) {
        await tx.academicYear.updateMany({
          where: {
            id: {
              not: newYear.id,
            },
          },
          data: {
            isActive: false,
          },
        });
      }
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Academic year already exists.",
      };
    }

    return {
      success: false,
      error: "Something went wrong.",
    };
  }
};

export const updateAcademicYear = async (
  _prevState: ActionState,
  data: AcademicYearSchema,
): Promise<ActionState> => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.academicYear.update({
        where: {
          id: data.id,
        },
        data: {
          label: data.label,
        },
      });

      if (data.isActive) {
        await tx.academicYear.updateMany({
          where: {
            id: {
              not: data.id,
            },
          },
          data: {
            isActive: false,
          },
        });

        await tx.academicYear.update({
          where: {
            id: data.id,
          },
          data: {
            isActive: true,
          },
        });
      }
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to update Academic Year.",
    };
  }
};

export const deleteAcademicYear = async (id: number): Promise<ActionState> => {
  try {
    const year = await prisma.academicYear.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            classes: true,
            students: true,
          },
        },
      },
    });

    if (!year) {
      return {
        success: false,
        error: "Academic Year not found.",
      };
    }

    if (year._count.classes > 0 || year._count.students > 0) {
      return {
        success: false,
        error:
          "Cannot delete Academic Year because it contains Classes or Students.",
      };
    }

    await prisma.academicYear.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Unable to delete Academic Year.",
    };
  }
};

export type StudentAttendanceRow = {
  id: string;
  name: string;
  surname: string;
  rollNo: string;
  admissionNo: string;
  attendance: {
    id: number;
    status: string;
    remarks: string | null;
    markedBy: string | null;
  } | null;
};

export async function getStudentAttendance(
  classId: number,
  date: Date,
): Promise<{
  success: boolean;
  data?: StudentAttendanceRow[];
  error?: string;
}> {
  try {
    if (!classId) {
      return {
        success: false,
        error: "Class is required.",
      };
    }

    const students = await prisma.student.findMany({
      where: {
        classId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        surname: true,
        rollNo: true,
        admissionNo: true,

        attendances: {
          where: {
            date,
          },
          select: {
            id: true,
            status: true,
            remarks: true,
            markedBy: true,
          },
          take: 1,
        },
      },
      orderBy: {
        rollNo: "asc",
      },
    });

    return {
      success: true,
      data: students.map((student) => ({
        id: student.id,
        name: student.name,
        surname: student.surname,
        rollNo: student.rollNo,
        admissionNo: student.admissionNo,
        attendance: student.attendances[0] ?? null,
      })),
    };
  } catch (error) {
    console.error("getStudentAttendance error:", error);

    return {
      success: false,
      error: "Failed to load student attendance.",
    };
  }
}

export type SaveStudentAttendanceInput = {
  classId: number;
  date: string;
  attendance: Record<string, "PRESENT" | "ABSENT">;
};

export async function saveStudentAttendance({
  classId,
  date,
  attendance,
}: {
  classId: number;
  date: string;
  attendance: Record<string, "PRESENT" | "ABSENT">;
}) {
  try {

    if (!date) {
      return {
        success: false,
        error: "Attendance date is required.",
      };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return {
        success: false,
        error: "Invalid attendance date. Expected YYYY-MM-DD.",
      };
    }

    const attendanceDate = parseAttendanceDate(date);

    const calendarBlock = await getAttendanceCalendarBlock(attendanceDate);

    if (calendarBlock.blocked) {
      return {
        success: false,
        error: calendarBlock.reason,
      };
    }

    const selectedClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },

      select: {
        id: true,
      },
    });

    if (!selectedClass) {
      return {
        success: false,
        error: "Class not found.",
      };
    }

    /* ============================================================
       ATTENDANCE RECORDS
    ============================================================ */

    const entries = Object.entries(attendance);

    if (entries.length === 0) {
      return {
        success: false,
        error: "No attendance records provided.",
      };
    }

    /* ============================================================
       UPSERT ATTENDANCE

       One student + one date = one attendance record.
    ============================================================ */

    let savedCount = 0;

    for (const [studentId, status] of entries) {
      if (status !== "PRESENT" && status !== "ABSENT") {
        continue;
      }

      /* ========================================================
         VERIFY STUDENT BELONGS TO CLASS
      ======================================================== */

      const student = await prisma.student.findFirst({
        where: {
          id: studentId,
          classId,
          status: "ACTIVE",
        },

        select: {
          id: true,
        },
      });

      if (!student) {
        continue;
      }

      /* ========================================================
         FIND EXISTING ATTENDANCE

         Since your Attendance model currently uses
         an integer id, we locate the record by:

         studentId + date
      ======================================================== */

      const existing = await prisma.attendance.findFirst({
        where: {
          studentId,
          date: attendanceDate,
        },

        select: {
          id: true,
        },
      });

      if (existing) {
        await prisma.attendance.update({
          where: {
            id: existing.id,
          },

          data: {
            status,
          },
        });
      } else {
        await prisma.attendance.create({
          data: {
            studentId,
            date: attendanceDate,
            status,
          },
        });
      }

      savedCount++;
    }

    return {
      success: true,
      savedCount,
    };
  } catch (error) {
    console.error("saveStudentAttendance error:", error);

    return {
      success: false,
      error: "Failed to save student attendance.",
    };
  }
}

export async function getMonthlyStudentAttendance(
  classId: number,
  month: string,
) {
  try {
    /* ============================================================
       VALIDATION
    ============================================================ */

    if (!classId) {
      return {
        success: false,
        error: "Class is required.",
      };
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return {
        success: false,
        error: "Invalid month. Expected YYYY-MM.",
      };
    }

    /* ============================================================
       AUTHENTICATION

       This is an ADMIN operation.
    ============================================================ */

    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

    const role = (
      sessionClaims?.metadata as
        | {
            role?: string;
          }
        | undefined
    )?.role;

    if (role !== "admin") {
      return {
        success: false,
        error: "Only administrators can view monthly student attendance.",
      };
    }

    /* ============================================================
       MONTH RANGE

       Example:
       2026-08

       start:
       2026-08-01

       endExclusive:
       2026-09-01
    ============================================================ */

    const [year, monthNumber] = month.split("-").map(Number);

    const monthStart = new Date(Date.UTC(year, monthNumber - 1, 1));

    const monthEndExclusive = new Date(Date.UTC(year, monthNumber, 1));

    /* ============================================================
       TODAY

       Use date-only comparison.
    ============================================================ */

    const now = new Date();

    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    /*
     * For the current month, don't count
     * future working days.
     *
     * For a previous month, the entire
     * month has already occurred.
     */
    const isCurrentMonth =
      year === todayUTC.getUTCFullYear() &&
      monthNumber === todayUTC.getUTCMonth() + 1;

    const lastCountedDate = isCurrentMonth
      ? todayUTC
      : new Date(monthEndExclusive.getTime() - 24 * 60 * 60 * 1000);

    /* ============================================================
       CLASS
    ============================================================ */

    const selectedClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },

      select: {
        id: true,
        name: true,

        academicYear: {
          select: {
            label: true,
          },
        },
      },
    });

    if (!selectedClass) {
      return {
        success: false,
        error: "Selected class was not found.",
      };
    }

    /* ============================================================
       ACTIVE STUDENTS
    ============================================================ */

    const students = await prisma.student.findMany({
      where: {
        classId,
        status: "ACTIVE",
      },

      select: {
        id: true,
        name: true,
        surname: true,
        rollNo: true,
        admissionNo: true,
      },

      orderBy: [
        {
          name: "asc",
        },
        {
          surname: "asc",
        },
      ],
    });

    const totalStudents = students.length;

    /* ============================================================
       HOLIDAYS

       Used only for calculating working days.
    ============================================================ */

    const holidays = await prisma.holiday.findMany({
      where: {
        date: {
          gte: monthStart,
          lt: monthEndExclusive,
        },

        isFullDay: true,
      },

      select: {
        date: true,
      },
    });

    const holidayDates = new Set(
      holidays.map((holiday) => toDateKey(holiday.date)),
    );

    /* ============================================================
       WORKING DAYS

       School week:
       Monday → Saturday
       Sunday   → non-working

       Holidays are excluded.

       IMPORTANT:
       This is now used for calendar information only.

       Attendance records are NOT filtered by workingDayKeys.
       This allows the admin monthly report to reflect all
       attendance records actually stored in the database.
    ============================================================ */

    const workingDayKeys = getWorkingDayKeys({
      start: monthStart,
      end: lastCountedDate,
      holidayDates,
    });

    const workingDays = workingDayKeys.length;

    /* ============================================================
       FUTURE WORKING DAYS

       Only relevant for current month.
    ============================================================ */

    const futureWorkingDayKeys = isCurrentMonth
      ? getWorkingDayKeys({
          start: new Date(todayUTC.getTime() + 24 * 60 * 60 * 1000),

          end: new Date(monthEndExclusive.getTime() - 24 * 60 * 60 * 1000),

          holidayDates,
        })
      : [];

    const futureDays = futureWorkingDayKeys.length;

    /* ============================================================
       ATTENDANCE RECORDS

       IMPORTANT:
       Fetch ALL attendance records belonging to active
       students in the selected class and selected month.

       We intentionally do NOT filter these records by
       workingDayKeys.

       Reason:
       The admin monthly report should reflect the actual
       attendance records stored in the Attendance table.
    ============================================================ */

    const attendanceRecords =
      totalStudents === 0
        ? []
        : await prisma.attendance.findMany({
            where: {
              studentId: {
                in: students.map((student) => student.id),
              },

              date: {
                gte: monthStart,
                lt: monthEndExclusive,
              },
            },

            select: {
              studentId: true,
              date: true,
              status: true,
            },

            orderBy: {
              date: "asc",
            },
          });

    /* ============================================================
       ATTENDANCE MAP

       studentId → date → status

       Example:

       student-1
         2026-08-01 → PRESENT
         2026-08-02 → PRESENT
         2026-08-03 → ABSENT
         ...
    ============================================================ */

    const attendanceMap = new Map<string, Map<string, string>>();

    for (const record of attendanceRecords) {
      const dateKey = toDateKey(record.date);

      const status = String(record.status).toUpperCase();

      /*
       * Only count valid attendance statuses.
       */
      if (status !== "PRESENT" && status !== "ABSENT") {
        continue;
      }

      if (!attendanceMap.has(record.studentId)) {
        attendanceMap.set(record.studentId, new Map());
      }

      attendanceMap.get(record.studentId)!.set(dateKey, status);
    }

    /* ============================================================
       STUDENT MONTHLY COUNTS
    ============================================================ */

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalMarked = 0;

    const monthlyStudents = students.map((student) => {
      const studentAttendance = attendanceMap.get(student.id);

      let present = 0;
      let absent = 0;

      const attendanceHistory: MonthlyAttendanceDay[] = [];

      if (studentAttendance) {
        for (const [date, status] of studentAttendance.entries()) {
          if (status !== "PRESENT" && status !== "ABSENT") {
            continue;
          }

          attendanceHistory.push({
            date,
            status,
          });

          if (status === "PRESENT") {
            present++;
          }

          if (status === "ABSENT") {
            absent++;
          }
        }
      }

      const marked = present + absent;

      const pending = Math.max(workingDays - marked, 0);

      totalPresent += present;
      totalAbsent += absent;
      totalMarked += marked;

      const attendancePercentage =
        marked === 0 ? 0 : Number(((present / marked) * 100).toFixed(2));

      return {
        id: student.id,
        name: student.name,
        surname: student.surname,
        rollNo: student.rollNo,
        admissionNo: student.admissionNo,

        present,
        absent,
        pending,

        attendancePercentage,

        // IMPORTANT
        attendance: attendanceHistory,
      };
    });

    /* ============================================================
       EXPECTED RECORDS
    ============================================================ */

    const expectedRecords = totalStudents * workingDays;

    /*
     * markedRecords is based on the actual attendance
     * records counted above.
     */
    const markedRecords = totalMarked;

    /*
     * Pending cannot become negative even if attendance
     * was entered for an extra/non-working day.
     */
    const pending = Math.max(expectedRecords - markedRecords, 0);

    /* ============================================================
       COMPLETED DAYS

       A working day is considered completed only when
       every active student has either PRESENT or ABSENT.

       IMPORTANT:
       Only working days participate in this calculation.
       Extra Sunday/non-working-day attendance records do
       not make a working day "completed".
    ============================================================ */

    let completedDays = 0;

    if (totalStudents > 0 && workingDays > 0) {
      for (const dateKey of workingDayKeys) {
        let dayComplete = true;

        for (const student of students) {
          const status = attendanceMap.get(student.id)?.get(dateKey);

          if (status !== "PRESENT" && status !== "ABSENT") {
            dayComplete = false;
            break;
          }
        }

        if (dayComplete) {
          completedDays++;
        }
      }
    }

    /* ============================================================
       OVERALL MONTHLY ATTENDANCE PERCENTAGE

       Present / (Present + Absent)

       Pending records do NOT count as absent.
    ============================================================ */

    const attendancePercentage =
      markedRecords === 0
        ? 0
        : Number(((totalPresent / markedRecords) * 100).toFixed(2));

    /* ============================================================
       RESPONSE
    ============================================================ */

    return {
      success: true,

      data: {
        month,

        totalStudents,

        workingDays,

        workingDayKeys,

        completedDays,

        futureDays,

        expectedRecords,

        markedRecords,

        present: totalPresent,

        absent: totalAbsent,

        pending,

        attendancePercentage,

        students: monthlyStudents,
      },
    };
  } catch (error) {
    console.error("getMonthlyStudentAttendance error:", error);

    return {
      success: false,
      error: "Failed to load monthly student attendance.",
    };
  }
}

function toDateKey(date: Date): string {
  return [
    date.getUTCFullYear().toString().padStart(4, "0"),

    String(date.getUTCMonth() + 1).padStart(2, "0"),

    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function getWorkingDayKeys({
  start,
  end,
  holidayDates,
}: {
  start: Date;
  end: Date;
  holidayDates: Set<string>;
}): string[] {
  const result: string[] = [];

  if (start > end) {
    return result;
  }

  const cursor = new Date(start);

  while (cursor <= end) {
    const day = cursor.getUTCDay();

    /**
     * Sunday = 0
     *
     * Monday = 1
     *
     * Saturday = 6
     */
    const isSunday = day === 0;

    const dateKey = toDateKey(cursor);

    if (!isSunday && !holidayDates.has(dateKey)) {
      result.push(dateKey);
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

function parseAttendanceDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  if (
    !year ||
    !month ||
    !day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error("Invalid attendance date.");
  }

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}
