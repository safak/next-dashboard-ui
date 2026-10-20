"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

interface Announcement {
  id: number;
  title: string;
  description: string;

  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";

  publishDate: string;
  expiryDate?: string | null;

  class?: {
    id: number;
    name: string;
  } | null;

  teacher?: {
    name: string;
    surname: string;
  } | null;
}

export default function AnnouncementDetails({
  announcementId,
}: {
  announcementId: string;
}) {
  const router = useRouter();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchAnnouncement = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/mobile/teacher/announcements/${announcementId}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch announcement (${response.status}).`);
      }

      const data: Announcement = await response.json();

      setAnnouncement(data);
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
      setAnnouncement(null);
    } finally {
      setLoading(false);
    }
  }, [announcementId]);

  useEffect(() => {
    void fetchAnnouncement();
  }, [fetchAnnouncement]);

  const deleteAnnouncement = async () => {
    if (!confirm("Delete this announcement?")) return;

    try {
      const response = await fetch(
        `/api/mobile/teacher/announcements/${announcementId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Announcement deleted");

      router.push("/teacher/mobile/announcements");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Announcement not found
      </div>
    );
  }

  const priorityColor = {
    LOW: "bg-green-100 text-green-700",
    NORMAL: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-xl font-bold">Announcement</h1>
        </div>
      </div>

      {/* Card */}

      <div className="px-4 mt-5">
        <div className="bg-white rounded-3xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
                <Image src="/announcement.png" alt="" width={24} height={24} />
              </div>

              <div>
                <h2 className="font-bold text-lg">{announcement.title}</h2>

                <p className="text-xs text-slate-500 mt-1">
                  {announcement.class?.name ?? "All Classes"}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor[announcement.priority]}`}
            >
              {announcement.priority}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <div className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-medium">
              📚 {announcement.class?.name ?? "All Classes"}
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-medium flex items-center gap-1">
              <CalendarDays size={14} />
              {new Date(announcement.publishDate).toLocaleDateString()}
            </div>

            {announcement.expiryDate && (
              <div className="px-3 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                Expires {new Date(announcement.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Description</h3>

            <p className="text-sm leading-7 text-slate-600 whitespace-pre-wrap">
              {announcement.description}
            </p>
          </div>

          {announcement.teacher && (
            <div className="mt-6 border-t pt-4 text-xs text-slate-500">
              Posted by{" "}
              <span className="font-semibold">
                {announcement.teacher.name} {announcement.teacher.surname}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}

      <div className="px-4 mt-6 flex gap-3">
        <button
          onClick={() =>
            router.push(`/teacher/mobile/announcements/${announcement.id}/edit`)
          }
          className="flex-1 h-12 rounded-2xl bg-[#7267F6] text-white font-semibold flex items-center justify-center gap-2"
        >
          <Pencil size={18} />
          Edit
        </button>

        <button
          onClick={deleteAnnouncement}
          className="flex-1 h-12 rounded-2xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
