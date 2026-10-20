"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

interface UploadDocumentDialogProps {
  open: boolean;
  onClose: () => void;

  studentId: string;

  onUploaded?: () => void;
}

const DOCUMENT_TYPES = [
  {
    label: "Birth Certificate",
    value: "BIRTH_CERTIFICATE",
  },
  {
    label: "Aadhaar Card",
    value: "AADHAAR_CARD",
  },
  {
    label: "Passport Photo",
    value: "PASSPORT_PHOTO",
  },
  {
    label: "Transfer Certificate",
    value: "TRANSFER_CERTIFICATE",
  },
  {
    label: "Address Proof",
    value: "ADDRESS_PROOF",
  },
  {
    label: "Parent Aadhaar",
    value: "PARENT_AADHAAR",
  },
  {
    label: "Health Record",
    value: "HEALTH_RECORD",
  },
  {
    label: "Previous School Report",
    value: "PREVIOUS_REPORT",
  },
  {
    label: "Caste Certificate",
    value: "CASTE_CERTIFICATE",
  },
];

export default function UploadDocumentDialog({
  open,
  onClose,
  studentId,
  onUploaded,
}: UploadDocumentDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [documentType, setDocumentType] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("Maximum allowed file size is 10 MB.");

      e.target.value = "";

      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!documentType || !file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("studentId", studentId);
      formData.append("documentType", documentType);
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
        throw new Error(result.message);
      }

      onUploaded?.();

      onClose();

      setDocumentType("");
      setFile(null);
    } catch (error) {
      console.error(error);

      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="md"
      title="Upload Document"
      description="Upload a student document."
      icon={<Upload className="h-5 w-5" />}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={uploading || !documentType || !file}
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Document Type */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Document Type
          </label>

          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select Document</option>

            {DOCUMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Area */}

        <div
          onClick={handleChooseFile}
          className="
            cursor-pointer
            rounded-xl
            border-2
            border-dashed
            border-slate-300
            p-10
            text-center
            transition
            hover:border-blue-500
            hover:bg-blue-50
          "
        >
          <Upload className="mx-auto h-10 w-10 text-slate-400" />

          <p className="mt-3 font-medium text-slate-700">Click to upload</p>

          <p className="mt-1 text-sm text-slate-500">
            PDF, JPG, PNG (Max 10 MB)
          </p>

          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </div>

        {/* Selected File */}

        {file && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />

              <div>
                <p className="font-medium">{file.name}</p>

                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)}
                  {" MB"}
                </p>
              </div>
            </div>

            <Button size="icon" variant="ghost" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
