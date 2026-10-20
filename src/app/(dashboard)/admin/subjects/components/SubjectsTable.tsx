"use client";

import { BookOpen, Users, UserRound, MoreVertical } from "lucide-react";

import SubjectRowActions from "./SubjectRowActions";

import type { SubjectRow } from "./types";

interface SubjectsTableProps {
  subjects: SubjectRow[];
  onEdit: (subject: SubjectRow) => void;
  onDelete: (subject: SubjectRow) => void;
  onView?: (subject: SubjectRow) => void;
}

export default function SubjectsTable({
  subjects,
  onEdit,
  onDelete,
  onView,
}: SubjectsTableProps) {
  const getTeacherInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) ?? ""}${surname?.charAt(0) ?? ""}`.toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Subject
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Lessons
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Teachers
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
            {subjects.map((subject) => {
              return (
                <tr
                  key={subject.id}
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
                  {/* SUBJECT */}

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
                          rounded-lg
                          bg-indigo-50
                          text-indigo-600
                          transition-transform
                          duration-150
                          group-hover:scale-105
                        "
                      >
                        <BookOpen className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                          {subject.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* LESSONS */}

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
                      <BookOpen className="h-3.5 w-3.5" />

                      <span>{subject._count.lessons}</span>
                    </div>
                  </td>

                  {/* TEACHERS */}

                  <td className="px-5 py-2.5">
                    {subject.teachers.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {subject.teachers.map((teacher) => (
                          <div
                            key={teacher.id}
                            className="flex items-center gap-2"
                          >
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
                                teacher.name,
                                teacher.surname,
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium leading-5 text-slate-900">
                                {teacher.name} 
                              </p>

                              {/* <div className="flex items-center gap-1 text-[11px] leading-4 text-slate-400">
                                <UserRound className="h-3 w-3" />
                                <span>Teacher</span>
                              </div> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        No teachers assigned
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-2.5 text-center">
                    <div className="flex justify-center">
                      <SubjectRowActions
                        subject={subject}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* EMPTY STATE */}

            {subjects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No subjects found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no subject records to display.
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
