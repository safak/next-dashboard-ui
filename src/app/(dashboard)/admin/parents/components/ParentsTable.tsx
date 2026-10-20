"use client";

import { Mail, MoreVertical, Phone, UserRound, Users } from "lucide-react";

import ParentRowActions from "./ParentRowActions";
import type { ParentRow } from "./types";

interface ParentsTableProps {
  parents: ParentRow[];
  onEdit: (parent: ParentRow) => void;
  onDelete: (parent: ParentRow) => void;
  onView: (parent: ParentRow) => void;
}

export default function ParentsTable({
  parents,
  onEdit,
  onDelete,
  onView,
}: ParentsTableProps) {
  const getParentInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) ?? ""}${surname?.charAt(0) ?? ""}`.toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Parent
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Contact
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Address
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {parents.map((parent) => {
              const studentCount = parent._count.students;

              return (
                <tr
                  key={parent.id}
                  className="
                    group
                    border-b
                    border-slate-100
                    last:border-b-0
                    transition-colors
                    duration-150
                    hover:bg-indigo-50/30
                  "
                >
                  {/* Parent */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          bg-indigo-50
                          text-[10px]
                          font-bold
                          text-indigo-700
                          transition-transform
                          duration-150
                          group-hover:scale-105
                        "
                      >
                        <UserRound className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                          {parent.name} {parent.surname}
                        </p>

                        <p className="truncate text-[11px] leading-4 text-slate-400">
                          @{parent.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}

                  <td className="px-5 py-2.5">
                    <div className="space-y-0.5">
                      {parent.email && (
                        <div className="flex max-w-[240px] items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                          <span className="truncate text-xs font-medium text-slate-700">
                            {parent.email}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                        <span className="text-xs text-slate-500">
                          {parent.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Address */}

                  <td className="px-5 py-2.5">
                    <div className="max-w-[260px]">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {parent.address || "—"}
                      </p>
                    </div>
                  </td>

                  {/* Students */}

                  <td className="px-5 py-2.5 text-center">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-blue-50
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-blue-700
                      "
                    >
                      <Users className="h-3.5 w-3.5" />

                      <span>{studentCount}</span>
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-5 py-2.5 text-center">
                    <div className="flex justify-center">
                      <ParentRowActions
                        parent={parent}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Empty table state */}

            {parents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No parents found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no parent records to display.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
