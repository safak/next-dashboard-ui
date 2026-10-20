"use client";

import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type ResultItem = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

export default function ResultsCardClient({
  item,
  role,
}: {
  item: ResultItem;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const onAction = (action: ActionType) => {
    const q = new URLSearchParams(params.toString());
    q.set("action", action);
    q.set("id", String(item.id));

    // force RSC refresh
    router.push(`?${q.toString()}`);
  };

  return (
    <div className="bg-white border rounded-xl p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        {/* INFO */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-sm font-semibold truncate">{item.title}</h3>

          <p className="text-xs text-gray-500 truncate">
            {item.studentName} {item.studentSurname}
          </p>

          <p className="text-xs text-gray-500 truncate">
            {item.teacherName} {item.teacherSurname}
          </p>

          <p className="text-xs text-gray-400">
            {item.className} •{" "}
            {new Intl.DateTimeFormat("en-US").format(item.startTime)}
          </p>
        </div>

        {/* SCORE + ACTIONS */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {item.score}
          </span>

          {(role === "admin" || role === "teacher") && (
            <ActionMenuClient
              actions={["edit", "delete"]}
              onAction={onAction}
            />
          )}
        </div>
      </div>
    </div>
  );
}