import { FeeDeleteButton, RecordPaymentForm } from "@/components/fees/FeeForms";
import { FeeStatusBadge, StatCard } from "@/components/fees/FeeStatus";
import { auth } from "@/lib/auth";
import { canViewAccount, getAccount, periodLabel } from "@/lib/fees";
import { formatRand } from "@/lib/money";
import Link from "next/link";
import { notFound } from "next/navigation";

const date = (d: Date) =>
  new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(d);

const methodLabels = { EFT: "EFT", CASH: "Cash", CARD: "Card", OTHER: "Other" };

const AccountPage = async ({ params }: { params: Promise<{ studentId: string }> }) => {
  const { studentId } = await params;
  const { userId, role } = await auth();
  if (!(await canViewAccount(role, userId, studentId))) return notFound();

  const account = await getAccount(studentId);
  if (!account) return notFound();
  const { student, invoices, payments, allocation, balance, overdue } = account;
  const isAdmin = role === "admin";

  return (
    <div className="flex-1 m-4 mt-0 flex flex-col gap-4">
      {role !== "student" && (
        <Link href="/list/fees" className="text-sm text-gray-500 hover:text-gray-700 w-fit">
          ← Back to fees
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            {student.name} {student.surname}
          </h1>
          <p className="text-sm text-gray-500">
            Student number {student.studentNumber ?? "—"} — use it as your payment reference
          </p>
        </div>
        <a href={`/api/fees/statement/${student.id}`} className="btn-primary">
          Download statement (PDF)
        </a>
      </div>

      <div className="flex flex-wrap gap-4">
        <StatCard
          label={balance < 0 ? "In credit" : "Balance due"}
          value={formatRand(Math.abs(balance))}
          tone={balance < 0 ? "good" : "default"}
        />
        <StatCard label="Overdue" value={formatRand(overdue)} tone={overdue > 0 ? "danger" : "default"} />
        <StatCard label="Paid to date" value={formatRand(account.paid)} tone="good" />
      </div>

      {overdue > 0 && !isAdmin && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {formatRand(overdue)} is overdue. Please pay as soon as possible, or contact the
          school office if you&apos;ve already paid.
        </p>
      )}

      <div className="card p-4 flex flex-col gap-3">
        <h2 className="text-base font-semibold">Invoices</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-gray-500">No invoices yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-3 font-medium">Invoice</th>
                  <th className="py-2 pr-3 font-medium hidden md:table-cell">Due</th>
                  <th className="py-2 pr-3 font-medium text-right">Amount</th>
                  <th className="py-2 pr-3 font-medium text-right hidden sm:table-cell">Still owed</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const a = allocation.get(inv.id)!;
                  return (
                    <tr key={inv.id} className="border-b border-gray-50 align-top">
                      <td className="py-3 pr-3">
                        <div className="font-medium">{inv.number}</div>
                        <div className="text-xs text-gray-500">
                          {inv.kind === "REGISTRATION" ? "Registration fee" : inv.period && periodLabel(inv.period)}
                          {" · "}issued {date(inv.issueDate)}
                        </div>
                        <ul className="mt-1 text-xs text-gray-500">
                          {inv.lines.map((l) => (
                            <li key={l.id}>
                              {l.description}: {formatRand(l.amount)}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 pr-3 hidden md:table-cell">{date(inv.dueDate)}</td>
                      <td className="py-3 pr-3 text-right">{formatRand(inv.total)}</td>
                      <td className="py-3 pr-3 text-right hidden sm:table-cell">{formatRand(a.outstanding)}</td>
                      <td className="py-3 pr-3"><FeeStatusBadge status={a.status} /></td>
                      <td className="py-3">
                        <div className="flex flex-col items-start gap-1">
                          <a href={`/api/fees/invoice/${inv.id}`} className="text-xs text-indigo-600 hover:underline">
                            PDF
                          </a>
                          {isAdmin && <FeeDeleteButton kind="invoice" id={inv.id} what={inv.number} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card p-4 flex flex-col gap-3">
        <h2 className="text-base font-semibold">Payments</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">No payments recorded yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100">
            {payments.map((pay) => (
              <li key={pay.id} className="py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="w-28 text-gray-500">{date(pay.paidOn)}</span>
                <span className="font-medium text-green-700">{formatRand(pay.amount)}</span>
                <span className="text-gray-500">
                  {methodLabels[pay.method]}
                  {pay.reference && ` · ${pay.reference}`}
                </span>
                {isAdmin && (
                  <span className="ml-auto">
                    <FeeDeleteButton kind="payment" id={pay.id} what={`payment of ${formatRand(pay.amount)}`} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        {isAdmin && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold mb-3">Record a payment</h3>
            <RecordPaymentForm studentId={student.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
