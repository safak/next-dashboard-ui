"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  FileText,
  Megaphone,
  Pencil,
  Trash2,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface NotificationDetailsProps {
  id: string;
}

interface NotificationData {
  id: number;
  type: "ANNOUNCEMENT" | "HOMEWORK" | "ASSIGNMENT" | "EXAM";

  title: string;
  description: string;

  classId?: number;
  className?: string;

  subjectId?: number;
  subjectName?: string;

  teacherName?: string;

  totalMarks?: number;

  priority?: string;

  publishDate?: string;
  expiryDate?: string;

  dueDate?: string;

  examDate?: string;

  createdAt: string;
}

export default function NotificationDetails({ id }: NotificationDetailsProps) {
  const router = useRouter();

  const [notification, setNotification] = useState<NotificationData | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  // editable fields

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("");

  const [publishDate, setPublishDate] = useState<Date | null>(null);

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const fetchNotification = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/mobile/teacher/notifications/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load notification (${response.status}).`);
      }

      const data: NotificationData = await response.json();

      setNotification(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setPriority(data.priority ?? "NORMAL");
      setPublishDate(data.publishDate ? new Date(data.publishDate) : null);
      setExpiryDate(data.expiryDate ? new Date(data.expiryDate) : null);
    } catch (error) {
      console.error("Failed to load notification:", error);
      toast.error("Failed to load notification.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchNotification();
  }, [fetchNotification]);

  const handleUpdate = async () => {
    if (notification?.type !== "ANNOUNCEMENT") return;

    try {
      setSaving(true);

      const response = await fetch(
        `/api/mobile/teacher/announcements/${notification.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            priority,
            publishDate: publishDate?.toISOString(),
            expiryDate: expiryDate?.toISOString() ?? null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success("Announcement updated successfully");

      setEditing(false);

      fetchNotification();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      let endpoint = "";

      switch (notification?.type) {
        case "ANNOUNCEMENT":
          endpoint = `/api/mobile/teacher/announcements/${notification.id}`;
          break;

        case "HOMEWORK":
          endpoint = `/api/mobile/teacher/homework/${notification.id}`;
          break;

        case "ASSIGNMENT":
          endpoint = `/api/mobile/teacher/assignments/${notification.id}`;
          break;

        case "EXAM":
          endpoint = `/api/mobile/teacher/exams/${notification.id}`;
          break;

        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success("Deleted successfully");

      router.replace("/teacher/mobile/notifications");
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        Notification not found
      </div>
    );
  }

  const icon =
    notification.type === "ANNOUNCEMENT" ? (
      <Megaphone className="text-orange-600" size={26} />
    ) : notification.type === "HOMEWORK" ? (
      <BookOpen className="text-sky-600" size={26} />
    ) : notification.type === "ASSIGNMENT" ? (
      <ClipboardList className="text-purple-600" size={26} />
    ) : (
      <FileText className="text-red-600" size={26} />
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* HEADER */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="
              w-10
              h-10
              rounded-2xl
              bg-white
              shadow
              flex
              items-center
              justify-center
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Notification</h1>

            <p className="text-xs text-slate-400">Details</p>
          </div>
        </div>
      </div>

      {/* SUMMARY CARD */}

      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-slate-100
                flex
                items-center
                justify-center
              "
              >
                {icon}
              </div>

              <div>
                <h2 className="font-bold text-lg">{notification.title}</h2>

                <p className="text-sm text-slate-500 mt-1">
                  {notification.className}
                </p>
              </div>
            </div>

            <span
              className="
                px-3
                py-1
                rounded-full
                bg-[#EEF2FF]
                text-[#7267F6]
                text-xs
                font-semibold
              "
            >
              {notification.type}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {notification.className && (
              <div
                className="
                px-3
                py-2
                rounded-xl
                bg-slate-100
                text-xs
                flex
                items-center
                gap-2
              "
              >
                <GraduationCap size={14} />

                {notification.className}
              </div>
            )}

            {notification.subjectName && (
              <div
                className="
                px-3
                py-2
                rounded-xl
                bg-slate-100
                text-xs
              "
              >
                {notification.subjectName}
              </div>
            )}

            {(notification.publishDate ||
              notification.examDate ||
              notification.dueDate) && (
              <div
                className="
                px-3
                py-2
                rounded-xl
                bg-slate-100
                text-xs
                flex
                items-center
                gap-2
              "
              >
                <CalendarDays size={14} />

                {new Date(
                  notification.publishDate ??
                    notification.examDate ??
                    notification.dueDate!,
                ).toLocaleDateString("en-GB")}
              </div>
            )}
          </div>
          {/* CONTENT */}

          <div className="mt-6">
            {editing ? (
              <div className="space-y-5">
                {/* TITLE */}

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                      mt-2
                      w-full
                      h-12
                      rounded-2xl
                      border
                      border-slate-200
                      px-4
                      outline-none
                      focus:border-[#7267F6]
                    "
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="
                      mt-2
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      p-4
                      resize-none
                      outline-none
                      focus:border-[#7267F6]
                    "
                  />
                </div>

                {/* PRIORITY */}

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="
                      mt-2
                      w-full
                      h-12
                      rounded-2xl
                      border
                      border-slate-200
                      px-4
                    "
                  >
                    <option value="LOW">LOW</option>

                    <option value="NORMAL">NORMAL</option>

                    <option value="HIGH">HIGH</option>

                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                {/* DESCRIPTION */}

                <div>
                  <h3 className="font-semibold text-slate-900">Description</h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {notification.description}
                  </p>
                </div>

                {/* HOMEWORK */}

                {notification.type === "HOMEWORK" && (
                  <div className="mt-6">
                    <div className="bg-sky-50 rounded-2xl p-4">
                      <p className="text-xs text-slate-500">Due Date</p>

                      <h4 className="font-semibold mt-1">
                        {notification.dueDate &&
                          new Date(notification.dueDate).toLocaleDateString(
                            "en-GB",
                          )}
                      </h4>
                    </div>
                  </div>
                )}

                {/* ASSIGNMENT */}

                {notification.type === "ASSIGNMENT" && (
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-purple-50 rounded-2xl p-4">
                      <p className="text-xs text-slate-500">Total Marks</p>

                      <h4 className="text-xl font-bold text-purple-700 mt-1">
                        {notification.totalMarks}
                      </h4>
                    </div>

                    <div className="bg-orange-50 rounded-2xl p-4">
                      <p className="text-xs text-slate-500">Due Date</p>

                      <h4 className="font-semibold mt-1">
                        {notification.dueDate &&
                          new Date(notification.dueDate).toLocaleDateString(
                            "en-GB",
                          )}
                      </h4>
                    </div>
                  </div>
                )}

                {/* EXAM */}

                {notification.type === "EXAM" && (
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-red-50 rounded-2xl p-4">
                      <p className="text-xs text-slate-500">Total Marks</p>

                      <h4 className="text-xl font-bold text-red-600 mt-1">
                        {notification.totalMarks}
                      </h4>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-4">
                      <p className="text-xs text-slate-500">Exam Date</p>

                      <h4 className="font-semibold mt-1">
                        {notification.examDate &&
                          new Date(notification.examDate).toLocaleDateString(
                            "en-GB",
                          )}
                      </h4>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ACTIONS */}

          <div className="mt-8 flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="
                    flex-1
                    h-12
                    rounded-2xl
                    border
                    border-slate-200
                    font-semibold
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="
                    flex-1
                    h-12
                    rounded-2xl
                    bg-[#7267F6]
                    text-white
                    font-semibold
                  "
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                {notification.type === "ANNOUNCEMENT" && (
                  <button
                    onClick={() => setEditing(true)}
                    className="
                      flex-1
                      h-12
                      rounded-2xl
                      bg-[#7267F6]
                      text-white
                      font-semibold
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <Pencil size={18} />
                    Edit
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="
                    flex-1
                    h-12
                    rounded-2xl
                    bg-red-500
                    text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
