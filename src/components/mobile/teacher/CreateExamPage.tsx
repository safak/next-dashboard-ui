"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function CreateExamPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [totalMarks, setTotalMarks] = useState(20);

  const [examDate, setExamDate] = useState<Date | null>(null);

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

  const createExam = async () => {
    try {
      if (!title.trim() || !classId || !subjectId || !examDate) {
        toast.error("Please fill all required fields");
        return;
      }

      if (totalMarks < 1) {
        toast.error("Total marks must be greater than 0");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/mobile/teacher/exams", {
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
          examDate: examDate.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create exam");
      }

      toast.success("Exam created successfully");

      setTimeout(() => {
        router.push("/teacher/mobile/exams");
      }, 1000);
    } catch (error) {
      console.error("Create exam error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to create exam",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedClassName =
    classes.find((item) => item.id === classId)?.name || "Select Class";

  const selectedSubjectName =
    subjects.find((item) => item.id === subjectId)?.name || "Select Subject";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          {/* Back Button */}

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

          {/* Title */}

          <div className="min-w-0">
            <h1 className="truncate text-[22px] font-extrabold tracking-tight text-slate-900">
              Create Exam
            </h1>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Create and schedule exams
            </p>
          </div>
        </div>
      </div>

      {/* ================= FORM ================= */}

      <div className="mt-6 space-y-5 px-4 pb-24">
        {/* ================= EXAM TITLE ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Exam Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="English Mid Term Exam"
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
            placeholder="Exam instructions..."
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
            "
          />
        </div>

        {/* ================= CLASS ================= */}

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-slate-700">
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

        {/* ================= SUBJECT ================= */}

        <div>
          <label className="mb-2 block text-[12px] font-semibold text-slate-700">
            Subject
          </label>

          <RadixSelect
            value={subjectId ? String(subjectId) : ""}
            onChange={(value) => setSubjectId(value ? Number(value) : null)}
            placeholder="Select Subject"
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
              "
            />

            <span
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[11px]
                font-semibold
                text-slate-400
              "
            >
              Marks
            </span>
          </div>
        </div>

        {/* ================= EXAM DATE ================= */}

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Exam Date
          </label>

          <div className="mt-2">
            <DatePicker
              selected={examDate}
              onChange={(date: Date | null) => {
                setExamDate(date);
              }}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Exam Date"
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

        {/* ================= EXAM PREVIEW ================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[24px]
            border
            border-[#DCE3F0]
            bg-gradient-to-br
            from-[#EEF2F9]
            via-white
            to-[#FFF8EC]
            p-4
          "
        >
          {/* Accent */}

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

          <div
            className="
              pointer-events-none
              absolute
              -bottom-10
              -left-8
              h-24
              w-24
              rounded-full
              bg-[#4B517D]/10
            "
          />

          <div className="relative z-10">
            {/* Preview Header */}

            <div className="flex items-center gap-2.5">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#4B517D]
                  text-white
                  shadow-sm
                "
              >
                <ClipboardCheck size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Exam Preview
                </h3>

                <p className="text-[9px] text-slate-400">
                  Review before creating
                </p>
              </div>
            </div>

            {/* Preview Content */}

            <div className="mt-4 rounded-[18px] border border-white/80 bg-white/75 p-4">
              <h4 className="truncate text-[15px] font-bold text-slate-900">
                {title || "Exam Title"}
              </h4>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                {description || "Exam description"}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {/* Class */}

                <div
                  className="
                    rounded-2xl
                    bg-[#F4F5F9]
                    px-3
                    py-2.5
                  "
                >
                  <p className="text-[9px] text-slate-400">Class</p>

                  <p className="mt-0.5 truncate text-[11px] font-semibold text-[#4B517D]">
                    {selectedClassName}
                  </p>
                </div>

                {/* Subject */}

                <div
                  className="
                    rounded-2xl
                    bg-[#F4F5F9]
                    px-3
                    py-2.5
                  "
                >
                  <p className="text-[9px] text-slate-400">Subject</p>

                  <p className="mt-0.5 truncate text-[11px] font-semibold text-[#4B517D]">
                    {selectedSubjectName}
                  </p>
                </div>
              </div>

              {/* Bottom Info */}

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#FFF8EC]
                      text-[#F59A23]
                    "
                  >
                    <span className="text-[11px] font-bold">{totalMarks}</span>
                  </div>

                  <div>
                    <p className="text-[8px] text-slate-400">Total</p>

                    <p className="text-[10px] font-bold text-slate-700">
                      Marks
                    </p>
                  </div>
                </div>

                {examDate ? (
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-[#4B517D]" />

                    <span className="text-[10px] font-semibold text-slate-600">
                      {examDate.toLocaleDateString("en-GB")}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    No date selected
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= CREATE BUTTON ================= */}

        <button
          type="button"
          onClick={createExam}
          disabled={loading}
          className="
            flex
            h-[56px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-[20px]
            bg-gradient-to-r
            from-[#4B517D]
            via-[#555B86]
            to-[#626991]
            text-sm
            font-bold
            text-white
            shadow-[0_14px_30px_rgba(75,81,125,0.22)]
            transition
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <span
                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-white/40
                  border-t-white
                "
              />
              Creating...
            </>
          ) : (
            <>
              <CheckCircle2 size={17} />
              Create Exam
            </>
          )}
        </button>
      </div>
    </div>
  );
}
