"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/* ================= DAY MAP ================= */

const dayMap: Record<string, string> = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
};

type ClassItem = {
  id: string;
  name: string;
  capacity: number;
};

type ScheduleItem = {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
};

export default function TeacherClassSchedule() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const selectedDay = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
  });

  /* ================= FETCH CLASSES ================= */

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/mobile/teacher/classes");

      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }

      const data = await response.json();

      const classList = Array.isArray(data) ? data : [];

      setClasses(classList);

      if (classList.length > 0) {
        setSelectedClass((current) => current || classList[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH SCHEDULE ================= */

  const fetchSchedule = useCallback(async () => {
    try {
      setScheduleLoading(true);

      const day = dayMap[selectedDay];

      if (!day) {
        setSchedule([]);
        return;
      }

      const response = await fetch(
        `/api/mobile/teacher/schedule?className=${encodeURIComponent(
          selectedClass,
        )}&day=${day}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }

      const data = await response.json();

      setSchedule(Array.isArray(data) ? data : data.schedule || []);
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      setSchedule([]);
    } finally {
      setScheduleLoading(false);
    }
  }, [selectedClass, selectedDay]);

  useEffect(() => {
    if (!selectedClass || selectedDate.getDay() === 0) {
      setSchedule([]);
      return;
    }

    void fetchSchedule();
  }, [selectedClass, selectedDate, fetchSchedule]);

  /* ================= CARD COLORS ================= */

  const cardColors = [
    "from-[#EEF2FA] to-[#E4E8F3]",
    "from-[#FFF8EC] to-[#FFECCF]",
    "from-[#EAF7E0] to-[#DFF2C8]",
    "from-[#F3EEF9] to-[#EAE3F4]",
    "from-[#FFF1E2] to-[#FFE4C2]",
  ];

  /* ================= CARD ICONS ================= */

  const cardIcons = [
    "/subjects.png",
    "/homework.png",
    "/studassignment.png",
    "/notifications.png",
    "/myclasses.png",
  ];

  /* ================= WEEK DATES ================= */

  const getWeekDates = () => {
    const baseDate = new Date(selectedDate);

    const dayOfWeek = baseDate.getDay();

    const monday = new Date(baseDate);

    monday.setDate(baseDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + index);

      return date;
    });
  };

  const weekDates = getWeekDates();

  const isSunday = selectedDate.getDay() === 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F8FA] pb-10">
      {/* ================= HEADER ================= */}

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          {/* BACK */}

          <button
            type="button"
            onClick={() => router.back()}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-100
              bg-white
              text-slate-700
              shadow-[0_6px_18px_rgba(75,81,125,0.07)]
              transition
              active:scale-95
            "
          >
            <ArrowLeft size={19} />
          </button>

          {/* CLASS SELECTOR */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowClassDropdown((prev) => !prev)}
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-[18px]
                border
                border-slate-100
                bg-white
                px-3.5
                shadow-[0_6px_18px_rgba(75,81,125,0.07)]
                transition
                active:scale-95
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#F59A23]
                "
              />

              <span
                className="
                  max-w-[100px]
                  truncate
                  text-[12px]
                  font-bold
                  text-[#4B517D]
                "
              >
                {loading ? "Loading..." : selectedClass || "Select Class"}
              </span>

              <ChevronDown
                size={15}
                className={`
                  text-[#4B517D]/60
                  transition-transform
                  duration-200
                  ${showClassDropdown ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* DROPDOWN */}

            {showClassDropdown && (
              <>
                <button
                  type="button"
                  aria-label="Close class selector"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowClassDropdown(false)}
                />

                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-[175px]
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-slate-100
                    bg-white
                    p-1.5
                    shadow-[0_18px_45px_rgba(75,81,125,0.16)]
                  "
                >
                  {classes.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-slate-400">
                      No classes available
                    </div>
                  ) : (
                    classes.map((cls) => (
                      <button
                        type="button"
                        key={cls.id}
                        onClick={() => {
                          setSelectedClass(cls.name);
                          setShowClassDropdown(false);
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-[14px]
                          px-3.5
                          py-2.5
                          text-left
                          transition
                          ${
                            selectedClass === cls.name
                              ? "bg-[#4B517D] text-white"
                              : "text-slate-700 hover:bg-[#F7F4FD]"
                          }
                        `}
                      >
                        <span className="truncate text-[13px] font-semibold">
                          {cls.name}
                        </span>

                        {selectedClass === cls.name && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#F59A23]" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-6">
          <div className="flex items-center gap-2.5">
            <h1
              className="
                text-[26px]
                font-extrabold
                leading-none
                tracking-tight
                text-slate-900
              "
            >
              My Classes
            </h1>

            <Image
              src="/myclasses.png"
              alt="Classes"
              width={19}
              height={19}
              className="object-contain"
            />
          </div>

          <p className="mt-2 text-[12px] text-slate-400">
            Montessori classroom schedule
          </p>
        </div>
      </div>

      {/* ================= WEEK HEADER ================= */}

      <div className="mt-5 px-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const date = new Date(selectedDate);

              date.setDate(date.getDate() - 7);

              setSelectedDate(date);
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#4B517D]
              shadow-[0_6px_18px_rgba(75,81,125,0.07)]
              transition
              active:scale-95
            "
          >
            <ArrowLeft size={16} />
          </button>

          <div className="text-center">
            <h3 className="text-[18px] font-extrabold text-[#4B517D]">
              {weekDates[0].toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-400">
              {weekDates[0].getDate()} -{" "}
              {weekDates[weekDates.length - 1].getDate()} Week Schedule
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const date = new Date(selectedDate);

              date.setDate(date.getDate() + 7);

              setSelectedDate(date);
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#4B517D]
              shadow-[0_6px_18px_rgba(75,81,125,0.07)]
              transition
              active:scale-95
            "
          >
            <span className="text-base">→</span>
          </button>
        </div>
      </div>

      {/* ================= DAYS ================= */}

      <div className="mt-4 px-4">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {weekDates.map((date) => {
            const isSelected =
              selectedDate.toDateString() === date.toDateString();

            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <button
                type="button"
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex
                  h-[70px]
                  min-w-[55px]
                  flex-col
                  items-center
                  justify-center
                  rounded-[19px]
                  border
                  transition-all
                  active:scale-95
                  ${
                    isSelected
                      ? "border-[#4B517D] bg-[#4B517D] text-white shadow-[0_8px_20px_rgba(75,81,125,0.20)]"
                      : "border-slate-100 bg-white text-slate-700"
                  }
                `}
              >
                {isToday ? (
                  <span
                    className={`
                      text-[8px]
                      font-bold
                      uppercase
                      ${isSelected ? "text-[#F59A23]" : "text-[#F59A23]"}
                    `}
                  >
                    TODAY
                  </span>
                ) : (
                  <span
                    className={`
                      text-[9px]
                      font-medium
                      ${isSelected ? "text-white/70" : "text-slate-400"}
                    `}
                  >
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                )}

                <span className="mt-0.5 text-[22px] font-extrabold leading-none">
                  {date.getDate()}
                </span>

                <span
                  className={`
                    mt-1
                    text-[10px]
                    ${isSelected ? "text-white/80" : "text-slate-500"}
                  `}
                >
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TIMELINE ================= */}

      <div className="mt-7 space-y-4 px-4">
        {scheduleLoading ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#EEF2FA] border-t-[#4B517D]" />

            <p className="mt-4 text-xs text-slate-400">Loading schedule...</p>
          </div>
        ) : isSunday ? (
          /* ================= SUNDAY ================= */

          <div className="flex flex-col items-center justify-center pt-16">
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[#FFF8EC]
              "
            >
              <span className="text-3xl">🏖️</span>
            </div>

            <h3 className="mt-5 text-[18px] font-bold text-[#4B517D]">
              Sunday Holiday
            </h3>

            <p className="mt-2 text-center text-[12px] leading-5 text-slate-400">
              No classes scheduled today.
              <br />
              Enjoy your weekend.
            </p>
          </div>
        ) : (
          <>
            {/* ================= SCHEDULE ================= */}

            {schedule.map((item: ScheduleItem, index) => {
              const now = new Date();

              const startTime = new Date(item.startTime);

              const endTime = new Date(item.endTime);

              const isToday =
                selectedDate.toDateString() === new Date().toDateString();

              const isActive = isToday && now >= startTime && now <= endTime;

              const isCompleted = isToday && now > endTime;

              const isUpcoming = isToday && now < startTime;

              return (
                <div key={item.id} className="flex items-start gap-2.5">
                  {/* TIME */}

                  <div className="w-[48px] shrink-0 pt-5">
                    <p className="text-[9px] font-semibold text-slate-400">
                      {startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* CARD */}

                  <div
                    className={`
                        flex-1
                        rounded-[23px]
                        bg-gradient-to-br
                        ${cardColors[index % cardColors.length]}
                        p-3.5
                        shadow-[0_5px_18px_rgba(75,81,125,0.05)]
                      `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-[15px]
                              bg-white/75
                            "
                        >
                          <Image
                            src={cardIcons[index % cardIcons.length]}
                            alt={item.name}
                            width={25}
                            height={25}
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-[16px] font-extrabold text-slate-900">
                            {item.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px]">🕒</span>

                            <span className="text-[11px] font-medium text-slate-600">
                              {startTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {" - "}
                              {endTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <p className="mt-1 text-[9px] uppercase tracking-wide text-slate-400">
                            {item.day}
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}

                      <span
                        className={`
                            shrink-0
                            rounded-full
                            px-2.5
                            py-1
                            text-[9px]
                            font-bold
                            ${
                              isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : isCompleted
                                  ? "bg-slate-200 text-slate-600"
                                  : isUpcoming
                                    ? "bg-[#FFF1DC] text-[#C87808]"
                                    : "bg-[#EEF2FA] text-[#4B517D]"
                            }
                          `}
                      >
                        {isActive
                          ? "Live"
                          : isCompleted
                            ? "Completed"
                            : isUpcoming
                              ? "Upcoming"
                              : "Scheduled"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ================= EMPTY ================= */}

            {schedule.length === 0 && (
              <div className="flex flex-col items-center justify-center pt-16">
                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-[#EEF2FA]
                  "
                >
                  <Image
                    src="/notifications.png"
                    alt="No classes"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>

                <h3 className="mt-5 text-[17px] font-bold text-[#4B517D]">
                  No Classes Scheduled
                </h3>

                <p className="mt-2 text-center text-[12px] leading-5 text-slate-400">
                  No timetable available for
                  <br />
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </p>

                {selectedClass && (
                  <p className="mt-1 text-[10px] font-medium text-[#F59A23]">
                    {selectedClass}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
