import "server-only";
import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import { getAccount, periodLabel } from "./fees";
import { formatRand } from "./money";

type Account = NonNullable<Awaited<ReturnType<typeof getAccount>>>;
type School = { schoolName: string; bankDetails: string | null };

// The built-in PDF fonts only cover Western European characters
const WIN_ANSI_EXTRAS = "–—‘’“”•…€";
const safe = (text: string) =>
  text
    .replace(/[   ]/g, " ")
    .replace(/./gu, (ch) => (ch.charCodeAt(0) < 256 || WIN_ANSI_EXTRAS.includes(ch) ? ch : "?"));

const date = (d: Date) =>
  new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(d);

const MARGIN = 50;
const GREY = rgb(0.4, 0.4, 0.45);
const LINE = rgb(0.85, 0.85, 0.88);

// A tiny layout helper: writes top to bottom, adding pages as needed
const writer = async () => {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page: PDFPage = doc.addPage([595.28, 841.89]); // A4
  let y = page.getHeight() - MARGIN;
  const width = page.getWidth() - MARGIN * 2;

  const ensure = (space: number) => {
    if (y - space < MARGIN) {
      page = doc.addPage([595.28, 841.89]);
      y = page.getHeight() - MARGIN;
    }
  };
  const text = (
    value: string,
    x: number,
    opts: { size?: number; f?: PDFFont; color?: ReturnType<typeof rgb>; right?: boolean } = {}
  ) => {
    const size = opts.size ?? 10;
    const f = opts.f ?? font;
    const v = safe(value);
    const at = opts.right ? x - f.widthOfTextAtSize(v, size) : x;
    page.drawText(v, { x: MARGIN + at, y, size, font: f, color: opts.color ?? rgb(0.1, 0.1, 0.15) });
  };
  const line = () => {
    page.drawLine({ start: { x: MARGIN, y: y + 4 }, end: { x: MARGIN + width, y: y + 4 }, thickness: 0.6, color: LINE });
  };
  const gap = (h: number) => {
    y -= h;
  };
  return { doc, font, bold, width, ensure, text, line, gap };
};

type W = Awaited<ReturnType<typeof writer>>;

const header = (w: W, school: School, title: string, account: Account) => {
  w.text(school.schoolName, 0, { size: 18, f: w.bold });
  w.text(title, w.width, { size: 18, f: w.bold, right: true, color: rgb(0.3, 0.3, 0.6) });
  w.gap(18);
  w.text(`Date: ${date(new Date())}`, w.width, { right: true, color: GREY });
  w.gap(28);

  const { student } = account;
  const billTo = student.parent ? `${student.parent.name} ${student.parent.surname}` : `${student.name} ${student.surname}`;
  w.text("Bill to", 0, { f: w.bold });
  w.text("Learner", w.width / 2, { f: w.bold });
  w.gap(14);
  w.text(billTo, 0);
  w.text(`${student.name} ${student.surname}`, w.width / 2);
  w.gap(13);
  w.text(student.parent?.address ?? student.address, 0, { color: GREY });
  w.text(`Student number: ${student.studentNumber ?? "-"}`, w.width / 2, { color: GREY });
  w.gap(30);
};

const payTo = (w: W, school: School, account: Account) => {
  w.ensure(90);
  w.gap(10);
  w.text("How to pay", 0, { f: w.bold });
  w.gap(14);
  for (const l of (school.bankDetails ?? "Ask the school office for payment details.").split(/\r?\n/)) {
    w.ensure(14);
    w.text(l, 0);
    w.gap(13);
  }
  w.gap(4);
  w.text(`Use your student number as the payment reference: ${account.student.studentNumber ?? "-"}`, 0, { color: GREY });
};

const COLS = { date: 0, desc: 80, debit: 380, credit: 440, balance: 495 };

