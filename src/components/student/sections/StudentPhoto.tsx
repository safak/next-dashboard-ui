"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface StudentPhotoProps {
  img: any;
  setImg: React.Dispatch<React.SetStateAction<any>>;
}

export default function StudentPhoto({
  img,
  setImg,
}: StudentPhotoProps) {
  return (
    <div className="md:col-span-1">
      <label className="mb-2 block text-[8px] font-bold text-gray-600 sm:text-[11px]">
        Student Photo
      </label>

      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result: any) => setImg(result.info)}
      >
        {({ open }) =>
          typeof img === "string" || img?.secure_url ? (
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
              <Image
                src={typeof img === "string" ? img : img.secure_url}
                alt="Student"
                width={72}
                height={72}
                className="rounded-full border object-cover"
              />

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => open()}
                  className="text-xs font-medium text-sky-600 hover:text-sky-700"
                >
                  Replace Photo
                </button>

                <button
                  type="button"
                  onClick={() => setImg(undefined)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove Photo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => open()}
              className="flex h-28 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-sky-400 hover:bg-sky-50"
            >
              <Camera className="mb-2 h-6 w-6 text-slate-500" />

              <span className="text-sm font-medium text-slate-700">
                Upload Student Photo
              </span>

              <span className="mt-1 text-xs text-slate-500">
                JPG, PNG up to 2 MB
              </span>
            </button>
          )
        }
      </CldUploadWidget>
    </div>
  );
}