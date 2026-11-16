import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import MenuLink from "./MenuLink";
import MenuLogout from "./MenuLogout";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "home",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/create.png",
        label: "Registrations",
        href: "/list/registrations",
        visible: ["admin"],
      },
      {
        icon: "/mail.png",
        label: "Enquiries",
        href: "/list/enquiries",
        visible: ["admin"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/singleLesson.png",
        label: "Extra Classes",
        href: "/list/extra-classes",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/finance.png",
        label: "Fees",
        href: "/list/fees",
        visible: ["admin", "student", "parent"],
      },
      {
        icon: "/upload.png",
        label: "Materials",
        href: "/list/materials",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/view.png",
        label: "Videos",
        href: "/list/videos",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  const { userId, role: authRole } = await auth();
  const role = authRole ?? "";
  const homeHref = role ? `/${role}` : "/";
  // Until a school-set password is replaced, every page except the profile
  // redirects there, so the other links are shown as locked instead
  const locked = !!(
    userId &&
    (await prisma.user.findUnique({ where: { id: userId }, select: { mustChangePassword: true } }))
      ?.mustChangePassword
  );
  // People without an email who asked for their password to be reset
  const resetRequests =
    role === "admin" && !locked
      ? await prisma.passwordResetRequest.count({ where: { handledAt: null } })
      : 0;

  const getHref = (href: string) => {
    if (href === "home") return homeHref;
    return href;
  };

  return (
    <nav className="mt-4 text-sm pb-6">
      {locked && (
        <p className="hidden lg:block mx-1 mt-2 rounded-lg bg-lamaYellowLight px-3 py-2 text-xs text-gray-700">
          Change your password on the Profile page to unlock the menu.
        </p>
      )}
      {resetRequests > 0 && (
        <Link
          href="/settings#password-requests"
          className="hidden lg:block mx-1 mt-2 rounded-lg bg-lamaYellowLight px-3 py-2 text-xs text-gray-700 hover:brightness-95"
        >
          {resetRequests} password reset request{resetRequests === 1 ? "" : "s"} waiting →
        </Link>
      )}
      {menuItems.map((section) => (
        <div className="flex flex-col gap-1" key={section.title}>
          <span className="hidden lg:block px-3 mt-4 mb-2 text-[11px] font-semibold tracking-wider text-gray-400">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (!item.visible.includes(role)) {
              return null;
            }

            if (item.href === "logout") {
              return <MenuLogout key={item.label} />;
            }

            return (
              <MenuLink
                key={item.label}
                href={getHref(item.href)}
                icon={item.icon}
                label={item.label}
                disabled={locked && item.href !== "/profile"}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
};

export default Menu;
