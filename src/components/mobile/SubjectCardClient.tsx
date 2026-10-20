"use client";

import { Subject, Teacher } from "@prisma/client";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type SubjectList = Subject & { teachers: Teacher[] };

export default function SubjectCardClient({
  item,
  role,
}: {
  item: SubjectList;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const onAction = (action: ActionType) => {
    const q = new URLSearchParams(params.toString());
    q.set("action", action);
    q.set("id", String(item.id));

    // ✅ force RSC refresh
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

      {/* SUBJECT NAME */}
      <p className="pr-8 text-sm font-semibold text-gray-900 truncate">
        {item.name}
      </p>

      {/* TEACHERS */}
      {item.teachers.length > 0 ? (
        <p className="mt-1 text-xs text-gray-600 truncate">
          <span className="font-medium text-gray-900">
            {item.teachers.map((t) => t.name).join(", ")}
          </span>
        </p>
      ) : (
        <p className="mt-1 text-xs italic text-gray-400">
          No teacher assigned
        </p>
      )}
    </div>
  );
}