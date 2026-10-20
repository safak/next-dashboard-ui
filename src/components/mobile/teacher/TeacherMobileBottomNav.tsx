"use client";

import {
  BarChart3,
  Bell,
  CalendarCheck2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Home,
  Megaphone,
  School,
  UsersRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type BottomNavItem = {
  label: string;
  icon: React.ElementType;
  path: string;
};

const moreItems: BottomNavItem[] = [
  {
    label: "Events",
    icon: CalendarDays,
    path: "/teacher/mobile/events",
  },
  {
    label: "Assignments",
    icon: ClipboardList,
    path: "/teacher/mobile/assignments",
  },
  {
    label: "Exams",
    icon: FileCheck2,
    path: "/teacher/mobile/exams",
  },
  {
    label: "Curriculum",
    icon: GraduationCap,
    path: "/teacher/mobile/curriculum",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/teacher/mobile/reports",
  },
  {
    label: "Announcements",
    icon: Megaphone,
    path: "/teacher/mobile/announcements",
  },
];

export default function TeacherMobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const [showMore, setShowMore] = useState(false);

  const isActive = (path: string) => {
    if (path === "/teacher") {
      return pathname === "/teacher" || pathname === "/teacher/mobile";
    }

    return pathname.startsWith(path);
  };

  const navigate = (path: string) => {
    setShowMore(false);
    router.push(path);
  };

  return (
    <>
      {/* ================= MORE MENU ================= */}

      {showMore && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setShowMore(false)}
            className="
              fixed
              inset-0
              z-[80]
              bg-black/20
              backdrop-blur-[2px]
              lg:hidden
            "
          />

          <div
            className="
              fixed
              bottom-[82px]
              left-1/2
              z-[90]
              w-[calc(100%-32px)]
              max-w-[390px]
              -translate-x-1/2
              overflow-hidden
              rounded-[24px]
              border
              border-slate-100
              bg-white
              p-3
              shadow-[0_15px_45px_rgba(15,23,42,0.18)]
              lg:hidden
            "
          >
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <div>
                <h3 className="text-sm font-bold text-[#4B517D]">More</h3>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Teacher modules
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMore(false)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-50
                  text-slate-500
                  transition
                  active:scale-95
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`
                      flex
                      min-h-[76px]
                      flex-col
                      items-center
                      justify-center
                      rounded-[18px]
                      border
                      px-1
                      py-2
                      transition
                      active:scale-95
                      ${
                        active
                          ? "border-[#4B517D]/10 bg-[#4B517D]/[0.07]"
                          : "border-slate-100 bg-slate-50/70"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        shadow-sm
                        ${
                          active
                            ? "bg-[#4B517D] text-white"
                            : "bg-white text-[#4B517D]"
                        }
                      `}
                    >
                      <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
                    </div>

                    <span
                      className={`
                        mt-1.5
                        text-[9px]
                        font-semibold
                        ${active ? "text-[#4B517D]" : "text-slate-600"}
                      `}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ================= BOTTOM NAVIGATION ================= */}

      <nav
        className="
          fixed
          bottom-3
          left-1/2
          z-[70]
          w-[calc(100%-24px)]
          max-w-[430px]
          -translate-x-1/2
          lg:hidden
        "
      >
        <div
          className="
            relative
            flex
            h-[68px]
            items-end
            justify-around
            rounded-[24px]
            border
            border-slate-100
            bg-white
            px-2
            pb-1.5
            pt-2
            shadow-[0_8px_30px_rgba(15,23,42,0.14)]
          "
        >
          {/* ================= STUDENTS ================= */}

          <button
            type="button"
            onClick={() => navigate("/teacher/mobile/student-attendance")}
            className="
              relative
              flex
              h-full
              min-w-0
              flex-1
              flex-col
              items-center
              justify-end
              pb-1
            "
          >
            <span
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                ${
                  isActive("/teacher/mobile/student-attendance")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              <UsersRound
                className="h-[19px] w-[19px]"
                strokeWidth={
                  isActive("/teacher/mobile/student-attendance") ? 2 : 1.8
                }
              />
            </span>

            <span
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${
                  isActive("/teacher/mobile/student-attendance")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              Students
            </span>

            {isActive("/teacher/mobile/student-attendance") && (
              <span
                className="
                  absolute
                  bottom-0
                  h-1
                  w-5
                  rounded-full
                  bg-[#F59A23]
                "
              />
            )}
          </button>

          {/* ================= CLASSES ================= */}

          <button
            type="button"
            onClick={() => navigate("/teacher/mobile/classes")}
            className="
              relative
              flex
              h-full
              min-w-0
              flex-1
              flex-col
              items-center
              justify-end
              pb-1
            "
          >
            <span
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                ${
                  isActive("/teacher/mobile/classes")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              <School
                className="h-[19px] w-[19px]"
                strokeWidth={isActive("/teacher/mobile/classes") ? 2 : 1.8}
              />
            </span>

            <span
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${
                  isActive("/teacher/mobile/classes")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              Classes
            </span>

            {isActive("/teacher/mobile/classes") && (
              <span
                className="
                  absolute
                  bottom-0
                  h-1
                  w-5
                  rounded-full
                  bg-[#F59A23]
                "
              />
            )}
          </button>

          {/* ================= CENTER HOME ================= */}

          <button
            type="button"
            onClick={() => navigate("/teacher")}
            aria-label="Home"
            className="
              relative
              flex
              h-full
              min-w-0
              flex-1
              flex-col
              items-center
              justify-end
              pb-1
            "
          >
            <span
              className="
                absolute
                -top-5
                flex
                h-[50px]
                w-[50px]
                items-center
                justify-center
                rounded-full
                border-[4px]
                border-[#F7F8FA]
                bg-[#4B517D]
                text-white
                shadow-[0_5px_14px_rgba(75,81,125,0.28)]
                transition
                active:scale-95
              "
            >
              <Home className="h-[20px] w-[20px]" strokeWidth={2} />
            </span>

            <span
              className="
                mt-0.5
                text-[9px]
                font-semibold
                text-[#4B517D]
              "
            >
              Home
            </span>

            {isActive("/teacher") && (
              <span
                className="
                  absolute
                  bottom-0
                  h-1
                  w-5
                  rounded-full
                  bg-[#F59A23]
                "
              />
            )}
          </button>

          {/* ================= ATTENDANCE ================= */}

          <button
            type="button"
            onClick={() => navigate("/teacher/mobile/my-attendance")}
            className="
              relative
              flex
              h-full
              min-w-0
              flex-1
              flex-col
              items-center
              justify-end
              pb-1
            "
          >
            <span
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                ${
                  isActive("/teacher/mobile/my-attendance")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              <CalendarCheck2
                className="h-[19px] w-[19px]"
                strokeWidth={
                  isActive("/teacher/mobile/my-attendance") ? 2 : 1.8
                }
              />
            </span>

            <span
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${
                  isActive("/teacher/mobile/my-attendance")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              Attendance
            </span>

            {isActive("/teacher/mobile/my-attendance") && (
              <span
                className="
                  absolute
                  bottom-0
                  h-1
                  w-5
                  rounded-full
                  bg-[#F59A23]
                "
              />
            )}
          </button>

          {/* ================= MORE ================= */}

          <button
            type="button"
            onClick={() => setShowMore((previous) => !previous)}
            aria-label="More"
            aria-expanded={showMore}
            className="
              relative
              flex
              h-full
              min-w-0
              flex-1
              flex-col
              items-center
              justify-end
              pb-1
            "
          >
            <span
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                transition-all
                duration-200
                ${
                  showMore
                    ? "bg-[#4B517D] text-white shadow-[0_5px_14px_rgba(75,81,125,0.28)]"
                    : "text-slate-400"
                }
              `}
            >
              <ChevronDown
                className={`
                  h-[19px]
                  w-[19px]
                  transition-transform
                  duration-200
                  ${showMore ? "rotate-180" : ""}
                `}
                strokeWidth={showMore ? 2 : 1.8}
              />
            </span>

            <span
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${showMore ? "text-[#4B517D]" : "text-slate-400"}
              `}
            >
              More
            </span>

            {showMore && (
              <span
                className="
                  absolute
                  bottom-0
                  h-1
                  w-5
                  rounded-full
                  bg-[#F59A23]
                "
              />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
