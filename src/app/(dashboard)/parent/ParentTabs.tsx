"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ParentTabs({
  students,
  activeId,
}: {
  students: any[];
  activeId: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = (id: string) => {
    const q = new URLSearchParams(
      params.toString()
    );
    q.set("studentId", id);
    router.push(`?${q.toString()}`);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {students.map((s) => (
        <button
          key={s.id}
          onClick={() => handleClick(s.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition
            ${
              s.id === activeId
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}