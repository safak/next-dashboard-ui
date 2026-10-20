"use client";

import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Megaphone,
  Save,
  Send,
} from "lucide-react";

import { AnnouncementPriority } from "@prisma/client";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";
import RadixSelect from "@/components/ui/RadixSelect";

import type {
  AnnouncementFormValues,
  AnnouncementRow,
  ClassOption,
} from "../types";

interface AnnouncementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  announcement: AnnouncementRow | null;

  classes: ClassOption[];

  onSubmit: (data: AnnouncementFormValues) => Promise<void>;

  loading?: boolean;
}

const priorityOptions = [
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
];

export default function AnnouncementForm({
  open,
  onOpenChange,
  announcement,
  classes,
  onSubmit,
  loading = false,
}: AnnouncementFormProps) {
  const isEdit = Boolean(announcement);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<AnnouncementPriority>(
    AnnouncementPriority.NORMAL,
  );

  const [publishDate, setPublishDate] = useState<Date | null>(null);

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const [isPublished, setIsPublished] = useState(true);

  const [classId, setClassId] = useState("ALL");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (announcement) {
      setTitle(announcement.title);

      setDescription(announcement.description);

      setPriority(announcement.priority);

      setPublishDate(
        announcement.publishDate ? new Date(announcement.publishDate) : null,
      );

      setExpiryDate(
        announcement.expiryDate ? new Date(announcement.expiryDate) : null,
      );

      setIsPublished(announcement.isPublished);

      setClassId(announcement.classId ? String(announcement.classId) : "ALL");
    } else {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      setTitle("");
      setDescription("");

      setPriority(AnnouncementPriority.NORMAL);

      setPublishDate(today);
      setExpiryDate(null);

      setIsPublished(true);
      setClassId("ALL");
    }

    setError("");
  }, [open, announcement]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Announcement title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Announcement description is required.");
      return;
    }

    if (!publishDate) {
      setError("Publish date is required.");
      return;
    }

    if (expiryDate && expiryDate < publishDate) {
      setError("Expiry date cannot be before the publish date.");
      return;
    }

    const finalPublishDate = new Date(publishDate);

    finalPublishDate.setHours(0, 0, 0, 0);

    let finalExpiryDate: Date | null = null;

    if (expiryDate) {
      finalExpiryDate = new Date(expiryDate);

      finalExpiryDate.setHours(23, 59, 59, 999);
    }

    const data: AnnouncementFormValues = {
      ...(announcement ? { id: announcement.id } : {}),
      title: title.trim(),
      description: description.trim(),
      priority,
      publishDate: finalPublishDate,
      expiryDate: finalExpiryDate,
      isPublished,
      classId: classId === "ALL" ? "ALL" : classId,
    };

    await onSubmit(data);
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      width="md"
      title={isEdit ? "Edit Announcement" : "Create Announcement"}
      description={
        isEdit
          ? "Update the announcement details below."
          : "Create a new announcement for your school."
      }
      icon={<Megaphone className="h-4 w-4" />}
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isPublished ? "Visible to users" : "Saved as draft"}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-9 rounded-lg border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="announcement-form"
              disabled={loading}
              className="h-9 rounded-lg bg-[#4B517D] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#41466D]"
            >
              {isPublished ? (
                <Send className="mr-2 h-3.5 w-3.5" />
              ) : (
                <Save className="mr-2 h-3.5 w-3.5" />
              )}

              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Announcement"
                  : isPublished
                    ? "Publish Announcement"
                    : "Save Draft"}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id="announcement-form"
        onSubmit={handleSubmit}
        className="space-y-5 pb-2"
      >
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              !
            </div>

            <div>
              <p className="text-xs font-semibold text-red-700">
                Please check the form
              </p>

              <p className="mt-0.5 text-xs text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#4B517D]">
                <Megaphone className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#303552]">
                  Announcement Details
                </h3>

                <p className="text-[11px] text-slate-400">
                  Add the message you want to share.
                </p>
              </div>
            </div>
          </div> */}

          <div className="space-y-4 p-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Bell className="h-3.5 w-3.5 text-[#F59A23]" />
                  Announcement Title
                  <span className="text-red-500">*</span>
                </label>

                <span className="text-[10px] font-medium text-slate-400">
                  {title.length}/150
                </span>
              </div>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={150}
                placeholder="Enter announcement title"
                disabled={loading}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4B517D] focus:ring-2 focus:ring-[#4B517D]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Description
                <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder="Write the announcement details..."
                disabled={loading}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4B517D] focus:ring-2 focus:ring-[#4B517D]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>
          </div>
        </section>

        {/* Audience & Priority */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4E2] text-[#B87938]">
                <GraduationCap className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#303552]">
                  Audience & Priority
                </h3>

                <p className="text-[11px] text-slate-400">
                  Choose who receives the announcement.
                </p>
              </div>
            </div>
          </div> */}

          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <GraduationCap className="h-3.5 w-3.5 text-[#4B517D]" />
                Class
              </label>

              <RadixSelect
                value={classId}
                onChange={setClassId}
                placeholder="All Classes"
                options={[
                  {
                    value: "ALL",
                    label: "All Classes",
                  },
                  ...(classes ?? []).map((item) => ({
                    value: String(item.id),
                    label: item.name,
                  })),
                ]}
                disabled={loading}
              />

              <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
                Choose a class or send to everyone.
              </p>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Bell className="h-3.5 w-3.5 text-[#F59A23]" />
                Priority
              </label>

              <RadixSelect
                value={priority}
                onChange={(value) => setPriority(value as AnnouncementPriority)}
                placeholder="Select priority"
                options={priorityOptions}
                disabled={loading}
              />

              <p className="mt-1.5 text-[10px] leading-4 text-slate-400">
                Set the importance of this message.
              </p>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#4B517D]">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#303552]">Schedule</h3>

                <p className="text-[11px] text-slate-400">
                  Control when the announcement is visible.
                </p>
              </div>
            </div>
          </div> */}

          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CalendarDays className="h-3.5 w-3.5 text-[#4B517D]" />
                Publish Date
                <span className="text-red-500">*</span>
              </label>

              <DatePicker
                selected={publishDate}
                onChange={(date: Date | null) => {
                  setPublishDate(date);

                  if (expiryDate && date && expiryDate < date) {
                    setExpiryDate(null);
                  }
                }}
                dateFormat="dd MMM yyyy"
                placeholderText="Select publish date"
                disabled={loading}
                showPopperArrow={false}
                popperPlacement="bottom-start"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4B517D] focus:ring-2 focus:ring-[#4B517D]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  Expiry Date
                </label>

                <span className="text-[10px] font-medium text-slate-400">
                  Optional
                </span>
              </div>

              <DatePicker
                selected={expiryDate}
                onChange={(date: Date | null) => setExpiryDate(date)}
                minDate={publishDate ?? undefined}
                dateFormat="dd MMM yyyy"
                placeholderText="Select expiry date"
                disabled={loading}
                isClearable
                showPopperArrow={false}
                popperPlacement="bottom-start"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#4B517D] focus:ring-2 focus:ring-[#4B517D]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              <p className="mt-1.5 text-[10px] text-slate-400">
                Leave empty for no expiry.
              </p>
            </div>
          </div>
        </section>

        {/* Publishing Status */}
        <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-[#F7F8FC] to-[#FFF9F0] p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isPublished
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isPublished ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-[#303552]">
                  {isPublished ? "Published" : "Draft"}
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                  {isPublished
                    ? "This announcement will be visible to the selected audience."
                    : "This announcement will be saved but not shown to users."}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isPublished}
              onClick={() => setIsPublished((value) => !value)}
              disabled={loading}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                isPublished ? "bg-[#4B517D]" : "bg-slate-300"
              } ${
                loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                  isPublished ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>
      </form>
    </Drawer>
  );
}
