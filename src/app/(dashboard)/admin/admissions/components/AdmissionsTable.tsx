"use client";

import { CalendarDays, GraduationCap, Phone, UserRound } from "lucide-react";

import AdmissionRowActions from "./AdmissionRowActions";
import type { AdmissionRow } from "./types";

interface AdmissionsTableProps {
  admissions: AdmissionRow[];
  onEdit: (admission: AdmissionRow) => void;
  onDelete: (admission: AdmissionRow) => void;
  onView?: (admission: AdmissionRow) => void;
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

export default function AdmissionsTable({
  admissions,
  onEdit,
  onDelete,
  onView,
}: AdmissionsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Student
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Admission No.
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Class
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Parent
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Contact
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Admission Date
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Status
              </th>

              <th className="w-14 px-4 py-3 text-right text-xs font-semibold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {admissions.map((admission) => {
              const studentName =
                `${admission.name} ${admission.surname}`.trim();

              const parentName = admission.parent
                ? `${admission.parent.name} ${admission.parent.surname}`.trim()
                : "—";

              const parentPhone = admission.parent?.phone;

              return (
                <tr
                  key={admission.id}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <GraduationCap className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">
                          {studentName || "Unnamed Student"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {admission.sex}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
                      {admission.admissionNo}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-medium text-slate-700">
                        {admission.class?.name ?? "—"}
                      </p>

                      {admission.rollNo && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          Roll No. {admission.rollNo}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                      <span className="truncate font-medium text-slate-700">
                        {parentName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {parentPhone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                        <span className="text-sm text-slate-600">
                          {parentPhone}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                      <span className="text-sm text-slate-600">
                        {formatDate(admission.admissionDate)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`
                        inline-flex
                        items-center
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${getStatusClass(admission.status)}
                      `}
                    >
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                      {getStatusLabel(admission.status)}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <AdmissionRowActions
                      admission={admission}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onView={onView}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
