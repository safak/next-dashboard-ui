"use client";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  GraduationCap,
  UserRound,
} from "lucide-react";

import LessonRowActions from "./LessonRowActions";
import type { LessonRow } from "./types";

interface LessonsTableProps {
  lessons: LessonRow[];
  onEdit: (lesson: LessonRow) => void;
  onDelete: (lesson: LessonRow) => void;
}

const dayLabels: Record<LessonRow["day"], string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
};

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function getTeacherInitials(name: string, surname: string) {
  return `${name?.charAt(0) ?? ""}${surname?.charAt(0) ?? ""}`.toUpperCase();
}

export default function LessonsTable({
  lessons,
  onEdit,
  onDelete,
}: LessonsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Lesson
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Subject
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Class
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Teacher
                </span>
              </th>

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Day
                </span>
              </th>

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Time
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
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
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
                {/* Lesson */}

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
                        {lesson.name}
                      </p>

                      <p className="text-[11px] leading-4 text-slate-400">
                        Lesson #{lesson.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Subject */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-50 text-purple-600">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-sm font-medium text-slate-800">
                      {lesson.subject.name}
                    </span>
                  </div>
                </td>

                {/* Class */}

                <td className="px-5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                      {lesson.class.name}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] leading-4 text-slate-400">
                      <CalendarDays className="h-3 w-3" />

                      <span>{lesson.class.academicYear.label}</span>
                    </div>
                  </div>
                </td>

                {/* Teacher */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2.5">
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
                        lesson.teacher.name,
                        lesson.teacher.surname,
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium leading-5 text-slate-900">
                        {lesson.teacher.name} {lesson.teacher.surname}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] leading-4 text-slate-400">
                        <UserRound className="h-3 w-3" />

                        <span>Teacher</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Day */}

                <td className="px-5 py-2.5 text-center">
                  <span
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
                    <CalendarDays className="h-3.5 w-3.5" />

                    {dayLabels[lesson.day]}
                  </span>
                </td>

                {/* Time */}

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        bg-slate-100
                        text-slate-500
                      "
                    >
                      <Clock3 className="h-3.5 w-3.5" />
                    </div>

                    <div className="text-sm font-medium text-slate-700">
                      <span>{formatTime(lesson.startTime)}</span>

                      <span className="mx-1.5 text-slate-300">
                        –
                      </span>

                      <span>{formatTime(lesson.endTime)}</span>
                    </div>
                  </div>
                </td>

                {/* Actions */}

                <td className="px-5 py-2.5 text-center">
                  <div className="flex justify-center">
                    <LessonRowActions
                      lesson={lesson}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty Table State */}

            {lessons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <BookOpen className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No lessons found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no lesson records to display.
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