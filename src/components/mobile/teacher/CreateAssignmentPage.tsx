"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import RadixSelect from "@/components/ui/RadixSelect";
import { toast } from "react-toastify";

interface ClassItem {
  id: number;
  name: string;
}

interface SubjectItem {
  id: number;
  name: string;
}

export default function CreateAssignmentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [totalMarks, setTotalMarks] = useState(20);

  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [classId, setClassId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);

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
        throw new Error(`Failed: ${response.status}`);
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

  const createAssignment = async () => {
    try {
      if (!title.trim() || !classId || !subjectId || !startDate || !dueDate) {
        toast.error("Please fill all required fields");
        return;
      }

      if (totalMarks < 1) {
        toast.error("Total marks must be at least 1");
        return;
      }

      if (dueDate < startDate) {
        toast.error("Due date cannot be before the start date");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/mobile/teacher/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          totalMarks,
          classId,
          subjectId,
          startDate,
          dueDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to create assignment");
      }

      toast.success("Assignment created successfully");

      setTimeout(() => {
        router.push("/teacher/mobile/assignments");
      }, 1000);
    } catch (error) {
      console.error("Create assignment error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to create assignment",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedClassName =
    classes.find((item) => item.id === classId)?.name || "Loading...";

  const selectedSubjectName =
    subjects.find((item) => item.id === subjectId)?.name || "Select Subject";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
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
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[22px] font-extrabold tracking-tight text-slate-900">
                Create Assignment
              </h1>

              <ClipboardList size={19} className="shrink-0 text-[#F59A23]" />
            </div>

            <p className="mt-1 text-[10px] text-slate-400">
              Create and assign marks
            </p>
          </div>
        </div>
      </div>

      {/* ================= FORM ================= */}

      <div className="mt-6 space-y-5 px-4 pb-10">
        {/* ================= TITLE ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Assignment Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="English Essay Writing"
            disabled={loading}
            className="
              mt-2
              h-[54px]
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

        {/* ================= DESCRIPTION ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Description
          </label>

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Assignment details..."
            disabled={loading}
            className="
              mt-2
              min-h-[80px]
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

        {/* ================= ASSIGNED CLASS ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Assigned Class
          </label>

          <div
            className="
              mt-2
              flex
              h-[54px]
              items-center
              gap-3
              rounded-[18px]
              border
              border-[#DDE2ED]
              bg-[#EEF1F7]
              px-4
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-[#4B517D]
              "
            >
              <GraduationCap size={17} />
            </div>

            <span className="truncate text-sm font-semibold text-[#4B517D]">
              {selectedClassName}
            </span>
          </div>
        </div>

        {/* ================= SUBJECT ================= */}

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

        {/* ================= TOTAL MARKS ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Total Marks
          </label>

          <div className="relative mt-2">
            <input
              type="number"
              min={1}
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              disabled={loading}
              className="
                h-[54px]
                w-full
                rounded-[18px]
                border
                border-slate-200
                bg-white
                px-4
                pr-20
                text-sm
                font-semibold
                text-slate-800
                outline-none
                transition
                focus:border-[#4B517D]
                focus:ring-2
                focus:ring-[#4B517D]/10
                disabled:bg-slate-50
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                flex
                -translate-y-1/2
                items-center
                gap-1.5
                rounded-full
                bg-[#FFF8EC]
                px-2.5
                py-1
                text-[10px]
                font-bold
                text-[#B87938]
              "
            >
              <ClipboardList size={12} />
              Marks
            </div>
          </div>
        </div>

        {/* ================= START DATE ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Start Date
          </label>

          <div className="mt-2">
            <DatePicker
              selected={startDate ? new Date(`${startDate}T00:00:00`) : null}
              onChange={(date: Date | null) => {
                if (!date) {
                  setStartDate("");
                  return;
                }

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");

                const formattedDate = `${year}-${month}-${day}`;

                setStartDate(formattedDate);

                if (dueDate && new Date(`${dueDate}T00:00:00`) < date) {
                  setDueDate("");
                }
              }}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Start Date"
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

        {/* ================= DUE DATE ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Due Date
          </label>

          <div className="mt-2">
            <DatePicker
              selected={dueDate ? new Date(`${dueDate}T00:00:00`) : null}
              onChange={(date: Date | null) => {
                if (!date) {
                  setDueDate("");
                  return;
                }

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");

                setDueDate(`${year}-${month}-${day}`);
              }}
              minDate={
                startDate ? new Date(`${startDate}T00:00:00`) : new Date()
              }
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
        focus:border-[#F59A23]
        focus:ring-2
        focus:ring-[#F59A23]/10
        disabled:bg-slate-50
      "
            />
          </div>
        </div>

        {/* ================= PREVIEW ================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-[#DCE3F0]
            bg-gradient-to-br
            from-[#EEF2F9]
            via-white
            to-[#FFF8EC]
            p-4
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-8
              -top-8
              h-24
              w-24
              rounded-full
              bg-[#F59A23]/10
            "
          />

          <div className="relative z-10">
            {/* Preview Header */}

            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#4B517D]/10
                  text-[#4B517D]
                "
              >
                <ClipboardList size={16} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Assignment Preview
                </h3>

                <p className="text-[10px] text-slate-400">
                  Review before creating
                </p>
              </div>
            </div>

            {/* Preview Content */}

            <div
              className="
                mt-4
                rounded-[18px]
                border
                border-white
                bg-white/80
                p-3.5
              "
            >
              <p className="text-[15px] font-bold text-slate-900">
                {title || "Assignment Title"}
              </p>

              <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                {description || "Assignment description will appear here."}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[#FFF8EC]
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    text-[#B87938]
                  "
                >
                  <ClipboardList size={12} />
                  {totalMarks || 0} Marks
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[#EEF2F9]
                    px-3
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-[#4B517D]
                  "
                >
                  {selectedSubjectName}
                </span>

                {dueDate && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-slate-100
                      px-3
                      py-1.5
                      text-[10px]
                      font-medium
                      text-slate-600
                    "
                  >
                    <CalendarDays size={11} />
                    {dueDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= CREATE BUTTON ================= */}

        <button
          type="button"
          onClick={createAssignment}
          disabled={loading}
          className="
            flex
            h-[56px]
            w-full
            items-center
            justify-center
            rounded-[20px]
            bg-gradient-to-r
            from-[#4B517D]
            via-[#555B86]
            to-[#626991]
            text-sm
            font-bold
            text-white
            shadow-[0_14px_32px_rgba(75,81,125,0.22)]
            transition-all
            duration-200
            hover:shadow-[0_18px_36px_rgba(75,81,125,0.26)]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "Creating Assignment..." : "Create Assignment"}
        </button>
      </div>
    </div>
  );
}
