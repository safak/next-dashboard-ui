import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function ensureAdminExists(userId: string) {
  const existing = await prisma.admin.findUnique({
    where: { id: userId },
  });

  if (existing) return existing;

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Clerk user not found");
  }

  return prisma.admin.create({
    data: {
      id: userId,
      username:
        clerkUser.username ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        "admin",
      img: clerkUser.imageUrl,
    },
  });
}
