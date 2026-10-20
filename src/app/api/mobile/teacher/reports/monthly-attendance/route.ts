import ExcelJS from "exceljs";
import PDFDocument from "pdfkit/js/pdfkit.standalone";

import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { className, month, year, format } = await request.json();

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
        },
      );
    }

    const students = await prisma.student.findMany({
      where: {
        classId: selectedClass.id,
      },

      orderBy: {
        name: "asc",
      },
    });

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        student: {
          classId: selectedClass.id,
        },

        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    /* =====================================================
       PDF EXPORT
    ===================================================== */

    if (format === "pdf") {
      const doc = new PDFDocument({
        margin: 40,
      });

      const chunks: Uint8Array[] = [];

      doc.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      /* HEADER */

      doc.fontSize(18).text("TRUE SUNSHINE PRESCHOOL", {
        align: "center",
      });

      doc.moveDown();

      doc.fontSize(14).text("Monthly Attendance Report", {
        align: "center",
      });

      doc.moveDown();

      doc.fontSize(11).text(`Class : ${className}`);

      doc.text(
        `Month : ${new Date(year, month - 1).toLocaleString("default", {
          month: "long",
        })} ${year}`,
      );

      doc.moveDown(2);

      /* TABLE HEADER */

      doc.fontSize(11).text("Student Name", 40, doc.y, {
        width: 180,
      });

      doc.text("Present", 240, doc.y - 14);

      doc.text("Absent", 310, doc.y - 14);

      doc.text("Leave", 380, doc.y - 14);

      doc.text("%", 450, doc.y - 14);

      doc.moveDown();

      doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();

      doc.moveDown();

      /* STUDENT ROWS */

      students.forEach((student) => {
        const records = attendance.filter((a) => a.studentId === student.id);

        const present = records.filter((r) => r.status === "present").length;

        const absent = records.filter((r) => r.status === "absent").length;

        const leave = records.filter((r) => r.status === "leave").length;

        const total = present + absent + leave;

        const percentage =
          total === 0 ? 0 : Math.round((present / total) * 100);

        const y = doc.y;

        doc.text(student.name, 40, y, {
          width: 180,
        });

        doc.text(String(present), 240, y);

        doc.text(String(absent), 310, y);

        doc.text(String(leave), 380, y);

        doc.text(`${percentage}%`, 450, y);

        doc.moveDown();
      });

      doc.end();

      await new Promise<void>((resolve) => doc.on("end", resolve));

      const pdfBytes = new Uint8Array(
        chunks.reduce<number[]>((acc, chunk) => acc.concat(...chunk), []),
      );

      return new Response(pdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${className}-${month}-${year}.pdf`,
        },
      });
    }

    /* =====================================================
       EXCEL EXPORT
    ===================================================== */

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Attendance");

    const daysInMonth = endDate.getDate();

    const headers = [
      "Student Name",

      ...Array.from(
        {
          length: daysInMonth,
        },
        (_, i) => String(i + 1),
      ),

      "Present",
      "Absent",
      "Leave",
      "%",
    ];

    worksheet.addRow(headers);

    students.forEach((student) => {
      const row: any[] = [student.name];

      let present = 0;
      let absent = 0;
      let leave = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const record = attendance.find(
          (a) =>
            a.studentId === student.id && new Date(a.date).getDate() === day,
        );

        if (!record) {
          row.push("-");
        } else if (record.status === "present") {
          row.push("P");
          present++;
        } else if (record.status === "absent") {
          row.push("A");
          absent++;
        } else {
          row.push("L");
          leave++;
        }
      }

      const total = present + absent + leave;

      const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

      row.push(present, absent, leave, `${percentage}%`);

      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition": `attachment; filename=${className}-${month}-${year}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Report Error:", error);

    return Response.json(
      {
        error: "Failed to generate report",
      },
      {
        status: 500,
      },
    );
  }
}
