"use server";

import prisma from "@/lib/prisma";
import { sendWhatsApp } from "@/lib/sendWhatsApp";

import type { AnnouncementFormValues } from "./types";

export type ActionState = {
  success: boolean;
  error?: string;
  message?: string;
  ts?: number;
};

type AnnouncementCreateData = {
  title: string;
  description: string;
  priority: AnnouncementFormValues["priority"];
  publishDate: Date;
  expiryDate: Date | null;
  isPublished: boolean;
  classId: number | null;
};

/* ==================================================
   SEND ANNOUNCEMENT WHATSAPP
================================================== */

async function sendAnnouncementWhatsApp(
  title: string,
  description: string,
  priority: AnnouncementFormValues["priority"],
  publishDate: Date,
  expiryDate: Date | null,
  classId: number | null,
) {
  const students = await prisma.student.findMany({
    where: {
      status: "ACTIVE",
      ...(classId !== null
        ? {
            classId,
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
      sent: 0,
      failed: 0,
      total: 0,
    };
  }

  const formattedPublishDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(publishDate));

  const formattedExpiryDate = expiryDate
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(expiryDate))
    : null;

  const classInfo =
    classId !== null
      ? await prisma.class.findUnique({
          where: {
            id: classId,
          },
          select: {
            name: true,
          },
        })
      : null;

  const classText = classInfo?.name ?? "All Classes";

  const results = await Promise.allSettled(
    parents.map(async (parent) => {
      const studentsText = parent.studentNames.join(", ");

      const message = [
        "📢 *TrueSunshine Montessori Preschool*",
        "",
        "*School Announcement*",
        "",
        `*${title.trim()}*`,
        "",
        description.trim(),
        "",
        `*Priority:* ${priority}`,
        `*Class:* ${classText}`,
        `*Student:* ${studentsText}`,
        `*Published:* ${formattedPublishDate}`,
        ...(formattedExpiryDate
          ? [`*Valid Until:* ${formattedExpiryDate}`]
          : []),
        "",
        "Thank you,",
        "*TrueSunshine Educational Society*",
      ].join("\n");

      console.log("Sending announcement WhatsApp to parent:", {
        parentId: parent.parentId,
        parentName: parent.parentName,
        phone: parent.phone,
        students: parent.studentNames,
      });

      return sendWhatsApp(parent.phone, message);
    }),
  );

  const sent = results.filter((result) => result.status === "fulfilled").length;

  const failed = results.filter(
    (result) => result.status === "rejected",
  ).length;

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `❌ Announcement WhatsApp failed for parent ${parents[index].parentId} (${parents[index].phone}):`,
        result.reason,
      );
    }
  });

  return {
    sent,
    failed,
    total: parents.length,
  };
}

/* ==================================================
   CREATE
================================================== */

export const createAnnouncement = async (
  _prev: ActionState,
  data: AnnouncementFormValues,
): Promise<ActionState> => {
  try {
    const title = data.title.trim();

    const description = data.description.trim();

    if (!title) {
      return {
        success: false,
        error: "Announcement title is required.",
      };
    }

    if (!description) {
      return {
        success: false,
        error: "Announcement description is required.",
      };
    }

    const classId =
      data.classId && data.classId !== "ALL" ? Number(data.classId) : null;

    if (classId !== null && !Number.isInteger(classId)) {
      return {
        success: false,
        error: "Invalid class selected.",
      };
    }

    const createData: AnnouncementCreateData = {
      title,
      description,
      priority: data.priority,
      publishDate: data.publishDate,
      expiryDate: data.expiryDate ?? null,
      isPublished: data.isPublished,
      classId,
    };

    const announcement = await prisma.announcement.create({
      data: createData,
    });

    /* -----------------------------------------------
       SEND WHATSAPP FOR PUBLISHED ANNOUNCEMENTS
    ------------------------------------------------ */

    if (announcement.isPublished) {
      const whatsappResult = await sendAnnouncementWhatsApp(
        announcement.title,
        announcement.description,
        announcement.priority,
        announcement.publishDate,
        announcement.expiryDate,
        announcement.classId,
      );

      if (whatsappResult.total === 0) {
        return {
          success: true,
          message:
            "Announcement created successfully, but no parents with phone numbers were found.",
        };
      }

      if (whatsappResult.failed === 0) {
        await prisma.announcement.update({
          where: {
            id: announcement.id,
          },
          data: {
            whatsappSent: true,
            whatsappSentAt: new Date(),
          },
        });

        return {
          success: true,
          message: `Announcement created successfully and sent to ${whatsappResult.sent} parent(s) on WhatsApp.`,
        };
      }

      if (whatsappResult.sent > 0) {
        return {
          success: true,
          message: `Announcement created successfully. WhatsApp sent to ${whatsappResult.sent} parent(s), but ${whatsappResult.failed} failed.`,
        };
      }

      return {
        success: true,
        message:
          "Announcement created successfully, but WhatsApp could not be sent.",
      };
    }

    return {
      success: true,
      message: "Announcement created successfully.",
    };
  } catch (err) {
    console.error("❌ createAnnouncement:", err);

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to create announcement",
    };
  }
};