// Every invoice and payment in date order with a running balance
export const statementPdf = async (account: Account, school: School) => {
  const w = await writer();
  header(w, school, "STATEMENT", account);

  // By day; on the same day invoices come before payments (so the running
  // balance doesn't dip below zero) and monthly invoices go in month order
  const day = (d: Date) => Math.floor(d.getTime() / 86_400_000);
  const entries = [
    ...account.invoices.map((i) => ({
      at: i.issueDate,
      order: 0,
      sortKey: i.period ?? "",
      desc:
        i.kind === "REGISTRATION"
          ? `Invoice ${i.number} – Registration fee`
          : `Invoice ${i.number} – ${i.period ? periodLabel(i.period) : "Fees"}`,
      debit: i.total,
      credit: 0,
    })),
    ...account.payments.map((p) => ({
      at: p.paidOn,
      order: 1,
      sortKey: "",
      desc: `Payment received${p.reference ? ` (${p.reference})` : ""} – ${p.method}`,
      debit: 0,
      credit: p.amount,
    })),
  ].sort(
    (a, b) =>
      day(a.at) - day(b.at) ||
      a.order - b.order ||
      a.sortKey.localeCompare(b.sortKey) ||
      a.at.getTime() - b.at.getTime()
  );

  w.text("Date", COLS.date, { f: w.bold });
  w.text("Description", COLS.desc, { f: w.bold });
  w.text("Charged", COLS.debit, { f: w.bold, right: true });
  w.text("Paid", COLS.credit, { f: w.bold, right: true });
  w.text("Balance", w.width, { f: w.bold, right: true });
  w.gap(8);
  w.line();
  w.gap(10);

  let balance = 0;
  if (entries.length === 0) {
    w.text("No invoices or payments yet.", COLS.desc, { color: GREY });
    w.gap(16);
  }
  for (const e of entries) {
    w.ensure(16);
    balance += e.debit - e.credit;
    w.text(date(e.at), COLS.date, { size: 9 });
    w.text(e.desc.length > 52 ? e.desc.slice(0, 51) + "…" : e.desc, COLS.desc, { size: 9 });
    if (e.debit) w.text(formatRand(e.debit), COLS.debit, { size: 9, right: true });
    if (e.credit) w.text(formatRand(e.credit), COLS.credit, { size: 9, right: true });
    w.text(formatRand(balance), w.width, { size: 9, right: true });
    w.gap(15);
  }
  w.line();
  w.gap(12);
  w.ensure(40);
  w.text(account.balance < 0 ? "In credit" : "Amount due", COLS.credit - 80, { f: w.bold, size: 12 });
  w.text(formatRand(Math.abs(account.balance)), w.width, { f: w.bold, size: 12, right: true });
  if (account.overdue > 0) {
    w.gap(16);
    w.text(`Overdue: ${formatRand(account.overdue)}`, w.width, { right: true, color: rgb(0.75, 0.1, 0.1) });
  }
  w.gap(10);
  payTo(w, school, account);
  return w.doc.save();
};

export const invoicePdf = async (
  account: Account,
  invoice: Account["invoices"][number],
  school: School
) => {
  const w = await writer();
  header(w, school, "INVOICE", account);
  const status = account.allocation.get(invoice.id)!;

  w.text(`Invoice number: ${invoice.number}`, 0, { f: w.bold });
  w.text(`Issued: ${date(invoice.issueDate)}`, w.width / 2);
  w.gap(14);
  w.text(invoice.period ? `Period: ${periodLabel(invoice.period)}` : "Registration fee", 0);
  w.text(`Due: ${date(invoice.dueDate)}`, w.width / 2, { f: w.bold });
  w.gap(28);

  w.text("Description", 0, { f: w.bold });
  w.text("Amount", w.width, { f: w.bold, right: true });
  w.gap(8);
  w.line();
  w.gap(10);
  for (const l of invoice.lines) {
    w.ensure(16);
    w.text(l.description, 0);
    w.text(formatRand(l.amount), w.width, { right: true });
    w.gap(15);
  }
  w.line();
  w.gap(12);
  const rows: [string, number, boolean][] = [
    ["Total", invoice.total, true],
    ["Paid", status.paid, false],
    ["Amount due", status.outstanding, true],
  ];
  for (const [label, value, strong] of rows) {
    w.text(label, COLS.credit - 40, { f: strong ? w.bold : w.font });
    w.text(formatRand(value), w.width, { f: strong ? w.bold : w.font, right: true });
    w.gap(15);
  }
  if (status.status === "OVERDUE") {
    w.text("This invoice is overdue.", w.width, { right: true, color: rgb(0.75, 0.1, 0.1) });
    w.gap(15);
  }
  payTo(w, school, account);
  return w.doc.save();
};
