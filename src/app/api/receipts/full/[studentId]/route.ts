export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import path from "path";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import SVGtoPDF from "svg-to-pdfkit";
import { readFile } from "fs/promises";
import { generateQrSvg } from "@/lib/receipt/generateQrSvg";
import { generateFullReportHash } from "@/lib/receipt/generateVerifyHash";
import { generateReportNo } from "@/lib/receipt/generateReportNo";

/* ----------------------------------------------
   CONSTANTS
---------------------------------------------- */
const INR = "₹";

/* ----------------------------------------------
   HELPER: LABEL + VALUE (two-column)
---------------------------------------------- */
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

  doc
    .font("Regular")
    .fontSize(10)
    .fillColor("#374151")
    .text(leftLabel, col1LabelX, y);
  doc.font("Bold").fillColor("#000").text(leftValue, col1ValueX, y);

  if (rightLabel) {
    doc.font("Regular").fillColor("#374151").text(rightLabel, col2LabelX, y);
    doc.font("Bold").fillColor("#000").text(rightValue, col2ValueX, y);
  }

  return y + rowHeight;
}

/* ----------------------------------------------
   ROUTE
---------------------------------------------- */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await params;

  /* FETCH DATA */

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      class: true,
      studentFees: {
        include: {
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
      },
    },
  });

  if (!student) {
    return new Response("Student not found", { status: 404 });
  }

  /* FLATTEN PAYMENTS */
  const allPayments = student.studentFees.flatMap((sf) =>
    sf.payments.map((p) => ({
      date: p.paidAt,
      category: sf.plan.feeStructure.title,
      receiptNo: `TS-${new Date(p.paidAt).getFullYear()}-${String(
        p.id,
      ).padStart(3, "0")}`,
      amount: p.amount,
      mode: p.mode,
    })),
  );

  allPayments.sort((a, b) => a.date.getTime() - b.date.getTime());

  const totalFee = student.studentFees.reduce(
    (sum, sf) => sum + sf.totalAmount,
    0,
  );
  const totalPaid = allPayments.reduce((s, p) => s + p.amount, 0);
  const pending = totalFee - totalPaid;

  /* PDF INIT */
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Uint8Array[] = [];
  doc.on("data", (c: Uint8Array) => chunks.push(c));

  /* FONTS */
  const fontRegular = await readFile("public/fonts/NotoSans-Regular.ttf");
  const fontBold = await readFile("public/fonts/NotoSans-Bold.ttf");

  doc.registerFont("Regular", fontRegular);
  doc.registerFont("Bold", fontBold);
  doc.font("Regular");

  /* HEADER + LOGO */
  const headerLeft = 50;
  try {
    const logoPath = path.resolve(process.cwd(), "public", "my_logo.svg");
    const svgContent = await readFile(logoPath, "utf-8");

    SVGtoPDF(doc, svgContent, 70, 40, {
      // X and Y EXACTLY MATCH SINGLE REPORT
      width: 60,
      height: 60,
      preserveAspectRatio: "xMidYMid meet",
    });
  } catch {}

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

  /* TITLE */
  const titleText = "Official Payment Receipt";
  const titleY = doc.y + 20;

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

  //   doc.moveDown(1);

  /* REPORT NUMBER (Correct Sequential Series) */
  const reportSeq = student.studentFees.length + 1;
  const reportNo = generateReportNo(reportSeq);

  /* STUDENT INFO BLOCK */
  let y = doc.y + 10;

  y = labelValueTwoColumn(
    doc,
    "Student Name",
    `${student.name} ${student.surname}`,
    "Class",
    student.class?.name ?? "School-wide",
    y,
  );
  y = labelValueTwoColumn(
    doc,
    "Fee Category",
    "Final",
    "Report No",
    reportNo,
    y,
  );
  y = labelValueTwoColumn(
    doc,
    "Generated On",
    new Intl.DateTimeFormat("en-GB").format(new Date()),
    "",
    "",
    y,
  );

  doc.y = y + 10;

  /* PAYMENT HISTORY */
  doc
    .font("Bold")
    .fontSize(12)
    .text("Payment History", 0, doc.y, { align: "center" });

  const tableStartY = doc.y + 20;
  /* COLUMN POSITIONS */
  const colDate = 40;
  const colCategory = 140;
  const colReceipt = 270;

  const amountRightEdge = 400;
  const amountColWidth = 100;
  const colAmount = amountRightEdge - amountColWidth;

  const colMode = 500;

  /* ---------------------------------------------------
   HEADER BACKGROUND
--------------------------------------------------- */
  const headerTopY = tableStartY;
  const headerHeight = 20;

  doc.save();
  doc.fillColor("#f3f4f6");
  doc.rect(40, headerTopY, 515, headerHeight).fill();
  doc.restore();

  /* ---------------------------------------------------
   NOW DRAW TOP DIVIDER — AFTER BACKGROUND
--------------------------------------------------- */
  doc
    .strokeColor("#d1d5db")
    .lineWidth(1)
    .moveTo(40, headerTopY)
    .lineTo(555, headerTopY)
    .stroke();

  /* ---------------------------------------------------
   HEADER TEXT
--------------------------------------------------- */
  const headerTextY = headerTopY + 4;

  doc
    .font("Bold")
    .fontSize(10)
    .fillColor("#000")
    .text("Date", colDate, headerTextY)
    .text("Fee Category", colCategory, headerTextY)
    .text("Receipt No", colReceipt, headerTextY)
    .text(`Amount (${INR})`, colAmount, headerTextY, {
      width: amountColWidth,
      align: "right",
    })
    .text("Mode", colMode, headerTextY);

  /* ---------------------------------------------------
   BOTTOM DIVIDER BELOW HEADER
--------------------------------------------------- */
  doc
    .strokeColor("#d1d5db")
    .lineWidth(1)
    .moveTo(40, headerTopY + headerHeight)
    .lineTo(555, headerTopY + headerHeight)
    .stroke();

  /* ---------------------------------------------------
   ROW START POSITION
--------------------------------------------------- */
  let rowY = headerTopY + headerHeight + 10;

  doc.font("Regular").fontSize(10).fillColor("#000");

  allPayments.forEach((p) => {
    const formattedDate = new Intl.DateTimeFormat("en-GB").format(p.date);
    const amountValue = p.amount.toLocaleString("en-IN");

    doc.text(formattedDate, colDate, rowY);
    doc.text(p.category, colCategory, rowY);
    doc.text(p.receiptNo, colReceipt, rowY);

    doc.text("₹", colAmount + 60, rowY);

    doc.text(amountValue, colAmount, rowY, {
      width: amountColWidth,
      align: "right",
    });

    doc.text(p.mode, colMode, rowY);

    rowY += 22;
  });

  /* ---------------------------------------------------
   TOP DIVIDER ABOVE TOTAL PAID (always visible)
--------------------------------------------------- */
  const totalTopY = rowY + 8;

  doc
    .strokeColor("#d1d5db")
    .lineWidth(1)
    .moveTo(40, totalTopY)
    .lineTo(555, totalTopY)
    .stroke();

  /* ---------------------------------------------------
   TOTAL PAID BACKGROUND
   SHIFTED DOWN BY 1px so divider stays visible
--------------------------------------------------- */
  const totalRowHeight = 24;
  const totalBgY = totalTopY + 1; // <-- IMPORTANT FIX

  doc.save();
  doc.fillColor("#f3f4f6");
  doc.rect(40, totalBgY, 515, totalRowHeight).fill();
  doc.restore();

  /* ---------------------------------------------------
   TOTAL PAID TEXT (adjusted to match new background Y)
--------------------------------------------------- */
  const totalTextY = totalBgY + 6;

  doc.font("Bold").fontSize(10).fillColor("#000");

  // Label
  doc.text("TOTAL PAID", colReceipt, totalTextY);

  // ₹ symbol
  doc.text("₹", colAmount + 60, totalTextY);

  // Amount
  doc.text(totalPaid.toLocaleString("en-IN"), colAmount, totalTextY, {
    width: amountColWidth,
    align: "right",
  });

  /* ---------------------------------------------------
   BOTTOM DIVIDER
--------------------------------------------------- */
  doc
    .strokeColor("#e5e7eb")
    .lineWidth(1)
    .moveTo(40, totalBgY + totalRowHeight)
    .lineTo(555, totalBgY + totalRowHeight)
    .stroke();

  /* SUMMARY BOX (OVERALL ONLY) */
  const boxX = 350;
  const boxWidth = 200;
  const boxHeight = 95;
  const boxY = rowY + 50;

  doc
    .save()
    .fillColor("#f9fafb")
    .rect(boxX, boxY, boxWidth, boxHeight)
    .fill()
    .restore();

  doc
    .rect(boxX, boxY, boxWidth, boxHeight)
    .strokeColor("#d1d5db")
    .lineWidth(0.8)
    .stroke();

  let sy = boxY + 12;

  doc
    .font("Bold")
    .fontSize(11)
    .text("Overall Summary", boxX + 10, sy);
  sy += 20;

  doc
    .font("Regular")
    .fontSize(10)
    .text("Total Fee:", boxX + 10, sy)
    .text(`₹ ${totalFee.toLocaleString("en-IN")}`, boxX + 110, sy);
  sy += 18;

  doc
    .text("Total Paid:", boxX + 10, sy)
    .text(`₹ ${totalPaid.toLocaleString("en-IN")}`, boxX + 110, sy);
  sy += 18;

  doc
    .font("Bold")
    .text("Pending:", boxX + 10, sy)
    .text(`₹ ${pending.toLocaleString("en-IN")}`, boxX + 110, sy);

  /* QR VERIFICATION */

  // Step 1: Generate verification hash
  const verifyHash = generateFullReportHash({
    studentId: student.id,
    overallPaid: totalPaid,
    reportNo,
  });

  // Step 2: Build verification URL
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-report/${verifyHash}`;

  // Step 3: Generate QR SVG
  let qrSvg = "";
  try {
    qrSvg = await generateQrSvg(verifyUrl);
  } catch (e) {
    console.error("QR generation failed", e);
  }

  /* QR CODE (ABOVE STAMP) */
  if (qrSvg) {
    const qrSize = 90;

    // QR position (same coordinates as single receipt)
    const qrX = doc.page.width - qrSize - 50; // right aligned
    const qrY = 280; // identical vertical position

    // LABEL above the QR (same style)
    doc
      .font("Bold")
      .fontSize(8)
      .fillColor("#6b7280")
      .text("Scan to verify report", qrX - 10, qrY + 355, {
        width: qrSize + 20,
        align: "center",
      });

    // QR render
    doc.save();
    SVGtoPDF(doc, qrSvg, qrX, qrY, {
      width: qrSize,
      preserveAspectRatio: "xMidYMid meet",
    });
    doc.restore();
  }

  /*Stamp */
  try {
    const stampPath = path.resolve(process.cwd(), "public", "stamp.svg");
    const stampSvg = await readFile(stampPath, "utf-8");

    const stampSize = 115; // smaller stamp

    /* Determine Y position above footer */
    const footerY = doc.page.height - 62;
    const rowY = footerY - stampSize - 50; // alignment row for both items

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

  /* FOOTER TEXT */
  const footerY = doc.page.height - 62;

  doc
    .strokeColor("#d1d5db")
    .moveTo(40, footerY - 15)
    .lineTo(555, footerY - 15)
    .stroke();

  doc
    .font("Bold")
    .fontSize(9)
    .text(
      "Authorised by TrueSunshine School Management System",
      0,
      footerY - 35,
      { width: doc.page.width, align: "center" },
    );

  doc
    .font("Regular")
    .fontSize(9)
    .fillColor("#6b7280")
    .text(
      "This report is digitally generated and system authenticated. No physical signature is required.",
      0,
      footerY,
      { width: doc.page.width, align: "center" },
    );

  /* ----------------------------------------------
     MERGE PDF CHUNKS SAFELY
  ---------------------------------------------- */
  doc.end();
  await new Promise<void>((resolve) => doc.on("end", resolve));

  const totalSize = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Uint8Array(totalSize);

  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }

  return new Response(merged, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=full-fee-report-${studentId}.pdf`,
    },
  });
}
