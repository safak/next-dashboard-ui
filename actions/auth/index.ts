"use server";

import { client } from "@/lib/prisma"
import { UserRegistrationSchema, UserLoginSchema, ResetSchema } from "@/schemas/auth.schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getUserByEmail } from "./user";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generatePasswordResetToken, generateTwoFactorToken, generateVerificationToken } from "./tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendPasswordResetEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "./two-factor-token";
import { getTwoFactorConfirmationByUserId } from "./two-factor-confirmation";


export const onUserRegistration = async (values: z.infer<typeof UserRegistrationSchema>) => {
  const validatedFields = UserRegistrationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, role, isTwoFactorEnabled, isStatus } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }
  await client.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      isTwoFactorEnabled,
      isStatus,
    }
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "Confirmation email sent!" };
}


export const onLoginUser = async (
  values: z.infer<typeof UserLoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = UserLoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(
        existingUser.email
      );

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await client.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await client.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      await client.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        }
      });
     
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
      );

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error;
  }
}

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid emaiL!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Reset email sent!" };
}




//logout user
export const OnLogout = async () => {
  await signOut();
};
