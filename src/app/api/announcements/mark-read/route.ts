import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { announcementId } = await req.json();
  const { userId } = await auth();

  if (!userId || !announcementId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.announcementRead.create({
    data: {
      userId,
      announcementId,
    },
  });

  return Response.json({ success: true });
}
