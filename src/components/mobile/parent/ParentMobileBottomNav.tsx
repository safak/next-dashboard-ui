"use client";

import {
  BookOpenCheck,
  CalendarCheck2,
  ChevronDown,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Home,
  IndianRupee,
  Megaphone,
  School,
  UsersRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type ParentMobileBottomNavProps = {
  studentId?: string;
};

type BottomNavItem = {
  label: string;
  icon: React.ElementType;
  path: string;
};

export default function ParentMobileBottomNav({
  studentId,
}: ParentMobileBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [showMore, setShowMore] = useState(false);

  const studentQuery = studentId
    ? `?studentId=${encodeURIComponent(studentId)}`
    : "";

  const isHomePage = pathname === "/parent";
  const isChildrenPage = pathname.startsWith("/parent/children");

  const moreItems: BottomNavItem[] = [
    {
      label: "Homework",
      icon: BookOpenCheck,
      path: `/parent/homework${studentQuery}`,
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      path: `/parent/assignments${studentQuery}`,
    },
    {
      label: "Exams",
      icon: FileCheck2,
      path: `/parent/exams${studentQuery}`,
    },
    {
      label: "Results",
      icon: GraduationCap,
      path: `/parent/results${studentQuery}`,
    },
    {
      label: "Fees",
      icon: IndianRupee,
      path: `/parent/fees${studentQuery}`,
    },
    {
      label: "Announcements",
      icon: Megaphone,
      path: "/parent/announcements",
    },
  ];

  const isActive = (path: string) => {
    const cleanPath = path.split("?")[0];

    if (cleanPath === "/parent") {
      return pathname === "/parent";
    }

    return pathname.startsWith(cleanPath);
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
                  Parent modules
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
          {/* ================= CHILDREN ================= */}

          <button
            type="button"
            onClick={() => navigate("/parent/children")}
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
                ${isChildrenPage ? "text-[#4B517D]" : "text-slate-400"}
              `}
            >
              <UsersRound
                className="h-[19px] w-[19px]"
                strokeWidth={isChildrenPage ? 2 : 1.8}
              />
            </span>

            <span
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${isChildrenPage ? "text-[#4B517D]" : "text-slate-400"}
              `}
            >
              Children
            </span>

            {isChildrenPage && (
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
            onClick={() => navigate(`/parent/classes${studentQuery}`)}
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
                  isActive("/parent/classes")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              <School
                className="h-[19px] w-[19px]"
                strokeWidth={isActive("/parent/classes") ? 2 : 1.8}
              />
            </span>

            <span
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${
                  isActive("/parent/classes")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              Classes
            </span>

            {isActive("/parent/classes") && (
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

          {/* ================= HOME ================= */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/parent?studentId=${encodeURIComponent(studentId || "")}`,
              )
            }
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
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${isHomePage ? "text-[#4B517D]" : "text-slate-400"}
              `}
            >
              Home
            </span>

            {isHomePage && (
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
            onClick={() => navigate(`/parent/attendance${studentQuery}`)}
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
                  isActive("/parent/attendance")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              <CalendarCheck2
                className="h-[19px] w-[19px]"
                strokeWidth={isActive("/parent/attendance") ? 2 : 1.8}
              />
            </span>

            <span
              className={`
                mt-0.5
                text-[9px]
                font-semibold
                ${
                  isActive("/parent/attendance")
                    ? "text-[#4B517D]"
                    : "text-slate-400"
                }
              `}
            >
              Attendance
            </span>

            {isActive("/parent/attendance") && (
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
