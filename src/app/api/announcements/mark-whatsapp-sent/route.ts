import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { announcementId } = await req.json();
  const { userId } = await auth();

  if (!userId || !announcementId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.announcement.update({
    where: { id: announcementId },
    data: {
      whatsappSent: true,
      whatsappSentAt: new Date(),
    },
  });

  return Response.json({ success: true });
}
