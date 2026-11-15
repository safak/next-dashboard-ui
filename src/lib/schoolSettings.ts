import { cache } from "react";
import prisma from "./prisma";

export const DEFAULT_SETTINGS = {
  schoolName: "Capital Mathematics Studies",
  academicYear: "2025/26",
  registrationFee: 0,
  siblingDiscountPercent: 0,
  paymentDueDay: 7,
  bankDetails: null as string | null,
  tagline: null as string | null,
  aboutText: null as string | null,
  missionText: null as string | null,
  contactPhone: null as string | null,
  contactEmail: null as string | null,
  address: null as string | null,
  whatsapp: null as string | null,
  officeHours: null as string | null,
  showFeesPublicly: false,
  brandColor: "#4f46e5",
  logoFile: null as string | null,
};

// The row is only created the first time an admin saves settings
export const getSettings = cache(async () => {
  const row = await prisma.setting.findUnique({ where: { id: 1 } });
  return row ?? { id: 1, ...DEFAULT_SETTINGS };
});

export type SchoolSettings = Awaited<ReturnType<typeof getSettings>>;

// Website wording, using the admin's text where it has been written and
// sensible starting text otherwise
export const siteContent = (s: SchoolSettings) => ({
  tagline:
    s.tagline ||
    "Mathematics and science tutoring that fits around you: one-on-one, in groups, at home or online.",
  about:
    s.aboutText ||
    `${s.schoolName} helps learners build confidence and results in mathematics and the subjects that depend on it. Learners choose the subjects they need and how they want to be taught, and parents can follow progress, lessons and fees from their own account.`,
  mission:
    s.missionText ||
    "To make excellent, personal maths and science teaching available to every learner, whether they learn best face to face or from home.",
  logoUrl: s.logoFile ? `/api/branding/logo?v=${encodeURIComponent(s.logoFile)}` : "/logo.png",
});
