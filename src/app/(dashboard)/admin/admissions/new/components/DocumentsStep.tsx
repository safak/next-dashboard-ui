"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FileText,
  ShieldCheck,
  HeartPulse,
  CheckCircle2,
  Upload,
  Eye,
  RefreshCw,
  Trash2,
  Loader2,
} from "lucide-react";

import { uploadDocument, deleteDocument } from "@/services/upload.service";

import type { UploadedDocument } from "@/types/document";

import { StudentRegistrationFormValues } from "@/lib/formValidationSchemas";

function DocumentRow({
  control,
  name,
  title,
  optional = false,
  error,
  setValue,
  trigger,
}: {
  control: any;
  name: any;
  title: string;
  optional?: boolean;
  error?: string;
  setValue: any;
  trigger: any;
}) {
  const document = useWatch({
    control,
    name,
  }) as UploadedDocument | undefined;

  const [uploading, setUploading] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const uploaded =
    !!document && typeof document === "object" && !!document.fileUrl;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    try {
      setUploading(true);

      const uploadedDocument = await uploadDocument(
        selectedFile,
        "students/documents",
      );

      setValue(name, uploadedDocument, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      await trigger(name);
    } catch (error) {
      console.error(error);

      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  }

  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    try {
      setUploading(true);

      if (document?.publicId) {
        await deleteDocument(document.publicId);
      }

      const uploadedDocument = await uploadDocument(
        selectedFile,
        "students/documents",
      );

      setValue(name, uploadedDocument, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      await trigger(name);
    } catch (error) {
      console.error(error);

      alert("Failed to replace document.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!document) return;

    try {
      setDeleting(true);

      await deleteDocument(document.publicId);

      setValue(name, undefined, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      await trigger(name);
    } catch (error) {
      console.error(error);

      alert("Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  }

  function handleView() {
    if (!document) return;

    window.open(document.fileUrl, "_blank");
  }

  return (
    <div
      className={`flex items-center justify-between rounded-lg border bg-white px-4 py-3 transition ${
        error
          ? "border-red-300 bg-red-50/30"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            uploaded
              ? "bg-emerald-100 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : uploaded ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-slate-900">{title}</h4>

            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                optional
                  ? "bg-slate-100 text-slate-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {optional ? "Optional" : "Required"}
            </span>
          </div>

          {uploaded ? (
            <>
              <p className="mt-1 text-xs text-emerald-600">
                ✓ Uploaded successfully
              </p>

              <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                {document.originalFileName}
              </p>
            </>
          ) : error ? (
            <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Pending Upload</p>
          )}
        </div>
      </div>

      {!uploaded ? (
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.webp"
            onChange={handleUpload}
            disabled={uploading}
          />

          <span className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}

            {uploading ? "Uploading..." : "Upload"}
          </span>
        </label>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleView}
            className="rounded-lg border p-2 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
          </button>

          <label className="cursor-pointer rounded-lg border p-2 hover:bg-slate-50">
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.webp"
              onChange={handleReplace}
            />

            <RefreshCw className="h-4 w-4" />
          </label>

          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  uploaded,
  total,
  icon: Icon,
  children,
}: {
  title: string;
  uploaded: number;
  total: number;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-sky-600" />

          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>

        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
          {uploaded}/{total}
        </span>
      </div>

      <div className="space-y-3 p-4">{children}</div>
    </div>
  );
}

export default function DocumentsStep() {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<StudentRegistrationFormValues>();

  const documents = useWatch({
    control,
    name: "documents",
  }) as StudentRegistrationFormValues["documents"];

  const studentUploaded = [
    documents?.birthCertificate,
    documents?.studentAadhaar,
    documents?.transferCertificate,
  ].filter(Boolean).length;

  const parentUploaded = [
    documents?.parentAadhaar,
    documents?.addressProof,
  ].filter(Boolean).length;

  const medicalUploaded = [
    documents?.vaccinationRecord,
    documents?.medicalCertificate,
  ].filter(Boolean).length;

  const uploadedCount = studentUploaded + parentUploaded + medicalUploaded;

  const totalDocuments = 7;

  const progress = Math.round((uploadedCount / totalDocuments) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h2 className="text-2xl font-semibold">Documents</h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload the required admission documents.
        </p>

        {/* Progress */}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>

            <span className="font-semibold text-sky-600">
              {uploadedCount} / {totalDocuments} Uploaded
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-300"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
            <p className="mt-2 text-xs text-slate-500">
              Supported formats: JPG, PNG, WEBP and PDF (Max 10 MB)
            </p>
          </div>
        </div>
      </div>

      <Section
        title="Student Documents"
        uploaded={studentUploaded}
        total={3}
        icon={FileText}
      >
        <DocumentRow
          control={control}
          setValue={setValue}
          trigger={trigger}
          name="documents.birthCertificate"
          title="Birth Certificate"
          error={errors.documents?.birthCertificate?.message}
        />

        <DocumentRow
          control={control}
          setValue={setValue}
          trigger={trigger}
          name="documents.studentAadhaar"
          title="Student Aadhaar"
          error={errors.documents?.studentAadhaar?.message}
        />

        <DocumentRow
          control={control}
          setValue={setValue}
          trigger={trigger}
          name="documents.transferCertificate"
          title="Transfer Certificate"
          optional
        />
      </Section>

      <Section
        title="Parent Documents"
        uploaded={parentUploaded}
        total={2}
        icon={ShieldCheck}
      >
        <DocumentRow
          control={control}
          setValue={setValue}
          trigger={trigger}
          name="documents.parentAadhaar"
          title="Parent Aadhaar"
          error={errors.documents?.parentAadhaar?.message}
        />

        <DocumentRow
          control={control}
          setValue={setValue}
          trigger={trigger}
          name="documents.addressProof"
          title="Address Proof"
          error={errors.documents?.addressProof?.message}
        />
      </Section>

      <Section
        title="Medical Documents"
        uploaded={medicalUploaded}
        total={2}
        icon={HeartPulse}
      >
        <DocumentRow
          control={control}
          setValue={setValue}
          trigger={trigger}
          name="documents.vaccinationRecord"
          title="Vaccination Record"
          optional
        />

        <DocumentRow
          control={control}
          setValue={setValue}
          trigger={trigger}
          name="documents.medicalCertificate"
          title="Medical Certificate"
          optional
        />
      </Section>
    </div>
  );
}
