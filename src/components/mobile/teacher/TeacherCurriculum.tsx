"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassItem {
  id: number;
  name: string;
}

interface CurriculumSubject {
  name: string;
  color: string;
  accent: string;
  topics: string[];
}

export default function TeacherCurriculum() {
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);

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

  const curriculumData: Record<string, CurriculumSubject[]> = {
    Nursery: [
      {
        name: "Sensorial",
        color: "bg-[#FFF0F6]",
        accent: "#D96C9D",
        topics: [
          "Identifying Objects",
          "Identifying Colours",
          "Identifying Shapes",
          "Identifying Sizes",
          "Simple Patterns",
        ],
      },
      {
        name: "Mathematics",
        color: "bg-[#EEF8FC]",
        accent: "#4E9BB8",
        topics: [
          "More and Less",
          "Number Symbols 0-9",
          "Counting 1-10",
          "Ordering 1-10",
          "Number Symbols 11-20",
          "Counting 11-20",
        ],
      },
      {
        name: "English",
        color: "bg-[#F0F8E5]",
        accent: "#719B45",
        topics: [
          "Naming Common Things",
          "Singing Rhymes",
          "Drawing and Craft",
          "Tracing Curves",
          "Writing Set 1 Sounds",
          "Writing Set 2 Sounds",
        ],
      },
      {
        name: "EVS",
        color: "bg-[#FFF7DF]",
        accent: "#C48A20",
        topics: [
          "Parts of Body",
          "Clothes",
          "House Areas",
          "Fruits & Vegetables",
          "Vehicles",
          "Animals",
        ],
      },
    ],

    LKG: [
      {
        name: "English",
        color: "bg-[#F0F8E5]",
        accent: "#719B45",
        topics: [
          "A-Z Recognition",
          "Phonics Set 1",
          "Phonics Set 2",
          "Three Letter Words",
          "Rhymes",
          "Story Listening",
        ],
      },
      {
        name: "Mathematics",
        color: "bg-[#EEF8FC]",
        accent: "#4E9BB8",
        topics: [
          "Counting 1-50",
          "Number Recognition 1-50",
          "Before and After Numbers",
          "Missing Numbers",
          "Shapes",
          "Patterns",
        ],
      },
      {
        name: "EVS",
        color: "bg-[#FFF7DF]",
        accent: "#C48A20",
        topics: [
          "My Family",
          "Community Helpers",
          "Animals",
          "Birds",
          "Fruits",
          "Vegetables",
        ],
      },
    ],

    UKG: [
      {
        name: "English",
        color: "bg-[#F0F8E5]",
        accent: "#719B45",
        topics: [
          "Phonics",
          "Reading Sentences",
          "Sight Words",
          "Opposites",
          "Action Words",
          "Creative Writing",
        ],
      },
      {
        name: "Mathematics",
        color: "bg-[#EEF8FC]",
        accent: "#4E9BB8",
        topics: [
          "Counting 1-100",
          "Addition",
          "Subtraction",
          "Number Names",
          "Time",
          "Money",
        ],
      },
      {
        name: "EVS",
        color: "bg-[#FFF7DF]",
        accent: "#C48A20",
        topics: [
          "Plants",
          "Animals",
          "Transport",
          "Seasons",
          "Food",
          "Environment",
        ],
      },
    ],

    "Grade 1": [
      {
        name: "English",
        color: "bg-[#F0F8E5]",
        accent: "#719B45",
        topics: [
          "Reading Comprehension",
          "Grammar Basics",
          "Nouns",
          "Verbs",
          "Paragraph Writing",
          "Poetry",
        ],
      },
      {
        name: "Mathematics",
        color: "bg-[#EEF8FC]",
        accent: "#4E9BB8",
        topics: [
          "Addition",
          "Subtraction",
          "Place Value",
          "Measurement",
          "Time",
          "Money",
        ],
      },
      {
        name: "EVS",
        color: "bg-[#FFF7DF]",
        accent: "#C48A20",
        topics: [
          "Living and Non-Living",
          "Plants",
          "Animals",
          "Food Habits",
          "Our Environment",
        ],
      },
    ],

    "Grade 2": [
      {
        name: "English",
        color: "bg-[#F0F8E5]",
        accent: "#719B45",
        topics: [
          "Reading Skills",
          "Grammar",
          "Essay Writing",
          "Vocabulary",
          "Comprehension",
        ],
      },
      {
        name: "Mathematics",
        color: "bg-[#EEF8FC]",
        accent: "#4E9BB8",
        topics: [
          "Multiplication",
          "Division",
          "Fractions",
          "Measurement",
          "Geometry",
        ],
      },
      {
        name: "EVS",
        color: "bg-[#FFF7DF]",
        accent: "#C48A20",
        topics: [
          "Human Body",
          "Plants",
          "Animals",
          "Water Resources",
          "Environment",
        ],
      },
    ],
  };

  const subjects = curriculumData[selectedClass] || [];

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
                className={`
                  text-slate-400
                  transition-transform
                  duration-200
                  ${showDropdown ? "rotate-180" : ""}
                `}
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

        {/* ================= TITLE ================= */}

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-slate-900">
              Curriculum
            </h1>

            <Image
              src="/checklist.png"
              alt="Curriculum"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            Academic syllabus reference
          </p>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}

      {subjects.length > 0 && (
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
                <BookOpen size={15} />
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Subjects</p>

                <p className="text-[12px] font-bold text-slate-800">
                  {subjects.length}{" "}
                  {subjects.length === 1 ? "subject" : "subjects"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-400">Class</p>

              <p className="text-[12px] font-bold text-[#4B517D]">
                {selectedClass}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBJECTS ================= */}

      <div className="mt-5 space-y-4 px-4">
        {subjects.map((subject) => (
          <div
            key={subject.name}
            className={`
              relative
              overflow-hidden
              rounded-[24px]
              border
              border-white
              ${subject.color}
              shadow-[0_8px_24px_rgba(15,23,42,0.04)]
            `}
          >
            {/* Subject Accent */}

            <div
              className="absolute left-0 top-0 h-full w-1.5"
              style={{
                backgroundColor: subject.accent,
              }}
            />

            <div className="p-4 pl-5">
              {/* Subject Header */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/80
                      shadow-sm
                    "
                  >
                    <BookOpen
                      size={16}
                      style={{
                        color: subject.accent,
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">
                      {subject.name}
                    </h3>

                    <p className="text-[9px] text-slate-500">
                      {subject.topics.length} topics
                    </p>
                  </div>
                </div>

                <ChevronRight size={17} className="text-slate-400" />
              </div>

              {/* Topics */}

              <div className="mt-4 space-y-2">
                {subject.topics.map((topic, index) => (
                  <div
                    key={topic}
                    className="
                        flex
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-white/70
                        bg-white/65
                        px-3
                        py-2.5
                      "
                  >
                    <div
                      className="
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                        "
                    >
                      <CircleCheck
                        size={12}
                        style={{
                          color: subject.accent,
                        }}
                      />
                    </div>

                    <span className="min-w-0 flex-1 text-[11px] font-medium text-slate-700">
                      {topic}
                    </span>

                    <span className="text-[8px] font-semibold text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* ================= EMPTY STATE ================= */}

        {selectedClass && subjects.length === 0 && (
          <div
            className="
              flex
              min-h-[300px]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border
              border-slate-100
              bg-white
              px-6
              text-center
              shadow-[0_8px_24px_rgba(15,23,42,0.04)]
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#FFF8EC]
              "
            >
              <Image
                src="/checklist.png"
                alt="No curriculum"
                width={38}
                height={38}
                className="object-contain"
              />
            </div>

            <h3 className="mt-4 text-[15px] font-bold text-slate-900">
              No Curriculum Available
            </h3>

            <p className="mt-1.5 max-w-[250px] text-[11px] leading-5 text-slate-400">
              There is no curriculum configured for {selectedClass} yet.
            </p>
          </div>
        )}

        {!selectedClass && (
          <div
            className="
              flex
              min-h-[260px]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              bg-white
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-[#EEF0F6]
              "
            >
              <BookOpen size={25} className="text-[#4B517D]" />
            </div>

            <h3 className="mt-4 text-[15px] font-bold text-slate-900">
              Select a Class
            </h3>

            <p className="mt-1 text-[11px] text-slate-400">
              Choose a class to view its curriculum.
            </p>
          </div>
        )}
      </div>

      <div className="h-10" />
    </div>
  );
}
