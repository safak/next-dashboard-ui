"use client";

import Image from "next/image";
import {
  Download,
  FileText,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import { StudentDocument } from "./DocumentCard";

interface PreviewDocumentDrawerProps {
  open: boolean;

  onClose: () => void;

  document: StudentDocument | null;

  onDownload?: (document: StudentDocument) => void;

  onReplace?: (document: StudentDocument) => void;

  onDelete?: (document: StudentDocument) => void;
}

export default function PreviewDocumentDrawer({
  open,
  onClose,
  document,
  onDownload,
  onReplace,
  onDelete,
}: PreviewDocumentDrawerProps) {
  if (!document) return null;

  const extension = document.fileName?.split(".").pop()?.toLowerCase() ?? "";

  const isImage = ["jpg", "jpeg", "png", "webp"].includes(extension);

  const isPdf = extension === "pdf";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="lg"
      title={document.title}
      description="Document Preview"
      icon={<FileText className="h-5 w-5" />}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button variant="outline" onClick={() => onReplace?.(document)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Replace
          </Button>

          <Button variant="destructive" onClick={() => onDelete?.(document)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* File Information */}

        <div className="rounded-xl border bg-slate-50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Document</p>

              <p className="font-medium">{document.title}</p>
            </div>

            <div>
              <p className="text-slate-500">File Name</p>

              <p className="font-medium truncate">{document.fileName}</p>
            </div>

            <div>
              <p className="text-slate-500">Uploaded</p>

              <p className="font-medium">
                {document.uploadedAt
                  ? new Date(document.uploadedAt).toLocaleDateString("en-IN")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Type</p>

              <p className="font-medium">{extension.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Preview */}

        <div className="overflow-hidden rounded-xl border bg-slate-100">
          {isImage && document.fileUrl && (
            <div className="relative h-[500px] w-full">
              <Image
                src={document.fileUrl}
                alt={document.title}
                fill
                className="object-contain"
              />
            </div>
          )}

          {isPdf && document.fileUrl && (
            <iframe
              src={document.fileUrl}
              title={document.title}
              className="h-[600px] w-full"
            />
          )}

          {!isImage && !isPdf && (
            <div className="flex h-[300px] flex-col items-center justify-center">
              <FileText className="mb-4 h-16 w-16 text-slate-400" />

              <p className="font-semibold text-slate-700">
                Preview not available
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Download the file to view it.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => onDownload?.(document)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>

          {document.fileUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(document.fileUrl, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
