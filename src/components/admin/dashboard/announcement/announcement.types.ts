import { AnnouncementPriority } from "@prisma/client";

export interface DashboardAnnouncement {
  id: number;
  title: string;
  description: string;
  date: Date;
  className?: string | null;
  priority: AnnouncementPriority;
}