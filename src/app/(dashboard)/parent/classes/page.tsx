import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import ParentMobileBottomNav from "@/components/mobile/parent/ParentMobileBottomNav";
import MobileStudentDropdown from "@/components/mobile/common/MobileStudentDropdown";
import { ArrowLeft, School } from "lucide-react";
import ParentClassesSchedule from "./ParentClassesSchedule";

type Props = {
  searchParams: Promise<{
    studentId?: string;
  }>;
};

export default async function ParentClassesPage({ searchParams }: Props) {
  const params = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
    include: {
      class: {
        include: {
          academicYear: true,
          supervisor: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] pb-24">
        <main className="px-4 pt-5">
          <Link
            href="/parent"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-slate-700
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              transition
              active:scale-95
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div
            className="
              mt-6
              rounded-[22px]
              border
              border-slate-100
              bg-white
              px-5
              py-10
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#E7ECF8]
                text-[#4B517D]
              "
            >
              <School className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-sm font-bold text-[#4B517D]">
              No children found
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              No student profiles are linked to your account.
            </p>
          </div>
        </main>

        <ParentMobileBottomNav />
      </div>
    );
  }

  const activeId = params.studentId || students[0].id;

  const student = students.find((item) => item.id === activeId) || students[0];

  const childName = student.name?.trim() || "Student";

  const classInfo = student.class;

  const lessons = await prisma.lesson.findMany({
    where: {
      classId: classInfo.id,
    },
    include: {
      subject: true,
      teacher: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const lessonData = lessons.map((lesson) => ({
    id: lesson.id,
    name: lesson.name,
    day: String(lesson.day),
    startTime: lesson.startTime.toISOString(),
    endTime: lesson.endTime.toISOString(),
    scheduleDate: lesson.scheduleDate?.toISOString() ?? null,
    subject: {
      id: lesson.subject.id,
      name: lesson.subject.name,
    },
    teacher: {
      name: lesson.teacher.name,
      surname: lesson.teacher.surname,
    },
  }));

  const studentOptions = students.map((item) => ({
    id: item.id,
    name: item.name,
    surname: item.surname,
    img: item.img,
    className: item.class?.name || "Class",
  }));

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      <main className="px-4 pt-5">
        {/* ================= TOP BAR ================= */}

        <div className="flex items-center justify-between">
          <Link
            href={`/parent?studentId=${encodeURIComponent(student.id)}`}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-slate-700
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              transition
              active:scale-95
            "
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <MobileStudentDropdown
            students={studentOptions}
            selectedStudentId={student.id}
          />
        </div>

        {/* ================= TITLE ================= */}

        <div className="mt-6">
          <div className="flex items-center gap-2.5">
            <h1
              className="
                text-[24px]
                font-extrabold
                leading-tight
                tracking-tight
                text-slate-950
              "
            >
              {childName}&apos;s Classes
            </h1>

            <School className="h-5 w-5 text-[#4B517D]" />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            {classInfo.name}
            {classInfo.academicYear?.label
              ? ` • ${classInfo.academicYear.label}`
              : ""}
          </p>
        </div>

        {/* ================= INTERACTIVE SCHEDULE ================= */}

        <ParentClassesSchedule lessons={lessonData} />
      </main>

      <ParentMobileBottomNav studentId={student.id} />
    </div>
  );
}
