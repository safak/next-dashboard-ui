import type { MaterialType } from "@prisma/client";

// Kept free of server-only imports so the upload form can use it too

export const MATERIAL_TYPES: MaterialType[] = [
  "STUDY_MATERIAL",
  "QUESTION_PAPER",
  "MEMORANDUM",
];

export const materialTypeLabels: Record<MaterialType, string> = {
  STUDY_MATERIAL: "Study material",
  QUESTION_PAPER: "Question paper",
  MEMORANDUM: "Memorandum",
};

export const materialTypeStyles: Record<MaterialType, string> = {
  STUDY_MATERIAL: "bg-sky-100 text-sky-800",
  QUESTION_PAPER: "bg-purple-100 text-purple-800",
  MEMORANDUM: "bg-amber-100 text-amber-800",
};

export const MAX_UPLOAD_MB = 25;

// Extension -> content type sent back on download
export const ALLOWED_FILES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".zip": "application/zip",
};

export const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
