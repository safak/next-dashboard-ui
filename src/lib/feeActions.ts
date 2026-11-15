"use server";

import { revalidatePath } from "next/cache";
import { auth } from "./auth";
import { dueDateFor, invoiceNumbers, periodLabel, rateFor } from "./fees";
import {
  feeRatesSchema,
  FeeRatesSchema,
  feeSettingsSchema,
  FeeSettingsSchema,
  paymentSchema,
  PaymentSchema,
} from "./formValidationSchemas";
import { parseRandToCents } from "./money";
import prisma from "./prisma";
import { getSettings } from "./schoolSettings";
import { formatLabels } from "./subjectDelivery";

type State = { success: boolean; error: boolean; message?: string };

const fail = (message: string): State => ({ success: false, error: true, message });
const NOT_ALLOWED = fail("You are not allowed to do this.");

const adminId = async () => {
  const { userId, role } = await auth();
  return role === "admin" ? userId : null;
};

const refresh = () => revalidatePath("/list/fees", "layout");

// ---------- Monthly invoices

export const generateMonthlyInvoices = async (
  _state: State,
  input: { period: string }
): Promise<State> => {
  const createdById = await adminId();
  if (!createdById) return NOT_ALLOWED;

  const period = String(input.period ?? "");
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) return fail("Choose a month.");

  const [settings, rates, learners, alreadyBilled, withoutSubjects] = await Promise.all([
    getSettings(),
    prisma.feeRate.findMany(),
    prisma.student.findMany({
      where: { subjects: { some: {} } },
      select: {
        id: true,
        parentId: true,
        createdAt: true,
        subjects: {
          select: { subjectId: true, format: true, subject: { select: { name: true } } },
          orderBy: { subject: { name: "asc" } },
        },
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    }),
    prisma.invoice.findMany({
      where: { kind: "MONTHLY", period },
      select: { studentId: true },
    }),
    prisma.student.count({ where: { subjects: { none: {} } } }),
  ]);

  // Every subject/lesson type being billed needs a price first
  const missing = new Set<string>();
  for (const l of learners) {
    for (const s of l.subjects) {
      if (rateFor(rates, s.subjectId, s.format) === null) {
        missing.add(`${s.subject.name} (${formatLabels[s.format].toLowerCase()})`);
      }
    }
  }
  if (missing.size > 0) {
    const list = [...missing];
    return fail(
      `Set a monthly fee first for: ${list.slice(0, 6).join(", ")}${
        list.length > 6 ? ` and ${list.length - 6} more` : ""
      }.`
    );
  }

  // The first child of a parent pays full price; younger siblings get the
  // discount (children are ordered by when they joined)
  const siblingRank = new Map<string, number>();
  const seen = new Map<string, number>();
  for (const l of learners) {
    if (!l.parentId) continue;
    const n = seen.get(l.parentId) ?? 0;
    siblingRank.set(l.id, n);
    seen.set(l.parentId, n + 1);
  }

  const billed = new Set(alreadyBilled.map((i) => i.studentId));
  const toBill = learners.filter((l) => !billed.has(l.id));
  const label = periodLabel(period);
  // Invoicing after the month's due day (or for a past month) still gives
  // parents a week, rather than making the invoice overdue at once
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  weekFromNow.setHours(23, 59, 59, 0);
  const monthDue = dueDateFor(period, settings.paymentDueDay);
  const dueDate = monthDue > weekFromNow ? monthDue : weekFromNow;
  const pct = settings.siblingDiscountPercent;

  await prisma.$transaction(
    async (tx) => {
      const nextNumber = await invoiceNumbers(tx);
      for (const l of toBill) {
        const lines = l.subjects.map((s) => ({
          description: `${s.subject.name} – ${formatLabels[s.format]} (${label})`,
          amount: rateFor(rates, s.subjectId, s.format)!,
        }));
        const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
        if (pct > 0 && (siblingRank.get(l.id) ?? 0) > 0 && subtotal > 0) {
          lines.push({
            description: `Sibling discount (${pct}%)`,
            amount: -Math.round((subtotal * pct) / 100),
          });
        }
        await tx.invoice.create({
          data: {
            number: nextNumber(),
            studentId: l.id,
            kind: "MONTHLY",
            period,
            dueDate,
            total: lines.reduce((sum, line) => sum + line.amount, 0),
            createdById,
            lines: { create: lines },
          },
        });
      }
    },
    { timeout: 60_000 }
  );

  refresh();
  const parts = [
    `Created ${toBill.length} invoice${toBill.length === 1 ? "" : "s"} for ${label}.`,
    billed.size > 0 && `${billed.size} learner${billed.size === 1 ? " was" : "s were"} already invoiced.`,
    withoutSubjects > 0 &&
      `${withoutSubjects} learner${withoutSubjects === 1 ? " has" : "s have"} no subjects, so weren't billed.`,
  ].filter(Boolean);
  return { success: true, error: false, message: parts.join(" ") };
};

