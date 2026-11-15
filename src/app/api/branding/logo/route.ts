import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { brandingDir, LOGO_TYPES, MAX_LOGO_BYTES } from "@/lib/branding";
import prisma from "@/lib/prisma";

// The school logo, shown on the public website and sign-in pages
export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { id: 1 }, select: { logoFile: true } });
  const file = setting?.logoFile && path.basename(setting.logoFile);
  const data = file ? await readFile(path.join(brandingDir(), file)).catch(() => null) : null;
  // Relative, so it works whatever address the site is opened on
  if (!file || !data) return new Response(null, { status: 302, headers: { Location: "/logo.png" } });

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": LOGO_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      // The URL includes the file name, so a new logo gets a new URL
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

// Admins upload a new logo (PNG, JPG or WebP, up to 2 MB)
export async function POST(request: Request) {
  const { role } = await auth();
  if (role !== "admin") return Response.json({ error: "Only admins can change the logo." }, { status: 403 });

  const file = (await request.formData().catch(() => null))?.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose an image." }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!LOGO_TYPES[ext]) return Response.json({ error: "Use a PNG, JPG or WebP image." }, { status: 400 });
  if (file.size > MAX_LOGO_BYTES) return Response.json({ error: "The logo can be at most 2 MB." }, { status: 413 });

  const storedName = `logo-${randomUUID()}${ext}`;
  await mkdir(brandingDir(), { recursive: true });
  await writeFile(path.join(brandingDir(), storedName), Buffer.from(await file.arrayBuffer()));

  const previous = await prisma.setting.findUnique({ where: { id: 1 }, select: { logoFile: true } });
  await prisma.setting.upsert({
    where: { id: 1 },
    update: { logoFile: storedName },
    create: { id: 1, logoFile: storedName },
  });
  if (previous?.logoFile) {
    await unlink(path.join(brandingDir(), path.basename(previous.logoFile))).catch(() => {});
  }

  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}

// Back to the built-in logo
export async function DELETE() {
  const { role } = await auth();
  if (role !== "admin") return Response.json({ error: "Only admins can change the logo." }, { status: 403 });
  const previous = await prisma.setting.findUnique({ where: { id: 1 }, select: { logoFile: true } });
  if (previous?.logoFile) {
    await prisma.setting.update({ where: { id: 1 }, data: { logoFile: null } });
    await unlink(path.join(brandingDir(), path.basename(previous.logoFile))).catch(() => {});
  }
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
