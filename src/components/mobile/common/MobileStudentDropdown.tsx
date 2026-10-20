"use client";

import { ChevronDown, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type StudentOption = {
  id: string;
  name: string;
  surname?: string | null;
  className?: string | null;
  img?: string | null;
};

type Props = {
  students: StudentOption[];
  selectedStudentId: string;
};

export default function MobileStudentDropdown({
  students,
  selectedStudentId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) || students[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!selectedStudent) {
    return null;
  }

  const selectStudent = (studentId: string) => {
    setOpen(false);

    router.push(`${pathname}?studentId=${encodeURIComponent(studentId)}`);
  };

  const childName = selectedStudent.name?.trim() || "Student";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (students.length > 1) {
            setOpen((previous) => !previous);
          }
        }}
        className="
          flex
          h-11
          items-center
          gap-1.5
          rounded-full
          border
          border-slate-100
          bg-white
          px-3
          shadow-[0_8px_24px_rgba(15,23,42,0.06)]
          transition
          active:scale-95
        "
      >
        {selectedStudent.img ? (
          <Image
            src={selectedStudent.img}
            alt={childName}
            className="
              h-6
              w-6
              rounded-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-[#E7ECF8]
              text-[#4B517D]
            "
          >
            <UserRound className="h-3.5 w-3.5" />
          </div>
        )}

        <span className="max-w-[70px] truncate text-[10px] font-bold text-[#4B517D]">
          {childName}
        </span>

        {students.length > 1 && (
          <ChevronDown
            className={`
              h-3.5
              w-3.5
              text-[#4B517D]
              transition-transform
              ${open ? "rotate-180" : ""}
            `}
          />
        )}
      </button>

      {open && students.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Close child selector"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80]"
          />

          <div
            className="
              absolute
              right-0
              top-[48px]
              z-[90]
              w-[215px]
              overflow-hidden
              rounded-[20px]
              border
              border-slate-100
              bg-white
              p-2
              shadow-[0_14px_40px_rgba(15,23,42,0.16)]
            "
          >
            <div className="px-3 pb-2 pt-1">
              <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                Select Child
              </p>
            </div>

            <div className="space-y-1">
              {students.map((student) => {
                const isActive = student.id === selectedStudentId;

                const name = `${student.name} ${student.surname || ""}`.trim();

                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => selectStudent(student.id)}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-2.5
                      rounded-[14px]
                      px-2.5
                      py-2
                      text-left
                      transition
                      ${
                        isActive
                          ? "bg-[#4B517D] text-white"
                          : "text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    {student.img ? (
                      <Image
                        src={student.img}
                        alt={name}
                        className="
                          h-8
                          w-8
                          shrink-0
                          rounded-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-[#E7ECF8] text-[#4B517D]"
                          }
                        `}
                      >
                        <UserRound className="h-4 w-4" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          truncate
                          text-[10px]
                          font-bold
                          ${isActive ? "text-white" : "text-slate-800"}
                        `}
                      >
                        {name}
                      </p>

                      <p
                        className={`
                          mt-0.5
                          truncate
                          text-[8px]
                          ${isActive ? "text-white/65" : "text-slate-400"}
                        `}
                      >
                        {student.className || "Class"}
                      </p>
                    </div>

                    {isActive && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
