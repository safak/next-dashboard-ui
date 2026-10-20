import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/getSessionUser";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({
      fullName: "",
      role: "",
      unreadAnnouncements: 0,
    });
  }

  const { userId, role, classId } = session;

  // ✅ Get name from Clerk (SOURCE OF TRUTH)
  const clerkUser = await currentUser();
  const fullName =
    `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const where: any = {
    publishDate: {
      gte: sevenDaysAgo,
    },

    isPublished: true,

    NOT: {
      reads: {
        some: {
          userId,
        },
      },
    },
  };

  if (role !== "admin") {
    where.OR = [{ classId: null }, ...(classId ? [{ classId }] : [])];
  }

  const unreadAnnouncements = await prisma.announcement.count({
    where,
  });

  return NextResponse.json({
  fullName,
  role,
  unreadAnnouncements,
});
}
