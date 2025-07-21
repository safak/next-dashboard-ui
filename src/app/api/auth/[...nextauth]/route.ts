// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { authConfig } from "../../../../lib/auth.config"; // Corrige si nécessaire
import { dbConnection } from "@/lib/mysql";

async function getUserByEmail(email: string) {
  try {
    const [rows] = await dbConnection.query(
      `SELECT 
         user.id, 
         user.name, 
         user.email, 
         user.password,
         role.id AS roleId,
         role.name AS roleName
       FROM user
       JOIN role ON user.roleId = role.id
       WHERE user.email = ?
       LIMIT 1`,
      [email]
    );

    const result = (rows as any[])[0];
    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      email: result.email,
      password: result.password,
      roles: [{ id: result.roleId, name: result.roleName }],
    };
  } catch (error) {
    console.error("[AUTH] Erreur MySQL:", error);
    return null;
  }
}

const handler = NextAuth({
  ...authConfig,
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

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        const { password: _, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",       // <- page login personnalisée
    error: "/login",        // <- en cas d'erreur
    newUser: "/",           // <- rediriger les nouveaux
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
});

export { handler as GET, handler as POST };
