"use client";

import {
  BookOpenCheck,
  CalendarCheck2,
  ClipboardList,
  FileCheck2,
  School,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ParentMobileBottomNav from "@/components/mobile/parent/ParentMobileBottomNav";
import MobileActionCard from "@/components/mobile/teacher/MobileActionCard";

type Student = {
  id: string;
  name: string;
  surname: string;
  className: string;
  image?: string | null;
};

type ParentMobileDashboardProps = {
  parentName: string;
  students: Student[];
  activeStudentId: string;
  attendanceRate: number;
};

export default function ParentMobileDashboard({
  parentName,
  students,
  activeStudentId,
  attendanceRate,
}: ParentMobileDashboardProps) {
  const router = useRouter();

  const [showStudents, setShowStudents] = useState(false);

  const activeStudent =
    students.find((item) => item.id === activeStudentId) || students[0];

  const currentHour = new Date().getHours();

  let greeting = "Good Morning";

  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good Evening";
  }

  const quickActions = [
    {
      title: "My Children",
      icon: <UsersRound />,
      iconBg: "bg-[#E7ECF8]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/parent/children"),
    },
    {
      title: "Attendance",
      icon: <CalendarCheck2 />,
      iconBg: "bg-[#E8F0D7]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/parent/attendance"),
    },
    {
      title: "Classes",
      icon: <School />,
      iconBg: "bg-[#FFF0D6]",
      iconColor: "text-[#B87938]",
      onClick: () => router.push("/parent/classes"),
    },
    {
      title: "Homework",
      icon: <BookOpenCheck />,
      iconBg: "bg-[#EEF0F7]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/parent/homework"),
    },
    {
      title: "Assignments",
      icon: <ClipboardList />,
      iconBg: "bg-[#F6EBDD]",
      iconColor: "text-[#B87938]",
      onClick: () => router.push("/parent/homework"),
    },
    {
      title: "Exams",
      icon: <FileCheck2 />,
      iconBg: "bg-[#E7EAF5]",
      iconColor: "text-[#4B517D]",
      onClick: () =>
        router.push(
          `/parent/exams?studentId=${encodeURIComponent(activeStudent.id)}`,
        ),
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          rounded-b-[30px]
          bg-gradient-to-br
          from-[#4B517D]
          via-[#555B86]
          to-[#626991]
          px-4
          pb-4
          pt-4
          shadow-[0_8px_24px_rgba(75,81,125,0.18)]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-12
            -top-16
            h-36
            w-36
            rounded-full
            bg-[#F59A23]/75
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            top-8
            h-32
            w-32
            rounded-full
            border-[18px]
            border-[#FFF8EC]/15
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            left-1/3
            h-32
            w-32
            rounded-full
            bg-white/5
          "
        />

        <div className="relative z-10">
          <div className="pr-16">
            <p className="text-[11px] font-medium text-white/75">
              {greeting} ☀️
            </p>

            <h1 className="mt-1 truncate text-[25px] font-bold leading-tight tracking-tight text-white">
              {parentName}
            </h1>

            <p className="mt-1 text-[10px] text-white/70">
              Stay connected with your child&apos;s school journey.
            </p>
          </div>

          <div
            className="
              mt-3
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-white/15
              bg-white/10
              px-3.5
              py-2.5
              backdrop-blur-md
            "
          >
            <div>
              <p className="text-[9px] font-medium uppercase tracking-wide text-white/60">
                Today&apos;s Overview
              </p>

              <p className="mt-0.5 text-[11px] font-medium text-white">
                {students.length}{" "}
                {students.length === 1 ? "child enrolled" : "children enrolled"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[9px] text-white/60">
                  {activeStudent?.name}&apos;s Attendance
                </p>

                <p className="text-sm font-bold text-white">
                  {attendanceRate}%
                </p>
              </div>

              <div className="h-8 w-px bg-white/15" />

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F59A23]
                  text-white
                  shadow-sm
                "
              >
                <CalendarCheck2 className="h-4 w-4" strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED CHILD */}

      {students.length > 0 && (
        <section className="px-4 pt-4">
          <button
            type="button"
            onClick={() => setShowStudents(true)}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-100
              bg-white
              p-3
              text-left
              shadow-sm
              transition
              active:scale-[0.99]
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#E7ECF8]
                text-[#4B517D]
              "
            >
              <UserRound className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                Selected Child
              </p>

              <p className="truncate text-sm font-bold text-[#4B517D]">
                {activeStudent?.name} {activeStudent?.surname}
              </p>

              <p className="text-[10px] text-slate-400">
                {activeStudent?.className}
              </p>
            </div>

            <span className="text-[10px] font-semibold text-[#F59A23]">
              Change
            </span>
          </button>
        </section>
      )}

      {/* QUICK ACTIONS */}

      <section className="px-4 pt-6">
        <div className="mb-4">
          <h2 className="text-[18px] font-bold tracking-tight text-[#4B517D]">
            Quick Actions
          </h2>

          <p className="mt-1 text-[11px] text-slate-400">
            Frequently used modules
          </p>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />

          <div className="h-1 w-8 rounded-full bg-[#F59A23]" />

          <div className="h-px w-6 bg-[#4B517D]/20" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <MobileActionCard
              key={action.title}
              title={action.title}
              icon={action.icon}
              bg="bg-white"
              iconBg={action.iconBg}
              iconColor={action.iconColor}
              onClick={action.onClick}
            />
          ))}
        </div>
      </section>

      {/* CHILD SELECTOR */}

      {showStudents && (
        <>
          <button
            type="button"
            aria-label="Close student selector"
            onClick={() => setShowStudents(false)}
            className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px]"
          />

          <div
            className="
              fixed
              bottom-0
              left-0
              right-0
              z-[90]
              rounded-t-[28px]
              bg-white
              px-4
              pb-8
              pt-3
              shadow-[0_-10px_40px_rgba(0,0,0,0.15)]
            "
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            <div className="mb-4">
              <h3 className="text-base font-bold text-[#4B517D]">
                My Children
              </h3>

              <p className="text-[10px] text-slate-400">
                Select a child to view their dashboard
              </p>
            </div>

            <div className="space-y-2">
              {students.map((item) => {
                const selected = item.id === activeStudentId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setShowStudents(false);

                      router.push(
                        `/parent?studentId=${encodeURIComponent(item.id)}`,
                      );
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      p-3
                      text-left
                      transition
                      ${
                        selected
                          ? "border-[#F59A23] bg-[#FFF8EC]"
                          : "border-slate-100 bg-slate-50"
                      }
                    `}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7ECF8] text-[#4B517D]">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700">
                        {item.name} {item.surname}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {item.className}
                      </p>
                    </div>

                    {selected && (
                      <span className="text-[10px] font-bold text-[#F59A23]">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <ParentMobileBottomNav studentId={activeStudentId} />
    </div>
  );
}
