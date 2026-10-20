import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Class } from "@prisma/client";

/* ✅ Explicit type */
type AnnouncementWithClass = Announcement & {
  class: Class | null;
};

const Announcements = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  let announcements: AnnouncementWithClass[] = [];

  /* -------------------------
     ADMIN → ALL ANNOUNCEMENTS
  -------------------------- */
  if (role === "admin") {
    announcements = await prisma.announcement.findMany({
      include: { class: true },
      orderBy: { publishDate: "desc" },
      take: 5,
    });
  } else if (role === "teacher" && userId) {

  /* -------------------------
     TEACHER → GLOBAL + SUPERVISED CLASSES
  -------------------------- */
    const teacherClasses = await prisma.class.findMany({
      where: { supervisorId: userId },
      select: { id: true },
    });

    const classIds = teacherClasses.map((c) => c.id);

    announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { classId: null }, // global
          { classId: { in: classIds } }, // supervised classes
        ],
      },
      include: { class: true },
      orderBy: { publishDate: "desc" },
      take: 5,
    });
  } else if (role === "student" && userId) {

  /* -------------------------
     STUDENT → GLOBAL + OWN CLASS
  -------------------------- */
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: { classId: true },
    });

    announcements = await prisma.announcement.findMany({
      where: {
        OR: [{ classId: null }, { classId: student?.classId }],
      },
      include: { class: true },
      orderBy: { publishDate: "desc" },
      take: 5,
    });
  } else if (role === "parent" && userId) {

  /* -------------------------
     PARENT → GLOBAL + CHILD CLASSES
  -------------------------- */
    const parent = await prisma.parent.findUnique({
      where: { id: userId },
      select: {
        students: { select: { classId: true } },
      },
    });

    const classIds = parent?.students.map((s) => s.classId) ?? [];

    announcements = await prisma.announcement.findMany({
      where: {
        OR: [{ classId: null }, { classId: { in: classIds } }],
      },
      include: { class: true },
      orderBy: { publishDate: "desc" },
      take: 5,
    });
  }

  /* -------------------------
     EMPTY STATE
  -------------------------- */
  if (announcements.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <p className="text-sm text-gray-400">
          No announcements have been published yet.
        </p>
      </div>
    );
  }

  /* -------------------------
     UI
  -------------------------- */
  return (
    <div className="bg-white p-2 rounded-md shadow-sm flex flex-col gap-3">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        📢 Announcements
      </h3>

      {announcements.map((a) => (
        <div
          key={a.id}
          className="p-3 rounded-md border bg-gray-50 hover:bg-gray-100 transition"
        >
          <h4 className="text-xs sm:text-sm font-medium text-gray-900">
            {a.title}
          </h4>

          <p className="text-xs text-gray-500 mt-1">
            {a.class?.name ?? "All Classes"} ·{" "}
            {new Date(a.publishDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
