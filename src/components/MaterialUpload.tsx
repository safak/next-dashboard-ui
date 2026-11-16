"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  ALLOWED_FILES,
  formatFileSize,
  IMAGE_FILES,
  MATERIAL_TYPES,
  materialTypeLabels,
  MAX_UPLOAD_MB,
  yearRequired,
} from "@/lib/materialTypes";

type Option = { id: number; name: string };

const label = "text-xs font-medium text-gray-600";

// Upload button and dialog. Sends the file to /api/materials with progress
const MaterialUpload = ({ subjects, grades }: { subjects: Option[]; grades: Option[] }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("STUDY_MATERIAL");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const close = () => {
    if (progress !== null) return; // don't abandon an upload in flight
    setOpen(false);
    setError(null);
    setFile(null);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!file) return setError("Choose a file to upload.");
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      return setError(`Files can be at most ${MAX_UPLOAD_MB} MB.`);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/materials");
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => {
      setProgress(null);
      if (xhr.status === 201) {
        toast("Material uploaded!");
        formRef.current?.reset();
        setFile(null);
        setOpen(false);
        router.refresh();
      } else {
        let message = "The upload failed. Please try again.";
        try {
          message = JSON.parse(xhr.responseText).error ?? message;
        } catch {}
        setError(message);
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError("The upload failed. Check your connection and try again.");
    };
    setProgress(0);
    xhr.send(new FormData(e.currentTarget));
  };

  return (
    <>
      <button
        type="button"
        title="Upload material"
        onClick={() => setOpen(true)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow transition hover:brightness-95"
      >
        <Image src="/create.png" alt="" width={16} height={16} />
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div role="dialog" aria-modal="true" className="bg-white p-6 rounded-2xl shadow-xl relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={close}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Upload material</h2>

            {subjects.length === 0 ? (
              <p className="text-sm text-gray-600">
                You aren&apos;t assigned to teach any subject yet, so you can&apos;t
                upload materials. Ask an admin to add you to a subject.
              </p>
            ) : (
              <form ref={formRef} onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="m-title" className={label}>Title</label>
                  <input id="m-title" name="title" required maxLength={150} className="form-control" placeholder="e.g. Algebra revision notes" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-type" className={label}>Type</label>
                  <select id="m-type" name="type" className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                    {MATERIAL_TYPES.map((t) => (
                      <option key={t} value={t}>{materialTypeLabels[t]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-subject" className={label}>Subject</label>
                  <select id="m-subject" name="subjectId" required defaultValue="" className="form-control">
                    <option value="" disabled>Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-grade" className={label}>Grade</label>
                  <select id="m-grade" name="gradeId" defaultValue="" className="form-control">
                    <option value="">All grades</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-year" className={label}>
                    Year {!yearRequired(type) && <span className="text-gray-400 font-normal">(optional)</span>}
                  </label>
                  <input
                    id="m-year"
                    name="year"
                    type="number"
                    min={1990}
                    max={2100}
                    required={yearRequired(type)}
                    placeholder={String(new Date().getFullYear())}
                    className="form-control"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="m-desc" className={label}>
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea id="m-desc" name="description" rows={2} maxLength={1000} className="form-control" placeholder="e.g. Paper 1, November exam" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="m-file" className={label}>File</label>
                  <input
                    id="m-file"
                    name="file"
                    type="file"
                    required
                    accept={(type === "PICTURE" ? IMAGE_FILES : Object.keys(ALLOWED_FILES)).join(",")}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-lamaSkyLight file:px-3 file:py-2 file:text-sm file:text-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    {file ? `${file.name} · ${formatFileSize(file.size)}` : type === "PICTURE"
                      ? `PNG, JPG, WebP or GIF, up to ${MAX_UPLOAD_MB} MB.`
                      : `PDF, Word, PowerPoint, Excel, images or ZIP, up to ${MAX_UPLOAD_MB} MB.`}
                  </p>
                </div>

                {error && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}
                {progress !== null && (
                  <div className="sm:col-span-2 h-2 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-valuenow={progress}>
                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}
                <button className="btn-primary sm:col-span-2" disabled={progress !== null}>
                  {progress !== null ? `Uploading... ${progress}%` : "Upload"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialUpload;
