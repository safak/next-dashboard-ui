
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit/js/pdfkit.standalone";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* ======================================
   GET - REPORT SUMMARY
====================================== */

export async function GET() {
  try {
    const assignments =
      await prisma.assignment.findMany({
        include: {
          class: true,
          subject: true,

          evaluations: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const totalAssignments =
      assignments.length;

    const totalEvaluations =
      assignments.reduce(
        (sum, assignment) =>
          sum +
          assignment.evaluations.length,
        0
      );

    const allMarks =
      assignments.flatMap(
        (assignment) =>
          assignment.evaluations.map(
            (evaluation) =>
              evaluation.obtainedMarks
          )
      );

    const averageMarks =
      allMarks.length > 0
        ? Number(
            (
              allMarks.reduce(
                (a, b) => a + b,
                0
              ) / allMarks.length
            ).toFixed(1)
          )
        : 0;

    const highestMark =
      allMarks.length > 0
        ? Math.max(...allMarks)
        : 0;

    const lowestMark =
      allMarks.length > 0
        ? Math.min(...allMarks)
        : 0;

    return NextResponse.json({
      summary: {
        totalAssignments,
        totalEvaluations,
        averageMarks,
        highestMark,
        lowestMark,
      },

      assignments,
    });
  } catch (error) {
    console.error(
      "Assignment Report Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate assignment report",
      },
      {
        status: 500,
      }
    );
  }
}

/* ======================================
   POST - PDF / EXCEL EXPORT
====================================== */

export async function POST(
  request: NextRequest
) {
  try {
    const {
      className,
      month,
      year,
      format,
    } = await request.json();

    const selectedClass =
      await prisma.class.findFirst({
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

    const startDate =
      new Date(year, month - 1, 1);

    const endDate =
      new Date(year, month, 0);

    const assignments =
      await prisma.assignment.findMany({
        where: {
          classId: selectedClass.id,

          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },

        include: {
          class: true,
          subject: true,

          evaluations: {
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    /* ===========================
       PDF EXPORT
    =========================== */

    if (format === "pdf") {
      const doc =
        new PDFDocument({
          margin: 40,
        });

      const chunks:
        Uint8Array[] = [];

      doc.on(
        "data",
        (chunk: Uint8Array) =>
          chunks.push(chunk)
      );

      doc
        .fontSize(18)
        .text(
          "TRUE SUNSHINE PRESCHOOL",
          {
            align: "center",
          }
        );

      doc.moveDown();

      doc
        .fontSize(14)
        .text(
          "Assignment Report",
          {
            align: "center",
          }
        );

      doc.moveDown();

      doc.text(
        `Class : ${className}`
      );

      doc.text(
        `Month : ${new Date(
          year,
          month - 1
        ).toLocaleString(
          "default",
          {
            month: "long",
          }
        )} ${year}`
      );

      doc.moveDown();

      assignments.forEach(
        (assignment) => {
          const marks =
            assignment.evaluations.map(
              (e) =>
                e.obtainedMarks
            );

          const avg =
            marks.length > 0
              ? (
                  marks.reduce(
                    (
                      a,
                      b
                    ) =>
                      a + b,
                    0
                  ) /
                  marks.length
                ).toFixed(1)
              : "0";

          doc.text(
            `Assignment : ${assignment.title}`
          );

          doc.text(
            `Subject : ${assignment.subject.name}`
          );

          doc.text(
            `Total Marks : ${assignment.totalMarks}`
          );

          doc.text(
            `Average Score : ${avg}`
          );

          doc.text(
            `Evaluated Students : ${assignment.evaluations.length}`
          );

          doc.moveDown();
        }
      );

      doc.end();

      await new Promise<void>(
        (resolve) =>
          doc.on(
            "end",
            resolve
          )
      );

      const pdfBytes =
        new Uint8Array(
          chunks.reduce<
            number[]
          >(
            (
              acc,
              chunk
            ) =>
              acc.concat(
                ...chunk
              ),
            []
          )
        );

      return new Response(
        pdfBytes,
        {
          headers: {
            "Content-Type":
              "application/pdf",

            "Content-Disposition":
              `attachment; filename=${className}-Assignment-${month}-${year}.pdf`,
          },
        }
      );
    }

    /* ===========================
       EXCEL EXPORT
    =========================== */

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Assignments"
      );

    worksheet.columns = [
      {
        header:
          "Assignment",
        key: "title",
        width: 30,
      },

      {
        header:
          "Subject",
        key: "subject",
        width: 20,
      },

      {
        header:
          "Student",
        key: "student",
        width: 30,
      },

      {
        header:
          "Marks",
        key: "marks",
        width: 15,
      },

      {
        header:
          "Total Marks",
        key: "totalMarks",
        width: 15,
      },

      {
        header:
          "Percentage",
        key: "percentage",
        width: 15,
      },
    ];

    assignments.forEach(
      (assignment) => {
        assignment.evaluations.forEach(
          (
            evaluation
          ) => {
            worksheet.addRow(
              {
                title:
                  assignment.title,

                subject:
                  assignment
                    .subject
                    .name,

                student: `${evaluation.student.name} ${
                  evaluation.student
                    .surname ?? ""
                }`,

                marks:
                  evaluation.obtainedMarks,

                totalMarks:
                  assignment.totalMarks,

                percentage: `${(
                  (evaluation.obtainedMarks /
                    assignment.totalMarks) *
                  100
                ).toFixed(1)}%`,
              }
            );
          }
        );
      }
    );

    const buffer =
      await workbook.xlsx.writeBuffer();

    return new Response(
      buffer,
      {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "Content-Disposition":
            `attachment; filename=${className}-Assignment-${month}-${year}.xlsx`,
        },
      }
    );
  } catch (error) {
    console.error(
      "Assignment Export Error:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to export assignment report",
      },
      {
        status: 500,
      }
    );
  }
}

