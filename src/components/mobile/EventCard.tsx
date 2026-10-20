"use client";

import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function EventCard({
  item,
  role,
}: {
  item: any;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  /* ACTION HANDLER */
  const onAction = (action: ActionType) => {
    const q = new URLSearchParams(params.toString());
    q.set("id", String(item.id));

    if (action === "edit") q.set("action", "edit");
    if (action === "delete") q.set("action", "delete");

    router.push(`?${q.toString()}`);
  };

  const actions: ActionType[] = role === "admin" ? ["edit", "delete"] : [];

  return (
    <div className="bg-white rounded-xl px-4 py-3 border shadow-sm">
      <div className="flex items-start justify-between gap-3">
        {/* LEFT CONTENT */}
        <div className="min-w-0">
          {/* TITLE */}
          <p className="text-xs font-semibold text-gray-900 truncate">
            {item.title}
          </p>

          {/* CLASS + DATE */}
          <p className="mt-0.5 text-xs text-gray-500 truncate">
            {item.class?.name ?? "All Classes"} ·{" "}
            {new Date(item.startTime).toLocaleDateString("en-IN")}
          </p>

          {/* TIME */}
          <p className="mt-0.5 text-xs text-gray-400 truncate">
            {new Date(item.startTime).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            –{" "}
            {new Date(item.endTime).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* ACTIONS */}
        {actions.length > 0 && (
          <ActionMenuClient onAction={onAction} actions={actions} />
        )}
      </div>
    </div>
  );
}