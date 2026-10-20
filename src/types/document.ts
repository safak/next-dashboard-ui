export interface UploadedDocument {
  originalFileName: string;

  fileUrl: string;

  publicId: string;

  folder?: string;

  mimeType: string;

  fileSize: number;
}

/**
 * Response returned from /api/upload/document
 */
export type DocumentUploadResponse = UploadedDocument;

/**
 * Value stored in React Hook Form
 */
export type StudentDocumentFormValue = UploadedDocument;