"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Upload,
} from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";

interface StudentDocument {
  id: number;
  title: string;
  type: string;
  status: "UPLOADED" | "MISSING";
  fileName?: string;
  fileUrl?: string;
}

interface DocumentSummary {
  uploaded: number;
  missing: number;
  total: number;
}

interface DocumentsSectionProps {
  studentId: string;
}

export default function DocumentsSection({ studentId }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [summary, setSummary] = useState<DocumentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/students/${studentId}/documents`,
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to load documents.");
      }

      setDocuments(result.documents ?? []);
      setSummary(result.summary ?? null);
    } catch (error) {
      console.error("Failed to load documents:", error);
      setDocuments([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const requiredTypes = [
    "BIRTH_CERTIFICATE",
    "AADHAAR_CARD",
    "PARENT_AADHAAR",
    "ADDRESS_PROOF",
  ];

  const requiredDocuments = documents.filter((document) =>
    requiredTypes.includes(document.type),
  );

  const optionalDocuments = documents.filter(
    (document) => !requiredTypes.includes(document.type),
  );

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading documents...
        </div>
      </div>
    );
  }

  const completionPercentage =
    summary && summary.total > 0
      ? Math.round((summary.uploaded / summary.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Student Documents"
        description="Upload, replace and manage admission documents."
      />

      {summary && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Document Completion
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {summary.uploaded} of {summary.total} documents uploaded
              </p>
            </div>

            <span className="text-sm font-semibold text-indigo-600">
              {completionPercentage}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

          {summary.missing > 0 && (
            <p className="mt-2 text-xs text-red-500">
              {summary.missing} document
              {summary.missing > 1 ? "s" : ""} still missing
            </p>
          )}
        </div>
      )}

      <DocumentGroup
        title="Required Documents"
        documents={requiredDocuments}
        studentId={studentId}
        onUploaded={loadDocuments}
      />

      {optionalDocuments.length > 0 && (
        <DocumentGroup
          title="Optional Documents"
          documents={optionalDocuments}
          studentId={studentId}
          onUploaded={loadDocuments}
        />
      )}
    </div>
  );
}

interface DocumentGroupProps {
  title: string;
  documents: StudentDocument[];
  studentId: string;
  onUploaded: () => void;
}

function DocumentGroup({
  title,
  documents,
  studentId,
  onUploaded,
}: DocumentGroupProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        <span className="text-xs text-slate-400">
          {documents.length} document
          {documents.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {documents.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-slate-500">
            No documents available.
          </div>
        ) : (
          documents.map((document) => (
            <DocumentCard
              key={document.type}
              studentId={studentId}
              document={document}
              onUploaded={onUploaded}
            />
          ))
        )}
      </div>
    </section>
  );
}

interface DocumentCardProps {
  studentId: string;
  document: StudentDocument;
  onUploaded: () => void;
}

function DocumentCard({ studentId, document, onUploaded }: DocumentCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploaded = document.status === "UPLOADED";

  async function uploadDocument(file: File) {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("documentType", document.type);
      formData.append("file", file);

      const response = await fetch(
        `/api/admin/students/${studentId}/documents`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to upload document.");
      }

      await onUploaded();
    } catch (error) {
      console.error("Failed to upload document:", error);

      alert(
        error instanceof Error ? error.message : "Failed to upload document.",
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    uploadDocument(file);
  }

  function handlePreview() {
    if (!document.fileUrl) {
      alert("File is not available for preview.");
      return;
    }

    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownload() {
    if (!document.fileUrl) {
      alert("File is not available for download.");
      return;
    }

    const link = window.document.createElement("a");

    link.href = document.fileUrl;
    link.download = document.fileName || `${document.title}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    window.document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-b-0 transition hover:bg-slate-50">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            uploaded ? "bg-emerald-50" : "bg-red-50"
          }`}
        >
          {uploaded ? (
            <FileText className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {document.title}
          </p>

          {uploaded ? (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

              <span className="truncate text-xs text-emerald-600">
                {document.fileName || "Uploaded"}
              </span>
            </div>
          ) : (
            <span className="text-xs text-red-500">Document not uploaded</span>
          )}
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-1.5">
        {uploaded && document.fileUrl ? (
          <>
            <IconButton
              icon={<Eye className="h-4 w-4" />}
              title="Preview"
              onClick={handlePreview}
            />

            <IconButton
              icon={<Download className="h-4 w-4" />}
              title="Download"
              onClick={handleDownload}
            />

            <IconButton
              icon={
                uploading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )
              }
              title="Replace"
              onClick={() => {
                if (!uploading) {
                  inputRef.current?.click();
                }
              }}
            />
          </>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}

            {uploading ? "Uploading..." : "Upload"}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

function IconButton({ icon, title, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
    >
      {icon}
    </button>
  );
}
