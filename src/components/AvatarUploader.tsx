"use client";

import { useRef } from "react";
import Image from "next/image";
import { uploadAvatar } from "@/lib/actions";

export default function AvatarUploader({
  userId,
  img,
  initials,
}: {
  userId: string;
  img?: string | null;
  initials: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative w-28 h-28 group cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      {img ? (
        <Image
          src={img}
          alt="Profile"
          fill
          className="rounded-full object-cover border"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-blue-100 border flex items-center justify-center text-3xl font-semibold text-blue-600">
          {initials}
        </div>
      )}

      {/* Hover edit */}
      <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
        ✎
      </div>

      {/* Hidden auto-submit form */}
      <form action={uploadAvatar} className="hidden">
        <input type="hidden" name="id" value={userId} />
        <input
          ref={inputRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        />
      </form>
    </div>
  );
}
