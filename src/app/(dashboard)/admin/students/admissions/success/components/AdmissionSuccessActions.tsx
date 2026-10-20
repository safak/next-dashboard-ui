"use client";

import {
  Printer,
  Receipt,
  CreditCard,
  User,
  Plus,
  Download,
} from "lucide-react";

import ActionCard from "./ActionCard";

import { AdmissionDetails } from "@/services/admissions.service";

interface Props {
  admission: AdmissionDetails;
}

export default function QuickActions({
  admission,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h2 className="text-xl font-semibold">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Continue with the next admission activities.
        </p>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
        <ActionCard
          title="Admission Form"
          description="Print the completed admission form."
          href={`/admin/students/${admission.id}/admission-form`}
          icon={<Printer className="h-7 w-7 text-white" />}
          color="bg-sky-600"
        />

        <ActionCard
          title="Fee Receipt"
          description="Print the admission fee receipt."
          href={`/admin/students/${admission.id}/fee-receipt`}
          icon={<Receipt className="h-7 w-7 text-white" />}
          color="bg-emerald-600"
        />

        <ActionCard
          title="Student ID Card"
          description="Generate the student identity card."
          href={`/admin/students/${admission.id}/id-card`}
          icon={<CreditCard className="h-7 w-7 text-white" />}
          color="bg-violet-600"
        />

        <ActionCard
          title="Student Profile"
          description="Open the complete student profile."
          href={`/admin/students/${admission.id}`}
          icon={<User className="h-7 w-7 text-white" />}
          color="bg-amber-500"
        />

        <ActionCard
          title="New Admission"
          description="Register another student."
          href="/admin/students/admissions/new"
          icon={<Plus className="h-7 w-7 text-white" />}
          color="bg-blue-600"
        />

        <ActionCard
          title="Download PDF"
          description="Download admission summary."
          href={`/admin/students/${admission.id}/pdf`}
          icon={<Download className="h-7 w-7 text-white" />}
          color="bg-rose-600"
        />
      </div>
    </div>
  );
}