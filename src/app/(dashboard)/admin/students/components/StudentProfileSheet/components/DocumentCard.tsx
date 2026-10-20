"use client";

import {
  CalendarDays,
  Download,
  Eye,
  FileImage,
  FileText,
  RefreshCw,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export interface StudentDocument {
  id: number | string;
  title: string;
  type: string;

  status: "UPLOADED" | "MISSING";

  fileName?: string;
  fileUrl?: string;

  uploadedAt?: string;
}

interface DocumentCardProps {
  document: StudentDocument;

  onPreview?: (document: StudentDocument) => void;
  onDownload?: (document: StudentDocument) => void;
  onReplace?: (document: StudentDocument) => void;
  onUpload?: (document: StudentDocument) => void;
}

export default function DocumentCard({
  document,
  onPreview,
  onDownload,
  onReplace,
  onUpload,
}: DocumentCardProps) {
  const uploaded = document.status === "UPLOADED";

  const isImage = document.fileName?.match(/\.(jpg|jpeg|png|webp)$/i) != null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md">
      {uploaded ? (
        <>
          {/* Header */}

          <div className="flex items-center gap-3">
            {/* File Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              {isImage ? (
                <FileImage className="h-5 w-5 text-blue-600" />
              ) : (
                <FileText className="h-5 w-5 text-blue-600" />
              )}
            </div>

            {/* File Details */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {document.title}
              </h3>

              <p className="mt-1 truncate text-sm text-slate-500">
                {document.fileName}
                {document.uploadedAt &&
                  ` (${new Date(document.uploadedAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )})`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                title="Preview"
                onClick={() => onPreview?.(document)}
              >
                <Eye className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                title="Download"
                onClick={() => onDownload?.(document)}
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                title="Replace"
                onClick={() => onReplace?.(document)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Missing */}

          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <FileText className="h-5 w-5 text-red-500" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {document.title}
                </h3>

                <p className="text-xs text-red-500">Document not uploaded</p>
              </div>
            </div>

            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onUpload?.(document)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
