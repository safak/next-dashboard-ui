import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import { readFile } from "fs/promises";
import path from "path";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";

function toDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);

  const date = new Date(Date.UTC(year, monthNumber - 1, 1));

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getWorkingDayKeys({
  start,
  end,
  holidayDates,
}: {
  start: Date;
  end: Date;
  holidayDates: Set<string>;
}): string[] {
  const result: string[] = [];

  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getUTCDay();

    // Sunday
    if (dayOfWeek !== 0) {
      const key = toDateKey(current);

      if (!holidayDates.has(key)) {
        result.push(key);
      }
    }

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return result;
}

async function getReportData(classId: number, month: string) {
  const [year, monthNumber] = month.split("-").map(Number);

  const monthStart = new Date(Date.UTC(year, monthNumber - 1, 1));

  const monthEndExclusive = new Date(Date.UTC(year, monthNumber, 1));

  const now = new Date();

  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const isCurrentMonth =
    year === todayUTC.getUTCFullYear() &&
    monthNumber === todayUTC.getUTCMonth() + 1;

  const lastCountedDate = isCurrentMonth
    ? todayUTC
    : new Date(monthEndExclusive.getTime() - 24 * 60 * 60 * 1000);

  /* ============================================================
     CLASS
  ============================================================ */

  const selectedClass = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    select: {
      id: true,
      name: true,
      academicYear: {
        select: {
          label: true,
        },
      },
    },
  });

  if (!selectedClass) {
    throw new Error("Selected class was not found.");
  }

  /* ============================================================
     ACTIVE STUDENTS
  ============================================================ */

  const students = await prisma.student.findMany({
    where: {
      classId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      surname: true,
      rollNo: true,
      admissionNo: true,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        surname: "asc",
      },
    ],
  });

  /* ============================================================
     HOLIDAYS
  ============================================================ */

  const holidays = await prisma.holiday.findMany({
    where: {
      date: {
        gte: monthStart,
        lt: monthEndExclusive,
      },
      isFullDay: true,
    },
    select: {
      date: true,
    },
  });

  const holidayDates = new Set(
    holidays.map((holiday) => toDateKey(holiday.date)),
  );

  /* ============================================================
     WORKING DAYS
  ============================================================ */

  const workingDayKeys = getWorkingDayKeys({
    start: monthStart,
    end: lastCountedDate,
    holidayDates,
  });

  /* ============================================================
     ATTENDANCE

     Fetch all records for the selected class/month.

     We do not construct dates using:
       new Date("YYYY-MM-DD")

     because that can introduce timezone shifts.
  ============================================================ */

  const attendanceRecords =
    students.length === 0
      ? []
      : await prisma.attendance.findMany({
          where: {
            studentId: {
              in: students.map((student) => student.id),
            },
            date: {
              gte: monthStart,
              lt: monthEndExclusive,
            },
          },
          select: {
            id: true,
            studentId: true,
            date: true,
            status: true,
          },
          orderBy: [
            {
              date: "asc",
            },
            {
              id: "asc",
            },
          ],
        });

  /* ============================================================
     ATTENDANCE MAP

     studentId → dateKey → status

     If duplicate records somehow exist for the same
     student/date, the later record wins.
  ============================================================ */

  const attendanceMap = new Map<string, Map<string, "PRESENT" | "ABSENT">>();

  for (const record of attendanceRecords) {
    const dateKey = toDateKey(record.date);

    if (!workingDayKeys.includes(dateKey)) {
      continue;
    }

    const status = String(record.status).toUpperCase();

    if (status !== "PRESENT" && status !== "ABSENT") {
      continue;
    }

    if (!attendanceMap.has(record.studentId)) {
      attendanceMap.set(record.studentId, new Map());
    }

    attendanceMap
      .get(record.studentId)!
      .set(dateKey, status as "PRESENT" | "ABSENT");
  }

  /* ============================================================
     STUDENT REPORT ROWS
  ============================================================ */

  const rows = students.map((student) => {
    const studentAttendance = attendanceMap.get(student.id);

    let present = 0;
    let absent = 0;

    const daily: Record<string, "PRESENT" | "ABSENT" | null> = {};

    for (const dateKey of workingDayKeys) {
      const status = studentAttendance?.get(dateKey) ?? null;

      daily[dateKey] = status;

      if (status === "PRESENT") {
        present++;
      }

      if (status === "ABSENT") {
        absent++;
      }
    }

    const pending = Math.max(workingDayKeys.length - present - absent, 0);

    const marked = present + absent;

    const attendancePercentage =
      marked > 0 ? Number(((present / marked) * 100).toFixed(2)) : 0;

    return {
      id: student.id,
      name: [student.name, student.surname].filter(Boolean).join(" "),
      rollNo: student.rollNo ?? "",
      admissionNo: student.admissionNo ?? "",
      present,
      absent,
      pending,
      attendancePercentage,
      daily,
    };
  });

  const totalPresent = rows.reduce((sum, row) => sum + row.present, 0);

  const totalAbsent = rows.reduce((sum, row) => sum + row.absent, 0);

  const totalPending = rows.reduce((sum, row) => sum + row.pending, 0);

  const totalMarked = totalPresent + totalAbsent;

  const attendancePercentage =
    totalMarked > 0
      ? Number(((totalPresent / totalMarked) * 100).toFixed(2))
      : 0;

  return {
    className: selectedClass.name,
    academicYear: selectedClass.academicYear.label,
    month,
    monthLabel: formatMonthLabel(month),
    workingDays: workingDayKeys.length,
    totalStudents: students.length,
    present: totalPresent,
    absent: totalAbsent,
    pending: totalPending,
    markedRecords: totalMarked,
    attendancePercentage,
    workingDayKeys,
    rows,
  };
}

