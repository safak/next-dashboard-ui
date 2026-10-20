import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Notification id is required" },
        { status: 400 },
      );
    }

    if (id.startsWith("notification-")) {
      const notificationId = Number(id.replace("notification-", ""));

      if (!Number.isInteger(notificationId)) {
        return NextResponse.json(
          { error: "Invalid notification id" },
          { status: 400 },
        );
      }

      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        return NextResponse.json(
          { error: "Notification not found" },
          { status: 404 },
        );
      }

      await prisma.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        notificationId: notification.id,
      });
    }

    if (id.startsWith("leave-")) {
      const leaveId = Number(id.replace("leave-", ""));

      if (!Number.isInteger(leaveId)) {
        return NextResponse.json(
          { error: "Invalid leave notification id" },
          { status: 400 },
        );
      }

      const leave = await prisma.teacherLeave.findFirst({
        where: {
          id: leaveId,
          teacherId: userId,
          status: {
            in: ["APPROVED", "REJECTED"],
          },
        },
      });

      if (!leave) {
        return NextResponse.json(
          { error: "Leave request not found" },
          { status: 404 },
        );
      }

      const notificationType =
        leave.status === "APPROVED" ? "LEAVE_APPROVED" : "LEAVE_REJECTED";

      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          referenceId: leave.id,
          type: notificationType,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingNotification) {
        if (!existingNotification.isRead) {
          await prisma.notification.update({
            where: {
              id: existingNotification.id,
            },
            data: {
              isRead: true,
            },
          });
        }

        return NextResponse.json({
          success: true,
          notificationId: existingNotification.id,
        });
      }

      const leaveType = leave.leaveType
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

      const leaveDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(leave.leaveDate);

      const message =
        leave.status === "APPROVED"
          ? `${leaveType} leave for ${leaveDate} has been approved.`
          : `${leaveType} leave for ${leaveDate} has been rejected${
              leave.rejectionReason ? `: ${leave.rejectionReason}` : "."
            }`;

      const notification = await prisma.notification.create({
        data: {
          userId,
          referenceId: leave.id,
          type: notificationType,
          title:
            leave.status === "APPROVED" ? "Leave Approved" : "Leave Rejected",
          message,
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        notificationId: notification.id,
      });
    }

    if (id.startsWith("announcement-")) {
      const announcementId = Number(id.replace("announcement-", ""));

      if (!Number.isInteger(announcementId)) {
        return NextResponse.json(
          { error: "Invalid announcement notification id" },
          { status: 400 },
        );
      }

      // First check for an existing persisted notification.
      // The notification can be marked as read even if the
      // announcement has already been deleted.
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          referenceId: announcementId,
          type: "ANNOUNCEMENT",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingNotification) {
        if (!existingNotification.isRead) {
          await prisma.notification.update({
            where: {
              id: existingNotification.id,
            },
            data: {
              isRead: true,
            },
          });
        }

        return NextResponse.json({
          success: true,
          notificationId: existingNotification.id,
        });
      }

      // Check whether the announcement still exists.
      const announcement = await prisma.announcement.findFirst({
        where: {
          id: announcementId,
          teacherId: userId,
        },
      });

      // Announcement was deleted, but there is no persisted notification.
      // Treat the notification as stale instead of returning 404.
      if (!announcement) {
        return NextResponse.json({
          success: true,
          notificationId: null,
          stale: true,
        });
      }

      // Announcement still exists but no notification record exists.
      const notification = await prisma.notification.create({
        data: {
          userId,
          referenceId: announcement.id,
          type: "ANNOUNCEMENT",
          title: announcement.title,
          message: announcement.description || "New announcement was created.",
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        notificationId: notification.id,
      });
    }

    if (id.startsWith("homework-")) {
      const homeworkId = Number(id.replace("homework-", ""));

      if (!Number.isInteger(homeworkId)) {
        return NextResponse.json(
          { error: "Invalid homework notification id" },
          { status: 400 },
        );
      }

      // First check for an existing persisted notification.
      // The notification can be marked as read even if the
      // homework has already been deleted.
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          referenceId: homeworkId,
          type: "HOMEWORK",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingNotification) {
        if (!existingNotification.isRead) {
          await prisma.notification.update({
            where: {
              id: existingNotification.id,
            },
            data: {
              isRead: true,
            },
          });
        }

        return NextResponse.json({
          success: true,
          notificationId: existingNotification.id,
        });
      }

      // Check whether the homework still exists.
      const homework = await prisma.homework.findFirst({
        where: {
          id: homeworkId,
          teacherId: userId,
        },
      });

      // Homework was deleted and no persisted notification exists.
      // Treat this as a stale notification instead of returning 404.
      if (!homework) {
        return NextResponse.json({
          success: true,
          notificationId: null,
          stale: true,
        });
      }

      // Homework still exists but no notification record exists.
      const notification = await prisma.notification.create({
        data: {
          userId,
          referenceId: homework.id,
          type: "HOMEWORK",
          title: homework.title,
          message: homework.description || "New homework was created.",
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        notificationId: notification.id,
      });
    }

    if (id.startsWith("assignment-")) {
      const assignmentId = Number(id.replace("assignment-", ""));

      if (!Number.isInteger(assignmentId)) {
        return NextResponse.json(
          { error: "Invalid assignment notification id" },
          { status: 400 },
        );
      }

      // First check for an existing persisted notification.
      // The notification can be marked as read even if the
      // assignment has already been deleted.
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          referenceId: assignmentId,
          type: "ASSIGNMENT",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingNotification) {
        if (!existingNotification.isRead) {
          await prisma.notification.update({
            where: {
              id: existingNotification.id,
            },
            data: {
              isRead: true,
            },
          });
        }

        return NextResponse.json({
          success: true,
          notificationId: existingNotification.id,
        });
      }

      // Check whether the assignment still exists.
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: assignmentId,
          teacherId: userId,
        },
      });

      // Assignment was deleted and no persisted notification exists.
      // Treat this as a stale notification instead of returning 404.
      if (!assignment) {
        return NextResponse.json({
          success: true,
          notificationId: null,
          stale: true,
        });
      }

      // Assignment still exists but no notification record exists.
      const notification = await prisma.notification.create({
        data: {
          userId,
          referenceId: assignment.id,
          type: "ASSIGNMENT",
          title: assignment.title,
          message: assignment.description || "New assignment was created.",
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        notificationId: notification.id,
      });
    }

    if (id.startsWith("exam-")) {
      const examId = Number(id.replace("exam-", ""));

      if (!Number.isInteger(examId)) {
        return NextResponse.json(
          { error: "Invalid exam notification id" },
          { status: 400 },
        );
      }

      // First check whether a persisted notification already exists.
      // The notification should be markable as read even if the exam
      // itself has already been deleted.
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          referenceId: examId,
          type: "EXAM",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingNotification) {
        if (!existingNotification.isRead) {
          await prisma.notification.update({
            where: {
              id: existingNotification.id,
            },
            data: {
              isRead: true,
            },
          });
        }

        return NextResponse.json({
          success: true,
          notificationId: existingNotification.id,
        });
      }

      // The exam may have already been deleted.
      // A stale notification should not produce an error.
      const exam = await prisma.exam.findFirst({
        where: {
          id: examId,
          teacherId: userId,
        },
      });

      if (!exam) {
        return NextResponse.json({
          success: true,
          notificationId: null,
          stale: true,
        });
      }

      // No persisted notification exists, but the exam still exists.
      // Create a read notification record.
      const notification = await prisma.notification.create({
        data: {
          userId,
          referenceId: exam.id,
          type: "EXAM",
          title: exam.title,
          message:
            exam.description ||
            `New exam scheduled for ${new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "Asia/Kolkata",
            }).format(exam.examDate)}.`,
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        notificationId: notification.id,
      });
    }

    return NextResponse.json(
      { error: "Invalid notification id" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Teacher notification read error:", error);

    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 },
    );
  }
}
