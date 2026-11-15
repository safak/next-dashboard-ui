import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";

import prisma from "@/lib/prisma";
import { StudentRegistration } from "@prisma/client";
import { formatLabels } from "@/lib/subjectDelivery";
import StudentSubjectsEditor from "@/components/StudentSubjectsEditor";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const StudentRegistrationDetails = ({
  subjects,
  registration: reg,
  showPrivate,
  editor,
}: {
  subjects: string[];
  registration: StudentRegistration | null;
  showPrivate: boolean;
  editor?: React.ReactNode;
}) => (
  <div className="mt-4 card p-4 flex flex-col gap-4">
    <h1 className="text-xl font-semibold">Registration details</h1>
    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="md:col-span-2">
        <dt className="text-xs text-gray-500 flex items-center gap-3">
          Subjects {editor}
        </dt>
        <dd className="mt-1 flex flex-wrap gap-1.5">
          {subjects.length
            ? subjects.map((s) => (
                <span key={s} className="rounded-full bg-lamaSkyLight px-2.5 py-0.5 text-xs">
                  {s}
                </span>
              ))
            : "—"}
        </dd>
      </div>
      {reg && showPrivate && (
        <>
          <div>
            <dt className="text-xs text-gray-500">Guardian</dt>
            <dd>
              {reg.guardianName} ({reg.guardianRelationship}) · {reg.guardianPhone}
              {reg.guardianEmail && ` · ${reg.guardianEmail}`}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Previous school</dt>
            <dd>
              {reg.previousSchool || "—"}
              {reg.lastGradeCompleted && ` (completed ${reg.lastGradeCompleted})`}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-xs text-gray-500">Medical / special needs</dt>
            <dd className="whitespace-pre-line">{reg.medicalNotes || "None given"}</dd>
          </div>
          <div className="md:col-span-2 text-xs text-gray-500">
            Enrolment agreement signed by{" "}
            <span className="font-serif italic text-sm text-gray-800">
              {reg.contractSignature}
            </span>{" "}
            on {new Intl.DateTimeFormat("en-GB").format(reg.contractSignedAt)}
          </div>
        </>
      )}
    </dl>
  </div>
);

const SingleStudentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { role } = await auth();

  const [student, performance] = await Promise.all([
    prisma.student.findUnique({
      where: { id },
      include: {
        class: { include: { _count: { select: { lessons: true } } } },
        grade: { select: { level: true } },
        parent: { select: { name: true, surname: true } },
        subjects: {
          select: { subjectId: true, format: true, subject: { select: { name: true } } },
          orderBy: { subject: { name: "asc" } },
        },
        registration: true,
      },
    }),
    prisma.result.aggregate({
      where: { studentId: id },
      _avg: { score: true },
      _count: true,
    }),
  ]);

  if (!student) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      <Link
        href="/list/students"
        className="text-sm text-gray-500 hover:text-gray-700 w-fit"
      >
        ← Back to students
      </Link>
      <div className="flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student.img || "/noAvatar.png"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {student.name + " " + student.surname}
                </h1>
                {role === "admin" && (
                  <FormContainer table="student" type="update" data={student} />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {student.studentNumber && (
                  <span className="font-mono">{student.studentNumber} · </span>
                )}
                Class {student.class.name} · Grade {student.grade.level} · Parent:{" "}
                {student.parent
                  ? `${student.parent.name} ${student.parent.surname}`
                  : "not linked yet"}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(student.birthday)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="card p-4 flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense fallback="loading...">
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </div>
            {/* CARD */}
            <div className="card p-4 flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class.name.charAt(0)}th
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className="card p-4 flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="card p-4 flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {(student.subjects.length > 0 || student.registration || role === "admin") && (
          <StudentRegistrationDetails
            subjects={student.subjects.map(
              (s) => `${s.subject.name} · ${formatLabels[s.format]}`
            )}
            registration={student.registration}
            showPrivate={role === "admin" || role === "teacher"}
            editor={
              role === "admin" && (
                <StudentSubjectsEditor
                  studentId={student.id}
                  subjects={await prisma.subject.findMany({
                    select: { id: true, name: true, delivery: true },
                    orderBy: { name: "asc" },
                  })}
                  current={student.subjects.map((s) => ({ subjectId: s.subjectId, format: s.format }))}
                />
              )
            }
          />
        )}
        {/* BOTTOM */}
        <div className="mt-4 card p-4">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="card p-4">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/lessons?classId=${student.class.id}`}
            >
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/teachers?classId=${student.class.id}`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className="p-3 rounded-md bg-pink-50"
              href={`/list/exams?classId=${student.class.id}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/assignments?classId=${student.class.id}`}
            >
              Student&apos;s Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/results?studentId=${student.id}`}
            >
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance
          average={performance._avg.score}
          count={performance._count}
        />
        <Announcements />
      </div>
      </div>
    </div>
  );
};

export default SingleStudentPage;
