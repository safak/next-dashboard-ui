"use client";

import { Class, Lesson, Subject, Teacher } from "@prisma/client";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type LessonList = Lesson & {
  subject: Subject;
  class: Class;
  teacher: Teacher;
};

export default function LessonCardClient({
  item,
  role,
}: {
  item: LessonList;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const onAction = (action: ActionType) => {
    const q = new URLSearchParams(params.toString());
    q.set("action", action);
    q.set("id", String(item.id));

    // ✅ MUST be push (forces RSC re-render)
    router.push(`?${q.toString()}`);
  };

  return (
    <div className="relative rounded-xl border bg-white px-4 py-3 shadow-sm">
      {/* ACTION MENU */}
      {role === "admin" && (
        <div className="absolute top-2 right-2">
          <ActionMenuClient onAction={onAction} />
        </div>
      )}

      {/* CONTENT */}
      <div className="pr-8">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm truncate">{item.name}</p>

          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100">
            {item.class.name}
          </span>
        </div>

        <div className="mt-1 text-xs text-gray-600 truncate">
          <span className="font-medium text-gray-900">
            {item.teacher.name} {item.teacher.surname}
          </span>
          <span className="mx-1 text-gray-400">•</span>
          {item.subject.name}
        </div>
      </div>
    </div>
  );
}