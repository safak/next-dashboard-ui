import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

import ParentMobileBottomNav from "@/components/mobile/parent/ParentMobileBottomNav";
import MobileStudentDropdown from "@/components/mobile/common/MobileStudentDropdown";

import { ArrowLeft, GraduationCap } from "lucide-react";

import ParentResultsClient from "./ParentResultsClient";

type Props = {
  searchParams: Promise<{
    studentId?: string;
  }>;
};

export default async function ParentResultsPage({ searchParams }: Props) {
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
      class: true,
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
              text-[#4B517D]
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
              py-12
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
              <GraduationCap className="h-6 w-6" />
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

  const activeStudentId = params.studentId || students[0].id;

  const student =
    students.find((item) => item.id === activeStudentId) || students[0];

  const results = await prisma.result.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      exam: {
        include: {
          subject: true,
          teacher: true,
        },
      },

      assignment: {
        include: {
          subject: true,
          teacher: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  const resultData = results
    .map((result) => {
      if (result.exam) {
        return {
          id: result.id,
          type: "EXAM" as const,
          title: result.exam.title,
          description: result.exam.description || "",
          score: result.score,
          totalMarks: result.exam.totalMarks,
          date: result.exam.examDate.toISOString(),

          subject: {
            id: result.exam.subject.id,
            name: result.exam.subject.name,
          },

          teacher: {
            name: result.exam.teacher.name,
            surname: result.exam.teacher.surname,
          },
        };
      }

      if (result.assignment) {
        return {
          id: result.id,
          type: "ASSIGNMENT" as const,
          title: result.assignment.title,
          description: result.assignment.description || "",
          score: result.score,
          totalMarks: result.assignment.totalMarks,
          date: result.assignment.dueDate.toISOString(),

          subject: {
            id: result.assignment.subject.id,
            name: result.assignment.subject.name,
          },

          teacher: {
            name: result.assignment.teacher.name,
            surname: result.assignment.teacher.surname,
          },
        };
      }

      return null;
    })
    .filter((result): result is NonNullable<typeof result> => result !== null);

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
              {student.name}&apos;s Results
            </h1>

            <GraduationCap className="h-5 w-5 text-[#4B517D]" />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            View your child&apos;s academic performance
          </p>
        </div>

        <ParentResultsClient results={resultData} />
      </main>

      <ParentMobileBottomNav studentId={student.id} />
    </div>
  );
}
