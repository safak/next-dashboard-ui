"use client";

import { Phone, User } from "lucide-react";

import { Checkbox } from "@/components/ui/Checkbox";
import StatusBadge from "@/components/ui/StatusBadge";

import AdmissionRowActions from "./AdmissionRowActions";
import EmptyAdmissions from "./EmptyAdmissions";

import { AdmissionStudent } from "@/services/admissions.service";

interface AdmissionTableProps {
  admissions: AdmissionStudent[];

  selectedIds: string[];

  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;

  onView: (admission: AdmissionStudent) => void;
  onEdit: (admission: AdmissionStudent) => void;
  onDelete?: (admission: AdmissionStudent) => void;
}

export default function AdmissionTable({
  admissions,

  selectedIds,

  onSelect,
  onSelectAll,

  onView,
  onEdit,
  onDelete,
}: AdmissionTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="hide-scrollbar overflow-x-auto">
        <table className="min-w-[1500px] border-separate border-spacing-0">
          <thead className="border-b bg-slate-50">
            <tr className="text-left text-xs font-semibold text-slate-600">
              {/* Checkbox */}
              <th className="sticky left-0 z-40 w-12 bg-slate-50 px-4 py-4">
                <Checkbox
                  checked={
                    selectedIds.length === 0
                      ? false
                      : selectedIds.length === admissions.length
                        ? true
                        : "indeterminate"
                  }
                  onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                />
              </th>

              {/* Student */}
              <th className="sticky left-12 z-40 w-[260px] border-r border-slate-200 bg-slate-50 px-4 py-4">
                Student
              </th>

              <th className="w-40 px-4 py-4">Admission No</th>

              <th className="w-32 px-4 py-4">Class</th>

              <th className="w-44 px-4 py-4">Admission Date</th>

              <th className="min-w-[220px] px-4 py-4">Parent</th>

              <th className="w-44 px-4 py-4">Phone</th>

              <th className="w-36 px-4 py-4">Status</th>

              <th className="w-20 px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {admissions.map((admission) => (
              <tr
                key={admission.id}
                className={`group transition hover:bg-slate-50 ${
                  selectedIds.includes(String(admission.id)) ? "bg-blue-50" : ""
                }`}
              >
                {/* Checkbox */}
                <td
                  className={`sticky left-0 z-30 px-4 py-4 ${
                    selectedIds.includes(String(admission.id))
                      ? "bg-blue-50"
                      : "bg-white group-hover:bg-slate-50"
                  }`}
                >
                  <Checkbox
                    checked={selectedIds.includes(String(admission.id))}
                    onCheckedChange={(checked) =>
                      onSelect(String(admission.id), Boolean(checked))
                    }
                  />
                </td>

                {/* Student */}
                <td
                  className={`sticky left-12 z-30 border-r border-slate-200 px-4 py-3 ${
                    selectedIds.includes(String(admission.id))
                      ? "bg-blue-50"
                      : "bg-white group-hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                      {(admission.studentName ?? "S").charAt(0).toUpperCase()}
                    </div>

                    <span className="font-medium">{admission.studentName}</span>
                  </div>
                </td>

                {/* Admission No */}
                <td className="px-4 py-3">{admission.admissionNo}</td>

                {/* Class */}
                <td className="px-4 py-3">{admission.className}</td>

                {/* Applied Date */}
                <td className="px-4 py-3 text-slate-600">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(admission.createdAt))}
                </td>

                {/* Parent */}
                <td className="px-4 py-3">{admission.parentName}</td>

                {/* Phone */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {admission.phone}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge
                    variant={
                      admission.status === "APPROVED"
                        ? "success"
                        : admission.status === "REJECTED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {admission.status}
                  </StatusBadge>
                </td>

                {/* Actions */}
                <td className="px-4 py-2 text-center">
                  <AdmissionRowActions
                    admission={admission}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
