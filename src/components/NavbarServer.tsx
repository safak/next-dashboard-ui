import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import type { SessionUser } from "@/lib/types";

export const getNavbarData = cache(async (session: SessionUser | null) => {
  if (!session) {
    return { fullName: "", role: "", unreadAnnouncements: 0 };
  }

  const clerkUser = await currentUser();

  const fullName =
    `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim();

  const { userId, role, classId } = session;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const where: any = {
    date: { gte: sevenDaysAgo },
    NOT: { reads: { some: { userId } } },
  };

  if (role !== "admin") {
    where.OR = [{ classId: null }, ...(classId ? [{ classId }] : [])];
  }

  const unreadAnnouncements = await prisma.announcement.count({
    where,
  });

  const unreadLeaveNotifications = await prisma.notification.count({
    where: {
      type: "TEACHER_LEAVE",
      isRead: false,
    },
  });

  const unreadNotifications = unreadAnnouncements + unreadLeaveNotifications;

  return {
    fullName,
    role,
    unreadNotifications,
  };
});
