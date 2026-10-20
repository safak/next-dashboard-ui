"use client";

import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";

export default function AnnouncementCard({
  item,
  role,
  onSend,
  onRead,
}: {
  item: any;
  role?: string;
  onSend: (item: any) => void;
  onRead: (id: number) => void;
}) {
  const isUnread = item.reads.length === 0;
  const isLatest =
    isUnread &&
    Date.now() - new Date(item.date).getTime() < 48 * 60 * 60 * 1000;

  const onAction = (action: ActionType) => {
    if (action === "whatsapp") onSend(item);
    if (action === "edit" && item.onEdit) item.onEdit(item);
    if (action === "delete" && item.onDelete) item.onDelete(item.id);
  };

  const actions: ActionType[] = [];

  if (role === "admin") {
    if (!item.whatsappSent) actions.push("whatsapp");
    actions.push("edit");
    actions.push("delete");
  }

  return (
    <div className="bg-white rounded-xl px-4 py-3 border shadow-sm mt-2">
      {/* ROW 1 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0 mt-1.5">
          {/* ● UNREAD DOT */}
          {isUnread && (
            <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          )}

          {/* TITLE */}
          <button
            onClick={() => onRead(item.id)}
            className="text-left text-xs font-semibold text-gray-900 leading-tight truncate"
          >
            {item.title}
          </button>

          {/* [Latest] BADGE */}
          {isLatest && (
            <span className="mt-0.5 px-2 py-0.5 text-[10px] rounded-full bg-blue-100 text-blue-700 shrink-0">
              Latest
            </span>
          )}
        </div>

        {actions.length > 0 && (
          <ActionMenuClient onAction={onAction} actions={actions} />
        )}
      </div>

      {/* ROW 2 */}
      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
        <span className="truncate">{item.class?.name || "All Classes"}</span>
        <span className="text-gray-400">
          {new Date(item.date).toLocaleDateString("en-IN")}
        </span>
      </div>
    </div>
  );
}
