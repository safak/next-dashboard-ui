import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        },
      );
    }

    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({
      unread: notifications.filter((notification) => !notification.isRead)
        .length,
      notifications,
    });
  } catch (error) {
    console.error("Admin Notification API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch notifications",
      },
      {
        status: 500,
      },
    );
  }
}
