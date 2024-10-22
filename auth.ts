import NextAuth from "next-auth"
import { client } from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/auth.config";
import { getAccountByUserId, getUserById } from "./actions/auth/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./actions/auth/two-factor-confirmation";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
 } = NextAuth({
    pages: {
      signIn: "/auth/sign-in",
      error: "/auth/error"
    },
    events: {
      async linkAccount({ user }) {
        await client.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: new Date()
          }
        })
      }
    },
    callbacks: {
      async signIn({ user, account }) {
        // Allow OAuth without email verification
        if (account?.provider !== "credentials") return true;

        const existingUser = await getUserById(user.id!);

        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

          if (!twoFactorConfirmation) return false;

          // Delete two factor confirmation for next sign in
          await client.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          });
        }

        return true;
      },

      async session({ token, session }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }

        if (token.role && session.user) {
          session.user.role = token.role as UserRole;
        }

        if (session.user) {
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        }

        if (session.user) {
          session.user.name = token.name;
          session.user.email = token.email!;
          session.user.isOAuth = token.isOAuth as boolean;
        }

        return session;
      },

      async jwt({ token }) {
        if (!token.sub) return token;

        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        const existingAccount = await getAccountByUserId(
          existingUser.id
        );

        token.isOAuth = !!existingAccount;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

        return token;
      }
    },

    adapter: PrismaAdapter(client),
    session: { strategy: "jwt" },
    ...authConfig
  });

