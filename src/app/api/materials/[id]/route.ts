import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import { auth } from "@/lib/auth";
import { materialAccessWhere, storedPath } from "@/lib/materials";
import { isImageType } from "@/lib/materialTypes";
import prisma from "@/lib/prisma";

// Downloads a material, checking the signed-in user may see it. Images can
// instead be shown in the browser with ?view=1
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, role } = await auth();
  if (!userId) return new Response("Please sign in.", { status: 401 });

  const access = await materialAccessWhere(role, userId);
  const id = parseInt((await params).id);
  const material =
    access && Number.isInteger(id)
      ? await prisma.material.findFirst({ where: { AND: [{ id }, access] } })
      : null;
  // Same answer for "doesn't exist" and "not yours" so ids can't be probed
  if (!material) return new Response("Not found.", { status: 404 });

  const filePath = storedPath(material.storedName);
  const info = await stat(filePath).catch(() => null);
  if (!info) return new Response("The file is missing on the server.", { status: 410 });

  const inline = isImageType(material.mimeType) && new URL(request.url).searchParams.has("view");
  const ascii = material.fileName.replace(/[^\x20-\x7e]|["\\]/g, "_");
  return new Response(Readable.toWeb(createReadStream(filePath)) as ReadableStream, {
    headers: {
      "Content-Type": material.mimeType,
      "Content-Length": String(info.size),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(material.fileName)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
