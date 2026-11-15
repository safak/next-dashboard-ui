import { FeeSettingsForm } from "@/components/fees/FeeForms";
import FeeRatesGrid from "@/components/fees/FeeRatesGrid";
import { auth } from "@/lib/auth";
import { centsToInput } from "@/lib/money";
import prisma from "@/lib/prisma";
import { getSettings } from "@/lib/schoolSettings";
import Link from "next/link";
import { notFound } from "next/navigation";

const FeeSettingsPage = async () => {
  const { role } = await auth();
  if (role !== "admin") return notFound();

  const [settings, subjects, rates] = await Promise.all([
    getSettings(),
    prisma.subject.findMany({ select: { id: true, name: true, delivery: true }, orderBy: { name: "asc" } }),
    prisma.feeRate.findMany(),
  ]);

  const initial = Object.fromEntries(
    rates.map((r) => [`${r.subjectId ?? "default"}:${r.format}`, centsToInput(r.monthlyAmount)])
  );
  const rows = [
    { subjectId: null, name: "Default (all subjects)", delivery: null },
    ...subjects.map((s) => ({ subjectId: s.id, name: s.name, delivery: s.delivery })),
  ];

  return (
    <div className="flex-1 m-4 mt-0 flex flex-col gap-4">
      <Link href="/list/fees" className="text-sm text-gray-500 hover:text-gray-700 w-fit">
        ← Back to fees
      </Link>
      <div className="card p-6">
        <h1 className="text-lg font-semibold">Monthly fees</h1>
        <p className="text-sm text-gray-500 mb-4">
          What a learner pays per month for each subject, depending on how it&apos;s taught.
        </p>
        <FeeRatesGrid rows={rows} initial={initial} />
      </div>
      <div className="card p-6">
        <h1 className="text-lg font-semibold mb-4">Other fee settings</h1>
        <FeeSettingsForm
          values={{
            registrationFee: settings.registrationFee ? centsToInput(settings.registrationFee) : "",
            siblingDiscountPercent: settings.siblingDiscountPercent,
            paymentDueDay: settings.paymentDueDay,
            bankDetails: settings.bankDetails ?? "",
          }}
        />
      </div>
    </div>
  );
};

export default FeeSettingsPage;
