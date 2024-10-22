"use server";
import { currentUser } from "@/lib/auth";
import { ProfileSchema } from "@/schemas/auth.schemas";
import { z } from "zod";
import { getUserByEmail, getUserById } from "./user";
import { generateVerificationToken } from "./tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { client } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const updateUser = async (
    values: z.infer<typeof ProfileSchema>
) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }
    const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isStatus = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateVerificationToken(
      values.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await client.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    }
  });
  return { success: "User Profile Updated!" }
}