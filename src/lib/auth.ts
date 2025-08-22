import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "./prisma";

// ✅ Fonction pour récupérer un utilisateur depuis MySQL
async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      role: true, // jointure vers la table "Role"
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    roles: [
      {
        id: user.role.id,
        name: user.role.name,
      },
    ],
  };
}


// ✅ Configuration NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await getUserByEmail(email);
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Exclure le mot de passe de l'objet retourné
        const { password: _, ...safeUser } = user;
        return safeUser as User;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.roles = token.roles as Array<{ id: string; name: string }>;
      }
      return session;
    },
  },
};

// ✅ Pour les routes API Next.js
export const handler = NextAuth(authOptions);

// ✅ Pour usage dans layout.tsx, etc.
export async function auth() {
  return await getServerSession(authOptions);
}
