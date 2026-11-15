import { jwtVerify, SignJWT } from "jose";

// Kept free of Prisma and next/headers so the proxy can import it too

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

export type SessionPayload = {
  userId: string;
  role: string;
  // Until they choose their own password, the proxy keeps them on /profile
  mustChangePassword?: boolean;
};

export type VerifiedSession = SessionPayload & { issuedAt: number };

const getKey = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set in .env");
  return new TextEncoder().encode(secret);
};

export const signSession = (payload: SessionPayload) =>
  new SignJWT({ role: payload.role, mcp: !!payload.mustChangePassword })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());

export const verifySession = async (
  token?: string
): Promise<VerifiedSession | null> => {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub || typeof payload.role !== "string" || !payload.iat) {
      return null;
    }
    return {
      userId: payload.sub,
      role: payload.role,
      mustChangePassword: payload.mcp === true,
      issuedAt: payload.iat,
    };
  } catch {
    return null;
  }
};
