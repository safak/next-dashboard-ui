import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type ExportMeta = {
  className: string;
  subjectName: string;
  periodLabel: string;
};

// 📌 Informations de l'entreprise
const ENTREPRISE_NAME = "MARGUERITE";
const ENTREPRISE_ID = "01-A-001";

// 📄 Export PDF avec en-tête, pied de page centré et ligne noire
export function exportToPDF(
  data: any[],
  columns: { header: string; accessor: string }[],
  meta?: ExportMeta
) {
  const doc = new jsPDF();
  let y = 10;

  // ✅ EN-TÊTE DU PDF
  if (meta) {
    doc.setFontSize(12);
    doc.text(`Classe : ${meta.className}`, 14, y);
    y += 7;
    doc.text(`Cours  : ${meta.subjectName}`, 14, y);
    y += 7;
    doc.text(`Période : ${meta.periodLabel}`, 14, y);
    y += 10;
  }

  // ✅ Préparation des données du tableau
  const headers = columns.map(col => col.header);
  const rows = data.map(row =>
    columns.map(col => (row[col.accessor] !== undefined ? String(row[col.accessor]) : ""))
  );

  // ✅ TABLEAU + PIED DE PAGE CENTRÉ + LIGNE DE SÉPARATION
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: y,
    styles: { fontSize: 8 },
    didDrawPage: function () {
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();

      // ➖ Ligne noire de séparation
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(14, pageHeight - 25, pageWidth - 14, pageHeight - 25);

      // 📄 Pied de page centré
      const footerLines = [
        `Complexe scolaire ${ENTREPRISE_NAME}`,
        `ID Nat. : ${ENTREPRISE_ID}, A/ mobutu n/45 Q/Sebo C/Mnt-Ngafula marguerite@gmail.com`,
        `Exporté le : ${dateStr} à ${timeStr}`,
      ];

      doc.setFontSize(8);
      footerLines.forEach((line, index) => {
        const textWidth = doc.getTextWidth(line);
        const x = (pageWidth - textWidth) / 2;
        const y = pageHeight - 20 + index * 5;
        doc.text(line, x, y);
      });
    },
  });

  doc.save("notes.pdf");
}

// 📊 Export Excel avec en-tête dans les premières lignes
export function exportToExcel(
  data: any[],
  columns: { header: string; accessor: string }[],
  meta?: ExportMeta
) {
  const exportData = data.map((row) =>
    columns.reduce((acc, col) => {
      const value = row[col.accessor];
      acc[col.header] = value !== undefined ? value : "";
      return acc;
    }, {} as Record<string, any>)
  );

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // ✅ EN-TÊTE DANS EXCEL (au-dessus du tableau)
  if (meta) {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [`Classe : ${meta.className}`],
        [`Cours : ${meta.subjectName}`],
        [`Période : ${meta.periodLabel}`],
        [``],
        [`Complexe scolaire : ${ENTREPRISE_NAME}`],
        [`ID Nat. : ${ENTREPRISE_ID}`] ,
        [`Exporté le : ${dateStr} à ${timeStr}`],
        [``],
      ],
      { origin: "A1" }
    );
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "notes.xlsx");
}
