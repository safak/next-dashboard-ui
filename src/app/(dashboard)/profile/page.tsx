import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ensureAdminExists } from "@/lib/ensureAdmin";
import AdminProfileServer from "@/components/profile/AdminProfile.server";
import TeacherProfileServer from "@/components/profile/TeacherProfile.server";
import ParentProfileServer from "@/components/profile/ParentProfile.server";

export default async function ProfilePage() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || !role) return null;

  /* ================= ADMIN ================= */
  if (role === "admin") {
    const admin = await ensureAdminExists(userId);
    return <AdminProfileServer admin={admin} />;
  }

  /* ================= TEACHER ================= */
  if (role === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: { id: userId },
    });

    if (!teacher) return null;
    return <TeacherProfileServer teacher={teacher} />;
  }

  /* ================= PARENT ================= */
  if (role === "parent") {
    const parent = await prisma.parent.findUnique({
      where: { id: userId },
    });

    if (!parent) return null;
    return <ParentProfileServer parent={parent} />;
  }

  return null;
}