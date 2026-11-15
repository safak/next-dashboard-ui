import { integrationStatus } from "@/lib/meetings";
import prisma from "@/lib/prisma";
import { getSettings } from "@/lib/schoolSettings";
import Link from "next/link";

// What a newly installed school still needs to configure
const SetupChecklist = async () => {
  const [settings, saved, grades, classes, subjects, taught, teachers, rates] = await Promise.all([
    getSettings(),
    prisma.setting.count(),
    prisma.grade.count(),
    prisma.class.count(),
    prisma.subject.count(),
    prisma.subject.count({ where: { teachers: { some: {} } } }),
    prisma.teacher.count(),
    prisma.feeRate.count(),
  ]);
  const online = integrationStatus();

  const items = [
    { done: saved > 0, label: "School name and academic year saved", href: "/settings" },
    { done: !!settings.logoFile, label: "Logo uploaded", href: "/settings#branding", optional: true },
    { done: !!(settings.contactPhone || settings.contactEmail), label: "Contact details for the website", href: "/settings#website" },
    { done: grades > 0, label: "Grades created", href: "/list/classes" },
    { done: classes > 0, label: "Classes created", href: "/list/classes" },
    { done: subjects > 0, label: "Subjects added, with how each is offered", href: "/list/subjects" },
    { done: teachers > 0, label: "Teachers added", href: "/list/teachers" },
    { done: subjects > 0 && taught === subjects, label: "Every subject has a teacher", href: "/list/subjects" },
    { done: rates > 0, label: "Monthly fees set", href: "/list/fees/settings" },
    { done: !!settings.bankDetails, label: "Banking details for invoices", href: "/list/fees/settings" },
    { done: online.zoom || online.teams, label: "Zoom or Teams connected", href: "/settings#online-classes", optional: true },
  ];
  const required = items.filter((i) => !i.optional);
  const doneCount = required.filter((i) => i.done).length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600">
        {doneCount === required.length
          ? "Everything essential is set up."
          : `${doneCount} of ${required.length} essential steps done.`}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={i.href} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50">
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  i.done ? "bg-green-500 text-white" : "border border-gray-300 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={i.done ? "text-gray-500" : "text-gray-800"}>
                {i.label}
                {i.optional && <span className="text-gray-400"> (optional)</span>}
              </span>
              <span className="sr-only">{i.done ? "done" : "not done"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SetupChecklist;
