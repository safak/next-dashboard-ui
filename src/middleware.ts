import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap, Role } from "./lib/settings";

const roleMatchers = Object.entries(routeAccessMap).map(([pattern, roles]) => ({
  matcher: createRouteMatcher([pattern]),
  allowedRoles: roles as Role[],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  const url = req.nextUrl;
  const pathname = url.pathname;

  const isTeacherApi = pathname.startsWith("/api/mobile/teacher");
  const isAdminApi = pathname.startsWith("/api/admin");

  /* ---------------------------------------------
   * API authentication
   * ------------------------------------------- */

  if (isTeacherApi || isAdminApi) {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  /* ---------------------------------------------
   * Public access
   * ------------------------------------------- */

  if (!userId) {
    return NextResponse.next();
  }

  /* ---------------------------------------------
   * Extract role
   * ------------------------------------------- */

  const role = (sessionClaims?.metadata as { role?: Role })?.role;

  if (!role) {
    return NextResponse.next();
  }

  /* ---------------------------------------------
   * Logged-in user on home
   * ------------------------------------------- */

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  /* ---------------------------------------------
   * Prevent logged-in users from sign-in
   * ------------------------------------------- */

  if (pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  /* ---------------------------------------------
   * Role-based access
   * ------------------------------------------- */

  for (const { matcher, allowedRoles } of roleMatchers) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:css|js|jpg|jpeg|png|gif|svg|ico)).*)",
  ],
};
