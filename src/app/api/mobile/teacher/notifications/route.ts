import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DAYS_TO_INCLUDE = 30;
const MAX_NOTIFICATIONS = 50;

type TeacherNotification = {
  id: string;
  refId: number | null;
  type:
    | "ANNOUNCEMENT"
    | "HOMEWORK"
    | "ASSIGNMENT"
    | "EXAM"
    | "LEAVE_APPROVED"
    | "LEAVE_REJECTED"
    | "GENERAL";
  title: string;
  message: string;
  className: string;
  date: string;
  isRead: boolean;
};

const formatLeaveType = (value: string) =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(value);

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const since = new Date();
    since.setDate(since.getDate() - DAYS_TO_INCLUDE);

    const storedNotifications = await prisma.notification.findMany({
      where: {
        userId,
        createdAt: {
          gte: since,
        },
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: MAX_NOTIFICATIONS,
    });

    const leaveRequests = await prisma.teacherLeave.findMany({
      where: {
        teacherId: userId,
        status: {
          in: ["APPROVED", "REJECTED"],
        },
        updatedAt: {
          gte: since,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 20,
    });

    const announcements = await prisma.announcement.findMany({
      where: {
        teacherId: userId,
        createdAt: {
          gte: since,
        },
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const homework = await prisma.homework.findMany({
      where: {
        teacherId: userId,
        createdAt: {
          gte: since,
        },
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const assignments = await prisma.assignment.findMany({
      where: {
        teacherId: userId,
        createdAt: {
          gte: since,
        },
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const exams = await prisma.exam.findMany({
      where: {
        teacherId: userId,
        createdAt: {
          gte: since,
        },
      },
      include: {
        class: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const notifications: TeacherNotification[] = [];
    const existingKeys = new Set<string>();

    for (const notification of storedNotifications) {
      let type: TeacherNotification["type"];

      switch (notification.type) {
        case "ANNOUNCEMENT":
          type = "ANNOUNCEMENT";
          break;
        case "HOMEWORK":
          type = "HOMEWORK";
          break;
        case "ASSIGNMENT":
          type = "ASSIGNMENT";
          break;
        case "EXAM":
          type = "EXAM";
          break;
        case "LEAVE_APPROVED":
          type = "LEAVE_APPROVED";
          break;
        case "LEAVE_REJECTED":
          type = "LEAVE_REJECTED";
          break;
        case "TEACHER_LEAVE":
          continue;
        default:
          type = "GENERAL";
      }

      if (notification.referenceId) {
        existingKeys.add(`${type}:${notification.referenceId}`);
      }

      notifications.push({
        id: `notification-${notification.id}`,
        refId: notification.referenceId ?? null,
        type,
        title: notification.title,
        message: notification.message,
        className: notification.class?.name ?? "All Classes",
        date: notification.createdAt.toISOString(),
        isRead: notification.isRead,
      });
    }

    for (const leave of leaveRequests) {
      const type =
        leave.status === "APPROVED" ? "LEAVE_APPROVED" : "LEAVE_REJECTED";
      const key = `${type}:${leave.id}`;

      if (existingKeys.has(key)) {
        continue;
      }

      const leaveType = formatLeaveType(leave.leaveType);
      const leaveDate = formatDate(leave.leaveDate);
      const message =
        leave.status === "APPROVED"
          ? `${leaveType} leave for ${leaveDate} has been approved.`
          : `${leaveType} leave for ${leaveDate} has been rejected${
              leave.rejectionReason ? `: ${leave.rejectionReason}` : "."
            }`;

      notifications.push({
        id: `leave-${leave.id}`,
        refId: leave.id,
        type,
        title:
          leave.status === "APPROVED" ? "Leave Approved" : "Leave Rejected",
        message,
        className: "My Leave",
        date: leave.updatedAt.toISOString(),
        isRead: false,
      });
    }

    for (const announcement of announcements) {
      const key = `ANNOUNCEMENT:${announcement.id}`;

      if (existingKeys.has(key)) {
        continue;
      }

      notifications.push({
        id: `announcement-${announcement.id}`,
        refId: announcement.id,
        type: "ANNOUNCEMENT",
        title: announcement.title,
        message: announcement.description || "A new announcement was created.",
        className: announcement.class?.name ?? "All Classes",
        date: announcement.createdAt.toISOString(),
        isRead: false,
      });
    }

    for (const item of homework) {
      const key = `HOMEWORK:${item.id}`;

      if (existingKeys.has(key)) {
        continue;
      }

      notifications.push({
        id: `homework-${item.id}`,
        refId: item.id,
        type: "HOMEWORK",
        title: item.title,
        message: item.description || "New homework was created.",
        className: item.class?.name ?? "All Classes",
        date: item.createdAt.toISOString(),
        isRead: false,
      });
    }

    for (const item of assignments) {
      const key = `ASSIGNMENT:${item.id}`;

      if (existingKeys.has(key)) {
        continue;
      }

      notifications.push({
        id: `assignment-${item.id}`,
        refId: item.id,
        type: "ASSIGNMENT",
        title: item.title,
        message: item.description || "New assignment was created.",
        className: item.class?.name ?? "All Classes",
        date: item.createdAt.toISOString(),
        isRead: false,
      });
    }

    for (const item of exams) {
      const key = `EXAM:${item.id}`;

      if (existingKeys.has(key)) {
        continue;
      }

      notifications.push({
        id: `exam-${item.id}`,
        refId: item.id,
        type: "EXAM",
        title: item.title,
        message:
          item.description ||
          `New exam scheduled for ${formatDate(item.examDate)}.`,
        className: item.class?.name ?? "All Classes",
        date: item.createdAt.toISOString(),
        isRead: false,
      });
    }

    notifications.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json(notifications.slice(0, MAX_NOTIFICATIONS));
  } catch (error) {
    console.error("Teacher notifications API error:", error);

    return NextResponse.json(
      { error: "Failed to load teacher notifications" },
      { status: 500 },
    );
  }
}
