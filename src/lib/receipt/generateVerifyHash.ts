import crypto from "crypto";

export function generateVerifyHash(payload: {
  studentFeeId: number;
  totalPaid: number;
  receiptNo: string;
}): string {
  const data = `${payload.studentFeeId}|${payload.totalPaid}|${payload.receiptNo}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function generateFullReportHash(payload: {
  studentId: string;
  overallPaid: number;
  reportNo: string;
}): string {
  const data = `${payload.studentId}|${payload.overallPaid}|${payload.reportNo}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}
