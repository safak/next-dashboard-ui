"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Images,
  Loader2,
  Trash2,
  Upload,
  ArrowLeft,
  X,
  Maximize2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import GalleryImageGrid from "./GalleryImageGrid";

type GalleryImage = {
  id: number;
  fileName: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPublished: boolean;
};

type GalleryEvent = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string | null;
  showInGallery: boolean;
  galleryImages: GalleryImage[];
};

interface GalleryImageManagerProps {
  eventId: string;
  embedded?: boolean;
}

export default function GalleryImageManager({
  eventId,
  embedded = false,
}: GalleryImageManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [updatingImageId, setUpdatingImageId] = useState<number | null>(null);

  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/admin/gallery/${eventId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load gallery.");
      }

      const data = await response.json();

      setEvent(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) {
      return;
    }

    const validFiles = files.filter((file) => {
      const validType = ["image/jpeg", "image/png", "image/webp"].includes(
        file.type,
      );

      const validSize = file.size <= 5 * 1024 * 1024;

      if (!validType) {
        toast.error(`${file.name}: unsupported image format.`);
        return false;
      }

      if (!validSize) {
        toast.error(`${file.name}: maximum size is 5 MB.`);
        return false;
      }

      return true;
    });

    setSelectedFiles(validFiles);

    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    setPreviewUrls(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const removeSelectedFile = (index: number) => {
    const updatedFiles = selectedFiles.filter(
      (_, fileIndex) => fileIndex !== index,
    );

    const updatedPreviews = previewUrls.filter(
      (_, previewIndex) => previewIndex !== index,
    );

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const clearSelection = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    setSelectedFiles([]);
    setPreviewUrls([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImages = async () => {
    if (!selectedFiles.length) {
      toast.error("Please select images first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`/api/admin/gallery/${eventId}/images`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload images.");
      }

      toast.success(
        `${data.images.length} ${
          data.images.length === 1 ? "image" : "images"
        } uploaded successfully.`,
      );

      clearSelection();

      await loadEvent();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to upload images.",
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      setDeletingId(imageId);

      const response = await fetch(
        `/api/admin/gallery/${eventId}/images/${imageId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete image.");
      }

      setEvent((current) => {
        if (!current) return current;

        return {
          ...current,
          galleryImages: current.galleryImages.filter(
            (image) => image.id !== imageId,
          ),
        };
      });

      toast.success("Image deleted successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete image.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const toggleImagePublished = async (imageId: number, value: boolean) => {
    try {
      setUpdatingImageId(imageId);

      const response = await fetch(
        `/api/admin/gallery/${eventId}/images/${imageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: value,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update image.");
      }

      setEvent((current) => {
        if (!current) return current;

        return {
          ...current,
          galleryImages: current.galleryImages.map((image) =>
            image.id === imageId
              ? {
                  ...image,
                  isPublished: value,
                }
              : image,
          ),
        };
      });

      toast.success(
        value ? "Image published successfully." : "Image hidden successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update image.",
      );
    } finally {
      setUpdatingImageId(null);
    }
  };

  const toggleEventVisibility = async () => {
    if (!event) return;

    try {
      const value = !event.showInGallery;

      const response = await fetch(`/api/admin/gallery/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showInGallery: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility.");
      }

      setEvent((current) =>
        current
          ? {
              ...current,
              showInGallery: value,
            }
          : current,
      );

      toast.success(
        value
          ? "Event is now visible in the website gallery."
          : "Event is now hidden from the website gallery.",
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update visibility.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading gallery...
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <Images className="mx-auto h-10 w-10 text-slate-300" />

        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          Event not found
        </h2>

        <button
          type="button"
          onClick={() => router.push("/admin/gallery")}
          className="mt-5 rounded-lg bg-[#4B517D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#41476F]"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!embedded && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/gallery")}
              className="
            mt-1
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-600
            shadow-sm
            transition
            hover:bg-slate-50
          "
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {event.title}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {new Date(event.startTime).toLocaleDateString()}
                {event.category ? ` • ${event.category}` : ""}
                {" • "}
                {event.galleryImages.length}{" "}
                {event.galleryImages.length === 1 ? "image" : "images"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleEventVisibility}
            className={`
          inline-flex
          h-10
          items-center
          justify-center
          gap-2
          rounded-lg
          px-4
          text-sm
          font-semibold
          shadow-sm
          transition
          ${
            event.showInGallery
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }
        `}
          >
            {event.showInGallery ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide from Website
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show on Website
              </>
            )}
          </button>
        </div>
      )}
      {embedded && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-800">
                {event.title}
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                {new Date(event.startTime).toLocaleDateString()}
                {event.category ? ` • ${event.category}` : ""}
                {" • "}
                {event.galleryImages.length}{" "}
                {event.galleryImages.length === 1 ? "image" : "images"}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleEventVisibility}
              className={`
          shrink-0
          inline-flex
          items-center
          gap-2
          rounded-lg
          px-3
          py-2
          text-xs
          font-semibold
          transition
          ${
            event.showInGallery
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }
        `}
            >
              {event.showInGallery ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Published
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <ImagePlus className="h-5 w-5 text-[#4B517D]" />
              Upload Images
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG or WEBP • Maximum 5 MB per image
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#4B517D]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#41476F]
            "
          >
            <Upload className="h-4 w-4" />
            Select Images
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Selected Images ({selectedFiles.length})
              </p>

              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-medium text-slate-500 hover:text-red-500"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {previewUrls.map((url, index) => (
                <div
                  key={url}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={url}
                      alt={selectedFiles[index]?.name || "Preview"}
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="
                        absolute
                        right-2
                        top-2
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-black/60
                        text-white
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="truncate px-2 py-1.5 text-[10px] text-slate-500">
                    {selectedFiles[index]?.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={uploadImages}
                disabled={uploading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#F59A23]
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#E88C16]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload {selectedFiles.length}{" "}
                    {selectedFiles.length === 1 ? "Image" : "Images"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing Images */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Images className="h-5 w-5 text-[#4B517D]" />
              Gallery Images
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Images uploaded for {event.title}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-[#EEF0F8] px-3 py-1 text-xs font-semibold text-[#4B517D]">
            {event.galleryImages.length}{" "}
            {event.galleryImages.length === 1 ? "Image" : "Images"}
          </span>
        </div>

        {event.galleryImages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <ImagePlus className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No images uploaded yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Select images above to add them to this event.
            </p>
          </div>
        ) : (
          <GalleryImageGrid
            images={event.galleryImages}
            eventTitle={event.title}
            deletingId={deletingId}
            updatingImageId={updatingImageId}
            onPreview={setPreviewImage}
            onTogglePublished={toggleImagePublished}
            onDelete={deleteImage}
          />
        )}
      </div>
      {previewImage && (
        <div
          className="
      fixed
      inset-0
      z-[200]
      flex
      items-center
      justify-center
      bg-black/75
      p-4
      backdrop-blur-sm
    "
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="
        relative
        w-full
        max-w-5xl
        overflow-hidden
        rounded-2xl
        bg-black
        shadow-2xl
      "
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewImage.imageUrl}
              alt={previewImage.altText || `${event.title} image`}
              width={1600}
              height={1000}
              className="
          max-h-[80vh]
          w-full
          object-contain
        "
            />

            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="
          absolute
          right-4
          top-4
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/90
          text-slate-700
          shadow-lg
          transition
          hover:scale-110
        "
              title="Close preview"
            >
              <X className="h-5 w-5" />
            </button>

            <div
              className="
          absolute
          bottom-0
          left-0
          right-0
          bg-gradient-to-t
          from-black/80
          to-transparent
          px-5
          pb-5
          pt-12
        "
            >
              <p className="truncate text-sm font-medium text-white">
                {previewImage.fileName}
              </p>

              <p className="mt-1 text-xs text-white/70">{event.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
