import { z } from "zod";

export const uploadedDocumentSchema = z.object({
  originalFileName: z.string(),

  fileUrl: z.string().url(),

  publicId: z.string(),

  mimeType: z.string(),

  fileSize: z.number(),
});