async function generatePdfReport(
  report: Awaited<ReturnType<typeof getReportData>>,
) {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 32,
  });

  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk: Uint8Array) => {
    chunks.push(chunk);
  });

  /* ============================================================
     CUSTOM FONTS

     Avoid pdfkit.standalone Helvetica/AFM issues.
  ============================================================ */

  const regularFontPath = path.resolve(
    process.cwd(),
    "public/fonts/NotoSans-Regular.ttf",
  );

  const boldFontPath = path.resolve(
    process.cwd(),
    "public/fonts/NotoSans-Bold.ttf",
  );

  const regularFont = await readFile(regularFontPath);

  const boldFont = await readFile(boldFontPath);

  doc.registerFont("NotoSans", regularFont);

  doc.registerFont("NotoSans-Bold", boldFont);

  /* ============================================================
     HEADER
  ============================================================ */

  doc.font("NotoSans-Bold").fontSize(18).text("TRUE SUNSHINE PRESCHOOL", {
    align: "center",
  });

  doc.font("NotoSans").fontSize(12).text("Monthly Student Attendance Report", {
    align: "center",
  });

  doc.moveDown(1);

  doc.font("NotoSans-Bold").fontSize(10).text(`Class: ${report.className}`, 40);

  doc.font("NotoSans").text(`Academic Year: ${report.academicYear}`);

  doc.text(`Month: ${report.monthLabel}`);

  doc.moveDown(0.8);

  /* ============================================================
     SUMMARY
  ============================================================ */

  doc.font("NotoSans-Bold").fontSize(11).text("Summary");

  doc.moveDown(0.3);

  doc
    .font("NotoSans")
    .fontSize(10)
    .text(
      `Students: ${report.totalStudents}    ` +
        `Working Days: ${report.workingDays}    ` +
        `Present: ${report.present}    ` +
        `Absent: ${report.absent}    ` +
        `Pending: ${report.pending}    ` +
        `Attendance: ${report.attendancePercentage}%`,
    );

  doc.moveDown(1);

  /* ============================================================
     STUDENT SUMMARY TABLE
  ============================================================ */

  const startX = 40;
  const columns = [
    {
      title: "#",
      width: 30,
    },
    {
      title: "Student",
      width: 190,
    },
    {
      title: "Roll No",
      width: 90,
    },
    {
      title: "Present",
      width: 65,
    },
    {
      title: "Absent",
      width: 65,
    },
    {
      title: "Pending",
      width: 65,
    },
    {
      title: "Attendance",
      width: 90,
    },
  ];

  const rowHeight = 24;

  let y = doc.y;

  function drawRow(values: string[], bold = false) {
    let x = startX;

    doc.font(bold ? "NotoSans-Bold" : "NotoSans").fontSize(9);

    values.forEach((value, index) => {
      const width = columns[index].width;

      doc.rect(x, y, width, rowHeight).strokeColor("#D1D5DB").stroke();

      doc.text(value, x + 5, y + 7, {
        width: width - 10,
        align: index === 1 ? "left" : "center",
      });

      x += width;
    });

    y += rowHeight;
  }

  drawRow(
    columns.map((column) => column.title),
    true,
  );

  for (let index = 0; index < report.rows.length; index++) {
    const student = report.rows[index];

    if (y > 520) {
      doc.addPage();
      y = 40;

      drawRow(
        columns.map((column) => column.title),
        true,
      );
    }

    drawRow([
      String(index + 1),
      student.name,
      student.rollNo,
      String(student.present),
      String(student.absent),
      String(student.pending),
      `${student.attendancePercentage}%`,
    ]);
  }

  doc.end();

  await new Promise<void>((resolve) => {
    doc.on("end", resolve);
  });

  const pdfBuffer = new Uint8Array(
    chunks.reduce<number[]>(
      (result, chunk) => result.concat(Array.from(chunk)),
      [],
    ),
  );

  const monthFileName = report.monthLabel.replace(/\s+/g, "_");

  const classFileName = report.className
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "");

  const filename = `${monthFileName}_${classFileName}_${report.month}.pdf`;

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (
      sessionClaims?.metadata as
        | {
            role?: string;
          }
        | undefined
    )?.role;

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Only administrators can export attendance reports." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const classId = Number(body.classId);
    const month = String(body.month ?? "");
    const format = String(body.format ?? "excel");

    if (!Number.isInteger(classId)) {
      return NextResponse.json({ error: "Invalid class." }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: "Invalid month. Expected YYYY-MM." },
        { status: 400 },
      );
    }

    if (format !== "excel" && format !== "pdf") {
      return NextResponse.json(
        { error: "Invalid report format." },
        { status: 400 },
      );
    }

    const report = await getReportData(classId, month);

    if (format === "excel") {
      return generateExcelReport(report);
    }

    return generatePdfReport(report);
  } catch (error) {
    console.error("Student attendance report error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate attendance report.",
      },
      { status: 500 },
    );
  }
}

