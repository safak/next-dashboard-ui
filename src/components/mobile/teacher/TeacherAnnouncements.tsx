"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Announcement {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  publishDate: string;
  expiryDate?: string | null;
  isPublished: boolean;
  class?: {
    id: number;
    name: string;
  };
}

interface ClassItem {
  id: number;
  name: string;
}

export default function TeacherAnnouncements() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchClasses();
    fetchAnnouncements();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/mobile/teacher/classes");

      const data = await response.json();

      const classList = Array.isArray(data) ? data : [];

      setClasses(classList);

      if (classList.length > 0) {
        setSelectedClass(classList[0].name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/mobile/teacher/announcements");

      const data = await response.json();

      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/mobile/teacher/announcements/${deleteId}`, {
        method: "DELETE",
      });

      setDeleteId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAnnouncements =
    selectedClass === ""
      ? announcements
      : announcements.filter(
          (announcement) => announcement.class?.name === selectedClass,
        );

  const activeCount = filteredAnnouncements.filter(
    (announcement) => announcement.isPublished,
  ).length;

  const getPriorityStyle = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "LOW":
        return "bg-slate-100 text-slate-600";

      case "NORMAL":
        return "bg-[#EEF2FF] text-[#4B517D]";

      case "HIGH":
        return "bg-[#FFF3E3] text-[#C87512]";

      case "URGENT":
        return "bg-[#FFF0ED] text-[#C94B35]";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* HEADER */}

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={18} className="text-[#4B517D]" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-10 px-4 rounded-[18px] bg-white border border-slate-100 shadow-sm flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-[#F59A23]" />

              <span className="text-[13px] font-bold text-[#33384F]">
                {selectedClass || "Select Class"}
              </span>

              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-[190px] bg-white rounded-[22px] shadow-xl border border-slate-100 p-2 z-50">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setSelectedClass(cls.name);
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition ${
                      selectedClass === cls.name
                        ? "bg-[#4B517D] text-white"
                        : "text-[#33384F] hover:bg-[#F7F8FA]"
                    }`}
                  >
                    <span className="text-sm font-semibold">{cls.name}</span>

                    {selectedClass === cls.name && (
                      <div className="w-2 h-2 rounded-full bg-[#F59A23]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">
              Announcements
            </h1>

            <Image
              src="/notifications.png"
              alt="Notifications"
              width={21}
              height={21}
              className="object-contain"
            />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Create and manage announcements
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="px-4 mt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#EEF2FF] rounded-[22px] p-4">
            <p className="text-xs text-slate-500">Total</p>

            <h2 className="text-3xl font-bold mt-2 text-[#30354D]">
              {filteredAnnouncements.length}
            </h2>
          </div>

          <div className="bg-[#EAF8EF] rounded-[22px] p-4">
            <p className="text-xs text-slate-500">Published</p>

            <h2 className="text-3xl font-bold mt-2 text-[#159447]">
              {activeCount}
            </h2>
          </div>
        </div>
      </div>

      {/* CREATE ANNOUNCEMENT */}

      <div className="px-4 mt-5">
        <button
          onClick={() => router.push("/teacher/mobile/announcements/create")}
          className="w-full h-14 rounded-[20px] bg-[#4B517D] text-white font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create Announcement
        </button>
      </div>

      {/* LIST */}

      <div className="px-4 mt-5 space-y-4">
        {loading ? (
          <>
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-white rounded-[24px] p-4 shadow-sm animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/3 mt-3" />
                  </div>

                  <div className="w-8 h-8 bg-slate-100 rounded-full" />
                </div>

                <div className="border-t border-slate-100 my-4" />

                <div className="flex justify-between">
                  <div className="h-6 bg-slate-100 rounded-full w-20" />
                  <div className="h-6 bg-slate-100 rounded-full w-20" />
                </div>
              </div>
            ))}
          </>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between gap-3">
                <div
                  onClick={() =>
                    router.push(
                      `/teacher/mobile/announcements/${announcement.id}`,
                    )
                  }
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <h3 className="font-bold text-[17px] text-[#30354D] truncate">
                    {announcement.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {announcement.class?.name || selectedClass}
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === announcement.id ? null : announcement.id,
                      )
                    }
                    className="w-9 h-9 rounded-full bg-[#F7F8FA] flex items-center justify-center"
                  >
                    <MoreVertical size={18} className="text-[#4B517D]" />
                  </button>

                  {activeMenu === announcement.id && (
                    <div className="absolute right-0 top-10 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <button
                        onClick={() =>
                          router.push(
                            `/teacher/mobile/announcements/${announcement.id}`,
                          )
                        }
                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-slate-50 text-sm text-[#30354D]"
                      >
                        <Eye size={15} />
                        View
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/teacher/mobile/announcements/${announcement.id}/edit`,
                          )
                        }
                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-slate-50 text-sm text-[#30354D]"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(announcement.id);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[#FFF0ED] text-[#C94B35] text-sm"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 my-4" />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${getPriorityStyle(
                      announcement.priority,
                    )}`}
                  >
                    {announcement.priority}
                  </span>

                  <span className="text-[11px] text-slate-400 truncate">
                    {new Date(announcement.publishDate).toLocaleDateString()}
                  </span>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                    announcement.isPublished
                      ? "bg-[#EAF8EF] text-[#159447]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {announcement.isPublished ? "Published" : "Draft"}
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && filteredAnnouncements.length === 0 && (
          <div className="bg-white rounded-[24px] border border-slate-100 py-14 px-5 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#FFF3E3] flex items-center justify-center">
              <Image src="/notifications.png" alt="" width={28} height={28} />
            </div>

            <p className="text-sm font-semibold text-[#4B517D] mt-4">
              No announcements found
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Create an announcement to share updates with your class.
            </p>
          </div>
        )}
      </div>

      {/* DELETE DIALOG */}

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-[100] px-5">
          <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0ED] flex items-center justify-center">
              <Trash2 size={21} className="text-[#C94B35]" />
            </div>

            <h3 className="font-bold text-lg text-[#30354D] mt-4">
              Delete Announcement?
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-5">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-[#4B517D] font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={deleteAnnouncement}
                className="flex-1 h-11 rounded-xl bg-[#C94B35] text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
