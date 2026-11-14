"use server";

import { revalidatePath } from "next/cache";
import {
  announcementSchema,
  AnnouncementSchema,
  assignmentSchema,
  AssignmentSchema,
  attendanceSchema,
  AttendanceSchema,
  classSchema,
  ClassSchema,
  eventSchema,
  EventSchema,
  examSchema,
  ExamSchema,
  lessonSchema,
  LessonSchema,
  parentSchema,
  ParentSchema,
  resultSchema,
  ResultSchema,
  studentSchema,
  StudentSchema,
  subjectSchema,
  SubjectSchema,
  teacherSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

const getCurrentUser = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return { userId, role };
};

const NOT_ALLOWED = {
  success: false,
  error: true,
  message: "You are not allowed to do this.",
};

const isAdmin = async () => (await getCurrentUser()).role === "admin";

// Admins can manage any lesson; teachers only their own
const canManageLesson = async (lessonId: number) => {
  const { userId, role } = await getCurrentUser();
  if (role === "admin") return true;
  if (role !== "teacher" || !userId) return false;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, teacherId: userId },
    select: { id: true },
  });
  return !!lesson;
};

// PARENT

export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = parentSchema.parse(data);
    if (!parsedData.password) {
      return {
        success: false,
        error: true,
        message: "Password is required when creating a parent.",
      };
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: parsedData.username,
      password: parsedData.password,
      ...(parsedData.email ? { emailAddress: [parsedData.email] } : {}),
      firstName: parsedData.name,
      lastName: parsedData.surname,
      publicMetadata: { role: "parent" },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: parsedData.username,
        name: parsedData.name,
        surname: parsedData.surname,
        email: parsedData.email || null,
        phone: parsedData.phone,
        address: parsedData.address,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: getActionErrorMessage(err, "Failed to create parent."),
    };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = parentSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    // Seeded parents have no Clerk account, so only sync ones that do
    const client = await clerkClient();
    await client.users
      .updateUser(parsedData.id, {
        username: parsedData.username,
        ...(parsedData.password ? { password: parsedData.password } : {}),
        firstName: parsedData.name,
        lastName: parsedData.surname,
      })
      .catch((err) => {
        if (err?.status !== 404) throw err;
      });

    await prisma.parent.update({
      where: { id: parsedData.id },
      data: {
        username: parsedData.username,
        name: parsedData.name,
        surname: parsedData.surname,
        email: parsedData.email || null,
        phone: parsedData.phone,
        address: parsedData.address,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: getActionErrorMessage(err, "Failed to update parent."),
    };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const childCount = await prisma.student.count({ where: { parentId: id } });
    if (childCount > 0) {
      return {
        success: false,
        error: true,
        message: "Reassign or delete this parent's students first.",
      };
    }

    const client = await clerkClient();
    await client.users.deleteUser(id).catch((err) => {
      if (err?.status !== 404) throw err;
    });

    await prisma.parent.delete({ where: { id } });

    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// LESSON

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = lessonSchema.parse(data);
    await prisma.lesson.create({
      data: {
        name: parsedData.name,
        day: parsedData.day,
        startTime: parsedData.startTime,
        endTime: parsedData.endTime,
        subjectId: parsedData.subjectId,
        classId: parsedData.classId,
        teacherId: parsedData.teacherId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = lessonSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    await prisma.lesson.update({
      where: { id: parsedData.id },
      data: {
        name: parsedData.name,
        day: parsedData.day,
        startTime: parsedData.startTime,
        endTime: parsedData.endTime,
        subjectId: parsedData.subjectId,
        classId: parsedData.classId,
        teacherId: parsedData.teacherId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    // Remove everything that hangs off the lesson so the delete doesn't
    // fail on foreign keys
    await prisma.$transaction([
      prisma.result.deleteMany({
        where: {
          OR: [{ exam: { lessonId: id } }, { assignment: { lessonId: id } }],
        },
      }),
      prisma.exam.deleteMany({ where: { lessonId: id } }),
      prisma.assignment.deleteMany({ where: { lessonId: id } }),
      prisma.attendance.deleteMany({ where: { lessonId: id } }),
      prisma.lesson.delete({ where: { id } }),
    ]);

    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ASSIGNMENT

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    const parsedData = assignmentSchema.parse(data);
    if (!(await canManageLesson(parsedData.lessonId))) return NOT_ALLOWED;

    await prisma.assignment.create({
      data: {
        title: parsedData.title,
        startDate: parsedData.startDate,
        dueDate: parsedData.dueDate,
        lessonId: parsedData.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    const parsedData = assignmentSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    const existing = await prisma.assignment.findUnique({
      where: { id: parsedData.id },
      select: { lessonId: true },
    });
    if (
      !existing ||
      !(await canManageLesson(existing.lessonId)) ||
      !(await canManageLesson(parsedData.lessonId))
    ) {
      return NOT_ALLOWED;
    }

    await prisma.assignment.update({
      where: { id: parsedData.id },
      data: {
        title: parsedData.title,
        startDate: parsedData.startDate,
        dueDate: parsedData.dueDate,
        lessonId: parsedData.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    const existing = await prisma.assignment.findUnique({
      where: { id },
      select: { lessonId: true },
    });
    if (!existing || !(await canManageLesson(existing.lessonId))) {
      return NOT_ALLOWED;
    }

    await prisma.$transaction([
      prisma.result.deleteMany({ where: { assignmentId: id } }),
      prisma.assignment.delete({ where: { id } }),
    ]);

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// RESULT

// The form sends the exam or assignment as "exam-<id>" / "assignment-<id>"
const parseAssessment = (assessment: string) => {
  const [kind, id] = assessment.split("-");
  return kind === "exam"
    ? { examId: parseInt(id), assignmentId: null }
    : { examId: null, assignmentId: parseInt(id) };
};

const getAssessmentLessonId = async (target: {
  examId: number | null;
  assignmentId: number | null;
}) => {
  if (target.examId) {
    const exam = await prisma.exam.findUnique({
      where: { id: target.examId },
      select: { lessonId: true },
    });
    return exam?.lessonId;
  }
  if (target.assignmentId) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: target.assignmentId },
      select: { lessonId: true },
    });
    return assignment?.lessonId;
  }
  return undefined;
};

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    const parsedData = resultSchema.parse(data);
    const target = parseAssessment(parsedData.assessment);

    const lessonId = await getAssessmentLessonId(target);
    if (!lessonId || !(await canManageLesson(lessonId))) return NOT_ALLOWED;

    await prisma.result.create({
      data: {
        score: parsedData.score,
        studentId: parsedData.studentId,
        ...target,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    const parsedData = resultSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    const existing = await prisma.result.findUnique({
      where: { id: parsedData.id },
      select: { examId: true, assignmentId: true },
    });
    const target = parseAssessment(parsedData.assessment);
    const oldLessonId = existing && (await getAssessmentLessonId(existing));
    const newLessonId = await getAssessmentLessonId(target);
    if (
      !oldLessonId ||
      !newLessonId ||
      !(await canManageLesson(oldLessonId)) ||
      !(await canManageLesson(newLessonId))
    ) {
      return NOT_ALLOWED;
    }

    await prisma.result.update({
      where: { id: parsedData.id },
      data: {
        score: parsedData.score,
        studentId: parsedData.studentId,
        ...target,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    const existing = await prisma.result.findUnique({
      where: { id },
      select: { examId: true, assignmentId: true },
    });
    const lessonId = existing && (await getAssessmentLessonId(existing));
    if (!lessonId || !(await canManageLesson(lessonId))) return NOT_ALLOWED;

    await prisma.result.delete({ where: { id } });

    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ATTENDANCE

export const createAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {
  try {
    const parsedData = attendanceSchema.parse(data);
    if (!(await canManageLesson(parsedData.lessonId))) return NOT_ALLOWED;

    await prisma.attendance.create({
      data: {
        date: parsedData.date,
        present: parsedData.present === "true",
        studentId: parsedData.studentId,
        lessonId: parsedData.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {
  try {
    const parsedData = attendanceSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    const existing = await prisma.attendance.findUnique({
      where: { id: parsedData.id },
      select: { lessonId: true },
    });
    if (
      !existing ||
      !(await canManageLesson(existing.lessonId)) ||
      !(await canManageLesson(parsedData.lessonId))
    ) {
      return NOT_ALLOWED;
    }

    await prisma.attendance.update({
      where: { id: parsedData.id },
      data: {
        date: parsedData.date,
        present: parsedData.present === "true",
        studentId: parsedData.studentId,
        lessonId: parsedData.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    const existing = await prisma.attendance.findUnique({
      where: { id },
      select: { lessonId: true },
    });
    if (!existing || !(await canManageLesson(existing.lessonId))) {
      return NOT_ALLOWED;
    }

    await prisma.attendance.delete({ where: { id } });

    revalidatePath("/list/attendance");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// EVENT

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = eventSchema.parse(data);
    await prisma.event.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        startTime: parsedData.startTime,
        endTime: parsedData.endTime,
        classId: parsedData.classId ? parseInt(parsedData.classId) : null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = eventSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    await prisma.event.update({
      where: { id: parsedData.id },
      data: {
        title: parsedData.title,
        description: parsedData.description,
        startTime: parsedData.startTime,
        endTime: parsedData.endTime,
        classId: parsedData.classId ? parseInt(parsedData.classId) : null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    await prisma.event.delete({ where: { id } });

    revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ANNOUNCEMENT

export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = announcementSchema.parse(data);
    await prisma.announcement.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        date: parsedData.date,
        classId: parsedData.classId ? parseInt(parsedData.classId) : null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = announcementSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    await prisma.announcement.update({
      where: { id: parsedData.id },
      data: {
        title: parsedData.title,
        description: parsedData.description,
        date: parsedData.date,
        classId: parsedData.classId ? parseInt(parsedData.classId) : null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    await prisma.announcement.delete({ where: { id } });

    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
