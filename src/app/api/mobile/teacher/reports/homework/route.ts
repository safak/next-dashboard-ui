import ExcelJS from "exceljs";
import PDFDocument from "pdfkit/js/pdfkit.standalone";

import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { className, month, year, format } =
      await request.json();

    const selectedClass = await prisma.class.findFirst({
      where: {
        name: className,
      },
    });

    if (!selectedClass) {
      return Response.json(
        {
          error: "Class not found",
        },
        {
          status: 404,
        }
      );
    }

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 0);

    const homeworks = await prisma.homework.findMany({
      where: {
        classId: selectedClass.id,

        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },

      include: {
        subject: true,

        homeworkRemarks: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    /* ===========================
       PDF EXPORT
    =========================== */

    if (format === "pdf") {
      const doc = new PDFDocument({
        margin: 40,
      });

      const chunks: Uint8Array[] = [];

      doc.on("data", (chunk: Uint8Array) =>
        chunks.push(chunk)
      );

      doc
        .fontSize(18)
        .text("TRUE SUNSHINE PRESCHOOL", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(14)
        .text("Homework Report", {
          align: "center",
        });

      doc.moveDown();

      doc.text(`Class : ${className}`);

      doc.text(
        `Month : ${new Date(
          year,
          month - 1
        ).toLocaleString("default", {
          month: "long",
        })} ${year}`
      );

      doc.moveDown();

      homeworks.forEach((homework) => {
        const completed =
          homework.homeworkRemarks.filter(
            (r) => r.status === "COMPLETED"
          ).length;

        const incomplete =
          homework.homeworkRemarks.filter(
            (r) => r.status === "INCOMPLETE"
          ).length;

        const notDone =
          homework.homeworkRemarks.filter(
            (r) => r.status === "NOT_DONE"
          ).length;

        doc
          .fontSize(11)
          .text(
            `Title: ${homework.title}`
          );

        doc.text(
          `Subject: ${homework.subject.name}`
        );

        doc.text(
          `Due Date: ${homework.dueDate.toLocaleDateString()}`
        );

        doc.text(
          `Completed: ${completed} | Incomplete: ${incomplete} | Not Done: ${notDone}`
        );

        doc.moveDown();
      });

      doc.end();

      await new Promise<void>((resolve) =>
        doc.on("end", resolve)
      );

      const pdfBytes = new Uint8Array(
        chunks.reduce<number[]>(
          (acc, chunk) =>
            acc.concat(...chunk),
          []
        )
      );

      return new Response(pdfBytes, {
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename=${className}-Homework-${month}-${year}.pdf`,
        },
      });
    }

    /* ===========================
       EXCEL EXPORT
    =========================== */

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet("Homework");

    worksheet.columns = [
      {
        header: "Title",
        key: "title",
        width: 30,
      },

      {
        header: "Subject",
        key: "subject",
        width: 20,
      },

      {
        header: "Due Date",
        key: "dueDate",
        width: 20,
      },

      {
        header: "Completed",
        key: "completed",
        width: 15,
      },

      {
        header: "Incomplete",
        key: "incomplete",
        width: 15,
      },

      {
        header: "Not Done",
        key: "notDone",
        width: 15,
      },
    ];

    homeworks.forEach((homework) => {
      worksheet.addRow({
        title: homework.title,

        subject: homework.subject.name,

        dueDate:
          homework.dueDate.toLocaleDateString(),

        completed:
          homework.homeworkRemarks.filter(
            (r) =>
              r.status === "COMPLETED"
          ).length,

        incomplete:
          homework.homeworkRemarks.filter(
            (r) =>
              r.status === "INCOMPLETE"
          ).length,

        notDone:
          homework.homeworkRemarks.filter(
            (r) =>
              r.status === "NOT_DONE"
          ).length,
      });
    });

    const buffer =
      await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          `attachment; filename=${className}-Homework-${month}-${year}.xlsx`,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to generate homework report",
      },
      {
        status: 500,
      }
    );
  }
}