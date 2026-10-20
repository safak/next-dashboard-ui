"use client";

import { Parent, Student } from "@prisma/client";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type ParentWithStudents = Parent & { students: Student[] };

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ParentCardClient({
  parent,
  role,
}: {
  parent: ParentWithStudents;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const onAction = (action: ActionType) => {
    const q = new URLSearchParams(params.toString());
    q.set("action", action);
    q.set("id", String(parent.id));

    // ✅ force RSC refresh
    router.push(`?${q.toString()}`);
  };

  const visibleChildren = parent.students.slice(0, 2);
  const extraCount = parent.students.length - visibleChildren.length;

  return (
    <div className="relative bg-white border rounded-xl p-3 shadow-sm">
      {/* ACTION MENU */}
      {role === "admin" && (
        <div className="absolute top-2 right-2">
          <ActionMenuClient onAction={onAction} actions={["edit", "delete"]} />
        </div>
      )}

      <div className="flex items-center gap-3 pr-8">
        {/* AVATAR */}
        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold shrink-0">
          {getInitials(parent.name)}
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{parent.name}</h3>
          <p className="text-[11px] text-gray-500 truncate">{parent.email}</p>

          {parent.students.length > 0 && (
            <p className="text-[11px] text-gray-600 truncate">
              {visibleChildren.map((s) => s.name).join(", ")}
              {extraCount > 0 && (
                <span className="ml-1 text-gray-400">+{extraCount} more</span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
