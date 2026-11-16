import "server-only";
import path from "path";
import prisma from "./prisma";

// Uploaded files are kept outside /public so every download goes through
// the access check in /api/materials/[id]
export const materialsDir = () =>
  process.env.MATERIALS_DIR || path.join(process.cwd(), "storage", "materials");

export const storedPath = (storedName: string) =>
  path.join(materialsDir(), path.basename(storedName));

// Filter on subject and grade that fits both materials and video playlists
export type LearnerScope = {
  OR?: LearnerScope[];
  gradeId?: number | null;
  subjectId?: { in: number[] };
};

// A learner sees materials and playlists for the subjects they registered for, in their
// grade (or for all grades). Learners added before subject registration
// existed have no subjects yet, so they see their grade's materials.
const learnerWhere = (student: {
  gradeId: number;
  subjects: { subjectId: number }[];
}): LearnerScope => ({
  OR: [{ gradeId: null }, { gradeId: student.gradeId }],
  ...(student.subjects.length > 0 && {
    subjectId: { in: student.subjects.map((s) => s.subjectId) },
  }),
});

// Materials (and playlists) a user may see; null means none
export const materialAccessWhere = async (
  role: string | undefined,
  userId: string | null
): Promise<LearnerScope | null> => {
  if (!userId) return null;
  if (role === "admin" || role === "teacher") return {};

  const studentSelect = {
    gradeId: true,
    subjects: { select: { subjectId: true } },
  } as const;

  if (role === "student") {
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: studentSelect,
    });
    return student ? learnerWhere(student) : null;
  }

  if (role === "parent") {
    const children = await prisma.student.findMany({
      where: { parentId: userId },
      select: studentSelect,
    });
    return children.length ? { OR: children.map(learnerWhere) } : null;
  }

  return null;
};

// Admins upload for any subject; teachers for the subjects they teach.
// The same goes for building playlists.
export const canUploadFor = async (
  role: string | undefined,
  userId: string | null,
  subjectId: number
) => {
  if (role === "admin") return true;
  if (role !== "teacher" || !userId) return false;
  const teaches = await prisma.subject.count({
    where: { id: subjectId, teachers: { some: { id: userId } } },
  });
  return teaches > 0;
};

export const canDeleteMaterial = (
  role: string | undefined,
  userId: string | null,
  material: { uploadedById: string }
) => role === "admin" || (role === "teacher" && material.uploadedById === userId);
