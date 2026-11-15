import { CtaBand, PageHero, Section } from "@/components/site/SiteBlocks";
import { rateFor } from "@/lib/fees";
import { formatRand } from "@/lib/money";
import prisma from "@/lib/prisma";
import { getSettings } from "@/lib/schoolSettings";
import { deliveryLabels, deliveryStyles, formatLabels, formatsFor } from "@/lib/subjectDelivery";
import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const s = await getSettings();
  return { title: `Subjects · ${s.schoolName}` };
};

const SubjectsPage = async () => {
  const [settings, subjects, rates] = await Promise.all([
    getSettings(),
    prisma.subject.findMany({ select: { id: true, name: true, delivery: true }, orderBy: { name: "asc" } }),
    prisma.feeRate.findMany(),
  ]);
  const showFees = settings.showFeesPublicly && rates.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Subjects"
        title="Subjects and ways to learn"
        intro="For each subject you choose how you'd like to be taught. Some subjects are offered in person only, some online only, and many both."
      />
      <Section>
        {subjects.length === 0 ? (
          <p className="text-gray-500">Subjects will be listed here soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <article key={s.id} className="flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{s.name}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${deliveryStyles[s.delivery]}`}>
                    {deliveryLabels[s.delivery]}
                  </span>
                </div>
                <ul className="mt-4 flex flex-col gap-1.5 text-sm">
                  {formatsFor(s.delivery).map((f) => {
                    const amount = showFees ? rateFor(rates, s.id, f) : null;
                    return (
                      <li key={f} className="flex justify-between gap-3 text-gray-700">
                        <span>{formatLabels[f]}</span>
                        {amount !== null && (
                          <span className="font-medium text-gray-900">{formatRand(amount)}/month</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        )}
        {showFees && settings.registrationFee > 0 && (
          <p className="mt-6 text-sm text-gray-500">
            A once-off registration fee of {formatRand(settings.registrationFee)} applies.
            {settings.siblingDiscountPercent > 0 &&
              ` Brothers and sisters get ${settings.siblingDiscountPercent}% off.`}
          </p>
        )}
      </Section>
      <CtaBand title="Choose your subjects" body="You'll pick subjects and lesson types when you register." />
    </>
  );
};

export default SubjectsPage;
