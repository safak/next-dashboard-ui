import { client } from "@/lib/prisma"

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await client.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await client.passwordResetToken.findFirst({
      where: { email }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};