import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { materialSchema } from "@/lib/formValidationSchemas";
import { canUploadFor, materialsDir, storedPath } from "@/lib/materials";
import { ALLOWED_FILES, IMAGE_FILES, MAX_UPLOAD_MB } from "@/lib/materialTypes";
import prisma from "@/lib/prisma";

// Uploads go through a route handler rather than a server action, which
// caps request bodies at 1 MB
export async function POST(request: Request) {
  const fail = (error: string, status = 400) => Response.json({ error }, { status });

  const { userId, role } = await auth();
  if (!userId || (role !== "admin" && role !== "teacher")) {
    return fail("You are not allowed to upload materials.", 403);
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > (MAX_UPLOAD_MB + 1) * 1024 * 1024) {
    return fail(`Files can be at most ${MAX_UPLOAD_MB} MB.`, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("The upload was incomplete. Please try again.");
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose a file to upload.");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return fail(`Files can be at most ${MAX_UPLOAD_MB} MB.`, 413);
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_FILES[ext]) {
    return fail("Upload a PDF, Word, PowerPoint, Excel, text, image or ZIP file.");
  }

  const parsed = materialSchema.safeParse(Object.fromEntries(
    ["title", "description", "type", "subjectId", "gradeId", "year"].map((k) => [k, form.get(k) ?? undefined])
  ));
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the form and try again.");
  }
  const d = parsed.data;
  if (d.type === "PICTURE" && !IMAGE_FILES.includes(ext)) {
    return fail("A picture must be a PNG, JPG, WebP or GIF image.");
  }

  if (!(await canUploadFor(role, userId, d.subjectId))) {
    return fail("You can only upload materials for subjects you teach.", 403);
  }

  const storedName = `${randomUUID()}${ext}`;
  await mkdir(materialsDir(), { recursive: true });
  await writeFile(storedPath(storedName), Buffer.from(await file.arrayBuffer()));

  try {
    await prisma.material.create({
      data: {
        title: d.title,
        description: d.description || null,
        type: d.type,
        subjectId: d.subjectId,
        gradeId: d.gradeId || null,
        year: d.year || null,
        fileName: path.basename(file.name).slice(0, 200),
        storedName,
        mimeType: ALLOWED_FILES[ext],
        size: file.size,
        uploadedById: userId,
      },
    });
  } catch (err) {
    console.log(err);
    await unlink(storedPath(storedName)).catch(() => {});
    return fail("The material couldn't be saved. Check the subject and grade.", 500);
  }

  revalidatePath("/list/materials");
  return Response.json({ ok: true }, { status: 201 });
}
