"use client";

import {
  BookOpen,
  GraduationCap,
  MoreVertical,
  School,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import TeacherRowActions from "./TeacherRowActions";
import type { TeacherRow } from "./types";

interface TeachersTableProps {
  teachers: TeacherRow[];

  onEdit: (teacher: TeacherRow) => void;
  onDelete: (teacher: TeacherRow) => void;
  onView?: (teacher: TeacherRow) => void;
}

export default function TeachersTable({
  teachers,
  onEdit,
  onDelete,
  onView,
}: TeachersTableProps) {
  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getTeacherInitials = (name?: string, surname?: string) => {
    return `${name?.charAt(0) ?? ""}${surname?.charAt(0) ?? ""}`.toUpperCase();
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          {/* ==================================================
              HEADER
          ================================================== */}

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Teacher
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Contact
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Subjects
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Classes
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Lessons
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
            {teachers.map((teacher) => {
              const fullName = `${teacher.name} ${teacher.surname}`.trim();

              const initials = getTeacherInitials(
                teacher.name,
                teacher.surname,
              );

              const subjectCount = teacher.subjects.length;
              const classCount = teacher.supervisedClasses.length;

              return (
                <tr
                  key={teacher.id}
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
                      TEACHER
                  ================================================== */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar */}

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
                          text-indigo-600
                          transition-transform
                          duration-150
                          group-hover:scale-105
                        "
                      >
                        {teacher.img ? (
                          <Image
                            src={teacher.img}
                            alt={fullName}
                            className="h-full w-full object-cover"
                            width={36}
                            height={36}
                          />
                        ) : (
                          <span className="text-[11px] font-bold">
                            {initials || <UserRound className="h-4 w-4" />}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                          {fullName}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] leading-4 text-slate-400">
                          <UserRound className="h-3 w-3" />

                          <span>@{teacher.username}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* ==================================================
                      CONTACT
                  ================================================== */}

                  <td className="px-5 py-2.5">
                    <div className="min-w-0">
                      <p className="max-w-[230px] truncate text-sm font-medium leading-5 text-slate-900">
                        {teacher.email || "—"}
                      </p>

                      <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
                        {teacher.phone || "No phone number"}
                      </p>
                    </div>
                  </td>

                  {/* ==================================================
                      SUBJECTS
                  ================================================== */}

                  <td className="px-5 py-2.5">
                    {subjectCount === 0 ? (
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-slate-300" />

                        <span className="text-xs text-slate-400">
                          No subjects
                        </span>
                      </div>
                    ) : (
                      <div className="flex max-w-[260px] flex-wrap items-center gap-1">
                        {teacher.subjects.slice(0, 2).map((subject) => (
                          <span
                            key={subject.id}
                            className="
                                inline-flex
                                items-center
                                rounded-md
                                bg-violet-50
                                px-2
                                py-1
                                text-[11px]
                                font-semibold
                                text-violet-700
                              "
                          >
                            {subject.name}
                          </span>
                        ))}

                        {subjectCount > 2 && (
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-md
                              bg-slate-100
                              px-2
                              py-1
                              text-[11px]
                              font-semibold
                              text-slate-600
                            "
                          >
                            +{subjectCount - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* ==================================================
                      CLASSES
                  ================================================== */}

                  <td className="px-5 py-2.5">
                    {classCount === 0 ? (
                      <div className="flex items-center gap-1.5">
                        <School className="h-3.5 w-3.5 text-slate-300" />

                        <span className="text-xs text-slate-400">No class</span>
                      </div>
                    ) : (
                      <div className="flex max-w-[220px] flex-wrap items-center gap-1">
                        {teacher.supervisedClasses.slice(0, 2).map((cls) => (
                          <span
                            key={cls.id}
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-md
                                bg-orange-50
                                px-2
                                py-1
                                text-[11px]
                                font-semibold
                                text-orange-700
                              "
                          >
                            <School className="h-3 w-3" />

                            {cls.name}
                          </span>
                        ))}

                        {classCount > 2 && (
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-md
                              bg-slate-100
                              px-2
                              py-1
                              text-[11px]
                              font-semibold
                              text-slate-600
                            "
                          >
                            +{classCount - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* ==================================================
                      LESSONS
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
                      <GraduationCap className="h-3.5 w-3.5" />

                      <span>{teacher._count.lessons}</span>
                    </div>
                  </td>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <td className="px-5 py-2.5 text-center">
                    <div className="flex justify-center">
                      <TeacherRowActions
                        teacher={teacher}
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

            {teachers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No teachers found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no teacher records to display.
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
