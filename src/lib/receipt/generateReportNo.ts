// src/lib/receipt/generateReportNo.ts
export function generateReportNo(id: number, date = new Date()) {
  const year = date.getFullYear();
  return `FR-${year}-${String(id).padStart(3, "0")}`;
}
