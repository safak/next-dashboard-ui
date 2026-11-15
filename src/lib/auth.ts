import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import prisma from "./prisma";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
} from "./session";

export type AuthResult = {
  userId: string | null;
  role: string | undefined;
  username: string | undefined;
};

// The signed cookie proves who the user is; the database lookup makes
// deleted accounts and role changes take effect straight away. cache()
// runs this once per request however many components call it.
export const auth = cache(async (): Promise<AuthResult> => {
  const session = await verifySession(
    (await cookies()).get(SESSION_COOKIE)?.value
  );
  if (!session) return { userId: null, role: undefined, username: undefined };

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, username: true },
  });
  if (!user) return { userId: null, role: undefined, username: undefined };

  return { userId: user.id, role: user.role, username: user.username };
});

// Full name from the person's profile row, falling back to the username
export const getDisplayName = cache(async () => {
  const { userId, role, username } = await auth();
  if (!userId) return "User";

  const where = { where: { id: userId }, select: { name: true, surname: true } };
  const person =
    role === "teacher"
      ? await prisma.teacher.findUnique(where)
      : role === "student"
      ? await prisma.student.findUnique(where)
      : role === "parent"
      ? await prisma.parent.findUnique(where)
      : null;

  return person ? `${person.name} ${person.surname}` : username ?? "User";
});

export const createSession = async (userId: string, role: string) => {
  // Secure cookies are dropped over plain http, which would break signing
  // in from another device on the local network (http://192.168.x.x)
  const https = (await headers()).get("x-forwarded-proto") === "https";

  (await cookies()).set(SESSION_COOKIE, await signSession({ userId, role }), {
    httpOnly: true,
    secure: https,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
};

export const deleteSession = async () => {
  (await cookies()).delete(SESSION_COOKIE);
};
