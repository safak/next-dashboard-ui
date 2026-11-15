import { getBalances } from "@/lib/fees";
import { formatRand } from "@/lib/money";
import prisma from "@/lib/prisma";
import Link from "next/link";

// Dashboard reminder shown only when something is overdue
const OverdueNotice = async ({ role, userId }: { role: "student" | "parent"; userId: string }) => {
  const children =
    role === "parent"
      ? await prisma.student.findMany({
          where: { parentId: userId },
          select: { id: true, name: true },
        })
      : [{ id: userId, name: "" }];
  const balances = await getBalances(children.map((c) => c.id));
  const overdue = children
    .map((c) => ({ ...c, amount: balances.get(c.id)?.overdue ?? 0 }))
    .filter((c) => c.amount > 0);
  if (overdue.length === 0) return null;

  const total = overdue.reduce((s, c) => s + c.amount, 0);
  return (
    <div role="alert" className="rounded-xl bg-red-50 ring-1 ring-red-100 p-4 flex flex-wrap items-center gap-3 justify-between">
      <div className="text-sm text-red-800">
        <p className="font-semibold">{formatRand(total)} in school fees is overdue</p>
        {role === "parent" && overdue.length > 1 && (
          <p className="text-xs mt-0.5">
            {overdue.map((c) => `${c.name}: ${formatRand(c.amount)}`).join(" · ")}
          </p>
        )}
      </div>
      <Link
        href={role === "student" ? `/list/fees/${userId}` : "/list/fees"}
        className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-700"
      >
        View statement
      </Link>
    </div>
  );
};

export default OverdueNotice;
