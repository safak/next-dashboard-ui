"use client";

import {
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  IndianRupee,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import type { AdmissionRow } from "./types";

interface AdmissionDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admission: AdmissionRow | null;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getStatusClass(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700";

    case "INACTIVE":
      return "bg-slate-100 text-slate-600";

    case "GRADUATED":
      return "bg-blue-50 text-blue-700";

    case "TRANSFERRED":
      return "bg-amber-50 text-amber-700";

    case "ARCHIVED":
      return "bg-red-50 text-red-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Active";

    case "INACTIVE":
      return "Inactive";

    case "GRADUATED":
      return "Graduated";

    case "TRANSFERRED":
      return "Transferred";

    case "ARCHIVED":
      return "Archived";

    default:
      return status;
  }
}

function getDocumentLabel(type?: string) {
  if (!type) return "Document";

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AdmissionDetailsDrawer({
  open,
  onOpenChange,
  admission,
}: AdmissionDetailsDrawerProps) {
  if (!admission) {
    return null;
  }

  const studentName = `${admission.name} ${admission.surname}`.trim();

  const parentName = admission.parent
    ? `${admission.parent.name} ${admission.parent.surname}`.trim()
    : "Not assigned";

  const totalFees = admission.studentFees.reduce(
    (sum, fee) => sum + Number(fee.totalAmount),
    0,
  );

  const paidFees = admission.studentFees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount),
    0,
  );

  const dueFees = Math.max(totalFees - paidFees, 0);

  const documents = admission.studentDocuments ?? [];

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Admission Details"
      description="View complete admission information."
      width="md"
      icon={<GraduationCap className="h-6 w-6" />}
      footer={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Student Overview */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-bold text-slate-900">
                  {studentName || "Unnamed Student"}
                </h2>

                <span
                  className={`
                    inline-flex
                    items-center
                    rounded-full
                    px-2.5
                    py-1
                    text-[11px]
                    font-semibold
                    ${getStatusClass(admission.status)}
                  `}
                >
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                  {getStatusLabel(admission.status)}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>{admission.admissionNo}</span>

                <span>•</span>

                <span>{admission.class?.name ?? "No Class"}</span>

                <span>•</span>

                <span>
                  {admission.academicYear?.label ?? "No Academic Year"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Admission Information */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Admission Information
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Basic enrollment and academic information.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-indigo-50/70 p-3">
              <p className="text-[11px] font-medium text-slate-500">
                Admission Number
              </p>

              <p className="mt-1 text-sm font-semibold text-indigo-700">
                {admission.admissionNo}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50/70 p-3">
              <p className="text-[11px] font-medium text-slate-500">
                Roll Number
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {admission.rollNo || "—"}
              </p>
            </div>

            <div className="rounded-lg bg-violet-50/70 p-3">
              <p className="text-[11px] font-medium text-slate-500">Class</p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {admission.class?.name ?? "—"}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50/70 p-3">
              <p className="text-[11px] font-medium text-slate-500">
                Academic Year
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {admission.academicYear?.label ?? "—"}
              </p>
            </div>

            <div className="col-span-2 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  Admission Date
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {formatDate(admission.admissionDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Student Information
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Personal and contact information.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-indigo-50/60 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <UserRound className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  Full Name
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {studentName || "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-medium text-slate-500">Gender</p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {admission.sex || "—"}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-[11px] font-medium text-slate-500">
                  Date of Birth
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatDate(admission.birthday)}
                </p>
              </div>
            </div>

            {admission.phone && (
              <div className="flex items-start gap-3 rounded-lg bg-emerald-50/60 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Phone className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Phone
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {admission.phone}
                  </p>
                </div>
              </div>
            )}

            {admission.email && (
              <div className="flex items-start gap-3 rounded-lg bg-blue-50/60 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-500">
                    Email
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                    {admission.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Parent Information */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Parent Information
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Parent linked to this admission.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-violet-50/60 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <UserRound className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-500">Parent</p>

              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {parentName}
              </p>

              {admission.parent?.phone && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  {admission.parent.phone}
                </div>
              )}

              {admission.parent?.email && (
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  {admission.parent.email}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fee Information */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Fee Information
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Admission fee and payment summary.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">Total</p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {formatCurrency(totalFees)}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-[11px] text-slate-500">Paid</p>

              <p className="mt-1 text-sm font-bold text-emerald-700">
                {formatCurrency(paidFees)}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-[11px] text-slate-500">Due</p>

              <p className="mt-1 text-sm font-bold text-amber-700">
                {formatCurrency(dueFees)}
              </p>
            </div>
          </div>

          {admission.studentFees.length > 0 && (
            <div className="mt-3 space-y-2">
              {admission.studentFees.map((fee) => {
                const installmentLabel =
                  fee.installment === "ADMISSION"
                    ? "Admission Fee"
                    : fee.installment === "TERM_1"
                      ? "Term 1"
                      : "Term 2";

                return (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                  >
                    <span className="text-xs font-medium text-slate-600">
                      {installmentLabel}
                    </span>

                    <span className="text-xs font-semibold text-slate-700">
                      {formatCurrency(Number(fee.paidAmount))} /{" "}
                      {formatCurrency(Number(fee.totalAmount))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Documents */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Documents
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Documents submitted for this admission.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>

          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileCheck2 className="h-4 w-4 shrink-0 text-slate-400" />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {getDocumentLabel(document.documentType)}
                      </p>

                      {document.originalFileName && (
                        <p className="truncate text-[10px] text-slate-400">
                          {document.originalFileName}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Uploaded
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 px-3 py-4 text-center">
              <p className="text-xs text-slate-500">No documents uploaded.</p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
