"use client";

import Image from "next/image";
import {
  User,
  Users,
  Phone,
  Mail,
  Home,
  Calendar,
  Droplets,
  GraduationCap,
} from "lucide-react";

import { AdmissionDetails } from "@/services/admissions.service";

interface Props {
  admission: AdmissionDetails;
}

export default function StudentSummary({ admission }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Student Profile */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {admission.student.img ? (
            <Image
              src={admission.student.img}
              alt={admission.student.fullName}
              width={120}
              height={120}
              className="h-32 w-32 rounded-2xl border object-cover shadow"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-100">
              <User className="h-12 w-12 text-slate-400" />
            </div>
          )}

          <h2 className="mt-5 text-xl font-bold">
            {admission.student.fullName}
          </h2>

          <p className="mt-1 text-slate-500">
            {admission.class.name}
          </p>

          <span className="mt-4 rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
            {admission.status}
          </span>
        </div>
      </div>

      {/* Student Information */}

      <InfoCard
        title="Student Information"
        icon={<GraduationCap className="h-5 w-5 text-sky-600" />}
      >
        <InfoItem
          icon={<Calendar className="h-4 w-4" />}
          label="Date of Birth"
          value={
            admission.student.birthday
              ? new Date(admission.student.birthday).toLocaleDateString()
              : "-"
          }
        />

        <InfoItem
          icon={<Droplets className="h-4 w-4" />}
          label="Blood Group"
          value={admission.student.bloodType}
        />

        <InfoItem
          icon={<User className="h-4 w-4" />}
          label="Gender"
          value={admission.student.sex}
        />

        <InfoItem
          icon={<GraduationCap className="h-4 w-4" />}
          label="Class"
          value={admission.class.name}
        />
      </InfoCard>

      {/* Parent Information */}

      <InfoCard
        title="Parent Information"
        icon={<Users className="h-5 w-5 text-sky-600" />}
      >
        <InfoItem
          icon={<Users className="h-4 w-4" />}
          label="Parent Name"
          value={admission.parent.fullName}
        />

        <InfoItem
          icon={<Phone className="h-4 w-4" />}
          label="Phone"
          value={admission.parent.phone}
        />

        <InfoItem
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          value={admission.parent.email || "-"}
        />

        <InfoItem
          icon={<Home className="h-4 w-4" />}
          label="Address"
          value={admission.parent.address}
        />
      </InfoCard>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-4">
        {icon}

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>
      </div>

      <div className="space-y-5 p-5">
        {children}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-400">
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-medium text-slate-900 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}