"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Upload,
  AlertTriangle,
} from "lucide-react";

import DocumentsSummary from "../components/DocumentsSummary";
import UploadDocumentDialog from "../components/UploadDocumentDialog";
import PreviewDocumentDrawer from "../components/PreviewDocumentDrawer";

import { StudentDocument } from "../components/DocumentCard";
import type { Student } from "@/types/student";

interface DocumentsSummaryType {
  uploaded: number;
  missing: number;
  total: number;
}

interface DocumentsResponse {
  success: boolean;
  summary: DocumentsSummaryType;
  documents: StudentDocument[];
}

interface DocumentsTabProps {
  student: Student;
}

interface RequiredDocument {
  title: string;
}

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  { title: "Student Photo" },
  { title: "Transfer Certificate" },
  { title: "Medical Certificate" },
  { title: "Previous School Report" },
  { title: "Caste Certificate" },
];

export default function DocumentsTab({ student }: DocumentsTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<DocumentsResponse | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [selectedDocument, setSelectedDocument] =
    useState<StudentDocument | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/students/${student.id}/documents`,
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to load documents.");
      }

      setData(result);
    } catch (error) {
      console.error("Failed to load documents:", error);
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, [student.id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  function handlePreview(document: StudentDocument) {
    setSelectedDocument(document);
    setPreviewOpen(true);
  }

  function handleReplace(document: StudentDocument) {
    setSelectedDocument(document);
    setPreviewOpen(false);
    setUploadOpen(true);
  }

  async function handleDelete(document: StudentDocument) {
    const confirmed = window.confirm(`Delete "${document.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/students/documents/${document.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to delete document.");
      }

      setPreviewOpen(false);
      setSelectedDocument(null);

      await fetchDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document.");
    }
  }

  function handleDownload(document: StudentDocument) {
    if (!document.fileUrl) {
      alert("File is not available for download.");
      return;
    }

    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  }

  function handleUploadClose() {
    setUploadOpen(false);
    setSelectedDocument(null);
  }

  function handlePreviewClose() {
    setPreviewOpen(false);
    setSelectedDocument(null);
  }

  async function handleUploaded() {
    setUploadOpen(false);
    setSelectedDocument(null);
    await fetchDocuments();
  }

  const uploadedDocuments = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.documents.filter((document) => Boolean(document.fileUrl));
  }, [data]);

  const missingDocuments = useMemo(() => {
    const uploadedTitles = new Set(
      uploadedDocuments.map((document) => document.title.toLowerCase().trim()),
    );

    return REQUIRED_DOCUMENTS.filter(
      (document) => !uploadedTitles.has(document.title.toLowerCase().trim()),
    );
  }, [uploadedDocuments]);

  const hasUploadedDocuments = uploadedDocuments.length > 0;
  const hasMissingDocuments = missingDocuments.length > 0;

  if (loading) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        </div>

        <p className="mt-3 text-sm font-medium text-slate-600">
          Loading documents...
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Please wait while the documents are loaded.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/60 px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-red-700">
          Unable to Load Documents
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-red-600">
          {error || "Something went wrong while loading documents."}
        </p>

        <button
          type="button"
          onClick={fetchDocuments}
          className="mt-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 pb-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Documents</h3>

          <p className="text-xs text-slate-500">
            View and manage documents submitted for this student.
          </p>
        </div>

        <DocumentsSummary
          uploaded={data.summary.uploaded}
          missing={data.summary.missing}
          total={data.summary.total}
        />

        {hasUploadedDocuments && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Uploaded Documents
                  </h4>

                  <p className="text-[11px] text-slate-500">
                    Available for preview and download
                  </p>
                </div>
              </div>

              <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 px-2 text-xs font-semibold text-emerald-600">
                {uploadedDocuments.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {uploadedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="group flex min-h-[58px] items-center gap-3 px-4 py-2.5 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {document.title}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Uploaded document
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handlePreview(document)}
                      title="Preview"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(document)}
                      title="Download"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReplace(document)}
                      title="Replace"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasMissingDocuments && (
          <section className="overflow-hidden rounded-xl border border-red-100 bg-white">
            <div className="flex items-center justify-between border-b border-red-50 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Missing Documents
                  </h4>

                  <p className="text-[11px] text-slate-500">
                    These documents still need to be uploaded
                  </p>
                </div>
              </div>

              <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-red-50 px-2 text-xs font-semibold text-red-600">
                {missingDocuments.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {missingDocuments.map((document) => (
                <div
                  key={document.title}
                  className="flex min-h-[58px] items-center gap-3 px-4 py-2.5 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <FileText className="h-4 w-4 text-red-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {document.title}
                    </p>

                    <p className="mt-0.5 text-[11px] text-red-500">
                      Document not uploaded
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadOpen(true)}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hasUploadedDocuments && !hasMissingDocuments && (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50">
              <FileText className="h-5 w-5 text-indigo-500" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-800">
              No Documents Available
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              No required documents have been configured for this student.
            </p>

            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Document
            </button>
          </div>
        )}
      </div>

      <UploadDocumentDialog
        open={uploadOpen}
        onClose={handleUploadClose}
        studentId={student.id}
        onUploaded={handleUploaded}
      />

      <PreviewDocumentDrawer
        open={previewOpen}
        onClose={handlePreviewClose}
        document={selectedDocument}
        onDownload={handleDownload}
        onReplace={handleReplace}
        onDelete={handleDelete}
      />
    </>
  );
}
