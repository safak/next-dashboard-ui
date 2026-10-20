"use client";

import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type AttendanceItem = {
  id: number;
  student: string;
  class: string;
  date: string;
  status: "Present" | "Absent";
};

export default function AttendanceCardClient({
  item,
  role,
}: {
  item: AttendanceItem;
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
    <div className="bg-white border rounded-lg px-3 py-2 shadow-sm">
      {/* TOP ROW */}
      <div className="flex justify-between items-center gap-2">
        <p className="font-medium text-sm truncate">{item.student}</p>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              item.status === "Present"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.status}
          </span>

          {role === "admin" && (
            <ActionMenuClient
              actions={["edit", "delete"]}
              onAction={onAction}
            />
          )}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <p className="mt-1 text-xs text-gray-500 truncate">
        {item.class} • {item.date}
      </p>
    </div>
  );
}