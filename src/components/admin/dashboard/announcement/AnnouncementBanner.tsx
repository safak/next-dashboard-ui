import prisma from "@/lib/prisma";
import AnnouncementSlider from "./AnnouncementSlider";
import { DashboardAnnouncement } from "./announcement.types";

export default async function AnnouncementBanner() {
  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      publishDate: "desc",
    },
    include: {
      class: true,
    },
    take: 5,
  });

  const data: DashboardAnnouncement[] = announcements.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.publishDate,
    priority: item.priority,
    className: item.class?.name ?? null,
  }));

  return <AnnouncementSlider announcements={data} />;
}