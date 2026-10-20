"use client";

import { FolderOpen } from "lucide-react";

import DocumentCard, { StudentDocument } from "./DocumentCard";

interface DocumentGridProps {
  documents: StudentDocument[];

  onPreview?: (document: StudentDocument) => void;
  onDownload?: (document: StudentDocument) => void;
  onReplace?: (document: StudentDocument) => void;
  onUpload?: (document: StudentDocument) => void;
}

export default function DocumentGrid({
  documents,
  onPreview,
  onDownload,
  onReplace,
  onUpload,
}: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <FolderOpen className="mx-auto mb-4 h-14 w-14 text-slate-300" />

        <h3 className="text-lg font-semibold text-slate-700">No Documents</h3>

        <p className="mt-2 text-sm text-slate-500">
          No documents are available for this student.
        </p>
      </div>
    );
  }

  const uploaded = documents.filter((d) => d.status === "UPLOADED");

  const missing = documents.filter((d) => d.status === "MISSING");

  return (
    <div className="space-y-6">
      {/* Uploaded */}

      {uploaded.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <FolderOpen className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Uploaded Documents
                </h3>

                <p className="text-xs text-slate-500">
                  Available for preview & download
                </p>
              </div>
            </div>

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              {uploaded.length}
            </div>
          </div>

          <div className="space-y-3">
            {uploaded.map((document) => (
              <DocumentCard
                key={document.type}
                document={document}
                onPreview={onPreview}
                onDownload={onDownload}
                onReplace={onReplace}
              />
            ))}
          </div>
        </section>
      )}

      {/* Missing */}

      {missing.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Missing Documents
              </h3>

              <p className="text-xs text-slate-500">
                These documents still need to be uploaded.
              </p>
            </div>

            <span className="rounded-full h-7 w-7  bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {missing.length}
            </span>
          </div>

          <div className="space-y-3">
            {missing.map((document) => (
              <DocumentCard
                key={document.type}
                document={document}
                onUpload={onUpload}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
