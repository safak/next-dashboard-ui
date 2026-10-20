import prisma from "@/lib/prisma";
import AnnouncementsDashboard from "./components/AnnouncementsDashboard";

export default async function AnnouncementsPage() {
  const [announcements, classes] = await Promise.all([
    prisma.announcement.findMany({
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
    }),

    prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <AnnouncementsDashboard announcements={announcements} classes={classes} />
  );
}
