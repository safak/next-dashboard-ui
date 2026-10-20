export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import path from "path";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import SVGtoPDF from "svg-to-pdfkit";
import { readFile } from "fs/promises";
import { generateQrSvg } from "@/lib/receipt/generateQrSvg";
import { generateVerifyHash } from "@/lib/receipt/generateVerifyHash";

/* ================= CONSTANTS ================= */
const INR = "₹";

/* ================= UTILITIES ================= */

function generateReceiptNo(id: number, date: Date) {
  const year = date.getFullYear();
  return `TS-${year}-${String(id).padStart(3, "0")}`;
}

/**
 * Draws a perfectly aligned label-value row
 */
function labelValueTwoColumn(
  doc: any,
  leftLabel: string,
  leftValue: string,
  rightLabel: string,
  rightValue: string,
  y: number,
) {
  const col1LabelX = 40;
  const col1ValueX = 150;

  const col2LabelX = 300;
  const col2ValueX = 420;

  const rowHeight = 20;

  // Left Label
  doc
    .font("Regular")
    .fontSize(10)
    .fillColor("#374151")
    .text(leftLabel, col1LabelX, y, { width: 100 });

  // Left Value
  doc
    .font("Bold")
    .fillColor("#000")
    .text(leftValue, col1ValueX, y, { width: 130 });

  // Right Label
  doc
    .font("Regular")
    .fillColor("#374151")
    .text(rightLabel, col2LabelX, y, { width: 100 });

  // Right Value
  doc
    .font("Bold")
    .fillColor("#000")
    .text(rightValue, col2ValueX, y, { width: 130 });

  return y + rowHeight;
}

