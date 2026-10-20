import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [type, refId] = id.split("-");

    const itemId = Number(refId);

    switch (type) {
      /* -------------------------------------------------- */
      /* ANNOUNCEMENT                                       */
      /* -------------------------------------------------- */

      case "announcement": {
        const announcement = await prisma.announcement.findUnique({
          where: {
            id: itemId,
          },

          include: {
            class: {
              select: {
                name: true,
              },
            },

            teacher: {
              select: {
                name: true,
                surname: true,
              },
            },
          },
        });

        if (!announcement) {
          return NextResponse.json(
            { error: "Announcement not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          id: announcement.id,

          type: "ANNOUNCEMENT",

          title: announcement.title,

          description: announcement.description,

          priority: announcement.priority,

          publishDate: announcement.publishDate,

          expiryDate: announcement.expiryDate,

          classId: announcement.classId,

          className: announcement.class?.name ?? "All Classes",

          teacherName: announcement.teacher
            ? `${announcement.teacher.name} ${announcement.teacher.surname}`
            : "",

          createdAt: announcement.createdAt,
        });
      }

      /* -------------------------------------------------- */
      /* HOMEWORK                                           */
      /* -------------------------------------------------- */

      case "homework": {
        const homework = await prisma.homework.findUnique({
          where: {
            id: itemId,
          },

          include: {
            class: true,

            subject: true,

            teacher: true,
          },
        });

        if (!homework) {
          return NextResponse.json(
            { error: "Homework not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          id: homework.id,

          type: "HOMEWORK",

          title: homework.title,

          description: homework.description,

          classId: homework.classId,

          className: homework.class.name,

          subjectId: homework.subjectId,

          subjectName: homework.subject.name,

          teacherName: `${homework.teacher.name} ${homework.teacher.surname}`,

          dueDate: homework.dueDate,

          createdAt: homework.createdAt,
        });
      }

      /* -------------------------------------------------- */
      /* ASSIGNMENT                                         */
      /* -------------------------------------------------- */

      case "assignment": {
        const assignment = await prisma.assignment.findUnique({
          where: {
            id: itemId,
          },

          include: {
            class: true,

            subject: true,

            teacher: true,
          },
        });

        if (!assignment) {
          return NextResponse.json(
            { error: "Assignment not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          id: assignment.id,

          type: "ASSIGNMENT",

          title: assignment.title,

          description: assignment.description,

          classId: assignment.classId,

          className: assignment.class.name,

          subjectId: assignment.subjectId,

          subjectName: assignment.subject.name,

          teacherName: `${assignment.teacher.name} ${assignment.teacher.surname}`,

          totalMarks: assignment.totalMarks,

          dueDate: assignment.dueDate,

          createdAt: assignment.createdAt,
        });
      }

      /* -------------------------------------------------- */
      /* EXAM                                               */
      /* -------------------------------------------------- */

      case "exam": {
        const exam = await prisma.exam.findUnique({
          where: {
            id: itemId,
          },

          include: {
            class: true,

            subject: true,

            teacher: true,
          },
        });

        if (!exam) {
          return NextResponse.json(
            { error: "Exam not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          id: exam.id,

          type: "EXAM",

          title: exam.title,

          description: exam.description,

          classId: exam.classId,

          className: exam.class.name,

          subjectId: exam.subjectId,

          subjectName: exam.subject.name,

          teacherName: `${exam.teacher.name} ${exam.teacher.surname}`,

          totalMarks: exam.totalMarks,

          examDate: exam.examDate,

          createdAt: exam.createdAt,
        });
      }

      default:
        return NextResponse.json(
          {
            error: "Invalid notification type",
          },
          {
            status: 400,
          }
        );
    }
  } catch (error) {
    console.error("Notification Details Error:", error);

    return NextResponse.json(
      {
        error: "Failed to load notification",
      },
      {
        status: 500,
      }
    );
  }
}