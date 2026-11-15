import { auth } from "@/lib/auth";
import { invoicePdf } from "@/lib/feePdf";
import { canViewAccount, getAccount } from "@/lib/fees";
import prisma from "@/lib/prisma";
import { getSettings } from "@/lib/schoolSettings";

// One invoice as PDF, for the learner, their parent or an admin
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, role } = await auth();
  if (!userId) return new Response("Please sign in.", { status: 401 });

  const id = parseInt((await params).id);
  const found = Number.isInteger(id)
    ? await prisma.invoice.findUnique({ where: { id }, select: { studentId: true } })
    : null;
  // Same answer for "doesn't exist" and "not yours" so ids can't be probed
  if (!found || !(await canViewAccount(role, userId, found.studentId))) {
    return new Response("Not found.", { status: 404 });
  }

  const account = (await getAccount(found.studentId))!;
  const invoice = account.invoices.find((i) => i.id === id)!;
  const pdf = await invoicePdf(account, invoice, await getSettings());
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