/* =====================================================
   GET RECEIPT PDF
===================================================== */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ studentFeeId: string }> },
) {
  const { studentFeeId } = await params;
  const feeId = Number(studentFeeId);

  if (Number.isNaN(feeId)) {
    return new Response("Invalid receipt id", { status: 400 });
  }

  /* ================= FETCH DATA ================= */

  const fee = await prisma.studentFee.findUnique({
    where: { id: feeId },
    include: {
      student: true,
      plan: {
        include: {
          feeStructure: {
            include: {
              class: true,
            },
          },
        },
      },
      payments: {
        orderBy: { paidAt: "asc" },
      },
    },
  });

  if (!fee) {
    return new Response("Receipt not found", { status: 404 });
  }

  /* ================= PDF SETUP ================= */
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Uint8Array[] = [];

  doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));

  /* ================= REGISTER FONTS (BUFFER-BASED) ================= */
  const fontRegularPath = path.resolve(
    process.cwd(),
    "public/fonts/NotoSans-Regular.ttf",
  );
  const fontBoldPath = path.resolve(
    process.cwd(),
    "public/fonts/NotoSans-Bold.ttf",
  );

  // ✅ REQUIRED for pdfkit.standalone
  const fontRegularBuffer = await readFile(fontRegularPath);
  const fontBoldBuffer = await readFile(fontBoldPath);

  doc.registerFont("Regular", fontRegularBuffer);
  doc.registerFont("Bold", fontBoldBuffer);

  doc.font("Regular");

  /* ================= HEADER ================= */
  const headerLeft = 50;
  try {
    const logoPath = path.resolve(process.cwd(), "public", "my_logo.svg");
    const svgContent = await readFile(logoPath, "utf-8");

    SVGtoPDF(doc, svgContent, headerLeft + 20, 40, {
      width: 60,
      height: 60,
      preserveAspectRatio: "xMidYMid meet",
    });
  } catch {
    // logo optional
  }

  doc
    .font("Bold")
    .fontSize(18)
    .fillColor("#000000")
    .text("TrueSunshine Educational Society", headerLeft + 120, 45);

  doc
    .font("Bold")
    .fontSize(9)
    .fillColor("#6b7280")
    .text(
      `101 Mohan's Elite Apartments Near Yashodha Hospital, Kothaguda
Hyderabad, Rangareddy District Telangana – 500084
Phone: +91 79895 99833 | Email: truesunshine.playschools@gmail.com`,
      headerLeft + 120,
      68,
    );

  doc
    .moveDown(1)
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .moveTo(40, doc.y)
    .lineTo(555, doc.y)
    .stroke();

  /* ================= TITLE ================= */
  const titleText = "Official Payment Receipt";
  const titleY = doc.y + 20;

  // Title text (centered)
  doc
    .font("Bold")
    .fontSize(15)
    .fillColor("#000000")
    .text(titleText, 0, titleY, { width: doc.page.width, align: "center" });

  // Calculate underline width based on text width
  const textWidth = doc.widthOfString(titleText);
  const underlineY = titleY + 22;

  // Draw underline
  doc
    .strokeColor("#9ca3af")
    .lineWidth(0.75)
    .moveTo((doc.page.width - textWidth) / 2, underlineY)
    .lineTo((doc.page.width + textWidth) / 2, underlineY)
    .stroke();

  // Space after title
  doc.y = underlineY + 14;

  doc.moveDown(1);

  /* ================= STUDENT INFO ================= */
  const receiptNo = generateReceiptNo(fee.id, new Date());

  let infoY = doc.y;

  // Row 1
  infoY = labelValueTwoColumn(
    doc,
    "Student Name",
    `${fee.student.name} ${fee.student.surname}`,
    "Class",
    fee.plan.feeStructure.class?.name ?? "School-wide",
    infoY,
  );

  // Row 2
  infoY = labelValueTwoColumn(
    doc,
    "Fee Category",
    fee.plan.feeStructure.title,
    "Receipt No",
    receiptNo,
    infoY,
  );

  // Row 3
  infoY = labelValueTwoColumn(
    doc,
    "Generated On",
    new Intl.DateTimeFormat("en-GB").format(new Date()),
    "", // no second label
    "", // no value
    infoY,
  );

  doc.y = infoY + 10;

  /* ================= PAYMENT HISTORY ================= */
  const tableStartY = doc.y + 10;

  // COLUMN POSITIONS
  const colDate = 40;
  const colReceipt = 180;

  // FIX: Expand spacing for proper right alignment
  const amountRightEdge = 400; // moved further right
  const amountColWidth = 100;
  const colAmount = amountRightEdge - amountColWidth;

  const colMode = 500; // moved to avoid overlap

  /* Section Title */
  doc
    .font("Bold")
    .fontSize(11)
    .text("Payment History", 0, tableStartY, { align: "center" });

  /* Table Header */
  const headerY = tableStartY + 22;

  doc
    .font("Bold")
    .fontSize(10)
    .fillColor("#000")
    .text("Date", colDate, headerY)
    .text("Receipt No", colReceipt, headerY)
    .text(`Amount (${INR})`, colAmount, headerY, {
      width: amountColWidth,
      align: "right",
    })
    .text("Mode", colMode, headerY);

  /* Header Divider */
  doc
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .moveTo(40, headerY + 14)
    .lineTo(555, headerY + 14)
    .stroke();

  /* Table Rows */
  let rowY = headerY + 26;

  doc.font("Regular").fontSize(10).fillColor("#000");

  fee.payments.forEach((p) => {
    // Date
    doc.text(new Intl.DateTimeFormat("en-GB").format(p.paidAt), colDate, rowY);

    // Row: Receipt No (DYNAMIC)
    const paymentReceiptNo = `${receiptNo}-${p.id}`;
    doc.text(paymentReceiptNo, colReceipt, rowY);

    const amountValue = p.amount.toLocaleString("en-IN");

    // ₹ symbol printed separately to avoid misalignment
    doc.font("Regular").text("₹", colAmount + 60, rowY);

    // numeric part right-aligned perfectly
    doc.text(amountValue, colAmount, rowY, {
      width: amountColWidth,
      align: "right",
    });

    // Mode
    doc.text(p.mode, colMode, rowY);

    rowY += 22;
  });

  /* ================= SUMMARY ================= */
  function summaryRow(
    doc: any,
    label: string,
    amount: number,
    x: number,
    y: number,
    width: number,
    bold = false,
  ) {
    const labelWidth = 90;

    // Two columns for accounting-style alignment
    const symbolWidth = 20; // column for ₹
    const numberWidth = width - labelWidth - symbolWidth - 20;

    // Label
    doc
      .font(bold ? "Bold" : "Regular")
      .fontSize(10)
      .text(label, x, y, { width: labelWidth });

    // Rupee symbol (fixed narrow column)
    doc.font(bold ? "Bold" : "Regular").text("₹", x + labelWidth + 30, y, {
      width: symbolWidth,
      align: "left", // keep symbol aligned vertically
    });

    // Numeric amount (right-aligned perfectly)
    doc.text(
      amount.toLocaleString("en-IN"),
      x + labelWidth + 10 + symbolWidth,
      y,
      {
        width: numberWidth,
        align: "right",
      },
    );

    return y + 18;
  }

  const totalPaid = fee.payments.reduce((s, p) => s + p.amount, 0);
  const pending = fee.totalAmount - totalPaid;

  /* Summary Box aligned with table end */
  const summaryX = 360;
  const summaryY = rowY + 10;
  const summaryWidth = 190;
  const summaryHeight = 95;

  doc
    .save()
    .fillColor("#f9fafb")
    .rect(summaryX, summaryY, summaryWidth, summaryHeight)
    .fill()
    .restore();

  doc
    .rect(summaryX, summaryY, summaryWidth, summaryHeight)
    .strokeColor("#e5e7eb")
    .lineWidth(0.8)
    .stroke();

  // Title
  let sy = summaryY + 12;
  doc
    .font("Bold")
    .fontSize(11)
    .text("Summary", summaryX + 10, sy);
  sy += 20;

  sy = summaryRow(
    doc,
    "Total Fee:",
    fee.totalAmount,
    summaryX + 10,
    sy,
    summaryWidth - 20,
  );

  sy = summaryRow(
    doc,
    "Total Paid:",
    totalPaid,
    summaryX + 10,
    sy,
    summaryWidth - 20,
  );

  sy = summaryRow(
    doc,
    "Pending:",
    pending,
    summaryX + 10,
    sy,
    summaryWidth - 20,
    true, // bold row
  );

  /* ================= QR VERIFICATION ================= */
  // Step 1: Generate verification hash
  const verifyHash = generateVerifyHash({
    studentFeeId: fee.id,
    totalPaid,
    receiptNo,
  });

  // Step 2: Build verification URL (PUBLIC URL)
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-receipt/${verifyHash}`;

  // Step 3: Generate QR SVG
  let qrSvg = "";
  try {
    qrSvg = await generateQrSvg(verifyUrl);
  } catch (e) {
    console.error("QR generation failed", e);
  }

  /* ================= QR CODE (ABOVE STAMP) ================= */
  if (qrSvg) {
    const qrSize = 90;

    // QR position
    const qrX = doc.page.width - qrSize - 50;
    const qrY = 220;

    // LABEL just ABOVE QR
    doc
      .font("Bold")
      .fontSize(8)
      .fillColor("#6b7280")
      .text("Scan to verify receipt", qrX - 10, qrY + 355, {
        width: qrSize + 20,
        align: "center",
      });

    // QR itself
    doc.save();
    SVGtoPDF(doc, qrSvg, qrX, qrY, {
      width: qrSize,
      preserveAspectRatio: "xMidYMid meet",
    });
    doc.restore();
  }

  /* ================= SCHOOL STAMP + SIGNATURE (SIDE-BY-SIDE) ================= */
  try {
    const stampPath = path.resolve(process.cwd(), "public", "stamp.svg");
    const stampSvg = await readFile(stampPath, "utf-8");

    const stampSize = 115; // smaller stamp

    /* Determine Y position above footer */
    const footerY = doc.page.height - 62;
    const rowY = footerY - stampSize - 80; // alignment row for both items

    /* ================= LEFT SIDE: DIGITAL SIGNATURE BLOCK ================= */
    const sigX = 40;
    const sigWidth = 260; // wide enough to hold full text on one line

    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);

    // No wrapping (single line)
    doc
      .font("Regular")
      .fontSize(10)
      .fillColor("#374151")
      .text("Digitally signed by: Ranjith Kumar V", sigX, rowY, {
        width: sigWidth,
        align: "left",
        lineBreak: false,
      });

    doc.text("Role: Chairman & Founder", sigX, rowY + 16, {
      width: sigWidth,
      align: "left",
      lineBreak: false,
    });

    doc.text(`Date: ${formattedDate}`, sigX, rowY + 32, {
      width: sigWidth,
      align: "left",
      lineBreak: false,
    });

    /* ================= RIGHT SIDE: STAMP ================= */
    const stampX = doc.page.width - stampSize - 320; // right aligned margin

    doc.save();
    doc.opacity(0.16);

    doc.rotate(-1, {
      origin: [stampX + stampSize / 2, rowY + stampSize / 2],
    });

    SVGtoPDF(doc, stampSvg, stampX, rowY, {
      width: stampSize,
      height: stampSize,
      preserveAspectRatio: "xMidYMid meet",
    });

    doc.restore();
  } catch (err) {
    console.warn("Stamp render skipped:", err);
  }

  /* ================= FOOTER ================= */
  const footerY = doc.page.height - 62;
  doc
    .font("Bold")
    .fontSize(9)
    .fillColor("#374151")
    .text(
      "Authorised by TrueSunshine School Management System",
      0,
      footerY - 35,
      { width: doc.page.width, align: "center" },
    );

  const footerText =
    "This receipt is digitally generated and system authenticated. No physical signature is required.";

  // Divider line above footer
  doc
    .strokeColor("#e5e7eb")
    .lineWidth(1.5)
    .moveTo(40, footerY - 15)
    .lineTo(doc.page.width - 40, footerY - 15)
    .stroke();

  // Footer text
  doc
    .font("Regular")
    .fontSize(9)
    .fillColor("#6b7280")
    .text(footerText, 0, footerY, {
      width: doc.page.width,
      align: "center",
    });

  doc.end();

  await new Promise<void>((resolve) => doc.on("end", resolve));

  const pdfBytes = new Uint8Array(
    chunks.reduce<number[]>((acc, chunk) => acc.concat(...chunk), []),
  );

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=receipt-${feeId}.pdf`,
    },
  });
}
