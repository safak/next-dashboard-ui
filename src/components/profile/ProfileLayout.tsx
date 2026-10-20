import AvatarUploader from "@/components/AvatarUploader";
import ProfileActivityTracker from "@/components/ProfileActivityTracker";
import ConfirmLogout from "@/components/ConfirmLogout";
import { LockKeyhole, LogOut, ShieldCheck } from "lucide-react";

export default function ProfileLayout({
  userId,
  img,
  initials,
  name,
  roleLabel,
  lastActiveAt,
  children,
}: {
  userId: string;
  img?: string | null;
  initials: string;
  name: string;
  roleLabel: string;
  lastActiveAt?: Date | null;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-full w-full max-w-6xl space-y-4 bg-[#F7F8FA] px-3 pb-24 pt-3 sm:px-5 sm:pb-8 sm:pt-5">
      <ProfileActivityTracker userId={userId} />

      <header className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-[#303654] sm:text-xl">
          My Profile
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Manage your personal information and account security.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4B517D] via-[#626991] to-[#F59A23]" />

          <div className="relative flex flex-col items-center gap-3 pt-1">
            <AvatarUploader
              userId={userId}
              img={img}
              initials={initials}
            />

            <div className="w-full text-center">
              <h2 className="break-words text-base font-bold text-slate-800 sm:text-lg">
                {name}
              </h2>

              <span className="mt-2 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-[#4B517D]">
                {roleLabel}
              </span>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active now
              </div>
            </div>
          </div>
        </section>

        <div className="min-w-0 space-y-4">
          {children}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D6] text-[#B87938]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                  Account Security
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Protect and manage your account.
                </p>
              </div>
            </div>

            <div className="space-y-3 p-3 sm:p-4">
              <SecurityItem
                title="Password"
                description="Update your account password."
                icon={<LockKeyhole className="h-4 w-4" />}
              >
                <a
                  href="/user/account"
                  className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#4B517D] transition hover:border-[#4B517D]/30 hover:bg-indigo-50 sm:text-sm"
                >
                  Change Password
                </a>
              </SecurityItem>

              <SecurityItem
                title="Sign out"
                description="Sign out from this device."
                icon={<LogOut className="h-4 w-4" />}
              >
                <ConfirmLogout />
              </SecurityItem>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SecurityItem({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#4B517D] shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}
