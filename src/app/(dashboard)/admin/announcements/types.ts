import { AnnouncementPriority } from "@prisma/client";

export type AnnouncementSchema = {
  id?: number;
  title: string;
  description: string;
  priority: AnnouncementPriority;
  publishDate: Date;
  expiryDate?: Date | null;
  isPublished: boolean;
  classId: string | null;
};

export type AnnouncementRow = {
  id: number;
  title: string;
  description: string;
  priority: AnnouncementPriority;
  publishDate: Date;
  expiryDate: Date | null;
  isPublished: boolean;
  whatsappSent: boolean;
  whatsappSentAt: Date | null;
  classId: number | null;
  teacherId: string | null;
  createdByRole: string;
  createdAt: Date;
  updatedAt: Date;

  class: {
    id: number;
    name: string;
  } | null;
};

export type AnnouncementFormValues = {
  id?: number;
  title: string;
  description: string;
  priority: AnnouncementPriority;
  publishDate: Date;
  expiryDate?: Date | null;
  isPublished: boolean;
  classId: string | null;
};

export type AnnouncementFormInput = AnnouncementFormValues;

export type ClassOption = {
  id: number;
  name: string;
};

export type AnnouncementStatusFilter =
  | "all"
  | "published"
  | "draft"
  | "expired";

export type AnnouncementPriorityFilter =
  | "all"
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";
