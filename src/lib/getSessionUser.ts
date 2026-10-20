import { auth } from "@clerk/nextjs/server";
import type { Role, SessionUser, ClerkSessionMetadata } from "@/lib/types";

const ROLE_SET: readonly Role[] = [
  "admin",
  "teacher",
  "student",
  "parent",
];

export async function getSessionUser(): Promise<SessionUser | null> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  // ✅ Explicitly tell TS what metadata contains
  const metadata = sessionClaims?.metadata as ClerkSessionMetadata | undefined;

  const rawRole = metadata?.role;

  // ✅ Runtime + type safety
  if (!rawRole || !ROLE_SET.includes(rawRole)) {
    return null;
  }

  return {
    userId,
    role: rawRole,
    classId: typeof metadata?.classId === "number"
      ? metadata.classId
      : undefined,
  };
}
