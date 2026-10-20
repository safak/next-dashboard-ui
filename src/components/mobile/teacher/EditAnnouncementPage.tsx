"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RadixSelect from "@/components/ui/RadixSelect";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ClassItem {
  id: number;
  name: string;
}

export default function EditAnnouncementPage({
  announcementId,
}: {
  announcementId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [classId, setClassId] = useState<number | null>(null);

  const [priority, setPriority] = useState("NORMAL");

  const [publishDate, setPublishDate] = useState<Date | null>(new Date());

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch("/api/mobile/teacher/classes");

      if (!res.ok) {
        throw new Error(`Failed to fetch classes (${res.status}).`);
      }

      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  }, []);

  const fetchAnnouncement = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/mobile/teacher/announcements/${announcementId}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch announcement (${res.status}).`);
      }

      const data = await res.json();

      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
      setPriority(data.priority ?? "NORMAL");
      setClassId(data.classId ?? null);

      setPublishDate(data.publishDate ? new Date(data.publishDate) : null);

      setExpiryDate(data.expiryDate ? new Date(data.expiryDate) : null);
    } catch (error) {
      console.error("Failed to load announcement:", error);
      toast.error("Unable to load announcement");
    } finally {
      setLoading(false);
    }
  }, [announcementId]);

  useEffect(() => {
    void fetchClasses();
    void fetchAnnouncement();
  }, [fetchClasses, fetchAnnouncement]);

  async function updateAnnouncement() {
    try {
      if (!title || !description) {
        toast.error("Please fill all required fields");
        return;
      }

      setSaving(true);

      const res = await fetch(
        `/api/mobile/teacher/announcements/${announcementId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            description,
            classId,
            priority,
            publishDate: publishDate?.toISOString(),
            expiryDate: expiryDate ? expiryDate.toISOString() : null,
          }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      toast.success("Announcement Updated");

      router.push(`/teacher/mobile/announcements/${announcementId}`);
    } catch (err) {
      console.error(err);

      toast.error("Failed to update announcement");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

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

          <div>
            <h1 className="text-xl font-bold">Edit Announcement</h1>

            <p className="text-xs text-slate-400">Update announcement</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-5">
        {/* Title */}

        <div>
          <label className="text-sm font-semibold">Title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full h-12 rounded-2xl text-xs border border-slate-200 px-4 outline-none focus:border-[#7267F6]"
          />
        </div>

        {/* Description */}

        <div>
          <label className="text-sm font-semibold">Description</label>

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-2xl text-xs border border-slate-200 p-4 resize-none outline-none focus:border-[#7267F6]"
          />
        </div>

        {/* Class */}

        <div>
          <label className="text-sm font-semibold block mb-2">Class</label>

          <RadixSelect
            value={classId ? String(classId) : ""}
            onChange={(value) => setClassId(value ? Number(value) : null)}
            placeholder="Select Class"
            options={classes.map((cls) => ({
              value: String(cls.id),
              label: cls.name,
            }))}
          />
        </div>

        {/* Priority */}

        <div>
          <label className="text-sm font-semibold block mb-2">Priority</label>

          <RadixSelect
            value={priority}
            onChange={(value) => setPriority(value ?? "NORMAL")}
            options={[
              {
                value: "LOW",
                label: "Low",
              },
              {
                value: "NORMAL",
                label: "Normal",
              },
              {
                value: "HIGH",
                label: "High",
              },
              {
                value: "URGENT",
                label: "Urgent",
              },
            ]}
          />
        </div>

        {/* Dates */}

        <div className="grid grid-cols-2 gap-3">
          {/* Publish Date */}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Publish Date
            </label>

            <div className="mt-2">
              <DatePicker
                selected={publishDate}
                onChange={(date: Date | null) => setPublishDate(date)}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Publish Date"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                popperClassName="z-[9999]"
                className="
                  w-full
                  h-[54px]
                  rounded-[18px]
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-[#7267F6]
                "
              />
            </div>
          </div>

          {/* Expiry Date */}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Expiry Date
            </label>

            <div className="mt-2">
              <DatePicker
                selected={expiryDate}
                onChange={(date: Date | null) => setExpiryDate(date)}
                minDate={publishDate ?? new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Expiry Date"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
                popperClassName="z-[9999]"
                className="
                  w-full
                  h-[54px]
                  rounded-[18px]
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-[#7267F6]
                "
              />
            </div>
          </div>
        </div>

        {/* Preview */}

        <div className="bg-[#EEF2FF] rounded-3xl p-5">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
              <Image
                src="/announcement.png"
                alt="Announcement"
                width={24}
                height={24}
              />
            </div>

            <div>
              <h3 className="font-bold">{title || "Announcement Title"}</h3>

              <p className="text-xs text-slate-500">{priority}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-700">{description}</p>
        </div>

        {/* Button */}

        <button
          onClick={updateAnnouncement}
          disabled={saving}
          className="w-full h-14 rounded-2xl bg-[#7267F6] text-white font-bold disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Announcement"}
        </button>
      </div>
    </div>
  );
}
