"use server";

import { revalidatePath } from "next/cache";
import {
  classSchema,
  ClassSchema,
  examSchema,
  ExamSchema,
  studentSchema,
  StudentSchema,
  subjectSchema,
  SubjectSchema,
  teacherSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean; message?: string };

const getActionErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null) {
    const clerkErrors = (err as { errors?: Array<{ longMessage?: string; message?: string }> }).errors;
    if (Array.isArray(clerkErrors) && clerkErrors.length > 0) {
      return clerkErrors[0].longMessage || clerkErrors[0].message || fallback;
    }

    const message = (err as { message?: string }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallback;
};

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    const parsedData = subjectSchema.parse(data);

    await prisma.subject.create({
      data: {
        name: parsedData.name,
        teachers: {
          connect: parsedData.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    const parsedData = subjectSchema.parse(data);

    if (!parsedData.id) {
      return { success: false, error: true };
    }

    await prisma.subject.update({
      where: {
        id: parsedData.id,
      },
      data: {
        name: parsedData.name,
        teachers: {
          set: parsedData.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    const parsedData = classSchema.parse(data);

    await prisma.class.create({
      data: parsedData,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    const parsedData = classSchema.parse(data);

    if (!parsedData.id) {
      return { success: false, error: true };
    }

    await prisma.class.update({
      where: {
        id: parsedData.id,
      },
      data: parsedData,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const parsedData = teacherSchema.parse(data);
    if (!parsedData.password) {
      return {
        success: false,
        error: true,
        message: "Password is required when creating a teacher.",
      };
    }

    const client = await clerkClient();

    const user = await client.users.createUser({
      username: parsedData.username,
      password: parsedData.password,
      ...(parsedData.email ? { emailAddress: [parsedData.email] } : {}),
      firstName: parsedData.name,
      lastName: parsedData.surname,
      publicMetadata:{role:"teacher"}
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: parsedData.username,
        name: parsedData.name,
        surname: parsedData.surname,
        email: parsedData.email || null,
        phone: parsedData.phone || null,
        address: parsedData.address,
        img: parsedData.img || null,
        bloodType: parsedData.bloodType,
        sex: parsedData.sex,
        birthday: parsedData.birthday,
        subjects: {
          connect: parsedData.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: getActionErrorMessage(err, "Failed to create teacher in Clerk."),
    };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  const parsedData = teacherSchema.parse(data);

  if (!parsedData.id) {
    return { success: false, error: true };
  }
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(parsedData.id, {
      username: parsedData.username,
      ...(parsedData.password !== "" && { password: parsedData.password }),
      firstName: parsedData.name,
      lastName: parsedData.surname,
    });

    await prisma.teacher.update({
      where: {
        id: parsedData.id,
      },
      data: {
        ...(parsedData.password !== "" && { password: parsedData.password }),
        username: parsedData.username,
        name: parsedData.name,
        surname: parsedData.surname,
        email: parsedData.email || null,
        phone: parsedData.phone || null,
        address: parsedData.address,
        img: parsedData.img || null,
        bloodType: parsedData.bloodType,
        sex: parsedData.sex,
        birthday: parsedData.birthday,
        subjects: {
          set: parsedData.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  const parsedData = studentSchema.parse(data);
  console.log(parsedData);
  try {
    if (!parsedData.password) {
      return {
        success: false,
        error: true,
        message: "Password is required when creating a student.",
      };
    }

    const client = await clerkClient();
    const classItem = await prisma.class.findUnique({
      where: { id: parsedData.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const user = await client.users.createUser({
      username: parsedData.username,
      password: parsedData.password,
      ...(parsedData.email ? { emailAddress: [parsedData.email] } : {}),
      firstName: parsedData.name,
      lastName: parsedData.surname,
      publicMetadata:{role:"student"}
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: parsedData.username,
        name: parsedData.name,
        surname: parsedData.surname,
        email: parsedData.email || null,
        phone: parsedData.phone || null,
        address: parsedData.address,
        img: parsedData.img || null,
        bloodType: parsedData.bloodType,
        sex: parsedData.sex,
        birthday: parsedData.birthday,
        gradeId: parsedData.gradeId,
        classId: parsedData.classId,
        parentId: parsedData.parentId,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  const parsedData = studentSchema.parse(data);

  if (!parsedData.id) {
    return { success: false, error: true };
  }
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(parsedData.id, {
      username: parsedData.username,
      ...(parsedData.password !== "" && { password: parsedData.password }),
      firstName: parsedData.name,
      lastName: parsedData.surname,
    });

    await prisma.student.update({
      where: {
        id: parsedData.id,
      },
      data: {
        ...(parsedData.password !== "" && { password: parsedData.password }),
        username: parsedData.username,
        name: parsedData.name,
        surname: parsedData.surname,
        email: parsedData.email || null,
        phone: parsedData.phone || null,
        address: parsedData.address,
        img: parsedData.img || null,
        bloodType: parsedData.bloodType,
        sex: parsedData.sex,
        birthday: parsedData.birthday,
        gradeId: parsedData.gradeId,
        classId: parsedData.classId,
        parentId: parsedData.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    const parsedData = examSchema.parse(data);

    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: parsedData.title,
        startTime: parsedData.startTime,
        endTime: parsedData.endTime,
        lessonId: parsedData.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    const parsedData = examSchema.parse(data);

    if (!parsedData.id) {
      return { success: false, error: true };
    }

    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: parsedData.id,
      },
      data: {
        title: parsedData.title,
        startTime: parsedData.startTime,
        endTime: parsedData.endTime,
        lessonId: parsedData.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
