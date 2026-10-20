import type { UploadedDocument } from "../types/document";

interface DeleteDocumentResponse {
  success: boolean;
}

export async function uploadDocument(
  file: File,
  folder: string,
): Promise<UploadedDocument> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload/document", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to upload document");
  }

  return data as UploadedDocument;
}

export async function deleteDocument(
  publicId: string,
): Promise<DeleteDocumentResponse> {
  const response = await fetch("/api/upload/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to delete document");
  }

  return data as DeleteDocumentResponse;
}
