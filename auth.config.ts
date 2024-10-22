import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserLoginSchema } from "@/schemas/auth.schemas";
import { getUserByEmail } from "@/actions/auth/user";

export default {
    providers: [
      Credentials({
        async authorize(credentials) {
          const validatedFields = UserLoginSchema.safeParse(credentials);
  
          if (validatedFields.success) {
            const { email, password } = validatedFields.data;
            
            const user = await getUserByEmail(email);
            if (!user || !user.password) return null;
  
            const passwordsMatch = await bcrypt.compare(
              password,
              user.password,
            );
  
            if (passwordsMatch) return user;
          }
  
          return null;
        }
      })
    ],
  } satisfies NextAuthConfig