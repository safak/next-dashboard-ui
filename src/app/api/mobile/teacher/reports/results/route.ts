// app/api/mobile/teacher/reports/results/route.ts
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { className, examId, format } = await request.json();

    const exam = await prisma.exam.findFirst({
      where: {
        id: Number(examId),
        teacherId: userId,
      },
      include: {
        class: {
          include: {
            students: true,
          },
        },
        subject: true,
        evaluations: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const rows = exam.class.students.map((student) => {
      const evaluation = exam.evaluations.find(
        (e) => e.studentId === student.id
      );

      const obtained = evaluation?.obtainedMarks ?? 0;
      const percentage =
        exam.totalMarks > 0
          ? ((obtained / exam.totalMarks) * 100).toFixed(2)
          : "0.00";

      return {
        student: `${student.name} ${student.surname}`,
        obtained,
        total: exam.totalMarks,
        percentage,
        remark: evaluation?.remark ?? "",
      };
    });

    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Uint8Array[] = [];

      doc.on("data", (c: Uint8Array) => chunks.push(c));

      doc.fontSize(18).text("TRUE SUNSHINE PRESCHOOL", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text("Exam Result Report", { align: "center" });
      doc.moveDown();

      doc.text(`Class : ${className}`);
      doc.text(`Exam : ${exam.title}`);
      doc.text(`Subject : ${exam.subject.name}`);
      doc.text(`Total Marks : ${exam.totalMarks}`);
      doc.moveDown();

      rows.forEach((r) => {
        doc.fontSize(11).text(
          `${r.student} | ${r.obtained}/${r.total} | ${r.percentage}% | ${r.remark}`
        );
      });

      doc.end();

      await new Promise<void>((resolve) => doc.on("end", resolve));

      const pdfBytes = new Uint8Array(
        chunks.reduce<number[]>((a, c) => a.concat(...c), [])
      );

      return new Response(pdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${className}-${exam.title}-Result.pdf`,
        },
      });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Exam Results");

    sheet.columns = [
      { header: "Student", key: "student", width: 30 },
      { header: "Obtained", key: "obtained", width: 15 },
      { header: "Total", key: "total", width: 15 },
      { header: "Percentage", key: "percentage", width: 15 },
      { header: "Remark", key: "remark", width: 30 },
    ];

    rows.forEach((r) => sheet.addRow(r));

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${className}-${exam.title}-Result.xlsx`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate result report" },
      { status: 500 }
    );
  }
}
