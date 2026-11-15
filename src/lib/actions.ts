"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canMessage, getAllUsers } from "./contacts";
import {
  extraClassSchema,
  ExtraClassSchema,
  messageSchema,
  MessageSchema,
  settingsSchema,
  SettingsSchema,
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
import { auth } from "./auth";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { nextStudentNumber } from "./studentNumber";
import { deleteRemoteMeeting } from "./meetings";

type CurrentState = { success: boolean; error: boolean; message?: string };

const getActionErrorMessage = (err: unknown, fallback: string) => {
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return "That username, email or phone is already in use.";
  }

  // Anything else may contain database details, so keep it in the server log
  return fallback;
};

// Subject names are the only unique field on a subject
const subjectErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
    ? "A subject with that name already exists."
    : getActionErrorMessage(err, fallback);

const hashPassword = (password: string) => bcrypt.hash(password, 10);

// Keeps a person's login account in step with their profile row. Seeded
// people have no account until an admin sets a password for them.
const syncLogin = async (
  tx: Prisma.TransactionClient,
  id: string,
  role: string,
  username: string,
  password?: string
) => {
  if (password) {
    const hash = await hashPassword(password);
    await tx.user.upsert({
      where: { id },
      create: { id, username, password: hash, role, mustChangePassword: true },
      // Also signs them out everywhere (see passwordChangedAt in auth.ts)
      update: {
        username,
        password: hash,
        mustChangePassword: true,
        passwordChangedAt: new Date(),
      },
    });
  } else {
    await tx.user.updateMany({ where: { id }, data: { username } });
  }
};

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;
    const parsedData = subjectSchema.parse(data);

    await prisma.subject.create({
      data: {
        name: parsedData.name,
        delivery: parsedData.delivery,
        teachers: {
          connect: parsedData.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: subjectErrorMessage(err, "Failed to create subject."),
    };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;
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
        delivery: parsedData.delivery,
        teachers: {
          set: parsedData.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: subjectErrorMessage(err, "Failed to update subject."),
    };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    // Removing a subject in use would orphan timetables and enrolments,
    // so say what still depends on it instead
    const { _count } = await prisma.subject.findUniqueOrThrow({
      where: { id },
      select: {
        _count: {
          select: {
            lessons: true,
            extraClasses: true,
            students: true,
            registrations: true,
            materials: true,
          },
        },
      },
    });
    const inUse = [
      [_count.lessons, "lesson"],
      [_count.extraClasses, "extra class"],
      [_count.students, "enrolled student"],
      [_count.registrations, "registration"],
      [_count.materials, "study material"],
    ]
      .filter(([n]) => (n as number) > 0)
      .map(([n, what]) => `${n} ${what}${n === 1 ? "" : "s"}`);
    if (inUse.length > 0) {
      return {
        success: false,
        error: true,
        message: `This subject is still used by ${inUse.join(", ")}. Move or delete those first.`,
      };
    }

    await prisma.subject.delete({
      where: {
        id,
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
  if (!(await isAdmin())) return NOT_ALLOWED;

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
  if (!(await isAdmin())) return NOT_ALLOWED;

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
  if (!(await isAdmin())) return NOT_ALLOWED;

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
  if (!(await isAdmin())) return NOT_ALLOWED;

  try {
    const parsedData = teacherSchema.parse(data);
    if (!parsedData.password) {
      return {
        success: false,
        error: true,
        message: "Password is required when creating a teacher.",
      };
    }

    const id = randomUUID();
    const password = await hashPassword(parsedData.password);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id,
          username: parsedData.username,
          password,
          role: "teacher",
          mustChangePassword: true,
        },
      });
      await tx.teacher.create({
        data: {
          id,
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
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: getActionErrorMessage(err, "Failed to create teacher."),
    };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!(await isAdmin())) return NOT_ALLOWED;

  const parsedData = teacherSchema.parse(data);

  if (!parsedData.id) {
    return { success: false, error: true };
  }
  try {
    const id = parsedData.id;
    await prisma.$transaction(async (tx) => {
      await syncLogin(tx, id, "teacher", parsedData.username, parsedData.password);
      await tx.teacher.update({
        where: {
          id,
        },
        data: {
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
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: getActionErrorMessage(err, "Failed to update teacher."),
    };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  if (!(await isAdmin())) return NOT_ALLOWED;

  const id = data.get("id") as string;
  try {
    await prisma.$transaction([
      prisma.user.deleteMany({ where: { id } }),
      prisma.teacher.delete({ where: { id } }),
    ]);

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
  if (!(await isAdmin())) return NOT_ALLOWED;

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

    const classItem = await prisma.class.findUnique({
      where: { id: parsedData.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const id = randomUUID();
    const password = await hashPassword(parsedData.password);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id,
          username: parsedData.username,
          password,
          role: "student",
          mustChangePassword: true,
        },
      });
      await tx.student.create({
        data: {
          id,
          studentNumber: await nextStudentNumber(tx),
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
          parentId: parsedData.parentId || null,
        },
      });
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: getActionErrorMessage(err, "Failed to create student."),
    };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!(await isAdmin())) return NOT_ALLOWED;

  const parsedData = studentSchema.parse(data);

  if (!parsedData.id) {
    return { success: false, error: true };
  }
  try {
    const id = parsedData.id;
    await prisma.$transaction(async (tx) => {
      await syncLogin(tx, id, "student", parsedData.username, parsedData.password);
      await tx.student.update({
        where: {
          id,
        },
        data: {
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
          parentId: parsedData.parentId || null,
        },
      });
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: getActionErrorMessage(err, "Failed to update student."),
    };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  if (!(await isAdmin())) return NOT_ALLOWED;

  const id = data.get("id") as string;
  try {
    await prisma.$transaction([
      prisma.user.deleteMany({ where: { id } }),
      prisma.student.delete({ where: { id } }),
    ]);

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
  try {
    const parsedData = examSchema.parse(data);

    // Teachers only for their own lessons
    if (!(await canManageLesson(parsedData.lessonId))) return NOT_ALLOWED;

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
  try {
    const parsedData = examSchema.parse(data);

    if (!parsedData.id) {
      return { success: false, error: true };
    }

    const existing = await prisma.exam.findUnique({
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

  try {
    const existing = await prisma.exam.findUnique({
      where: { id: parseInt(id) },
      select: { lessonId: true },
    });
    if (!existing || !(await canManageLesson(existing.lessonId))) {
      return NOT_ALLOWED;
    }

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
  const { userId, role } = await auth();
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

    const id = randomUUID();
    const password = await hashPassword(parsedData.password);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id,
          username: parsedData.username,
          password,
          role: "parent",
          mustChangePassword: true,
        },
      });
      await tx.parent.create({
        data: {
          id,
          username: parsedData.username,
          name: parsedData.name,
          surname: parsedData.surname,
          email: parsedData.email || null,
          phone: parsedData.phone,
          address: parsedData.address,
        },
      });
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

    const id = parsedData.id;
    await prisma.$transaction(async (tx) => {
      await syncLogin(tx, id, "parent", parsedData.username, parsedData.password);
      await tx.parent.update({
        where: { id },
        data: {
          username: parsedData.username,
          name: parsedData.name,
          surname: parsedData.surname,
          email: parsedData.email || null,
          phone: parsedData.phone,
          address: parsedData.address,
        },
      });
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

    await prisma.$transaction([
      prisma.user.deleteMany({ where: { id } }),
      prisma.parent.delete({ where: { id } }),
    ]);

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

    const meeting = await prisma.onlineMeeting.findUnique({ where: { lessonId: id } });

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
    if (meeting) await deleteRemoteMeeting(meeting).catch(console.log);

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

// SETTINGS

export const updateSettings = async (
  currentState: CurrentState,
  data: SettingsSchema
) => {
  try {
    if (!(await isAdmin())) return NOT_ALLOWED;

    const parsedData = settingsSchema.parse(data);
    await prisma.setting.upsert({
      where: { id: 1 },
      update: parsedData,
      create: { id: 1, ...parsedData },
    });

    // School name and year show up in the sidebar and dashboard cards
    revalidatePath("/", "layout");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// MESSAGE

export const sendMessage = async (
  currentState: CurrentState,
  data: MessageSchema
) => {
  try {
    const { userId, role } = await getCurrentUser();
    if (!userId) return NOT_ALLOWED;

    const parsedData = messageSchema.parse(data);
    const receiver = (await getAllUsers()).find(
      (u) => u.id === parsedData.receiverId
    );
    if (!receiver || receiver.id === userId || !canMessage(role, receiver.role)) {
      return {
        success: false,
        error: true,
        message: "You can't send a message to this person.",
      };
    }

    await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: receiver.id,
        subject: parsedData.subject,
        body: parsedData.body,
      },
    });

    revalidatePath("/list/messages");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

const deleteOwnMessage = async (id: number) => {
  const { userId } = await getCurrentUser();
  if (!userId) return false;

  // Either side of the conversation may delete it
  const { count } = await prisma.message.deleteMany({
    where: { id, OR: [{ senderId: userId }, { receiverId: userId }] },
  });
  return count > 0;
};

export const deleteMessage = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    if (!(await deleteOwnMessage(id))) return NOT_ALLOWED;

    revalidatePath("/list/messages");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// Used on the message page, which no longer exists once deleted
export const deleteMessageAndReturn = async (data: FormData) => {
  const id = parseInt(data.get("id") as string);
  await deleteOwnMessage(id);
  revalidatePath("/list/messages");
  redirect("/list/messages");
};

// EXTRA CLASS

// Admins manage every extra class; teachers only the ones they teach
const canManageExtraClass = async (teacherId: string) => {
  const { userId, role } = await getCurrentUser();
  return role === "admin" || (role === "teacher" && userId === teacherId);
};

const extraClassData = (d: ReturnType<typeof extraClassSchema.parse>) => ({
  name: d.name,
  description: d.description || null,
  day: d.day,
  startTime: d.startTime,
  endTime: d.endTime,
  capacity: d.capacity,
  subjectId: d.subjectId,
  teacherId: d.teacherId,
});

export const createExtraClass = async (
  currentState: CurrentState,
  data: ExtraClassSchema
) => {
  try {
    const parsedData = extraClassSchema.parse(data);
    if (!(await canManageExtraClass(parsedData.teacherId))) return NOT_ALLOWED;

    await prisma.extraClass.create({ data: extraClassData(parsedData) });

    revalidatePath("/list/extra-classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExtraClass = async (
  currentState: CurrentState,
  data: ExtraClassSchema
) => {
  try {
    const parsedData = extraClassSchema.parse(data);
    if (!parsedData.id) {
      return { success: false, error: true };
    }

    const existing = await prisma.extraClass.findUnique({
      where: { id: parsedData.id },
      select: { teacherId: true, _count: { select: { registrations: true } } },
    });
    if (
      !existing ||
      !(await canManageExtraClass(existing.teacherId)) ||
      !(await canManageExtraClass(parsedData.teacherId))
    ) {
      return NOT_ALLOWED;
    }
    if (parsedData.capacity < existing._count.registrations) {
      return {
        success: false,
        error: true,
        message: `${existing._count.registrations} students are already registered; capacity can't be lower than that.`,
      };
    }

    await prisma.extraClass.update({
      where: { id: parsedData.id },
      data: extraClassData(parsedData),
    });

    revalidatePath("/list/extra-classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExtraClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = parseInt(data.get("id") as string);
  try {
    const existing = await prisma.extraClass.findUnique({
      where: { id },
      select: { teacherId: true },
    });
    if (!existing || !(await canManageExtraClass(existing.teacherId))) {
      return NOT_ALLOWED;
    }

    const meeting = await prisma.onlineMeeting.findUnique({ where: { extraClassId: id } });

    // Registrations and the meeting row are removed by the cascade
    await prisma.extraClass.delete({ where: { id } });
    if (meeting) await deleteRemoteMeeting(meeting).catch(console.log);

    revalidatePath("/list/extra-classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// Students register themselves, parents their children, admins anyone
const canRegisterStudent = async (studentId: string) => {
  const { userId, role } = await getCurrentUser();
  if (!userId) return false;
  if (role === "admin") return true;
  if (role === "student") return studentId === userId;
  if (role === "parent") {
    const child = await prisma.student.findFirst({
      where: { id: studentId, parentId: userId },
      select: { id: true },
    });
    return !!child;
  }
  return false;
};

export const setExtraClassRegistration = async (
  currentState: CurrentState,
  data: { extraClassId: number; studentId: string; register: boolean }
) => {
  try {
    const { extraClassId, studentId, register } = data;
    if (!(await canRegisterStudent(studentId))) return NOT_ALLOWED;

    if (!register) {
      await prisma.extraClassRegistration.deleteMany({
        where: { extraClassId, studentId },
      });
    } else {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { id: true },
      });
      if (!student) {
        return {
          success: false,
          error: true,
          message: "This account isn't linked to a student record.",
        };
      }

      // Count and insert together so two people can't take the last seat
      const outcome = await prisma.$transaction(async (tx) => {
        const extraClass = await tx.extraClass.findUnique({
          where: { id: extraClassId },
          select: {
            capacity: true,
            _count: { select: { registrations: true } },
            registrations: { where: { studentId }, select: { id: true } },
          },
        });
        if (!extraClass) return "missing";
        if (extraClass.registrations.length > 0) return "ok"; // already in
        if (extraClass._count.registrations >= extraClass.capacity) return "full";

        await tx.extraClassRegistration.create({
          data: { extraClassId, studentId },
        });
        return "ok";
      });

      if (outcome === "missing") {
        return { success: false, error: true, message: "This class no longer exists." };
      }
      if (outcome === "full") {
        return { success: false, error: true, message: "Sorry, this class is full." };
      }
    }

    revalidatePath("/list/extra-classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
