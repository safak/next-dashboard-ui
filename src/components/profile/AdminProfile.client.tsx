"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  CircleUserRound,
  KeyRound,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

type AdminProfileProps = {
  admin: {
    id: string;
    username: string;
    img: string | null;
    lastActiveAt: Date | null;
  };
  editSlot: React.ReactNode;
};

const privileges = [
  "Manage Teachers & Students",
  "Publish Announcements",
  "View Reports",
  "Configure Classes & Subjects",
  "Manage Fees",
  "System Configuration",
];

export default function AdminProfileClient({
  admin,
  editSlot,
}: AdminProfileProps) {
  const initials = admin.username.slice(0, 2).toUpperCase();
  const { openUserProfile } = useClerk();

  return (
    <div className="w-full px-4 py-4 sm:px-1 lg:py-1">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account information and profile settings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col items-center px-6 py-8 text-center">
              <div className="relative">
                {admin.img ? (
                  <Image
                    src={admin.img}
                    alt="Profile"
                    width={104}
                    height={104}
                    className="h-26 w-26 rounded-full object-cover ring-4 ring-slate-50"
                  />
                ) : (
                  <div className="flex h-26 w-26 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-700 ring-4 ring-slate-50">
                    {initials}
                  </div>
                )}

                <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {admin.username}
              </h2>

              <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                System Administrator
              </span>

              {admin.lastActiveAt ? (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Last active{" "}
                  {formatDistanceToNow(admin.lastActiveAt, {
                    addSuffix: true,
                  })}
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active now
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/80">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Account Status
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Your account is active
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <CircleUserRound className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Account Information
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Your account details
                    </p>
                  </div>
                </div>

                {editSlot}
              </div>

              <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Role
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-slate-800">
                    Admin
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Username
                  </p>

                  <p className="mt-1.5 break-all text-sm font-semibold text-slate-800">
                    {admin.username}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    User ID
                  </p>

                  <p className="mt-1.5 break-all text-sm font-medium text-slate-700">
                    {admin.id}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Access
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-slate-800">
                    Full System Access
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <UserCog className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Administrative Privileges
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Permissions available to your administrator account
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 px-5 py-5 sm:grid-cols-2 sm:px-6">
                {privileges.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />

                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <KeyRound className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Account Security
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Manage your password and authentication settings
                  </p>
                </div>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Manage account
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Update your password and manage your account security.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openUserProfile()}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Manage Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
