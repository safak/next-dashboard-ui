import { NextRequest, NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";
import { SESSION_COOKIE, verifySession } from "./lib/session";

// Route keys are regex-style patterns such as "/admin(.*)"
const matchers = Object.keys(routeAccessMap).map((route) => ({
  pattern: new RegExp(`^${route}$`),
  allowedRoles: routeAccessMap[route],
}));

export default async function proxy(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = req.nextUrl;

  if (!session) {
    // Signed-out users may only see the sign-in page
    if (matchers.some(({ pattern }) => pattern.test(pathname))) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return;
  }

  // A password set by an admin must be replaced before anything else. The
  // sign-in page stays reachable in case this session has been revoked.
  if (session.mustChangePassword) {
    return pathname === "/profile" || pathname === "/"
      ? undefined
      : NextResponse.redirect(new URL("/profile", req.url));
  }

  for (const { pattern, allowedRoles } of matchers) {
    if (pattern.test(pathname) && !allowedRoles.includes(session.role)) {
      return NextResponse.redirect(new URL(`/${session.role}`, req.url));
    }
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals, API routes (they check access themselves, and
    // the proxy would cut uploads off at 10 MB) and all static files
    '/((?!_next|api/|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
