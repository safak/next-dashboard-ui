import RegistrationReview from "@/components/RegistrationReview";
import { getContractTerms } from "@/lib/contract";
import prisma from "@/lib/prisma";
import {
  registrationStatusLabel,
  registrationStatusStyles,
} from "@/lib/registrationStatus";
import { getSettings } from "@/lib/schoolSettings";
import { formatLabels } from "@/lib/subjectDelivery";
import Link from "next/link";
import { notFound } from "next/navigation";

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(d);

const Detail = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-800 whitespace-pre-line">
      {value || <span className="text-gray-400">—</span>}
    </dd>
  </div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="card p-5 flex flex-col gap-4">
    <h2 className="text-base font-semibold">{title}</h2>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</dl>
  </section>
);

const RegistrationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const reg = await prisma.studentRegistration.findUnique({
    where: { id },
    include: {
      grade: true,
      parent: { select: { name: true, surname: true, phone: true } },
      subjects: {
        select: { format: true, subject: { select: { name: true } } },
        orderBy: { subject: { name: "asc" } },
      },
      student: { select: { id: true, class: { select: { name: true } } } },
    },
  });
  if (!reg) return notFound();

  const [classes, { schoolName }] = await Promise.all([
    reg.status === "PENDING"
      ? prisma.class.findMany({
          where: { gradeId: reg.gradeId },
          include: { _count: { select: { students: true } } },
          orderBy: { name: "asc" },
        })
      : [],
    getSettings(),
  ]);

  return (
    <div className="flex-1 p-4 pt-0 flex flex-col gap-4">
      <Link
        href="/list/registrations"
        className="text-sm text-gray-500 hover:text-gray-700 w-fit"
      >
        ← Back to registrations
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">
          {reg.name} {reg.surname}
        </h1>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${registrationStatusStyles[reg.status]}`}
        >
          {registrationStatusLabel(reg.status)}
        </span>
        <span className="font-mono text-sm text-gray-500">{reg.studentNumber}</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 items-start">
        <div className="w-full xl:w-2/3 flex flex-col gap-4">
          <Card title="Personal details">
            <Detail label="Username" value={`@${reg.username}`} />
            <Detail label="Date of birth" value={formatDate(reg.birthday)} />
            <Detail label="Sex" value={registrationStatusLabel(reg.sex)} />
            <Detail label="Blood type" value={reg.bloodType} />
            <Detail label="Phone" value={reg.phone} />
            <Detail label="Email" value={reg.email} />
            <Detail label="Address" value={reg.address} />
          </Card>

          <Card title="School information">
            <Detail label="Enrolling into" value={`Grade ${reg.grade.level}`} />
            <Detail label="Last grade completed" value={reg.lastGradeCompleted} />
            <Detail label="Previous school" value={reg.previousSchool} />
            <div className="sm:col-span-2">
              <Detail
                label="Subjects and lesson types"
                value={
                  <span className="flex flex-wrap gap-1.5 mt-1">
                    {reg.subjects.map((s) => (
                      <span key={s.subject.name} className="rounded-full bg-lamaSkyLight px-2.5 py-0.5 text-xs">
                        {s.subject.name} · {formatLabels[s.format]}
                      </span>
                    ))}
                  </span>
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Detail
                label="Medical conditions, allergies or special needs"
                value={reg.medicalNotes}
              />
            </div>
          </Card>

          <Card title="Parent or guardian">
            <Detail label="Name" value={reg.guardianName} />
            <Detail label="Relationship" value={reg.guardianRelationship} />
            <Detail label="Phone" value={reg.guardianPhone} />
            <Detail label="Email" value={reg.guardianEmail} />
            <Detail
              label="Parent account"
              value={
                reg.parent
                  ? `${reg.parent.name} ${reg.parent.surname} (${reg.parent.phone})`
                  : "No parent has linked to this student yet"
              }
            />
          </Card>

          <section className="card p-5 flex flex-col gap-3">
            <h2 className="text-base font-semibold">Enrolment agreement</h2>
            <p className="text-sm text-gray-600">
              Signed{" "}
              <span className="font-serif italic text-base text-gray-900">
                {reg.contractSignature}
              </span>{" "}
              on {formatDate(reg.contractSignedAt)} · version {reg.contractVersion}
            </p>
            <details className="text-sm text-gray-600">
              <summary className="cursor-pointer text-indigo-600">
                Show agreement text
              </summary>
              <ol className="mt-3 flex flex-col gap-2 list-decimal list-inside">
                {getContractTerms(schoolName).map((t) => (
                  <li key={t.title}>
                    <span className="font-medium text-gray-800">{t.title}.</span>{" "}
                    {t.body}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        </div>

        <div className="w-full xl:w-1/3 flex flex-col gap-4">
          {reg.status === "PENDING" && (
            <RegistrationReview
              id={reg.id}
              classes={classes.map((c) => ({
                id: c.id,
                name: c.name,
                taken: c._count.students,
                capacity: c.capacity,
              }))}
            />
          )}
          {reg.status === "APPROVED" && (
            <div className="card p-5 flex flex-col gap-2 text-sm">
              <p>
                Approved {reg.reviewedAt && formatDate(reg.reviewedAt)}
                {reg.student && ` and placed in class ${reg.student.class.name}`}.
              </p>
              {reg.student && (
                <Link
                  href={`/list/students/${reg.student.id}`}
                  className="text-indigo-600 hover:underline"
                >
                  View student profile →
                </Link>
              )}
            </div>
          )}
          {reg.status === "REJECTED" && (
            <div className="card p-5 flex flex-col gap-2 text-sm">
              <p>Rejected {reg.reviewedAt && formatDate(reg.reviewedAt)}.</p>
              {reg.rejectionReason && (
                <p className="text-gray-600">Reason: {reg.rejectionReason}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
