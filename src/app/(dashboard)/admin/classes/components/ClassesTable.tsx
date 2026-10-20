"use client";

import { Building2, Users, MoreVertical, UserRound } from "lucide-react";

import { Prisma } from "@prisma/client";

import ClassRowActions from "./ClassRowActions";

type ClassRow = Prisma.ClassGetPayload<{
  include: {
    supervisor: {
      select: {
        id: true;
        name: true;
        surname: true;
      };
    };
    _count: {
      select: {
        students: true;
      };
    };
  };
}>;

interface ClassesTableProps {
  classes: ClassRow[];
  onEdit: (cls: ClassRow) => void;
  onDelete: (cls: ClassRow) => void;
  onView: (cls: ClassRow) => void;
}

export default function ClassesTable({
  classes,
  onEdit,
  onDelete,
  onView,
}: ClassesTableProps) {
  const getTeacherInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) ?? ""}${surname?.charAt(0) ?? ""}`.toUpperCase();
  };

  const getCapacityPercentage = (students: number, capacity: number) => {
    if (!capacity) return 0;

    return Math.min(Math.round((students / capacity) * 100), 100);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          {/* ==================================================
              HEADER
          ================================================== */}

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Class
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Class Teacher
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Capacity
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Roll Prefix
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ==================================================
              BODY
          ================================================== */}

          <tbody>
            {classes.map((item) => {
              const studentCount = item._count.students;

              const capacityPercentage = getCapacityPercentage(
                studentCount,
                item.capacity,
              );

              return (
                <tr
                  key={item.id}
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
                  {/* ==================================================
                      CLASS
                  ================================================== */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {/* Class Icon */}
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-indigo-50
                          text-indigo-600
                          transition-transform
                          duration-150
                          group-hover:scale-105
                        "
                      >
                        <Building2 className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ==================================================
                      TEACHER
                  ================================================== */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {/* Teacher Avatar */}
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-purple-100
                          text-[10px]
                          font-bold
                          text-purple-700
                        "
                      >
                        {getTeacherInitials(
                          item.supervisor.name,
                          item.supervisor.surname,
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium leading-5 text-slate-900">
                          {item.supervisor.name} {item.supervisor.surname}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] leading-4 text-slate-400">
                          <UserRound className="h-3 w-3" />
                          <span>Class Supervisor</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ==================================================
                      STUDENTS
                  ================================================== */}

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

                  {/* ==================================================
                      CAPACITY
                  ================================================== */}

                  <td className="px-5 py-2.5">
                    <div className="min-w-[120px] max-w-[155px]">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-700">
                          {studentCount} / {item.capacity}
                        </span>

                        <span className="text-[11px] font-medium text-slate-400">
                          {capacityPercentage}%
                        </span>
                      </div>

                      {/* Capacity Bar */}
                      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-indigo-400
                            transition-all
                            duration-300
                          "
                          style={{
                            width: `${capacityPercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-0.5 text-[10px] leading-3 text-slate-400">
                        {item.capacity} seats
                      </p>
                    </div>
                  </td>

                  {/* ==================================================
                      ROLL PREFIX
                  ================================================== */}

                  <td className="px-5 py-2.5 text-center">
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-md
                        bg-slate-100
                        px-2
                        py-1
                        text-[11px]
                        font-bold
                        tracking-wide
                        text-slate-600
                      "
                    >
                      #{item.rollPrefix}
                    </span>
                  </td>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <td className="px-5 py-2.5 text-center">
                    <div className="flex justify-center">
                      <ClassRowActions
                        item={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* ==================================================
                EMPTY TABLE STATE
            ================================================== */}

            {classes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No classes found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no class records to display.
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
