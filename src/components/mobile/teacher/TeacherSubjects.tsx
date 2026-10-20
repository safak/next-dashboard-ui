"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const teacherClasses = [
  "Nursery",
  "Junior KG",
  "Senior KG",
  "Grade 1",
  "Grade 2",
];

const subjects = [
  {
    title: "Language",
    activities: 24,
    progress: 85,
    icon: "/subjects.png",
    bg: "from-[#DFF5FF] to-[#D6F1FF]",
  },

  {
    title: "Phonics",
    activities: 18,
    progress: 72,
    icon: "/homework.png",
    bg: "from-[#FFE1EC] to-[#FFD4E4]",
  },

  {
    title: "Rhymes",
    activities: 14,
    progress: 92,
    icon: "/notifications.png",
    bg: "from-[#FFF2D7] to-[#FFE7B0]",
  },

  {
    title: "Mathematics",
    activities: 28,
    progress: 76,
    icon: "/myclasses.png",
    bg: "from-[#DDF5B7] to-[#D2F09E]",
  },

  {
    title: "Art & Craft",
    activities: 16,
    progress: 68,
    icon: "/studassignment.png",
    bg: "from-[#EEE7FF] to-[#E2D8FF]",
  },

  {
    title: "Story Time",
    activities: 12,
    progress: 88,
    icon: "/subjects.png",
    bg: "from-[#DFF5FF] to-[#D6F1FF]",
  },

  {
    title: "Outdoor Play",
    activities: 10,
    progress: 95,
    icon: "/notifications.png",
    bg: "from-[#FFE1EC] to-[#FFD4E4]",
  },

  {
    title: "Practical Life",
    activities: 20,
    progress: 80,
    icon: "/homework.png",
    bg: "from-[#FFF2D7] to-[#FFE7B0]",
  },
];

export default function TeacherSubjects() {
  const router = useRouter();

  const [selectedClass, setSelectedClass] =
    useState("Nursery");

  const [showDropdown, setShowDropdown] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between">
          {/* BACK */}

          <button
            onClick={() => router.back()}
            className="
              w-11
              h-11
              rounded-2xl
              bg-white
              shadow-[0_8px_24px_rgba(15,23,42,0.06)]
              flex
              items-center
              justify-center
            "
          >
            <ArrowLeft
              size={20}
              className="text-slate-700"
            />
          </button>

          {/* CLASS SELECTOR */}

          <div className="relative">
            <button
              onClick={() =>
                setShowDropdown(!showDropdown)
              }
              className="
                h-11
                px-4
                rounded-[18px]
                bg-white
                border
                border-slate-100
                shadow-[0_8px_24px_rgba(15,23,42,0.06)]
                flex
                items-center
                gap-2
              "
            >
              <div className="w-2 h-2 rounded-full bg-[#7267F6]" />

              <span className="text-[13px] font-bold text-slate-800">
                {selectedClass}
              </span>

              <ChevronDown
                size={16}
                className={`
                  text-slate-400
                  transition-transform
                  duration-300
                  ${
                    showDropdown
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* DROPDOWN */}

            {showDropdown && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  w-[170px]
                  bg-white
                  rounded-[26px]
                  shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                  border
                  border-slate-100
                  p-2
                  z-50
                "
              >
                {teacherClasses.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => {
                      setSelectedClass(cls);
                      setShowDropdown(false);
                    }}
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      rounded-2xl
                      transition-all
                      ${
                        selectedClass === cls
                          ? "bg-[#7267F6] text-white"
                          : "hover:bg-slate-50 text-slate-700"
                      }
                    `}
                  >
                    <span className="text-[14px] font-semibold">
                      {cls}
                    </span>

                    {selectedClass === cls && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-7">
          <div className="flex items-center gap-3">
            <h1
              className="
                text-[28px]
                font-extrabold
                text-slate-900
                leading-none
              "
            >
              Subjects
            </h1>

            <Image
              src="/subjects.png"
              alt="subjects"
              width={28}
              height={28}
            />
          </div>

          <p className="text-[13px] text-slate-400 mt-3">
            Montessori learning spaces & activities
          </p>
        </div>
      </div>

      {/* ================= SUBJECT GRID ================= */}

      <div className="mt-8 px-4">
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject, index) => (
            <button
              key={index}
              className={`
                rounded-[28px]
                bg-gradient-to-br
                ${subject.bg}
                p-3
                text-left
                shadow-[0_10px_30px_rgba(0,0,0,0.04)]
                active:scale-[0.98]
                transition-all
              `}
            >
              {/* ICON */}

              <div
                className="
                  w-12
                  h-12  
                  rounded-[22px]
                  bg-white/60
                  flex
                  items-center
                  justify-center
                "
              >
                <Image
                  src={subject.icon}
                  alt={subject.title}
                  width={30}
                  height={30}
                />
              </div>

              {/* CONTENT */}

              <div className="mt-5">
                <h3
                  className="
                    text-[16px]
                    font-bold
                    text-slate-900
                    leading-tight
                  "
                >
                  {subject.title}
                </h3>

                <p className="text-[12px] text-slate-500 mt-2">
                  {subject.activities} Activities
                </p>
              </div>

              {/* PROGRESS */}

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-500">
                    Progress
                  </p>

                  <p className="text-[12px] font-bold text-slate-900">
                    {subject.progress}%
                  </p>
                </div>

                <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-800 rounded-full"
                    style={{
                      width: `${subject.progress}%`,
                    }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}