"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ClassItem {
  id: number;
  name: string;
}

export default function TeacherReports() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const reports = [
    {
      title: "Attendance Report",
      description: "View attendance analytics",
      icon: "/attendance.png",
      path: "/teacher/mobile/reports/attendance",
      bg: "bg-[#EEF8FC]",
      accent: "#4E9BB8",
    },
    {
      title: "Homework Report",
      description: "Homework completion stats",
      icon: "/homework.png",
      path: "/teacher/mobile/reports/homework",
      bg: "bg-[#F0F8E5]",
      accent: "#719B45",
    },
    {
      title: "Assignment Report",
      description: "Marks & evaluations",
      icon: "/studAssignment.png",
      path: "/teacher/mobile/reports/assignments",
      bg: "bg-[#F3EFFB]",
      accent: "#7567A8",
    },
    {
      title: "Exam Report",
      description: "Exam performance",
      icon: "/result.png",
      path: "/teacher/mobile/reports/results",
      bg: "bg-[#FFF7DF]",
      accent: "#C48A20",
    },
  ];

  useEffect(() => {
    fetchClasses();
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
        setSelectedClass(classList[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClasses([]);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-24">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          {/* Back */}

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

          {/* Class Selector */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-3.5
                shadow-[0_8px_24px_rgba(15,23,42,0.06)]
                transition
                active:scale-[0.98]
              "
            >
              <span className="h-2 w-2 rounded-full bg-[#F59A23]" />

              <span className="max-w-[100px] truncate text-[12px] font-bold text-slate-800">
                {selectedClass || "Select Class"}
              </span>

              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <>
                {/* Outside click */}

                <button
                  type="button"
                  aria-label="Close class selector"
                  onClick={() => setShowDropdown(false)}
                  className="fixed inset-0 z-40 h-full w-full cursor-default"
                />

                {/* Dropdown */}

                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-[180px]
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-slate-100
                    bg-white
                    p-2
                    shadow-[0_20px_50px_rgba(15,23,42,0.14)]
                  "
                >
                  {classes.length === 0 ? (
                    <div className="px-4 py-4 text-center text-xs text-slate-400">
                      No classes available
                    </div>
                  ) : (
                    classes.map((cls) => {
                      const isSelected = selectedClass === cls.name;

                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => {
                            setSelectedClass(cls.name);
                            setShowDropdown(false);
                          }}
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-xl
                            px-3
                            py-2.5
                            text-left
                            transition
                            ${
                              isSelected
                                ? "bg-[#4B517D] text-white"
                                : "text-slate-700 hover:bg-[#F7F8FA]"
                            }
                          `}
                        >
                          <span className="text-[12px] font-semibold">
                            {cls.name}
                          </span>

                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#F59A23]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= TITLE ================= */}

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-slate-900">
              Reports
            </h1>

            <Image
              src="/report.png"
              alt="Reports"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Download and analyze reports
          </p>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="mt-5 px-4">
        <div
          className="
            flex
            items-center
            justify-between
            rounded-[20px]
            border
            border-[#E2E5EF]
            bg-white
            px-4
            py-3
            shadow-[0_6px_20px_rgba(15,23,42,0.04)]
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-[#FFF8EC]
                text-[#F59A23]
              "
            >
              <Image
                src="/report.png"
                alt="Reports"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Available Reports</p>

              <p className="text-[12px] font-bold text-slate-800">
                {reports.length} reports
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-slate-400">Class</p>

            <p className="text-[12px] font-bold text-[#4B517D]">
              {selectedClass || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= REPORT CARDS ================= */}

      <div className="mt-5 space-y-3 px-4">
        {reports.map((report) => (
          <button
            key={report.title}
            type="button"
            onClick={() => router.push(report.path)}
            className={`
              relative
              w-full
              overflow-hidden
              rounded-[24px]
              border
              border-white
              ${report.bg}
              p-4
              text-left
              shadow-[0_8px_24px_rgba(15,23,42,0.04)]
              transition-all
              duration-200
              active:scale-[0.985]
            `}
          >
            {/* Accent */}

            <div
              className="absolute left-0 top-0 h-full w-1.5 rounded-r-full"
              style={{
                backgroundColor: report.accent,
              }}
            />

            <div className="flex items-center gap-4">
              {/* Icon */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/90
                  shadow-sm
                "
              >
                <Image
                  src={report.icon}
                  alt={report.title}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-bold text-slate-900">
                  {report.title}
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  {report.description}
                </p>
              </div>

              {/* Arrow */}

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/75
                "
              >
                <ChevronRight
                  size={16}
                  style={{
                    color: report.accent,
                  }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom spacing */}

      <div className="h-10" />
    </div>
  );
}
