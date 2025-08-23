// src/lib/session.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

type UserSessionInfo = {
  role: string;
  currentUserId: string | null;
  currentUserName: string;
};

export async function getUserSessionInfo(): Promise<UserSessionInfo> {
  const session = await getServerSession(authOptions);

  const role = session?.user?.roles?.[0]?.name ?? "guest";
  const currentUserId = session?.user?.id ?? null;
  const currentUserName = session?.user?.name ?? "Invité";

  return {
    role,
    currentUserId,
    currentUserName,
  };
}
