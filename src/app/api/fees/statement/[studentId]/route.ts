import { auth } from "@/lib/auth";
import { statementPdf } from "@/lib/feePdf";
import { canViewAccount, getAccount } from "@/lib/fees";
import { getSettings } from "@/lib/schoolSettings";

// A learner's statement as PDF, for the learner, their parent or an admin
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { userId, role } = await auth();
  if (!userId) return new Response("Please sign in.", { status: 401 });

  const { studentId } = await params;
  const account = (await canViewAccount(role, userId, studentId)) ? await getAccount(studentId) : null;
  if (!account) return new Response("Not found.", { status: 404 });

  const pdf = await statementPdf(account, await getSettings());
  const name = `Statement ${account.student.studentNumber ?? account.student.surname} ${new Date().toISOString().slice(0, 10)}.pdf`;
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
