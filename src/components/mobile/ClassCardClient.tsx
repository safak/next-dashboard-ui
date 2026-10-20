"use client";

import { Class, Teacher } from "@prisma/client";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type ClassList = Class & { supervisor: Teacher | null };

export default function ClassCardClient({
  item,
  role,
}: {
  item: ClassList;
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
    <div className="relative rounded-lg border border-gray-100 bg-white px-3 py-2.5 shadow-sm">
      {role === "admin" && (
        <div className="absolute top-2 right-2">
          <ActionMenuClient onAction={onAction} />
        </div>
      )}

      <div className="pr-8">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold truncate">{item.name}</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
            Cap {item.capacity}
          </span>
        </div>

        <div className="mt-1 text-[11px] text-gray-400 truncate">
          Supervisor:{" "}
          <span className="text-gray-500">
            {item.supervisor
              ? `${item.supervisor.name} ${item.supervisor.surname}`
              : "Not assigned"}
          </span>
        </div>
      </div>
    </div>
  );
}