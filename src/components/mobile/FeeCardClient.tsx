"use client";

import { FeeStatusBadge } from "@/components/ui/FeeBadges";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type FeeItem = {
  id: number;
  title: string;
  amount: number;
  className: string;
  type: string;
  isActive: boolean;
};

export default function FeeCardClient({
  item,
  role,
}: {
  item: FeeItem;
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
    <div className="bg-white rounded-xl px-4 py-3 border shadow-sm">
      <div className="flex items-start justify-between gap-3">
        {/* LEFT: ICON + TEXT */}
        <div className="flex items-start gap-3 min-w-0">
          {/* ICON */}
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <span className="text-purple-600 text-base font-semibold">₹</span>
          </div>

          {/* TITLE + SUBTITLE */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
              {item.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {item.className || "All Classes"}
            </p>
          </div>
        </div>

        {/* RIGHT: AMOUNT + STATUS + MENU */}
        <div className="flex items-start gap-2 shrink-0">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-900">
              ₹{item.amount.toLocaleString()}
            </p>
            <div className="mt-0.5">
              <FeeStatusBadge active={item.isActive} />
            </div>
          </div>

          {role === "admin" && (
            <ActionMenuClient
              onAction={onAction}
              actions={["edit", "assign", "delete"]}
            />
          )}
        </div>
      </div>
    </div>
  );
}