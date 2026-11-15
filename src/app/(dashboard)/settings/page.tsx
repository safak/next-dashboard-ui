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

const SettingsPage = async () => {
  const { role } = await auth();
  const settings = await getSettings();
  const builtIn = siteContent({ ...settings, ...DEFAULT_SETTINGS, schoolName: settings.schoolName });
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
          <h1 className="text-lg font-semibold">Reset a password</h1>
          <p className="text-sm text-gray-500 mb-4">
            For anyone who forgot their password, including other admins. You
            get a temporary password to give them; they choose their own when
            they next sign in. This also lifts a sign-in lockout.
          </p>
          <ResetPasswordForm />
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
