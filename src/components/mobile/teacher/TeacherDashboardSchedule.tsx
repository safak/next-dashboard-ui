"use client";

import { ChevronRight } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

const todaySchedule = [
  {
    time: "09:00 AM",
    subject: "English",
    class: "Nursery A",
    progress: 85,
    color: "from-[#DFF5FF] to-[#D6F1FF]",
    icon: "/subjects.png",
  },

  {
    time: "10:00 AM",
    subject: "Rhymes",
    class: "Junior KG",
    progress: 60,
    color: "from-[#EEE7FF] to-[#E2D8FF]",
    icon: "/homework.png",
  },

  {
    time: "11:00 AM",
    subject: "Activity",
    class: "Senior KG",
    progress: 72,
    color: "from-[#FFE1EC] to-[#FFD4E4]",
    icon: "/studassignment.png",
  },
];

export default function TeacherDashboardSchedule() {
  const router = useRouter();

  return (
    <div className="px-4">
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[22px] font-extrabold text-slate-900 leading-none">
            Today&apos;s Schedule
          </h2>

          <p className="text-[13px] text-slate-400 mt-2">
            Your upcoming classroom timeline
          </p>
        </div>

        <button
          onClick={() => router.push("/teacher/mobile/classes")}
          className="text-[13px] font-semibold text-[#7267F6]"
        >
          View all
        </button>
      </div>

      {/* ================= SCHEDULE LIST ================= */}

      <div className="space-y-4">
        {todaySchedule.slice(0, 2).map((item, index) => (
          <button
            key={index}
            onClick={() => router.push("/teacher/mobile/classes")}
            className={`w-full rounded-[26px] bg-gradient-to-br
              ${item.color}
              p-3
              text-left
              active:scale-[0.99]
              transition-all
              shadow-[0_10px_30px_rgba(0,0,0,0.03)]
            `}
          >
            {/* TOP */}

            <div className="flex items-start justify-between gap-3">
              {/* LEFT */}

              <div className="flex items-start gap-3">
                {/* ICON */}

                <div
                  className="
                    w-12
                    h-12
                    rounded-[18px]
                    bg-white/70
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <Image
                    src={item.icon}
                    alt={item.subject}
                    width={26}
                    height={26}
                  />
                </div>

                {/* CONTENT */}

                <div>
                  <h3
                    className="
                      text-[16px]
                      font-bold
                      text-slate-900
                      leading-none
                    "
                  >
                    {item.subject}
                  </h3>

                  {/* CLASS BADGE */}

                  <div
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      bg-white/70
                      text-[10px]
                      font-bold
                      text-slate-700
                      mt-2
                    "
                  >
                    {item.class}
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="text-right shrink-0">
                <h3
                  className="
                    text-[18px]
                    font-black
                    text-slate-900
                    leading-none
                  "
                >
                  {item.progress}%
                </h3>

                <p
                  className="
                    text-[10px]
                    text-slate-500
                    mt-1
                  "
                >
                  Completed
                </p>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="mt-5">
              <div
                className="
                  h-1.5
                  rounded-full
                  bg-black/10
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#1F2A44]
                  "
                  style={{
                    width: `${item.progress}%`,
                  }}
                />
              </div>
            </div>

            {/* BOTTOM */}

            <div className="flex items-center justify-between mt-4">
              {/* TIME */}

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-500" />

                <p
                  className="
                    text-[12px]
                    text-slate-700
                    font-semibold
                  "
                >
                  Starts at {item.time}
                </p>
              </div>

              {/* ACTION */}

              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-[12px]
                  font-bold
                  text-slate-700
                "
              >
                Open
                <ChevronRight size={15} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
