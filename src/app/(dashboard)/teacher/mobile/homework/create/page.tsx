"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RadixSelect from "@/components/ui/RadixSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface ClassItem {
  id: number;
  name: string;
}

interface SubjectItem {
  id: number;
  name: string;
}

export default function CreateHomeworkPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [classId, setClassId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);

  const [dueDate, setDueDate] = useState<Date | null>(null);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/mobile/teacher/classes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch classes: ${response.status}`);
      }

      const data = await response.json();

      const classList = Array.isArray(data) ? data : [];

      setClasses(classList);

      if (classList.length > 0) {
        setClassId(classList[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClasses([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/mobile/teacher/subjects", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.status}`);
      }

      const data = await response.json();

      const subjectList = Array.isArray(data) ? data : [];

      setSubjects(subjectList);

      if (subjectList.length > 0) {
        setSubjectId(subjectList[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      setSubjects([]);
    }
  };

  const createHomework = async () => {
    try {
      if (
        !title.trim() ||
        !description.trim() ||
        !classId ||
        !subjectId ||
        !dueDate
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/mobile/teacher/homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          classId,
          subjectId,
          dueDate: dueDate.toISOString(),
        }),
      });

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(result?.error || "Failed to create homework");
      }

      toast.success("Homework assigned successfully");

      setTimeout(() => {
        router.push("/teacher/mobile/homework");
      }, 1000);
    } catch (error) {
      console.error("Create homework error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to create homework",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedSubject = subjects.find((subject) => subject.id === subjectId);

  const selectedClass = classes.find((item) => item.id === classId);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA]">
      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-100
              bg-white
              text-[#4B517D]
              shadow-sm
              transition
              active:scale-95
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900">
              Create Homework
            </h1>
          </div>
        </div>

        <p className="mt-2 text-[10px] text-slate-400">
          Assign homework to your class
        </p>
      </div>

      <div className="space-y-5 px-4 pb-24 pt-6">
        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Homework Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            disabled={loading}
            className="
              mt-2
              h-[52px]
              w-full
              rounded-[18px]
              border
              border-slate-200
              bg-white
              px-4
              text-sm
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#4B517D]
              focus:ring-2
              focus:ring-[#4B517D]/10
              disabled:bg-slate-50
            "
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Description
          </label>

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Homework details..."
            disabled={loading}
            className="
              mt-2
              min-h-[90px]
              w-full
              resize-none
              rounded-[18px]
              border
              border-slate-200
              bg-white
              p-4
              text-sm
              leading-6
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#4B517D]
              focus:ring-2
              focus:ring-[#4B517D]/10
              disabled:bg-slate-50
            "
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Assigned Class
          </label>

          <div
            className="
              mt-2
              flex
              h-[52px]
              items-center
              rounded-[18px]
              border
              border-slate-200
              bg-[#F1F4F8]
              px-4
              text-sm
              font-semibold
              text-slate-700
            "
          >
            <span className="mr-2">🏫</span>

            {selectedClass?.name || "Loading..."}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-slate-700">
            Subject
          </label>

          <RadixSelect
            value={subjectId ? String(subjectId) : ""}
            onChange={(value) => setSubjectId(value ? Number(value) : null)}
            placeholder="Select Subject"
            disabled={loading}
            options={subjects.map((subject) => ({
              value: String(subject.id),
              label: subject.name,
            }))}
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Due Date
          </label>

          <div className="mt-2">
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => {
                setDueDate(date);
              }}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Due Date"
              disabled={loading}
              wrapperClassName="w-full"
              popperPlacement="bottom-start"
              popperClassName="z-[9999]"
              className="
                h-[54px]
                w-full
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
                disabled:bg-slate-50
              "
            />
          </div>
        </div>

        <div
          className="
            overflow-hidden
            rounded-[22px]
            border
            border-[#D6E9FA]
            bg-[#EAF5FF]
            p-4
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-white
              "
            >
              <Image
                src="/homework.png"
                alt="Homework"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Homework Preview
            </h3>
          </div>

          <div className="mt-4">
            <p className="text-[13px] font-bold text-slate-900">
              {title || "Homework Title"}
            </p>

            <p className="mt-2 line-clamp-3 text-[12px] leading-5 text-slate-600">
              {description || "Homework description will appear here"}
            </p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="truncate text-[11px] font-medium text-[#4B517D]">
                {selectedSubject?.name || "No Subject"}
              </span>

              {dueDate && (
                <span className="shrink-0 text-[11px] font-medium text-slate-600">
                  📅 {dueDate.toLocaleDateString("en-GB")}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={createHomework}
          disabled={loading}
          className="
            h-[54px]
            w-full
            rounded-[19px]
            bg-gradient-to-r
            from-[#4B517D]
            to-[#626991]
            text-sm
            font-bold
            text-white
            shadow-[0_12px_30px_rgba(75,81,125,0.22)]
            transition
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "Assigning..." : "Assign Homework"}
        </button>
      </div>

      <div className="h-10" />
    </div>
  );
}
