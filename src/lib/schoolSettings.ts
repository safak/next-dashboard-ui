import { cache } from "react";
import prisma from "./prisma";

export const DEFAULT_SETTINGS = {
  schoolName: "Capital Mathematics Studies",
  academicYear: "2025/26",
};

// The row is only created the first time an admin saves settings
export const getSettings = cache(async () => {
  const row = await prisma.setting.findUnique({ where: { id: 1 } });
  return row ?? { id: 1, ...DEFAULT_SETTINGS };
});