/* ==================================================
   UPDATE
================================================== */

export const updateAnnouncement = async (
  _prev: ActionState,
  data: AnnouncementFormValues,
): Promise<ActionState> => {
  try {
    if (!data.id) {
      return {
        success: false,
        error: "Announcement ID is required.",
      };
    }

    const title = data.title.trim();

    const description = data.description.trim();

    if (!title) {
      return {
        success: false,
        error: "Announcement title is required.",
      };
    }

    if (!description) {
      return {
        success: false,
        error: "Announcement description is required.",
      };
    }

    const classId =
      data.classId && data.classId !== "ALL" ? Number(data.classId) : null;

    if (classId !== null && !Number.isInteger(classId)) {
      return {
        success: false,
        error: "Invalid class selected.",
      };
    }

    const existingAnnouncement = await prisma.announcement.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!existingAnnouncement) {
      return {
        success: false,
        error: "Announcement not found.",
      };
    }

    const updateData = {
      title,
      description,
      priority: data.priority,
      publishDate: data.publishDate,
      expiryDate: data.expiryDate ?? null,
      isPublished: data.isPublished,
      classId,
    };

    const announcement = await prisma.announcement.update({
      where: {
        id: data.id,
      },
      data: updateData,
    });

    /* -----------------------------------------------
       RESET WHATSAPP STATUS WHEN CONTENT IS UPDATED
    ------------------------------------------------ */

    await prisma.announcement.update({
      where: {
        id: announcement.id,
      },
      data: {
        whatsappSent: false,
        whatsappSentAt: null,
      },
    });

    /* -----------------------------------------------
       SEND WHATSAPP FOR PUBLISHED ANNOUNCEMENTS
    ------------------------------------------------ */

    if (announcement.isPublished) {
      const whatsappResult = await sendAnnouncementWhatsApp(
        announcement.title,
        announcement.description,
        announcement.priority,
        announcement.publishDate,
        announcement.expiryDate,
        announcement.classId,
      );

      if (whatsappResult.total === 0) {
        return {
          success: true,
          message:
            "Announcement updated successfully, but no parents with phone numbers were found.",
        };
      }

      if (whatsappResult.failed === 0) {
        await prisma.announcement.update({
          where: {
            id: announcement.id,
          },
          data: {
            whatsappSent: true,
            whatsappSentAt: new Date(),
          },
        });

        return {
          success: true,
          message: `Announcement updated successfully and sent to ${whatsappResult.sent} parent(s) on WhatsApp.`,
        };
      }

      if (whatsappResult.sent > 0) {
        return {
          success: true,
          message: `Announcement updated successfully. WhatsApp sent to ${whatsappResult.sent} parent(s), but ${whatsappResult.failed} failed.`,
        };
      }

      return {
        success: true,
        message:
          "Announcement updated successfully, but WhatsApp could not be sent.",
      };
    }

    return {
      success: true,
      message: "Announcement updated successfully.",
    };
  } catch (err) {
    console.error("❌ updateAnnouncement:", err);

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to update announcement",
    };
  }
};

/* ==================================================
   DELETE
================================================== */

export const deleteAnnouncement = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const id = Number(formData.get("id"));

    if (!id || !Number.isInteger(id)) {
      return {
        success: false,
        error: "Invalid announcement ID.",
      };
    }

    await prisma.announcement.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (err) {
    console.error("❌ deleteAnnouncement:", err);

    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to delete announcement",
    };
  }
};
