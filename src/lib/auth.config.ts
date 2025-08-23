// auth.config.ts
import type { NextAuthOptions } from "next-auth";

export const authConfig: Partial<NextAuthOptions> = {
  pages: {
    signIn: "/login",
  },
};
