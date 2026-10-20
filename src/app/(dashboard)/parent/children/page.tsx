import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, ChevronRight, UserRound, UsersRound } from "lucide-react";
import Link from "next/link";
import ParentMobileBottomNav from "@/components/mobile/parent/ParentMobileBottomNav";
import Image from "next/image";

export default async function ParentChildrenPage() {
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
      academicYear: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between">
          {/* BACK */}

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
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              transition-all
              duration-200
              active:scale-95
            "
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" strokeWidth={1.9} />
          </Link>
        </div>

        {/* TITLE */}

        <div className="mt-7">
          <div className="flex items-center gap-3">
            <h1
              className="
                text-[28px]
                font-extrabold
                leading-none
                tracking-tight
                text-slate-900
              "
            >
              My Children
            </h1>

            <UsersRound className="h-6 w-6 text-[#4B517D]" strokeWidth={1.8} />
          </div>

          <p className="mt-3 text-[13px] text-slate-400">
            Select a child to view their school dashboard
          </p>
        </div>
      </div>

      {/* ================= CHILDREN ================= */}

      <main className="mt-6 px-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[19px] font-bold text-slate-900">Children</h2>

            <p className="mt-1 text-[11px] text-slate-400">
              {students.length} {students.length === 1 ? "child" : "children"}{" "}
              linked
            </p>
          </div>

          <div
            className="
              flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-xl
              bg-[#EEF0F7]
              px-2.5
              text-[11px]
              font-bold
              text-[#4B517D]
            "
          >
            {students.length}
          </div>
        </div>

        {students.length === 0 ? (
          <div
            className="
              rounded-[24px]
              border
              border-slate-100
              bg-white
              px-5
              py-10
              text-center
              shadow-[0_8px_24px_rgba(15,23,42,0.05)]
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
              <UsersRound className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <h3 className="mt-4 text-[16px] font-bold text-slate-800">
              No Children Found
            </h3>

            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              No student profiles are currently linked to your parent account.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => {
              const initials = `${student.name?.[0] ?? ""}${
                student.surname?.[0] ?? ""
              }`.toUpperCase();

              return (
                <Link
                  key={student.id}
                  href={`/parent?studentId=${encodeURIComponent(student.id)}`}
                  className="
                    group
                    block
                    rounded-[24px]
                    border
                    border-slate-100
                    bg-white
                    p-4
                    shadow-[0_8px_24px_rgba(15,23,42,0.05)]
                    transition-all
                    duration-200
                    active:scale-[0.985]
                  "
                >
                  <div className="flex items-center gap-3">
                    {/* PROFILE */}

                    <div
                      className="
                        relative
                        flex
                        h-[62px]
                        w-[62px]
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[20px]
                        bg-[#E7ECF8]
                        text-[#4B517D]
                      "
                    >
                      {student.img ? (
                        <Image
                          src={student.img}
                          alt={`${student.name} ${student.surname}`}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />
                      ) : initials ? (
                        <span className="text-[15px] font-bold">
                          {initials}
                        </span>
                      ) : (
                        <UserRound className="h-6 w-6" strokeWidth={1.8} />
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">
                      <h3
                        className="
                          truncate
                          text-[15px]
                          font-bold
                          text-[#4B517D]
                        "
                      >
                        {student.name} {student.surname}
                      </h3>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className="
                            rounded-full
                            bg-[#EEF0F7]
                            px-2
                            py-0.5
                            text-[9px]
                            font-semibold
                            text-[#4B517D]
                          "
                        >
                          {student.class.name}
                        </span>
                      </div>
                    </div>

                    {/* ARROW */}

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FFF0D6]
                        text-[#B87938]
                        transition-all
                        duration-200
                        group-active:scale-90
                      "
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={1.9} />
                    </div>
                  </div>

                  {/* STUDENT INFORMATION */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                      border-t
                      border-slate-100
                      pt-3
                    "
                  >
                    <div
                      className="
                        rounded-[14px]
                        bg-[#F8FAFC]
                        px-3
                        py-2
                      "
                    >
                      <p
                        className="
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                      >
                        Roll Number
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[10px]
                          font-semibold
                          text-slate-700
                        "
                      >
                        {student.rollNo || "—"}
                      </p>
                    </div>

                    <div
                      className="
                        rounded-[14px]
                        bg-[#F8FAFC]
                        px-3
                        py-2
                      "
                    >
                      <p
                        className="
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-slate-400
                        "
                      >
                        Admission Number
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[10px]
                          font-semibold
                          text-slate-700
                        "
                      >
                        {student.admissionNo || "—"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* ================= FOOTER SPACE ================= */}

      <div className="h-5" />

      {/* ================= BOTTOM NAV ================= */}

      <ParentMobileBottomNav />
    </div>
  );
}
