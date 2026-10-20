import prisma from "@/lib/prisma";
import { sendWhatsApp } from "@/lib/sendWhatsApp";

interface SendAnnouncementResult {
  success: boolean;
  sentCount: number;
  failedCount: number;
  skippedCount: number;
  error?: string;
}

export async function sendAnnouncementWhatsApp(
  announcementId: number,
): Promise<SendAnnouncementResult> {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!announcement) {
      return {
        success: false,
        sentCount: 0,
        failedCount: 0,
        skippedCount: 0,
        error: "Announcement not found.",
      };
    }

    if (!announcement.isPublished) {
      return {
        success: false,
        sentCount: 0,
        failedCount: 0,
        skippedCount: 0,
        error: "Only published announcements can be sent through WhatsApp.",
      };
    }

    const students = await prisma.student.findMany({
      where: {
        status: "ACTIVE",
        ...(announcement.classId
          ? {
              classId: announcement.classId,
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        surname: true,

        parent: {
          select: {
            id: true,
            name: true,
            surname: true,
            phone: true,
          },
        },
      },
    });

    const parentMap = new Map<
      string,
      {
        parentId: string;
        parentName: string;
        phone: string;
        studentNames: string[];
      }
    >();

    for (const student of students) {
      const parent = student.parent;

      if (!parent?.phone?.trim()) {
        continue;
      }

      const phone = parent.phone.trim();

      const studentName = `${student.name} ${student.surname}`.trim();

      const existing = parentMap.get(parent.id);

      if (existing) {
        if (!existing.studentNames.includes(studentName)) {
          existing.studentNames.push(studentName);
        }

        continue;
      }

      parentMap.set(parent.id, {
        parentId: parent.id,
        parentName: `${parent.name} ${parent.surname}`.trim(),
        phone,
        studentNames: [studentName],
      });
    }

    const parents = Array.from(parentMap.values());

    if (parents.length === 0) {
      return {
        success: false,
        sentCount: 0,
        failedCount: 0,
        skippedCount: 0,
        error:
          "No parents with phone numbers were found for this announcement.",
      };
    }

    const classText = announcement.class?.name ?? "All Classes";

    const results = await Promise.allSettled(
      parents.map(async (parent) => {
        const studentsText = parent.studentNames.join(", ");

        const message = [
          "📢 *TrueSunshine Montessori Preschool*",
          "",
          `*${announcement.title}*`,
          "",
          announcement.description,
          "",
          `Class: ${classText}`,
          `Student: ${studentsText}`,
          "",
          "Thank you,",
          "TrueSunshine Montessori Preschool",
        ].join("\n");

        console.log("Sending announcement to parent:", {
          parentId: parent.parentId,
          parentName: parent.parentName,
          phone: parent.phone,
          students: parent.studentNames,
        });

        return sendWhatsApp(parent.phone, message);
      }),
    );

    const sentCount = results.filter(
      (result) => result.status === "fulfilled",
    ).length;

    const failedCount = results.filter(
      (result) => result.status === "rejected",
    ).length;

    const skippedCount = students.filter(
      (student) => !student.parent?.phone?.trim(),
    ).length;

    if (sentCount > 0 && failedCount === 0) {
      await prisma.announcement.update({
        where: {
          id: announcement.id,
        },
        data: {
          whatsappSent: true,
          whatsappSentAt: new Date(),
        },
      });
    }

    if (failedCount > 0) {
      console.error(
        "Some WhatsApp messages failed:",
        results.filter((result) => result.status === "rejected"),
      );
    }

    return {
      success: failedCount === 0,
      sentCount,
      failedCount,
      skippedCount,
      error:
        failedCount > 0
          ? `${sentCount} WhatsApp message(s) sent, ${failedCount} failed.`
          : undefined,
    };
  } catch (error) {
    console.error("sendAnnouncementWhatsApp error:", error);

    return {
      success: false,
      sentCount: 0,
      failedCount: 0,
      skippedCount: 0,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send WhatsApp announcement.",
    };
  }
}
