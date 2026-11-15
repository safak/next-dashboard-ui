import { GenerateInvoicesForm } from "@/components/fees/FeeForms";
import { StatCard } from "@/components/fees/FeeStatus";
import ListControls from "@/components/ListControls";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { auth } from "@/lib/auth";
import { getBalances, periodLabel, periodOf } from "@/lib/fees";
import { formatRand } from "@/lib/money";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Link from "next/link";
import { redirect } from "next/navigation";

const FeesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId, role } = await auth();
  if (role === "student") redirect(`/list/fees/${userId}`);
  if (role === "parent") return <ParentFees parentId={userId!} />;

  const { page, search, show } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [students, balances, collected] = await Promise.all([
    prisma.student.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { surname: { contains: search } },
              { studentNumber: { contains: search.toUpperCase() } },
            ],
          }
        : {},
      select: {
        id: true,
        name: true,
        surname: true,
        studentNumber: true,
        parent: { select: { name: true, surname: true } },
        _count: { select: { subjects: true } },
      },
    }),
    getBalances(),
    prisma.payment.aggregate({ where: { paidOn: { gte: monthStart } }, _sum: { amount: true } }),
  ]);

  const zero = { invoiced: 0, paid: 0, balance: 0, overdue: 0 };
  const accounts = students
    .map((s) => ({ ...s, ...(balances.get(s.id) ?? zero) }))
    .filter((a) =>
      show === "overdue" ? a.overdue > 0 : show === "owing" ? a.balance > 0 : true
    )
    // Most overdue first, then most owed, then by name
    .sort(
      (a, b) =>
        b.overdue - a.overdue || b.balance - a.balance || a.surname.localeCompare(b.surname)
    );
  const pageRows = accounts.slice(ITEM_PER_PAGE * (p - 1), ITEM_PER_PAGE * p);

  const all = [...balances.values()];
  const outstanding = all.reduce((s, b) => s + Math.max(b.balance, 0), 0);
  const overdue = all.reduce((s, b) => s + b.overdue, 0);
  const overdueCount = all.filter((b) => b.overdue > 0).length;

  const months = [-1, 0, 1].map((offset) => {
    const value = periodOf(new Date(now.getFullYear(), now.getMonth() + offset, 1));
    return { value, label: periodLabel(value) };
  });

  type Row = (typeof accounts)[number];
  const columns = [
    { header: "Learner", accessor: "name" },
    { header: "Parent", accessor: "parent", className: "hidden md:table-cell" },
    { header: "Balance", accessor: "balance" },
    { header: "Overdue", accessor: "overdue", className: "hidden sm:table-cell" },
    { header: "", accessor: "action" },
  ];
  const renderRow = (a: Row) => (
    <tr key={a.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4">
        <div className="font-semibold">{a.name} {a.surname}</div>
        <p className="text-xs text-gray-500">
          {a.studentNumber ?? "—"}
          {a._count.subjects === 0 && " · no subjects (not billed)"}
        </p>
      </td>
      <td className="hidden md:table-cell">
        {a.parent ? `${a.parent.name} ${a.parent.surname}` : <span className="text-gray-400">—</span>}
      </td>
      <td className={a.balance > 0 ? "font-medium" : a.balance < 0 ? "text-green-700" : "text-gray-400"}>
        {a.balance < 0 ? `${formatRand(-a.balance)} credit` : formatRand(a.balance)}
      </td>
      <td className={`hidden sm:table-cell ${a.overdue > 0 ? "text-red-600 font-medium" : "text-gray-400"}`}>
        {formatRand(a.overdue)}
      </td>
      <td>
        <Link href={`/list/fees/${a.id}`} className="rounded-full bg-lamaSky px-3 py-1 text-xs font-medium hover:brightness-95">
          Account
        </Link>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 m-4 mt-0 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <StatCard label="Outstanding" value={formatRand(outstanding)} />
        <StatCard
          label="Overdue"
          value={formatRand(overdue)}
          tone={overdue > 0 ? "danger" : "default"}
          hint={`${overdueCount} account${overdueCount === 1 ? "" : "s"}`}
        />
        <StatCard
          label={`Received in ${periodLabel(periodOf(now))}`}
          value={formatRand(collected._sum.amount ?? 0)}
          tone="good"
        />
      </div>

      <div className="card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-semibold">Monthly invoices</h2>
          <Link href="/list/fees/settings" className="text-sm text-indigo-600 hover:underline">
            Fee rates &amp; settings →
          </Link>
        </div>
        <GenerateInvoicesForm months={months} />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-lg font-semibold">Accounts</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <ListControls
              filters={[
                {
                  key: "show",
                  label: "Show",
                  options: [
                    { value: "owing", label: "Owing money" },
                    { value: "overdue", label: "Overdue only" },
                  ],
                },
              ]}
            />
          </div>
        </div>
        <Table columns={columns} renderRow={renderRow} data={pageRows} />
        <Pagination page={p} count={accounts.length} />
      </div>
    </div>
  );
};

// Parents see one card per child
const ParentFees = async ({ parentId }: { parentId: string }) => {
  const children = await prisma.student.findMany({
    where: { parentId },
    select: { id: true, name: true, surname: true, studentNumber: true },
    orderBy: { name: "asc" },
  });
  const balances = await getBalances(children.map((c) => c.id));

  return (
    <div className="flex-1 m-4 mt-0 flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Fees</h1>
      {children.length === 0 && (
        <p className="card p-4 text-sm text-gray-500">No children are linked to your account yet.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children.map((c) => {
          const b = balances.get(c.id) ?? { balance: 0, overdue: 0 };
          return (
            <Link key={c.id} href={`/list/fees/${c.id}`} className="card p-5 flex flex-col gap-2 hover:ring-2 hover:ring-indigo-200 transition">
              <span className="font-semibold">{c.name} {c.surname}</span>
              <span className="text-xs text-gray-500">{c.studentNumber}</span>
              <span className="text-sm">
                {b.balance < 0 ? `In credit: ${formatRand(-b.balance)}` : `Balance: ${formatRand(b.balance)}`}
              </span>
              {b.overdue > 0 && (
                <span className="text-sm font-medium text-red-600">Overdue: {formatRand(b.overdue)}</span>
              )}
              <span className="text-sm text-indigo-600">View account →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FeesPage;
