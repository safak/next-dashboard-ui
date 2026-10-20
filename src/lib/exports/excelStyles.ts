import ExcelJS from "exceljs";

export function applyTitle(row: ExcelJS.Row) {
  row.height = 24;

  row.font = {
    bold: true,
    size: 18,
    color: { argb: "1E3A8A" },
  };

  row.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
}

export function applySubTitle(row: ExcelJS.Row) {
  row.height = 18;

  row.font = {
    bold: true,
    size: 12,
    color: { argb: "475569" },
  };

  row.alignment = {
    horizontal: "center",
  };
}

export function applyHeader(row: ExcelJS.Row) {
  row.height = 22;

  row.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFF" },
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "2563EB",
      },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
  });
}

export function applyBody(row: ExcelJS.Row) {
  row.height = 20;

  row.eachCell((cell) => {
    cell.border = {
      top: { style: "thin", color: { argb: "E2E8F0" } },
      left: { style: "thin", color: { argb: "E2E8F0" } },
      right: { style: "thin", color: { argb: "E2E8F0" } },
      bottom: { style: "thin", color: { argb: "E2E8F0" } },
    };

    cell.alignment = {
      vertical: "middle",
    };
  });
}