"use client";

import { Pencil, Phone, ShieldCheck, UserRound, Fingerprint } from "lucide-react";
import ProfileLayout from "./ProfileLayout";

type Teacher = {
  id: string;
  name: string;
  surname: string;
  phone?: string | null;
  img?: string | null;
  lastActiveAt?: Date | null;
};

export default function TeacherProfileClient({
  teacher,
  editSlot,
}: {
  teacher: Teacher;
  editSlot: React.ReactNode;
}) {
  const fullName = `${teacher.name} ${teacher.surname}`.trim();

  const initials = `${teacher.name?.[0] ?? ""}${teacher.surname?.[0] ?? ""}`
    .toUpperCase() || "T";

  return (
    <ProfileLayout
      userId={teacher.id}
      img={teacher.img ?? null}
      initials={initials}
      name={fullName}
      roleLabel="Teacher"
      lastActiveAt={teacher.lastActiveAt ?? null}
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7ECF8] text-[#4B517D]">
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                Account Information
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Your registered account details.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#4B517D]">
            {editSlot}
          </div>
        </div>

        <div className="divide-y divide-slate-100 px-4 sm:px-5">
          <Info
            label="Role"
            value="Teacher"
            icon={<ShieldCheck className="h-4 w-4" />}
          />

          <Info
            label="Name"
            value={fullName}
            icon={<UserRound className="h-4 w-4" />}
          />

          <Info
            label="Phone"
            value={teacher.phone || "Not provided"}
            icon={<Phone className="h-4 w-4" />}
          />

          <Info
            label="User ID"
            value={teacher.id}
            icon={<Fingerprint className="h-4 w-4" />}
            mono
          />
        </div>
      </section>
    </ProfileLayout>
  );
}

function Info({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 sm:py-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 break-words text-sm font-semibold text-slate-800 ${
            mono ? "break-all font-mono text-xs font-medium" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}