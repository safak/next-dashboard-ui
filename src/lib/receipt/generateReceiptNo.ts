// src/lib/receipt/generateReceiptNo.ts
export function generateReceiptNo(id: number, date = new Date()) {
  const year = date.getFullYear();
  return `TS-${year}-${String(id).padStart(3, "0")}`;
}