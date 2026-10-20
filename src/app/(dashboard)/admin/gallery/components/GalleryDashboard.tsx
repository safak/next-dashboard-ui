"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Images, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import PageHeader from "@/components/admin/PageHeader";

import GalleryImageDrawer from "./GalleryImageDrawer";
import GalleryToolbar from "./GalleryToolbar";

type GalleryImage = {
  id: number;
  imageUrl: string;
  fileName?: string;
  altText?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
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

export default function GalleryDashboard() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const loadGallery = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/gallery", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load gallery.");
      }

      const data = await response.json();

      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const filteredEvents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return events;
    }

    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(keyword) ||
        event.description.toLowerCase().includes(keyword) ||
        (event.category ?? "").toLowerCase().includes(keyword)
      );
    });
  }, [events, search]);

  const publishedEvents = events.filter((event) => event.showInGallery).length;

  const hiddenEvents = events.filter((event) => !event.showInGallery).length;

  const totalImages = events.reduce(
    (total, event) => total + event.galleryImages.length,
    0,
  );

  const toggleGallery = async (eventId: number, value: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showInGallery: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update gallery.");
      }

      setEvents((current) =>
        current.map((event) =>
          event.id === eventId
            ? {
                ...event,
                showInGallery: value,
              }
            : event,
        ),
      );

      toast.success(
        value ? "Event published to gallery." : "Event hidden from gallery.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update gallery.",
      );
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Gallery"
        subtitle="Manage event photos displayed on the TrueSunshine website."
        image="/gallery-icon.png"
        imageClassName="h-10 w-10"
      />

      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Events
          </p>

          <p className="mt-1 text-2xl font-bold text-[#4B517D]">
            {events.length}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Published
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {publishedEvents}
          </p>
        </div>

        <div className="rounded-xl border border-orange-100 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total Images
          </p>

          <p className="mt-1 text-2xl font-bold text-[#F59A23]">
            {totalImages}
          </p>
        </div>
      </div> */}

      <GalleryToolbar
        search={search}
        onSearchChange={setSearch}
        total={filteredEvents.length}
        onRefresh={loadGallery}
        loading={loading}
      />

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#4B517D]" />

          <p className="mt-3 text-sm text-slate-500">Loading gallery...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center">
            <div className="relative h-44 w-56 sm:h-52 sm:w-64">
              <Image
                src="/no-gallery-events-found-removebg.png"
                alt="No gallery images"
                fill
                sizes="256px"
                className="object-contain"
              />
            </div>

            <h2 className="mt-2 text-lg font-bold text-slate-800">
              {search ? "No Gallery Events Found" : "No Gallery Events Yet"}
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              {search
                ? `We couldn't find any gallery event matching "${search}".`
                : "Create an event and upload images to start building your school gallery."}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {search
                ? "Try searching with a different event title, category or description."
                : "Published gallery images will appear on the TrueSunshine website."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const imageCount = event.galleryImages?.length ?? 0;

            return (
              <div
                key={event.id}
                className="
                  overflow-hidden
                  rounded-2xl
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
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  {event.galleryImages?.[0]?.imageUrl ? (
                    <Image
                      src={event.galleryImages[0].imageUrl}
                      alt={event.galleryImages[0].altText || event.title}
                      fill
                      sizes="
                        (max-width: 768px) 100vw,
                        (max-width: 1280px) 50vw,
                        33vw
                      "
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Images className="h-10 w-10 text-slate-300" />
                    </div>
                  )}

                  <div className="absolute right-3 top-3">
                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        shadow-sm
                        ${
                          event.showInGallery
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-700/85 text-white"
                        }
                      `}
                    >
                      {event.showInGallery ? "Published" : "Hidden"}
                    </span>
                  </div>

                  {imageCount > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="
                          rounded-full
                          bg-black/60
                          px-2.5
                          py-1
                          text-[11px]
                          font-medium
                          text-white
                          backdrop-blur-sm
                        "
                      >
                        {imageCount} {imageCount === 1 ? "image" : "images"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-slate-800">
                      {event.title}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(event.startTime).toLocaleDateString()}
                      {event.category ? ` • ${event.category}` : ""}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEventId(event.id)}
                      className="
                        flex-1
                        rounded-lg
                        bg-[#4B517D]
                        px-3
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#41476F]
                      "
                    >
                      Manage Images
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleGallery(event.id, !event.showInGallery)
                      }
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-slate-600
                        transition
                        hover:border-[#4B517D]/20
                        hover:bg-slate-50
                      "
                      title={
                        event.showInGallery
                          ? "Hide from website"
                          : "Publish to website"
                      }
                    >
                      {event.showInGallery ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GalleryImageDrawer
        open={selectedEventId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEventId(null);
          }
        }}
        eventId={selectedEventId}
      />
    </div>
  );
}
