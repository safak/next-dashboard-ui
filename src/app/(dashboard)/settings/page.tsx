import SettingsForm from "@/components/forms/SettingsForm";
import { getSettings } from "@/lib/schoolSettings";
import { auth } from "@/lib/auth";
import Link from "next/link";

const SettingsPage = async () => {
  const { role } = await auth();
  const settings = await getSettings();

  return (
    <div className="flex-1 m-4 mt-0 flex flex-col gap-4">
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