export const deleteInvoice = async (_state: State, formData: FormData): Promise<State> => {
  if (!(await adminId())) return NOT_ALLOWED;
  const id = parseInt(String(formData.get("id")));
  const { count } = await prisma.invoice.deleteMany({ where: { id } });
  if (!count) return fail("That invoice no longer exists.");
  refresh();
  return { success: true, error: false };
};

// ---------- Payments

export const recordPayment = async (_state: State, data: PaymentSchema): Promise<State> => {
  const recordedById = await adminId();
  if (!recordedById) return NOT_ALLOWED;

  const parsed = paymentSchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the payment.");
  const d = parsed.data;

  const amount = parseRandToCents(d.amount);
  if (!amount) return fail("Enter an amount greater than zero.");
  if (!(await prisma.student.count({ where: { id: d.studentId } }))) {
    return fail("Learner not found.");
  }

  await prisma.payment.create({
    data: {
      studentId: d.studentId,
      amount,
      paidOn: d.paidOn,
      method: d.method,
      reference: d.reference || null,
      recordedById,
    },
  });
  refresh();
  return { success: true, error: false };
};

export const deletePayment = async (_state: State, formData: FormData): Promise<State> => {
  if (!(await adminId())) return NOT_ALLOWED;
  const id = parseInt(String(formData.get("id")));
  const { count } = await prisma.payment.deleteMany({ where: { id } });
  if (!count) return fail("That payment no longer exists.");
  refresh();
  return { success: true, error: false };
};

// ---------- Settings and rates

export const updateFeeSettings = async (
  _state: State,
  data: FeeSettingsSchema
): Promise<State> => {
  if (!(await adminId())) return NOT_ALLOWED;
  const parsed = feeSettingsSchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the settings.");
  const d = parsed.data;

  const values = {
    registrationFee: d.registrationFee ? parseRandToCents(d.registrationFee) ?? 0 : 0,
    siblingDiscountPercent: d.siblingDiscountPercent,
    paymentDueDay: d.paymentDueDay,
    bankDetails: d.bankDetails || null,
  };
  await prisma.setting.upsert({
    where: { id: 1 },
    update: values,
    create: { id: 1, ...values },
  });
  refresh();
  return { success: true, error: false };
};

export const saveFeeRates = async (_state: State, data: FeeRatesSchema): Promise<State> => {
  if (!(await adminId())) return NOT_ALLOWED;
  const parsed = feeRatesSchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the fees.");

  await prisma.$transaction(async (tx) => {
    for (const r of parsed.data.rates) {
      // findFirst rather than upsert: SQLite treats every empty subjectId
      // (the defaults) as distinct, so the unique key can't match it
      const existing = await tx.feeRate.findFirst({
        where: { subjectId: r.subjectId, format: r.format },
      });
      const amount = r.amount ? parseRandToCents(r.amount) : null;
      if (amount === null) {
        if (existing) await tx.feeRate.delete({ where: { id: existing.id } });
      } else if (existing) {
        await tx.feeRate.update({ where: { id: existing.id }, data: { monthlyAmount: amount } });
      } else {
        await tx.feeRate.create({
          data: { subjectId: r.subjectId, format: r.format, monthlyAmount: amount },
        });
      }
    }
  });
  refresh();
  return { success: true, error: false };
};
