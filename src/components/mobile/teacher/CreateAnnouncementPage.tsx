"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Megaphone } from "lucide-react";
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

export default function CreateAnnouncementPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [classId, setClassId] = useState<number | null>(null);

  const [priority, setPriority] = useState("NORMAL");

  const [publishDate, setPublishDate] = useState<Date | null>(new Date());

  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    setPublishDate(new Date());
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/mobile/teacher/classes");

      const data = await response.json();

      const classList = Array.isArray(data) ? data : [];

      setClasses(classList);

      if (classList.length > 0) {
        setClassId(classList[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createAnnouncement = async () => {
    try {
      if (!title.trim() || !description.trim() || !classId || !publishDate) {
        toast.error("Please fill all required fields");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/mobile/teacher/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          classId,
          priority,
          publishDate: publishDate.toISOString(),
          expiryDate: expiryDate ? expiryDate.toISOString() : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create announcement");
      }

      toast.success("Announcement Created");

      router.push("/teacher/mobile/announcements");
    } catch (error) {
      console.error(error);

      toast.error("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = () => {
    switch (priority) {
      case "LOW":
        return "bg-slate-100 text-slate-600";

      case "HIGH":
        return "bg-[#FFF3E3] text-[#C87512]";

      case "URGENT":
        return "bg-[#FFF0ED] text-[#C94B35]";

      default:
        return "bg-[#EEF2FF] text-[#4B517D]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* HEADER */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={18} className="text-[#4B517D]" />
          </button>

          <div>
            <h1 className="text-[21px] font-bold text-[#30354D]">
              Create Announcement
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Publish announcement to your class
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}

      <div className="px-4 mt-6 space-y-5">
        {/* TITLE */}

        <div>
          <label className="text-sm font-semibold text-[#30354D]">Title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Annual Day Celebration"
            className="mt-2 w-full h-[52px] rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-[#4B517D] focus:ring-2 focus:ring-[#4B517D]/10"
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="text-sm font-semibold text-[#30354D]">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write announcement..."
            className="mt-2 w-full rounded-[18px] border border-slate-200 bg-white p-4 text-sm text-slate-700 outline-none resize-none transition focus:border-[#4B517D] focus:ring-2 focus:ring-[#4B517D]/10"
          />
        </div>

        {/* CLASS */}

        <div>
          <label className="text-sm font-semibold text-[#30354D] block mb-2">
            Class
          </label>

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

        {/* PRIORITY */}

        <div>
          <label className="text-sm font-semibold text-[#30354D] block mb-2">
            Priority
          </label>

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

        {/* DATES */}

        <div className="grid grid-cols-2 gap-3">
          {/* PUBLISH DATE */}

          <div>
            <label className="text-sm font-semibold text-[#30354D]">
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
                  h-[52px]
                  rounded-[18px]
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-[#4B517D]
                  focus:ring-2
                  focus:ring-[#4B517D]/10
                "
              />
            </div>
          </div>

          {/* EXPIRY DATE */}

          <div>
            <label className="text-sm font-semibold text-[#30354D]">
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
                  h-[52px]
                  rounded-[18px]
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  focus:border-[#4B517D]
                  focus:ring-2
                  focus:ring-[#4B517D]/10
                "
              />
            </div>
          </div>
        </div>

        {/* PREVIEW */}

        <div className="bg-[#EEF2FF] rounded-[26px] p-5 border border-[#E3E7FA]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Image src="/notifications.png" alt="" width={25} height={25} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#4B517D] uppercase tracking-wide">
                  Preview
                </p>

                <h3 className="font-bold text-[16px] text-[#30354D] truncate mt-0.5">
                  {title || "Announcement Title"}
                </h3>
              </div>
            </div>

            <span
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold ${getPriorityStyle()}`}
            >
              {priority}
            </span>
          </div>

          <div className="mt-4 bg-white/70 rounded-2xl p-4">
            <p className="text-sm text-slate-600 leading-5">
              {description || "Announcement preview will appear here."}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 mt-4 text-[11px] text-slate-500">
            <span>
              📅{" "}
              {publishDate
                ? publishDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "--"}
            </span>

            <span className="font-semibold text-[#4B517D] truncate">
              {classes.find((c) => c.id === classId)?.name ||
                "No class selected"}
            </span>
          </div>
        </div>

        {/* CREATE BUTTON */}

        <button
          onClick={createAnnouncement}
          disabled={loading}
          className="
            w-full
            h-14
            rounded-[20px]
            bg-[#4B517D]
            text-white
            font-bold
            flex
            items-center
            justify-center
            gap-2
            shadow-sm
            active:scale-[0.98]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Megaphone size={18} strokeWidth={2.3} />
              Create Announcement
            </>
          )}
        </button>
      </div>
    </div>
  );
}
