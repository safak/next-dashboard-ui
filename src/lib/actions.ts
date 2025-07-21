"use server";

import { v4 as uuidv4 } from "uuid";

import {
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { getUserSessionInfo } from "@/lib/session";
import { UserSex } from "@prisma/client";


// src/lib/actions.ts
import fs from "fs/promises"
import path from "path"

import { signIn } from 'next-auth/react';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");

  redirect("/");
}


export async function authenticate(_prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await signIn('credentials', {
    redirect: false,
    email,
    password,
  });

  if (result?.error) {
    return 'Email ou mot de passe invalide.';
  }

  return null;
}

type CurrentState = { success: boolean; error: boolean };

export async function saveImage(base64: string): Promise<string> {
  try {
    if (!base64.startsWith("data:")) return base64;

    const match = base64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) throw new Error("Invalid base64 image format");

    const mimeType = match[1];
    const ext = mimeType.split("/")[1];
    const buffer = Buffer.from(match[2], "base64");

    const fileName = `${Date.now()}.${ext}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);

    return `${fileName}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return "";
  }
}

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    // Vérifier que tous les enseignants existent dans la base
    const existingTeachers = await prisma.teacher.findMany({
      where: {
    id: { in: data.teachers },  // filtre les enseignants dont l'id est dans data.teachers
  },
  select: { id: true },
    });
    console.log("Enseignants trouvés :", existingTeachers);
    if (existingTeachers.length !== data.teachers.length) {
      console.error("Un ou plusieurs enseignants sont introuvables.");
      return { success: false, error: true };
    }

    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: existingTeachers.map((teacher) => ({ id: teacher.id })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
 
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

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

    // revalidatePath("/list/subjects");
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
    await prisma.class.create({
      data: {
        ...data,
        id: data.id ? Number(data.id) : undefined, // Convert to number if defined
        capacity: Number(data.capacity),
        gradeId: Number(data.gradeId),
        supervisorId: data.supervisorId || null,
      },
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
    await prisma.class.update({
    where: {
      id: Number(data.id),
    },
    data: {
      name: data.name,
      capacity: Number(data.capacity),
      gradeId: Number(data.gradeId), // ✅ convert to number
      supervisorId: data.supervisorId || null,
    },
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

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

function mapSex(input: string  | undefined): UserSex{
  if(input === "Male") return UserSex.Male;
   if(input === "Female") return UserSex.Female;
  return UserSex.Female;
}
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    /*  const user = await clerkClient.users.createUser({
        username: data.username,
        password: data.password,
        firstName: data.name,
        lastName: data.surname,
        publicMetadata:{role:"teacher"}
      }); */
const imgName = data.img ? await saveImage(data.img) : "";

    await prisma.teacher.create({
      data: {
        id: uuidv4(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        password: data.password,
        email: data.email || "",
        phone: data.phone || "+243",
        address: data.address,
        img:imgName,
        bloodType: data.bloodType,
        birthday: new Date(data.birthday),
        sex: data.sex as UserSex, //mapSex(data.sex),
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
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

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
const imgName = data.img ? await saveImage(data.img) : "";
    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: imgName,
        sex: data.sex as UserSex, //mapSex(data.sex),
        bloodType: data.bloodType,
        birthday: new Date(data.birthday),
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
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
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
 const toInt = (value: string | number) => typeof value === 'string' ? parseInt(value) : value;
export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
 
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: toInt(data.classId) },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }
const imgName = data.img ? await saveImage(data.img) : "";
    await prisma.student.create({
      data: {
        id: uuidv4(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: imgName,
        bloodType: data.bloodType,
        sex: data.sex as UserSex,
        gradeId: toInt(data.gradeId),
        classId: toInt(data.classId),
        parentId: data.parentId,
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
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    /* const user = await clerkClient.users.updateUser(data.id, {
        username: data.username,
        ...(data.password !== "" && { password: data.password }),
        firstName: data.name,
        lastName: data.surname,
      }); */
const imgName = data.img ? await saveImage(data.img) : "";

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: imgName,
        bloodType: data.bloodType,
        sex: data.sex as UserSex,
        gradeId: toInt(data.gradeId),
        classId: toInt(data.classId),
        parentId: data.parentId,
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
    // await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
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
    const { role, currentUserId } = await getUserSessionInfo();
     if (role === "teacher") {
       const teacherLesson = await prisma.lesson.findFirst({
         where: {
           teacherId: currentUserId!,
           id: data.lessonId,
         },
       });

       if (!teacherLesson) {
         return { success: false, error: true };
       }
     }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        dueDate: new Date(data.dueDate),
        lessonId: data.lessonId,
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
    const { role, currentUserId } = await getUserSessionInfo();
     if (role === "teacher") {
       const teacherLesson = await prisma.lesson.findFirst({
         where: {
           teacherId: currentUserId!
         },
       });

       if (!teacherLesson) {
         return { success: false, error: true };
     }
     }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        dueDate: new Date(data.dueDate),
        lessonId: data.lessonId,
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
const { role, currentUserId } = await getUserSessionInfo();
  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
         ...(role === "teacher" ? { lesson: { teacherId: currentUserId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