async function generateExcelReport(
  report: Awaited<ReturnType<typeof getReportData>>,
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "True Sunshine Preschool";
  workbook.lastModifiedBy = "True Sunshine Preschool";
  workbook.created = new Date();
  workbook.modified = new Date();

  /* ============================================================
     FILE NAME

     Example:
       August_SrKG_2026-08.xlsx
  ============================================================ */

  const monthFileName = report.monthLabel.replace(/\s+/g, "_");

  const classFileName = report.className
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "");

  const filename = `${monthFileName}_${classFileName}_${report.month}.xlsx`;

  /* ============================================================
     COMMON STYLES
  ============================================================ */

  const border = {
    top: { style: "thin" as const, color: { argb: "FFD9E2EC" } },
    left: { style: "thin" as const, color: { argb: "FFD9E2EC" } },
    bottom: { style: "thin" as const, color: { argb: "FFD9E2EC" } },
    right: { style: "thin" as const, color: { argb: "FFD9E2EC" } },
    diagonal: { style: "thin" as const, color: { argb: "FFD9E2EC" } },
  };

  const headerFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFEFF6FF" },
  };

  const presentFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFDCFCE7" },
  };

  const absentFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFFEE2E2" },
  };

  const pendingFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFFEF3C7" },
  };

  const darkFont = {
    name: "Calibri",
    color: { argb: "FF0F172A" },
  };

  const mutedFont = {
    name: "Calibri",
    color: { argb: "FF64748B" },
  };

  /* ============================================================
     SUMMARY SHEET

     Clean dashboard-style monthly attendance summary.
     Detailed student/date attendance is kept in Attendance.
  ============================================================ */

  const summarySheet = workbook.addWorksheet("Summary");

  summarySheet.columns = [
    { key: "a", width: 22 },
    { key: "b", width: 22 },
    { key: "c", width: 22 },
    { key: "d", width: 22 },
    { key: "e", width: 22 },
    { key: "f", width: 22 },
  ];

  const summaryTitleFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFEEF5FF" },
  };

  const infoLabelFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFF1F5F9" },
  };

  const metricLabelFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFF8FAFC" },
  };

  const presentSummaryFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFE2F7E9" },
  };

  const absentSummaryFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFFDE2E2" },
  };

  const pendingSummaryFill = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FFFFF3CD" },
  };

  const summaryDarkFont = {
    name: "Calibri",
    color: { argb: "FF17375E" },
  };

  /* ============================================================
     TITLE
  ============================================================ */

  summarySheet.mergeCells("A1:F1");

  const titleCell = summarySheet.getCell("A1");
  titleCell.value = "TRUE SUNSHINE PRESCHOOL";
  titleCell.font = {
    name: "Calibri",
    bold: true,
    size: 18,
    color: { argb: "FF17375E" },
  };
  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  titleCell.fill = summaryTitleFill;
  titleCell.border = border;
  summarySheet.getRow(1).height = 34;

  /* ============================================================
     SUBTITLE
  ============================================================ */

  summarySheet.mergeCells("A2:F2");

  const subtitleCell = summarySheet.getCell("A2");
  subtitleCell.value = "Monthly Student Attendance Report";
  subtitleCell.font = {
    name: "Calibri",
    bold: true,
    size: 14,
    color: { argb: "FF17375E" },
  };
  subtitleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  summarySheet.getRow(1).height = 34;

  /* ============================================================
     REPORT INFORMATION

     Class          Sr KG
     Academic Year  2026-2027
     Month          August 2026
  ============================================================ */

  const reportInfo = [
    ["Class", report.className],
    ["Academic Year", report.academicYear],
    ["Month", report.monthLabel],
  ];

  for (let index = 0; index < reportInfo.length; index++) {
    const rowNumber = 4 + index;

    summarySheet.mergeCells(`A${rowNumber}:B${rowNumber}`);
    summarySheet.mergeCells(`C${rowNumber}:F${rowNumber}`);

    const labelCell = summarySheet.getCell(`A${rowNumber}`);
    const valueCell = summarySheet.getCell(`C${rowNumber}`);

    labelCell.value = reportInfo[index][0];
    valueCell.value = reportInfo[index][1];

    labelCell.fill = infoLabelFill;
    labelCell.font = {
      ...summaryDarkFont,
      bold: true,
      size: 11,
    };
    valueCell.font = {
      ...summaryDarkFont,
      bold: true,
      size: 11,
    };

    labelCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    valueCell.alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    labelCell.border = border;
    valueCell.border = border;

    summarySheet.getRow(rowNumber).height = 24;
  }

  /* ============================================================
     PRIMARY SUMMARY

     TOTAL STUDENTS | WORKING DAYS | ATTENDANCE RATE
  ============================================================ */

  summarySheet.mergeCells("A8:B8");
  summarySheet.mergeCells("C8:D8");
  summarySheet.mergeCells("E8:F8");

  summarySheet.mergeCells("A9:B10");
  summarySheet.mergeCells("C9:D10");
  summarySheet.mergeCells("E9:F10");

  summarySheet.getCell("A8").value = "TOTAL STUDENTS";
  summarySheet.getCell("C8").value = "WORKING DAYS";
  summarySheet.getCell("E8").value = "ATTENDANCE RATE";

  summarySheet.getCell("A9").value = report.totalStudents;
  summarySheet.getCell("C9").value = report.workingDays;
  summarySheet.getCell("E9").value = `${report.attendancePercentage}%`;

  for (const address of ["A8", "C8", "E8"]) {
    const cell = summarySheet.getCell(address);
    cell.fill = metricLabelFill;
    cell.font = {
      ...summaryDarkFont,
      bold: true,
      size: 11,
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cell.border = border;
  }

  for (const address of ["A9", "C9", "E9"]) {
    const cell = summarySheet.getCell(address);
    cell.font = {
      ...summaryDarkFont,
      bold: true,
      size: 20,
    };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cell.border = border;
  }

  summarySheet.getRow(8).height = 24;
  summarySheet.getRow(9).height = 30;
  summarySheet.getRow(10).height = 30;

  /* ============================================================
     ATTENDANCE STATUS SUMMARY

     PRESENT | ABSENT | PENDING
  ============================================================ */

  summarySheet.mergeCells("A12:B12");
  summarySheet.mergeCells("C12:D12");
  summarySheet.mergeCells("E12:F12");

  summarySheet.mergeCells("A13:B14");
  summarySheet.mergeCells("C13:D14");
  summarySheet.mergeCells("E13:F14");

  summarySheet.getCell("A12").value = "PRESENT";
  summarySheet.getCell("C12").value = "ABSENT";
  summarySheet.getCell("E12").value = "PENDING";

  summarySheet.getCell("A13").value = report.present;
  summarySheet.getCell("C13").value = report.absent;
  summarySheet.getCell("E13").value = report.pending;

  summarySheet.getCell("A12").fill = presentSummaryFill;
  summarySheet.getCell("C12").fill = absentSummaryFill;
  summarySheet.getCell("E12").fill = pendingSummaryFill;

  summarySheet.getCell("A12").font = {
    ...summaryDarkFont,
    bold: true,
    size: 11,
    color: { argb: "FF166534" },
  };
  summarySheet.getCell("C12").font = {
    ...summaryDarkFont,
    bold: true,
    size: 11,
    color: { argb: "FFB91C1C" },
  };
  summarySheet.getCell("E12").font = {
    ...summaryDarkFont,
    bold: true,
    size: 11,
    color: { argb: "FFA16207" },
  };

  for (const address of ["A12", "C12", "E12"]) {
    const cell = summarySheet.getCell(address);
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cell.border = border;
  }

  summarySheet.getCell("A13").fill = presentSummaryFill;
  summarySheet.getCell("C13").fill = absentSummaryFill;
  summarySheet.getCell("E13").fill = pendingSummaryFill;

  summarySheet.getCell("A13").font = {
    ...summaryDarkFont,
    bold: true,
    size: 20,
    color: { argb: "FF166534" },
  };
  summarySheet.getCell("C13").font = {
    ...summaryDarkFont,
    bold: true,
    size: 20,
    color: { argb: "FFB91C1C" },
  };
  summarySheet.getCell("E13").font = {
    ...summaryDarkFont,
    bold: true,
    size: 20,
    color: { argb: "FFA16207" },
  };

  for (const address of ["A13", "C13", "E13"]) {
    const cell = summarySheet.getCell(address);
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    cell.border = border;
  }

  summarySheet.getRow(12).height = 24;
  summarySheet.getRow(13).height = 30;
  summarySheet.getRow(14).height = 30;

  /* ============================================================
     SUMMARY VIEW / PRINT
  ============================================================ */

  summarySheet.views = [
    {
      state: "normal",
      showGridLines: false,
    },
  ];

  summarySheet.pageSetup = {
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    paperSize: 9,
  };

  /* ============================================================
   ATTENDANCE SHEET

   Detailed attendance data only.

   Row 1:
   # | Student | Roll No | Admission No | Present | Absent |
   Pending | Attendance % | Aug 1 | Aug 3 | Aug 4 | ...

   No title rows.
   No school name.
   No academic year row.
   No working-days row.
   No legend.
============================================================ */

  const attendanceSheet = workbook.addWorksheet("Attendance");

  /* ============================================================
   DAILY ATTENDANCE COLUMNS
============================================================ */

  const dailyColumns = report.workingDayKeys.map((dateKey) => ({
    header: formatDateLabel(dateKey),
    key: dateKey,
    width: 11,
  }));

  /* ============================================================
   TABLE COLUMNS
============================================================ */

  attendanceSheet.columns = [
    {
      header: "#",
      key: "index",
      width: 6,
    },
    {
      header: "Student",
      key: "student",
      width: 28,
    },
    {
      header: "Roll No",
      key: "rollNo",
      width: 16,
    },
    {
      header: "Admission No",
      key: "admissionNo",
      width: 20,
    },
    {
      header: "Present",
      key: "present",
      width: 11,
    },
    {
      header: "Absent",
      key: "absent",
      width: 11,
    },
    {
      header: "Pending",
      key: "pending",
      width: 11,
    },
    {
      header: "Attendance %",
      key: "attendancePercentage",
      width: 16,
    },
    ...dailyColumns,
  ];

  /* ============================================================
   HEADER ROW
============================================================ */

  const attendanceHeaderRow = attendanceSheet.getRow(1);

  attendanceHeaderRow.height = 26;

  attendanceHeaderRow.eachCell((cell, columnNumber) => {
    cell.fill = headerFill;

    cell.font = {
      ...darkFont,
      bold: true,
    };

    cell.alignment = {
      horizontal: columnNumber === 2 ? "left" : "center",
      vertical: "middle",
      wrapText: true,
    };

    cell.border = border;
  });

  /* ============================================================
   STUDENT ROWS
============================================================ */

  report.rows.forEach((student, index) => {
    const row = attendanceSheet.addRow({
      index: index + 1,
      student: student.name,
      rollNo: student.rollNo,
      admissionNo: student.admissionNo,
      present: student.present,
      absent: student.absent,
      pending: student.pending,
      attendancePercentage: `${student.attendancePercentage}%`,
      ...student.daily,
    });

    row.height = 23;

    /* ----------------------------------------------------------
     GENERAL CELL FORMATTING
  ---------------------------------------------------------- */

    row.eachCell((cell, columnNumber) => {
      cell.border = border;

      cell.font = {
        ...darkFont,
      };

      cell.alignment = {
        horizontal: columnNumber === 2 ? "left" : "center",
        vertical: "middle",
      };
    });

    /* ----------------------------------------------------------
     STUDENT NAME
  ---------------------------------------------------------- */

    row.getCell(2).font = {
      ...darkFont,
      bold: true,
    };

    /* ----------------------------------------------------------
     PRESENT SUMMARY
  ---------------------------------------------------------- */

    row.getCell(5).fill = presentFill;

    row.getCell(5).font = {
      ...darkFont,
      bold: true,
    };

    /* ----------------------------------------------------------
     ABSENT SUMMARY
  ---------------------------------------------------------- */

    row.getCell(6).fill = absentFill;

    row.getCell(6).font = {
      ...darkFont,
      bold: true,
    };

    /* ----------------------------------------------------------
     PENDING SUMMARY
  ---------------------------------------------------------- */

    row.getCell(7).fill = pendingFill;

    row.getCell(7).font = {
      ...darkFont,
      bold: true,
    };

    /* ----------------------------------------------------------
     ATTENDANCE %
  ---------------------------------------------------------- */

    row.getCell(8).font = {
      ...darkFont,
      bold: true,
    };

    /* ==========================================================
     DAILY ATTENDANCE

     Daily columns begin at column 9.
  ========================================================== */

    report.workingDayKeys.forEach((dateKey, dateIndex) => {
      const columnNumber = 9 + dateIndex;

      const cell = row.getCell(columnNumber);

      const status = student.daily[dateKey];

      if (status === "PRESENT") {
        cell.value = "P";

        cell.fill = presentFill;

        cell.font = {
          ...darkFont,
          bold: true,
        };
      } else if (status === "ABSENT") {
        cell.value = "A";

        cell.fill = absentFill;

        cell.font = {
          ...darkFont,
          bold: true,
        };
      } else {
        cell.value = "—";

        cell.fill = pendingFill;

        cell.font = {
          ...mutedFont,
          bold: true,
        };
      }

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = border;
    });
  });

  /* ============================================================
   FREEZE HEADER + STUDENT INFORMATION COLUMNS
============================================================ */

  attendanceSheet.views = [
    {
      state: "frozen",

      // Keep header row visible
      ySplit: 1,

      // Keep #, Student, Roll No and Admission No visible
      xSplit: 4,

      showGridLines: false,
    },
  ];

  /* ============================================================
   FILTER
============================================================ */

  const lastAttendanceColumn = 8 + report.workingDayKeys.length;

  const lastAttendanceColumnLetter = getExcelColumnLetter(lastAttendanceColumn);

  attendanceSheet.autoFilter = {
    from: "A1",
    to: `${lastAttendanceColumnLetter}1`,
  };

  /* ============================================================
   PRINT SETTINGS
============================================================ */

  attendanceSheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
  };

  /* ============================================================
   WRITE WORKBOOK
============================================================ */

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });

  /* ============================================================
   EXCEL COLUMN LETTER HELPER
============================================================ */

  function getExcelColumnLetter(columnNumber: number): string {
    let result = "";
    let number = columnNumber;

    while (number > 0) {
      const remainder = (number - 1) % 26;

      result = String.fromCharCode(65 + remainder) + result;

      number = Math.floor((number - 1) / 26);
    }

    return result;
  }
}
