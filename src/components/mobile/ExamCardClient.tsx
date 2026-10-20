"use client";

import { Exam, Subject, Class, Teacher } from "@prisma/client";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type ExamWithRelations = Exam & {
  subject: Subject;
  class: Class;
  teacher: Teacher;
};

export default function ExamCardClient({
  item,
  role,
}: {
  item: ExamWithRelations;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const onAction = (action: ActionType) => {
    const q = new URLSearchParams(params.toString());
    q.set("action", action);
    q.set("id", String(item.id));

    router.push(`?${q.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm px-4 py-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{item.title}</h3>
          <p className="text-xs text-gray-500 truncate">{item.subject.name}</p>
        </div>

        {(role === "admin" || role === "teacher") && (
          <ActionMenuClient actions={["edit", "delete"]} onAction={onAction} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
          {item.class.name}
        </span>

        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          {new Intl.DateTimeFormat("en-US").format(item.examDate)}
        </span>

        <span className="truncate">• {item.teacher.name}</span>
      </div>
    </div>
  );
}
