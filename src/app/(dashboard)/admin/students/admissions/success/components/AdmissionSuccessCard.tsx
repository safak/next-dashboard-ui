"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  GraduationCap,
  Hash,
  BadgeCheck,
} from "lucide-react";

import { AdmissionDetails } from "@/services/admissions.service";

interface AdmissionSuccessCardProps {
  admission: AdmissionDetails;
}

export default function AdmissionSuccessCard({
  admission,
}: AdmissionSuccessCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-xl">
      {/* Background Decoration */}

      <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10" />

      <div className="absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-white/5" />

      <div className="relative p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div className="flex items-start gap-5">
            <div className="rounded-full bg-white/20 p-5 backdrop-blur-sm">
              <CheckCircle2 className="h-14 w-14 text-white" />
            </div>

            <div>
              <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
                Admission Completed
              </span>

              <h1 className="mt-4 text-3xl font-bold">
                {admission.student.fullName}
              </h1>

              <p className="mt-2 max-w-xl text-emerald-50">
                The student has been successfully admitted and all admission
                records have been created successfully.
              </p>
            </div>
          </div>

          {/* Status */}

          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />

              <span className="font-semibold">Admission Status</span>
            </div>

            <div className="mt-4 rounded-xl bg-white px-5 py-3 text-center">
              <p className="font-bold text-emerald-700">
                {admission.status}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <StatCard
            icon={<Hash className="h-5 w-5" />}
            label="Admission No"
            value={admission.admissionNo}
          />

          <StatCard
            icon={<Hash className="h-5 w-5" />}
            label="Roll Number"
            value={admission.rollNo}
          />

          <StatCard
            icon={<GraduationCap className="h-5 w-5" />}
            label="Class"
            value={admission.class.name}
          />

          <StatCard
            icon={<Calendar className="h-5 w-5" />}
            label="Academic Year"
            value={admission.academicYear.label}
          />
        </div>

        {/* Bottom */}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/admin/students/admissions/new"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-slate-100"
          >
            New Admission
          </Link>

          <Link
            href={`/admin/students/${admission.id}`}
            className="rounded-xl border border-white/40 px-6 py-3 font-semibold transition hover:bg-white/10"
          >
            View Student Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/15 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-emerald-100">
        {icon}

        {label}
      </div>

      <p className="mt-3 text-lg font-bold">{value}</p>
    </div>
  );
}