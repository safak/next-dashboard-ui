"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

/* TYPES */

type Role = "admin" | "teacher" | "student" | "parent";

type MenuItem = {
  icon: string;
  label: string;
  href: string;
  visible: Role[];
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

/* MENU GROUPS */

const menuGroups: MenuGroup[] = [
  {
    title: "ACADEMICS",
    items: [
      {
        icon: "/academicYearsIcon.png",
        label: "Academic Years",
        href: "/admin/academic-years",
        visible: ["admin"],
      },
      {
        icon: "/classesIcon.png",
        label: "Classes",
        href: "/admin/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subjetsIcon.png",
        label: "Subjects",
        href: "/admin/subjects",
        visible: ["admin", "teacher", "parent"],
      },
      {
        icon: "/lessonsIcon.png",
        label: "Lessons",
        href: "/admin/lessons",
        visible: ["admin", "teacher", "parent"],
      },
      // {
      //   icon: "/timetable.png",
      //   label: "Timetable",
      //   href: "/admin/timetable",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
    ],
  },

  {
    title: "STUDENTS & ADMISSIONS",
    items: [
      {
        icon: "/admissionsIcon.png",
        label: "Admissions",
        href: "/admin/admissions",
        visible: ["admin"],
      },
      {
        icon: "/studentsIcon.png",
        label: "Students",
        href: "/admin/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parentsIcon.png",
        label: "Parents",
        href: "/admin/parents",
        visible: ["admin", "teacher"],
      },
    ],
  },

  {
    title: "STAFF",
    items: [
      {
        icon: "/teachersIcon.png",
        label: "Teachers",
        href: "/admin/teachers",
        visible: ["admin"],
      },
      {
        icon: "/teacherLeavesIcon.png",
        label: "Teacher Leaves",
        href: "/admin/teacher-leaves",
        visible: ["admin"],
      },
    ],
  },

  {
    title: "ATTENDANCE",
    items: [
      {
        icon: "/studentAttendanceIcon.png",
        label: "Student Attendance",
        href: "/admin/student-attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacherAttendanceIcon.png",
        label: "Teacher Attendance",
        href: "/admin/teacher-attendance",
        visible: ["admin"],
      },
    ],
  },

  {
    title: "ASSESSMENT",
    items: [
      {
        icon: "/examsIcon.png",
        label: "Exams",
        href: "/admin/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/resultsIcon.png",
        label: "Results",
        href: "/admin/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      // {
      //   icon: "/report-cards.png",
      //   label: "Report Cards",
      //   href: "/admin/report-cards",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
    ],
  },

  {
    title: "FINANCE",
    items: [
      {
        icon: "/feeStructuresIcon.png",
        label: "Fee Structures",
        href: "/admin/fee-structures",
        visible: ["admin"],
      },
      {
        icon: "/feeManagementIcon.png",
        label: "Fee Management",
        href: "/admin/fees",
        visible: ["admin"],
      },
      {
        icon: "/paymentsIcon.png",
        label: "Payments",
        href: "/admin/payments",
        visible: ["admin"],
      },
      // {
      //   icon: "/expenses.png",
      //   label: "Expenses",
      //   href: "/admin/expenses",
      //   visible: ["admin"],
      // },
    ],
  },

  {
    title: "COMMUNICATION",
    items: [
      {
        icon: "/announcementsIcon.png",
        label: "Announcements",
        href: "/admin/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/eventsIcon.png",
        label: "Events",
        href: "/admin/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/galleryIcon.png",
        label: "Gallery",
        href: "/admin/gallery",
        visible: ["admin"],
      },
      {
        icon: "/holidaysIcon.png",
        label: "Holidays",
        href: "/admin/holidays",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },

  {
    title: "SETTINGS",
    items: [
      {
        icon: "/profileIcon.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/systemSettingsIcon.png",
        label: "System Settings",
        href: "/admin/settings",
        visible: ["admin"],
      },
    ],
  },
];

/* COMPONENT */

export default function Menu({
  mode,
  role,
  onItemClick,
}: {
  mode: "desktop" | "mobile";
  role: Role;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  const shouldAutoOpen = mode === "desktop";

  /* =======================================================
     VISIBLE MENU ITEMS
  ======================================================= */

  const visibleMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.visible.includes(role)),
    }))
    .filter((group) => group.items.length > 0);

  const activeItem = visibleMenuGroups
    .flatMap((group) => group.items)
    .filter(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  const activeHref = activeItem?.href ?? null;

  /* =======================================================
     ACTIVE GROUP
  ======================================================= */

  const activeGroup = visibleMenuGroups.find((group) =>
    group.items.some((item) => item.href === activeHref),
  );

  /* =======================================================
     HOME ROUTE
  ======================================================= */

  const homeRoute =
    role === "admin"
      ? "/admin"
      : role === "teacher"
        ? "/teacher"
        : role === "student"
          ? "/student"
          : role === "parent"
            ? "/parent"
            : "/";

  /* =======================================================
     OPEN SECTION
  ======================================================= */

  const [openSection, setOpenSection] = useState<string | null>(
    () => activeGroup?.title ?? null,
  );

  /* =======================================================
     AUTO OPEN ACTIVE GROUP
  ======================================================= */

  useEffect(() => {
    if (!shouldAutoOpen) return;

    setOpenSection(activeGroup?.title ?? null);
  }, [pathname, shouldAutoOpen, activeGroup?.title]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-1">
      {/* ===================================================
        DASHBOARD
    =================================================== */}

      <Link
        href={homeRoute}
        onClick={() => {
          if (mode === "mobile") {
            setOpenSection(null);
            onItemClick?.();
          }
        }}
        className={`
  group flex items-center gap-2.5
  rounded-xl px-2.5 py-2
  transition-all duration-200
  ${
    pathname === homeRoute
      ? "bg-[#FF9100] text-white shadow-sm"
      : "text-[#FF9100] hover:bg-[#37374b] hover:text-white"
  }
`}
      >
        {/* Dashboard icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
          <Image
            src="/home-icon-silhouette.png"
            alt=""
            width={21}
            height={21}
            className="object-contain"
          />
        </div>

        <span className="text-[14px] font-medium">Dashboard</span>
      </Link>

      {/* Divider */}
      <div className="my-1.5 h-px bg-white/30" />

      {/* MENU GROUPS */}

      <div className="space-y-0.5">
        {visibleMenuGroups.map((group) => {
          const groupActive = activeGroup?.title === group.title;

          const groupOpen = openSection === group.title;

          return (
            <div key={group.title}>
              {/* GROUP HEADER */}

              <button
                type="button"
                onClick={() => {
                  setOpenSection((prev) =>
                    prev === group.title ? null : group.title,
                  );
                }}
                className={`
                flex w-full items-center
                justify-between
                rounded-lg
                px-2.5 py-2
                text-[11px]
                font-bold
                tracking-wide
                transition-all duration-200
                ${
                  groupActive
                    ? "text-white"
                    : "text-black/90 hover:bg-white/10 hover:text-white"
                }
              `}
              >
                <span>{group.title}</span>

                <ChevronRight
                  size={14}
                  strokeWidth={2.5}
                  className={`
                  transition-transform duration-200
                  ${groupOpen ? "rotate-90" : ""}
                `}
                />
              </button>

              {/* GROUP ITEMS */}

              {groupOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const active = activeHref === item.href;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          if (mode === "mobile") {
                            setOpenSection(null);
                            onItemClick?.();
                          }
                        }}
                        className={`
                        group flex items-center gap-2.5
                        rounded-xl
                        px-2.5 py-1.5
                        transition-all duration-200
                        ${
                          active
                            ? "bg-[#FF9100] text-white shadow-sm"
                            : "text-[#FF9100] hover:bg-[#37374b] hover:text-white"
                        }
                      `}
                      >
                        {/* 3D ICON */}

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                          <Image
                            src={item.icon}
                            alt=""
                            width={21}
                            height={21}
                            className="
      object-contain
      drop-shadow-[0_2px_2px_rgba(0,0,0,0.22)]
      transition-transform
      duration-200
      group-hover:scale-105
    "
                          />
                        </div>

                        {/* LABEL */}

                        <span
                          className={`
                          min-w-0
                          flex-1
                          truncate
                          whitespace-nowrap
                          text-[13px]
                          ${active ? "font-semibold" : "font-medium"}
                        `}
                        >
                          {item.label}
                        </span>

                        {/* ACTIVE DOT */}

                        {active && (
                          <span
                            className="
                            h-1.5 w-1.5
                            shrink-0
                            rounded-full
                            bg-indigo-600
                          "
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
