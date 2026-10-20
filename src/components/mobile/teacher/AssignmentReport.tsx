"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassItem {
  id: number;
  name: string;
}

export default function AssignmentReport() {
  const router = useRouter();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [loadingType, setLoadingType] = useState<"pdf" | "excel" | null>(
    null,
  );

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[month - 1];

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

  const downloadReport = async (format: "pdf" | "excel") => {
    if (!selectedClass) {
      alert("No class assigned");
      return;
    }

    try {
      setLoadingType(format);

      const response = await fetch(
        "/api/mobile/teacher/reports/assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            className: selectedClass,
            month,
            year,
            format,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        format === "pdf"
          ? `${selectedClass}_assignment_report_${monthName}-${year}.pdf`
          : `${selectedClass}_assignment_report_${monthName}-${year}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to generate report");
    } finally {
      setLoadingType(null);
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
                <button
                  type="button"
                  aria-label="Close class selector"
                  onClick={() => setShowDropdown(false)}
                  className="fixed inset-0 z-40 h-full w-full cursor-default"
                />

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

        {/* TITLE */}

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-slate-900">
              Assignment Report
            </h1>

            <span className="text-[20px]">📋</span>
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            View and download monthly assignment activity
          </p>
        </div>
      </div>

      {/* ================= REPORT CARD ================= */}

      <div className="mt-5 px-4">
        <div
          className="
            overflow-hidden
            rounded-[26px]
            border
            border-slate-100
            bg-white
            shadow-[0_10px_30px_rgba(15,23,42,0.05)]
          "
        >
          {/* CARD HEADER */}

          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-[#4B517D]
              via-[#555B86]
              to-[#626991]
              px-5
              py-5
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-[#F59A23]/90
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-12
                right-10
                h-24
                w-24
                rounded-full
                bg-white/5
              "
            />

            <div className="relative z-10 flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/15
                  text-white
                  backdrop-blur-sm
                "
              >
                <FileText size={21} />
              </div>

              <div>
                <p className="text-[10px] font-medium text-white/65">
                  Assignment Summary
                </p>

                <p className="mt-0.5 text-[15px] font-bold text-white">
                  {selectedClass || "Select Class"}
                </p>
              </div>
            </div>
          </div>

          {/* CARD CONTENT */}

          <div className="p-5">
            {/* CLASS */}

            <div>
              <label className="text-[11px] font-semibold text-slate-500">
                Assigned Class
              </label>

              <div
                className="
                  mt-2
                  flex
                  h-[50px]
                  items-center
                  rounded-[17px]
                  border
                  border-slate-200
                  bg-[#F5F7FA]
                  px-4
                  text-[13px]
                  font-semibold
                  text-slate-800
                "
              >
                <span className="mr-2">🏫</span>

                {selectedClass || "Loading..."}
              </div>
            </div>

            {/* MONTH */}

            <div className="mt-5">
              <label className="text-[11px] font-semibold text-slate-500">
                Select Month
              </label>

              <div className="mt-2 grid grid-cols-4 gap-2">
                {months.map((name, index) => {
                  const selected = month === index + 1;

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setMonth(index + 1)}
                      className={`
                        h-9
                        rounded-xl
                        text-[11px]
                        font-semibold
                        transition-all
                        active:scale-95
                        ${
                          selected
                            ? "bg-[#4B517D] text-white shadow-[0_5px_14px_rgba(75,81,125,0.22)]"
                            : "bg-[#F4F5F8] text-slate-600 hover:bg-[#EEF0F5]"
                        }
                      `}
                    >
                      {name.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* YEAR */}

            <div className="mt-5">
              <label className="text-[11px] font-semibold text-slate-500">
                Select Year
              </label>

              <div className="mt-2 flex gap-2">
                {years.map((yr) => {
                  const selected = year === yr;

                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setYear(yr)}
                      className={`
                        h-10
                        flex-1
                        rounded-xl
                        text-[12px]
                        font-semibold
                        transition-all
                        active:scale-95
                        ${
                          selected
                            ? "bg-[#F59A23] text-white shadow-[0_5px_14px_rgba(245,154,35,0.20)]"
                            : "bg-[#F4F5F8] text-slate-600 hover:bg-[#EEF0F5]"
                        }
                      `}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELECTED PERIOD */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                rounded-[18px]
                border
                border-[#E7E9F0]
                bg-[#F8F9FB]
                px-4
                py-3
              "
            >
              <div>
                <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                  Selected Period
                </p>

                <p className="mt-0.5 text-[13px] font-bold text-[#4B517D]">
                  {monthName} {year}
                </p>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#FFF8EC]
                  text-[#F59A23]
                "
              >
                <CalendarDays size={17} />
              </div>
            </div>

            {/* DOWNLOAD BUTTONS */}

            <div className="mt-5 space-y-3">
              <button
                type="button"
                disabled={loadingType !== null}
                onClick={() => downloadReport("pdf")}
                className={`
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[18px]
                  text-[13px]
                  font-bold
                  transition-all
                  active:scale-[0.98]
                  ${
                    loadingType === "pdf"
                      ? "bg-slate-200 text-slate-400"
                      : "bg-[#4B517D] text-white shadow-[0_10px_24px_rgba(75,81,125,0.20)]"
                  }
                `}
              >
                <FileText size={18} />

                {loadingType === "pdf"
                  ? "Generating PDF..."
                  : "Download PDF"}
              </button>

              <button
                type="button"
                disabled={loadingType !== null}
                onClick={() => downloadReport("excel")}
                className={`
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[18px]
                  text-[13px]
                  font-bold
                  transition-all
                  active:scale-[0.98]
                  ${
                    loadingType === "excel"
                      ? "bg-slate-200 text-slate-400"
                      : "border border-[#E5E7EC] bg-[#FFF8EC] text-[#B87316] shadow-sm"
                  }
                `}
              >
                <FileSpreadsheet size={18} />

                {loadingType === "excel"
                  ? "Generating Excel..."
                  : "Download Excel"}
              </button>
            </div>

            {/* LOADING */}

            {loadingType && (
              <div className="mt-5 flex flex-col items-center justify-center">
                <div
                  className="
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-4
                    border-[#E4E7F2]
                    border-t-[#4B517D]
                  "
                />

                <p className="mt-2 text-[11px] font-semibold text-[#4B517D]">
                  Generating{" "}
                  {loadingType === "pdf" ? "PDF" : "Excel"} report...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}