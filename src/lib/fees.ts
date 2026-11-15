import "server-only";
import { FeeRate, LessonFormat, Prisma } from "@prisma/client";
import prisma from "./prisma";

// ---------- Rates

// A subject's own rate wins; otherwise the school-wide default for that
// lesson type
export const rateFor = (
  rates: Pick<FeeRate, "subjectId" | "format" | "monthlyAmount">[],
  subjectId: number,
  format: LessonFormat
) =>
  rates.find((r) => r.subjectId === subjectId && r.format === format)?.monthlyAmount ??
  rates.find((r) => r.subjectId === null && r.format === format)?.monthlyAmount ??
  null;

// ---------- Periods and dates

export const periodOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const periodLabel = (period: string) => {
  const [y, m] = period.split("-").map(Number);
  return new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric" }).format(
    new Date(y, m - 1, 1)
  );
};

// The due day of the period's month, capped for short months
export const dueDateFor = (period: string, dueDay: number) => {
  const [y, m] = period.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  return new Date(y, m - 1, Math.min(Math.max(dueDay, 1), lastDay), 23, 59, 59);
};

// ---------- Invoice numbers (INV-2026-0001), shared sequence per year

export const invoiceNumbers = async (tx: Prisma.TransactionClient) => {
  const prefix = `INV-${new Date().getFullYear()}-`;
  const last = await tx.invoice.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  let n = last ? parseInt(last.number.slice(prefix.length)) || 0 : 0;
  return () => `${prefix}${String(++n).padStart(4, "0")}`;
};

// ---------- Balances

export type InvoiceStatus = "PAID" | "PART_PAID" | "UNPAID" | "OVERDUE";

// Payments settle the invoices that fell due first
export const allocatePayments = <
  T extends { id: number; total: number; issueDate: Date; dueDate: Date }
>(
  invoices: T[],
  paidTotal: number,
  now = new Date()
) => {
  let remaining = paidTotal;
  const oldestFirst = [...invoices].sort(
    (a, b) =>
      a.dueDate.getTime() - b.dueDate.getTime() ||
      a.issueDate.getTime() - b.issueDate.getTime() ||
      a.id - b.id
  );
  const result = new Map<number, { paid: number; outstanding: number; status: InvoiceStatus }>();
  for (const inv of oldestFirst) {
    const paid = Math.min(inv.total, Math.max(remaining, 0));
    remaining -= paid;
    const outstanding = inv.total - paid;
    const status: InvoiceStatus =
      outstanding === 0
        ? "PAID"
        : inv.dueDate < now
        ? "OVERDUE"
        : paid > 0
        ? "PART_PAID"
        : "UNPAID";
    result.set(inv.id, { paid, outstanding, status });
  }
  return result;
};

export const getAccount = async (studentId: string) => {
  const [student, invoices, payments] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        surname: true,
        studentNumber: true,
        address: true,
        parent: { select: { name: true, surname: true, address: true, phone: true, email: true } },
      },
    }),
    prisma.invoice.findMany({
      where: { studentId },
      include: { lines: { orderBy: { id: "asc" } } },
      orderBy: [{ issueDate: "desc" }, { id: "desc" }],
    }),
    prisma.payment.findMany({
      where: { studentId },
      orderBy: [{ paidOn: "desc" }, { id: "desc" }],
    }),
  ]);
  if (!student) return null;

  const invoiced = invoices.reduce((s, i) => s + i.total, 0);
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  const allocation = allocatePayments(invoices, paid);
  const overdue = invoices.reduce(
    (s, i) => s + (allocation.get(i.id)?.status === "OVERDUE" ? allocation.get(i.id)!.outstanding : 0),
    0
  );

  return { student, invoices, payments, allocation, invoiced, paid, balance: invoiced - paid, overdue };
};

// Balances for many learners at once, for the admin overview and dashboards
export const getBalances = async (studentIds?: string[]) => {
  const where = studentIds ? { studentId: { in: studentIds } } : {};
  const [invoices, payments] = await Promise.all([
    prisma.invoice.findMany({
      where,
      select: { id: true, studentId: true, total: true, issueDate: true, dueDate: true },
    }),
    prisma.payment.groupBy({ by: ["studentId"], where, _sum: { amount: true } }),
  ]);
  const paidBy = new Map(payments.map((p) => [p.studentId, p._sum.amount ?? 0]));
  const byStudent = new Map<string, typeof invoices>();
  for (const inv of invoices) {
    byStudent.set(inv.studentId, [...(byStudent.get(inv.studentId) ?? []), inv]);
  }

  const ids = new Set([...byStudent.keys(), ...paidBy.keys()]);
  return new Map(
    [...ids].map((id) => {
      const list = byStudent.get(id) ?? [];
      const paid = paidBy.get(id) ?? 0;
      const allocation = allocatePayments(list, paid);
      const invoiced = list.reduce((s, i) => s + i.total, 0);
      const overdue = list.reduce(
        (s, i) => s + (allocation.get(i.id)!.status === "OVERDUE" ? allocation.get(i.id)!.outstanding : 0),
        0
      );
      return [id, { invoiced, paid, balance: invoiced - paid, overdue }];
    })
  );
};

// ---------- Access

// Admins see every account; a parent their children's; a learner their own
export const canViewAccount = async (
  role: string | undefined,
  userId: string | null,
  studentId: string
) => {
  if (!userId) return false;
  if (role === "admin") return true;
  if (role === "student") return userId === studentId;
  if (role === "parent") {
    return (await prisma.student.count({ where: { id: studentId, parentId: userId } })) > 0;
  }
  return false;
};
