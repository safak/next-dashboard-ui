"use client";

import Image from "next/image";
import { Eye, EyeOff, Loader2, Maximize2, Trash2 } from "lucide-react";

type GalleryImage = {
  id: number;
  fileName: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPublished: boolean;
};

interface GalleryImageGridProps {
  images: GalleryImage[];
  eventTitle: string;
  deletingId: number | null;
  updatingImageId: number | null;
  onPreview: (image: GalleryImage) => void;
  onTogglePublished: (imageId: number, value: boolean) => void;
  onDelete: (imageId: number) => void;
}

export default function GalleryImageGrid({
  images,
  eventTitle,
  deletingId,
  updatingImageId,
  onPreview,
  onTogglePublished,
  onDelete,
}: GalleryImageGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {images.map((image) => (
        <div
          key={image.id}
          className="
            group
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
            transition
            duration-200
            hover:border-[#4B517D]/20
            hover:shadow-md
          "
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Image
              src={image.imageUrl}
              alt={image.altText || `${eventTitle} image`}
              fill
              className="
                object-cover
                transition
                duration-300
                group-hover:scale-105
              "
            />

            <div className="absolute left-2 top-2">
              <span
                className={`
                  rounded-full
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  ${
                    image.isPublished
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-700/80 text-white"
                  }
                `}
              >
                {image.isPublished ? "Published" : "Hidden"}
              </span>
            </div>

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                gap-2
                bg-black/40
                opacity-0
                transition
                duration-200
                group-hover:opacity-100
              "
            >
              <button
                type="button"
                onClick={() => onPreview(image)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#4B517D]
                  shadow-lg
                  transition
                  hover:scale-110
                "
                title="Preview image"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onTogglePublished(image.id, !image.isPublished)}
                disabled={updatingImageId === image.id}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#4B517D]
                  shadow-lg
                  transition
                  hover:scale-110
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                title={image.isPublished ? "Hide image" : "Publish image"}
              >
                {updatingImageId === image.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : image.isPublished ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this image?",
                    )
                  ) {
                    onDelete(image.id);
                  }
                }}
                disabled={deletingId === image.id}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  text-white
                  shadow-lg
                  transition
                  hover:scale-110
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                title="Delete image"
              >
                {deletingId === image.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="px-3 py-2.5">
            <p className="truncate text-xs font-medium text-slate-700">
              {image.fileName}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Order: {image.sortOrder + 1}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
