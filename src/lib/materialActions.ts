"use server";

import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { auth } from "./auth";
import { canDeleteMaterial, storedPath } from "./materials";
import prisma from "./prisma";

export const deleteMaterial = async (
  _state: { success: boolean; error: boolean; message?: string },
  formData: FormData
) => {
  const { userId, role } = await auth();
  const id = parseInt(String(formData.get("id")));

  const material = Number.isInteger(id)
    ? await prisma.material.findUnique({ where: { id } })
    : null;
  if (!material || !canDeleteMaterial(role, userId, material)) {
    return { success: false, error: true, message: "You can't delete this material." };
  }

  await prisma.material.delete({ where: { id } });
  // A file already missing on disk doesn't matter once the record is gone
  await unlink(storedPath(material.storedName)).catch(() => {});

  revalidatePath("/list/materials");
  return { success: true, error: false };
};
