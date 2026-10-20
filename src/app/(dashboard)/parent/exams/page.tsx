import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import ParentMobileBottomNav from "@/components/mobile/parent/ParentMobileBottomNav";
import MobileStudentDropdown from "@/components/mobile/common/MobileStudentDropdown";
import { ArrowLeft, FileCheck2 } from "lucide-react";
import ParentExamsClient from "./ParentExamsClient";

type Props = {
  searchParams: Promise<{
    studentId?: string;
  }>;
};

export default async function ParentExamsPage({ searchParams }: Props) {
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
              <FileCheck2 className="h-6 w-6" />
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

  const exams = await prisma.exam.findMany({
    where: {
      classId: student.classId,
    },
    include: {
      subject: true,
      teacher: true,

      evaluations: {
        where: {
          studentId: student.id,
        },
        select: {
          id: true,
          obtainedMarks: true,
          remark: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      examDate: "asc",
    },
  });

  const examData = exams.map((exam) => {
    const evaluation = exam.evaluations[0] ?? null;

    return {
      id: exam.id,
      title: exam.title,
      description: exam.description ?? "",
      totalMarks: exam.totalMarks,
      examDate: exam.examDate.toISOString(),

      subject: {
        id: exam.subject.id,
        name: exam.subject.name,
      },

      teacher: {
        name: exam.teacher.name,
        surname: exam.teacher.surname,
      },

      evaluation: evaluation
        ? {
            id: evaluation.id,
            obtainedMarks: evaluation.obtainedMarks,
            remark: evaluation.remark,
            createdAt: evaluation.createdAt.toISOString(),
          }
        : null,
    };
  });

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
              {student.name}&apos;s Exams
            </h1>

            <FileCheck2 className="h-5 w-5 text-[#4B517D]" />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            View and track your child&apos;s exams
          </p>
        </div>

        <ParentExamsClient exams={examData} />
      </main>

      <ParentMobileBottomNav studentId={student.id} />
    </div>
  );
}
