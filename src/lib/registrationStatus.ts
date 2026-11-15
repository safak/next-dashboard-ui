import { RegistrationStatus } from "@prisma/client";

export const REGISTRATION_STATUSES: RegistrationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export const registrationStatusStyles: Record<RegistrationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export const registrationStatusLabel = (s: string) =>
  s.charAt(0) + s.slice(1).toLowerCase();
