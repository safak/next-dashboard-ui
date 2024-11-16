import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/utils";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

const SingleStudentPage = async ({ params: { id } }: { params: { id: string } }) => {
    const {role} =  await getUserRole();

  const student: (Student & { class: (Class & {_count:{lessons:number}})})|null = await prisma.student.findUnique({
    where: { id },
    include: {
      class: {
        include:{_count:{select:{lessons:true}}}
      }
    },
  });

  if (!student) {
    return notFound();
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/*LEFT*/}
      <div className="w-full xl:w-2/3">
        {/*TOP*/}
        <div className="flex flex-col lg:flex-row gap-4">
          {/*USER INFO CARD*/}
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
            <div className="w-2/3 dlex flex-col justify-between gap-4">
               <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold">{student.name + "" + student.surname} </h1>
                {role === "admin" && (
                  <FormContainer
                    table="student"
                    type="update"
                    data={student}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType} </span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{new Intl.DateTimeFormat("en-GB").format(student.birthday)}</span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email || "-"} </span>
                </div>
                <div className="w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone || "-"} </span>
                </div>
              </div>
            </div>
          </div>
          {/*SMALL CARDS*/}
          <div className="flex-1 flex gap-4  justify-between flex-wrap">
            {/*CARD*/}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
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
            {/*CARD*/}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class.name.charAt(0)} </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/*CARD*/}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class._count.lessons} </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/*CARD*/}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">{student.class.name} </h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/*BOTTOM*/}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
            <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>
      {/*RIGHT*/}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/lessons?classId=${2}`}>
              Student&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/teachers?classId=${2}`}>
              Student&apos;s Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${2}`}>
              Student&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?classId=${2}`}>
              Student&apos;s Assignments
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/results?studentId=${"student2"}`}>
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
