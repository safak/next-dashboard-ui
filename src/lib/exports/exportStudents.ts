import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { Student } from "@/types/student";

import {
  applyBody,
  applyHeader,
  applySubTitle,
  applyTitle,
} from "./excelStyles";

export async function exportStudentsToExcel(
  students: Student[],
  academicYear?: string,
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "True Sunshine Montessori School";
  workbook.company = "True Sunshine Montessori School";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Students", {
    properties: {
      defaultRowHeight: 22,
    },
    pageSetup: {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
    },
  });

  // ------------------------------------------------------------------
  // Title
  // ------------------------------------------------------------------

  sheet.mergeCells("A1:K1");
  sheet.getCell("A1").value = "TRUE SUNSHINE MONTESSORI SCHOOL";
  applyTitle(sheet.getRow(1));

  sheet.mergeCells("A2:K2");
  sheet.getCell("A2").value = "Student Register";
  applySubTitle(sheet.getRow(2));

  sheet.mergeCells("A3:K3");
  sheet.getCell("A3").value = `Academic Year : ${
    academicYear ?? "-"
  }        Generated : ${new Date().toLocaleDateString()}`;
  applySubTitle(sheet.getRow(3));

  // ------------------------------------------------------------------
  // Header
  // ------------------------------------------------------------------

  const headerRow = sheet.getRow(5);

  headerRow.values = [
    "Admission No",
    "Roll No",
    "Student Name",
    "Gender",
    "Class",
    "Academic Year",
    "Parent Name",
    "Phone",
    "Email",
    "Blood Group",
    "Status",
  ];

  applyHeader(headerRow);

  // ------------------------------------------------------------------
  // Data
  // ------------------------------------------------------------------

  students.forEach((student) => {
    const row = sheet.addRow([
      student.admissionNo,
      student.rollNo,
      student.fullName,
      student.gender,
      student.className,
      student.academicYear,
      student.parentName,
      student.parentPhone ?? "",
      student.parentEmail ?? "",
      student.bloodType ?? "",
      student.status,
    ]);

    applyBody(row);
  });

  // ------------------------------------------------------------------
  // Auto Filter
  // ------------------------------------------------------------------

  sheet.autoFilter = {
    from: {
      row: 5,
      column: 1,
    },
    to: {
      row: 5,
      column: 11,
    },
  };

  // ------------------------------------------------------------------
  // Freeze Header
  // ------------------------------------------------------------------

  sheet.views = [
    {
      state: "frozen",
      ySplit: 5,
    },
  ];

  // ------------------------------------------------------------------
  // Column Widths
  // ------------------------------------------------------------------

  sheet.columns = [
    { width: 18 },
    { width: 15 },
    { width: 28 },
    { width: 12 },
    { width: 15 },
    { width: 18 },
    { width: 28 },
    { width: 18 },
    { width: 30 },
    { width: 15 },
    { width: 15 },
  ];

  // ------------------------------------------------------------------
  // Alignment
  // ------------------------------------------------------------------

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 5) return;

    row.alignment = {
      vertical: "middle",
    };
  });

  // ------------------------------------------------------------------
  // Download
  // ------------------------------------------------------------------

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `Student_Register_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}