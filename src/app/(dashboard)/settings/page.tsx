import SettingsForm from "@/components/forms/SettingsForm";
import { getSettings } from "@/lib/schoolSettings";
import { auth } from "@/lib/auth";
import Link from "next/link";
import IntegrationStatus from "@/components/IntegrationStatus";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { integrationStatus } from "@/lib/meetings";
import SetupChecklist from "@/components/SetupChecklist";
import GradesManager from "@/components/GradesManager";
import { LogoUpload, WebsiteSettingsForm } from "@/components/forms/WebsiteSettingsForm";
import { siteContent, DEFAULT_SETTINGS } from "@/lib/schoolSettings";
import prisma from "@/lib/prisma";
import { ResetRequests, TestEmailForm, type ResetRequestRow } from "@/components/AccountRecoveryAdmin";
import { emailConfigured } from "@/lib/email";

// Open "forgot password" requests, with the person's name and phone on file
const openResetRequests = async (): Promise<ResetRequestRow[]> => {
  const requests = await prisma.passwordResetRequest.findMany({
    where: { handledAt: null },
    include: { user: { select: { id: true, username: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });
  const ids = { where: { id: { in: requests.map((r) => r.userId) } }, select: { id: true, name: true, surname: true, phone: true } };
  const people = new Map(
    (await Promise.all([prisma.teacher.findMany(ids), prisma.student.findMany(ids), prisma.parent.findMany(ids)]))
      .flat()
      .map((p) => [p.id, p])
  );
  return requests.map((r) => {
    const person = people.get(r.userId);
    return {
      id: r.id,
      username: r.user.username,
      role: r.user.role,
      name: person ? `${person.name} ${person.surname}` : r.user.username,
      contact: r.contact,
      phone: person?.phone ?? null,
      requestedAt: new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(r.createdAt),
    };
  });
};

const SettingsPage = async () => {
  const { role } = await auth();
  const settings = await getSettings();
  const builtIn = siteContent({ ...settings, ...DEFAULT_SETTINGS, schoolName: settings.schoolName });
  const resetRequests = role === "admin" ? await openResetRequests() : [];
  const grades =
    role === "admin"
      ? await prisma.grade.findMany({
          orderBy: { level: "asc" },
          include: { _count: { select: { classes: true, students: true } } },
        })
      : [];

  return (
    <div className="flex-1 m-4 mt-0 flex flex-col gap-4">
      {role === "admin" && (
        <div className="card p-6">
          <h1 className="text-lg font-semibold">Setup checklist</h1>
          <p className="text-sm text-gray-500 mb-4">
            What this school still needs before learners and parents can use it.
          </p>
          <SetupChecklist />
        </div>
      )}
      <div className="card p-6">
        <h1 className="text-lg font-semibold">School</h1>
        <p className="text-sm text-gray-500 mb-6">
          {role === "admin"
            ? "Shown in the sidebar and on the dashboard cards."
            : "Only administrators can change these."}
        </p>
        {role === "admin" ? (
          <SettingsForm
            data={{
              schoolName: settings.schoolName,
              academicYear: settings.academicYear,
            }}
          />
        ) : (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 text-sm">
            <dt className="text-gray-500">School name</dt>
            <dd className="font-medium">{settings.schoolName}</dd>
            <dt className="text-gray-500">Academic year</dt>
            <dd className="font-medium">{settings.academicYear}</dd>
          </dl>
        )}
      </div>
      {role === "admin" && (
        <div className="card p-6">
          <h1 className="text-lg font-semibold">Grades</h1>
          <p className="text-sm text-gray-500 mb-4">
            The grades learners can enrol into. Classes belong to a grade.
          </p>
          <GradesManager
            grades={grades.map((g) => ({ id: g.id, level: g.level, inUse: g._count.classes + g._count.students > 0 }))}
          />
        </div>
      )}
      {role === "admin" && (
        <div id="website" className="card p-6 scroll-mt-4">
          <h1 className="text-lg font-semibold">Public website</h1>
          <p className="text-sm text-gray-500 mb-4">
            The wording and contact details on your website.{" "}
            <Link href="/" target="_blank" className="text-indigo-600 hover:underline">View website ↗</Link>
          </p>
          <WebsiteSettingsForm
            defaults={{ tagline: builtIn.tagline, aboutText: builtIn.about, missionText: builtIn.mission }}
            values={{
              tagline: settings.tagline ?? "",
              aboutText: settings.aboutText ?? "",
              missionText: settings.missionText ?? "",
              contactPhone: settings.contactPhone ?? "",
              contactEmail: settings.contactEmail ?? "",
              address: settings.address ?? "",
              whatsapp: settings.whatsapp ?? "",
              officeHours: settings.officeHours ?? "",
              showFeesPublicly: settings.showFeesPublicly,
              brandColor: settings.brandColor,
            }}
          />
        </div>
      )}
      {role === "admin" && (
        <div id="branding" className="card p-6 scroll-mt-4">
          <h1 className="text-lg font-semibold">Logo</h1>
          <p className="text-sm text-gray-500 mb-4">
            Shown on the website, the sign-in page and the dashboard.
          </p>
          <LogoUpload logoUrl={siteContent(settings).logoUrl} custom={!!settings.logoFile} />
        </div>
      )}
      {role === "admin" && (
        <div className="card p-6">
          <h1 id="password-requests" className="text-lg font-semibold scroll-mt-4">Reset a password</h1>
          <p className="text-sm text-gray-500 mb-4">
            For anyone who forgot their password, including other admins. You
            get a temporary password to give them; they choose their own when
            they next sign in. This also lifts a sign-in lockout and switches
            off two-step sign-in, in case they lost access to their email.
            People without an email address who use &quot;Forgot password&quot;
            are listed here.
          </p>
          <ResetRequests requests={resetRequests} />
          <ResetPasswordForm />
        </div>
      )}
      {role === "admin" && (
        <div id="email" className="card p-6 scroll-mt-4">
          <h1 className="text-lg font-semibold">Email</h1>
          <p className="text-sm text-gray-500 mb-4">
            Needed for password reset links and two-step sign-in codes.{" "}
            {emailConfigured() ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Set up
              </span>
            ) : (
              <span className="font-medium text-amber-700">
                Not set up yet: add the SMTP settings to .env (see docs/email-setup.md) and restart the app.
              </span>
            )}
          </p>
          <TestEmailForm />
        </div>
      )}
      {role === "admin" && (
        <div id="online-classes" className="card p-6 scroll-mt-4">
          <h1 className="text-lg font-semibold">Online classes</h1>
          <p className="text-sm text-gray-500 mb-4">
            Connect Zoom and Microsoft Teams so teachers can create meetings
            for lessons and extra classes in one click. Without them,
            teachers can still paste meeting links.
          </p>
          <IntegrationStatus configured={integrationStatus()} />
        </div>
      )}
      <div className="card p-6">
        <h1 className="text-lg font-semibold">Account</h1>
        <p className="text-sm text-gray-500 mb-4">
          Your name, password and profile photo are managed on your profile.
        </p>
        <Link href="/profile" className="btn-primary inline-block">
          Go to profile
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
