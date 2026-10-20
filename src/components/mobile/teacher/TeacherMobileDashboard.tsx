"use client";

import {
  BarChart3,
  Bell,
  BookOpenCheck,
  CalendarCheck2,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Megaphone,
  School,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import MobileActionCard from "./MobileActionCard";

type Props = {
  teacherName: string;
  teacherImage?: string | null;
  attendanceRate: number;
  myClasses: any[];
  tests: any[];
  insights: any[];
};

export default function TeacherMobileDashboard({
  teacherName,
  attendanceRate,
  myClasses,
}: Props) {
  const [showAllActions, setShowAllActions] = useState(false);

  const router = useRouter();

  const quickActions = [
    {
      title: "My Attendance",
      icon: <CalendarCheck2 />,
      iconBg: "bg-[#E8F0D7]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/teacher/mobile/my-attendance"),
    },

    {
      title: "Student Attendance",
      icon: <UsersRound />,
      iconBg: "bg-[#E7ECF8]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/teacher/mobile/student-attendance"),
    },

    {
      title: "Classes",
      icon: <School />,
      iconBg: "bg-[#FFF0D6]",
      iconColor: "text-[#B87938]",
      onClick: () => router.push("/teacher/mobile/classes"),
    },

    {
      title: "Homework",
      icon: <BookOpenCheck />,
      iconBg: "bg-[#EEF0F7]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/teacher/mobile/homework"),
    },

    {
      title: "Assignments",
      icon: <ClipboardList />,
      iconBg: "bg-[#F6EBDD]",
      iconColor: "text-[#B87938]",
      onClick: () => router.push("/teacher/mobile/assignments"),
    },

    {
      title: "Exams",
      icon: <FileCheck2 />,
      iconBg: "bg-[#E7EAF5]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/teacher/mobile/exams"),
    },

    {
      title: "Events",
      icon: <CalendarDays />,
      iconBg: "bg-[#FFF0D6]",
      iconColor: "text-[#B87938]",
      onClick: () => router.push("/teacher/mobile/events"),
    },

    {
      title: "Curriculum",
      icon: <GraduationCap />,
      iconBg: "bg-[#F2EADF]",
      iconColor: "text-[#B87938]",
      onClick: () => router.push("/teacher/mobile/curriculum"),
    },

    {
      title: "Reports",
      icon: <BarChart3 />,
      iconBg: "bg-[#FFF0D6]",
      iconColor: "text-[#B87938]",
      onClick: () => router.push("/teacher/mobile/reports"),
    },

    {
      title: "Announcements",
      icon: <Megaphone />,
      iconBg: "bg-[#E8F0D7]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/teacher/mobile/announcements"),
    },

    {
      title: "Notifications",
      icon: <Bell />,
      iconBg: "bg-[#E7ECF8]",
      iconColor: "text-[#4B517D]",
      onClick: () => router.push("/teacher/mobile/notifications"),
    },
  ];

  const currentHour = new Date().getHours();

  let greeting = "Good Morning";

  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good Evening";
  }

  const visibleActions = showAllActions
    ? quickActions
    : quickActions.slice(0, 6);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-10">
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
              {teacherName}
            </h1>

            <p className="mt-1 text-[10px] text-white/70">
              Ready to manage your classes today.
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
                {myClasses.length}{" "}
                {myClasses.length === 1 ? "class" : "classes"} assigned
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[9px] text-white/60">Attendance</p>

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
                <ClipboardCheck className="h-4 w-4" strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-[18px] font-bold tracking-tight text-[#4B517D]">
              Quick Actions
            </h2>

            <p className="mt-1 text-[11px] text-slate-400">
              Frequently used modules
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllActions((previous) => !previous)}
            className="
              rounded-full
              px-2
              py-1
              text-[11px]
              font-semibold
              text-[#F59A23]
              transition
              active:scale-95
            "
          >
            {showAllActions ? "Show Less" : "View All"}
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />

          <div className="h-1 w-8 rounded-full bg-[#F59A23]" />

          <div className="h-px w-6 bg-[#4B517D]/20" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {visibleActions.map((action, index) => (
            <MobileActionCard
              key={`${action.title}-${index}`}
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
    </div>
  );
}
