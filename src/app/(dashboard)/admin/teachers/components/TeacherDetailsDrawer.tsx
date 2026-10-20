"use client";

import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  School,
  UserRound,
  X,
} from "lucide-react";

import { Prisma } from "@prisma/client";
import Image from "next/image";
import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

type TeacherRow = Prisma.TeacherGetPayload<{
  include: {
    subjects: {
      select: {
        id: true;
        name: true;
      };
    };

    supervisedClasses: {
      select: {
        id: true;
        name: true;
      };
    };

    _count: {
      select: {
        lessons: true;
        supervisedClasses: true;
        subjects: true;
      };
    };
  };
}>;

interface TeacherDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: TeacherRow | null;
}

export default function TeacherDetailsDrawer({
  open,
  onOpenChange,
  teacher,
}: TeacherDetailsDrawerProps) {
  if (!teacher) {
    return null;
  }

  const teacherName = `${teacher.name} ${teacher.surname}`.trim();

  const subjectCount = teacher.subjects.length;
  const classCount = teacher.supervisedClasses.length;
  const lessonCount = teacher._count.lessons;

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSex = (sex: string | null | undefined) => {
    if (!sex) {
      return "—";
    }

    return sex.charAt(0) + sex.slice(1).toLowerCase();
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Teacher Details"
      description="View the personal and academic details of this teacher."
      width="md"
      icon={<UserRound className="h-6 w-6" />}
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
        {/* TEACHER OVERVIEW */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 text-indigo-600">
              {teacher.img ? (
                <Image
                  src={teacher.img}
                  alt={teacherName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-7 w-7" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">
                {teacherName}
              </h2>

              <p className="text-sm text-slate-500">
                @{teacher.username}
              </p>

              <div className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                Teacher
              </div>
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Personal Information
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Basic information about this teacher.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Email */}

            <div className="rounded-lg bg-blue-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Mail className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Email
                </span>
              </div>

              <p className="truncate text-sm font-semibold text-slate-900">
                {teacher.email || "—"}
              </p>
            </div>

            {/* Phone */}

            <div className="rounded-lg bg-emerald-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Phone className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Phone
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {teacher.phone || "—"}
              </p>
            </div>

            {/* Gender */}

            <div className="rounded-lg bg-violet-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <UserRound className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Gender
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {formatSex(teacher.sex)}
              </p>
            </div>

            {/* Blood Group */}

            <div className="rounded-lg bg-red-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span className="text-xs font-bold">+</span>
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Blood Group
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {teacher.bloodType || "—"}
              </p>
            </div>

            {/* Date of Birth */}

            <div className="rounded-lg bg-amber-50/70 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <CalendarDays className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Date of Birth
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {formatDate(teacher.birthday)}
              </p>
            </div>

            {/* Username */}

            <div className="rounded-lg bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <UserRound className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Username
                </span>
              </div>

              <p className="truncate text-sm font-semibold text-slate-900">
                @{teacher.username}
              </p>
            </div>
          </div>

          {/* Address */}

          <div className="mt-3 rounded-lg bg-slate-50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <MapPin className="h-3.5 w-3.5" />
              </div>

              <span className="text-xs font-medium text-slate-500">
                Address
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900">
              {teacher.address || "No address provided"}
            </p>
          </div>
        </div>

        {/* SUBJECTS */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Subjects
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Subjects assigned to this teacher.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>

          {subjectCount === 0 ? (
            <div className="rounded-lg bg-slate-50 px-3 py-4 text-center">
              <p className="text-xs text-slate-500">
                No subjects assigned
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <span
                  key={subject.id}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-violet-50
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-violet-700
                  "
                >
                  <BookOpen className="h-3 w-3" />
                  {subject.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SUPERVISED CLASSES */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Supervised Classes
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Classes supervised by this teacher.
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <School className="h-4 w-4" />
            </div>
          </div>

          {classCount === 0 ? (
            <div className="rounded-lg bg-slate-50 px-3 py-4 text-center">
              <p className="text-xs text-slate-500">
                No classes assigned
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {teacher.supervisedClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    bg-orange-50/70
                    px-3
                    py-2.5
                  "
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <School className="h-4 w-4" />
                  </div>

                  <p className="text-sm font-semibold text-slate-900">
                    {cls.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK STATS */}

        <div className="grid grid-cols-3 gap-3">
          {/* Subjects */}

          <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-600" />

              <span className="text-xs font-medium text-slate-500">
                Subjects
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {subjectCount}
            </p>
          </div>

          {/* Classes */}

          <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-3">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-orange-600" />

              <span className="text-xs font-medium text-slate-500">
                Classes
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {classCount}
            </p>
          </div>

          {/* Lessons */}

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />

              <span className="text-xs font-medium text-slate-500">
                Lessons
              </span>
            </div>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {lessonCount}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}