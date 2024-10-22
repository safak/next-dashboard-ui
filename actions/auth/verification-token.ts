import { client } from "@/lib/prisma";

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await client.verificationToken.findUnique({
        where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await client.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
  } catch {
    return null;
  }
}