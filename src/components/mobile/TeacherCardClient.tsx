"use client";

import Image from "next/image";
import { Teacher } from "@prisma/client";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function TeacherCardClient({
  item,
  role,
}: {
  item: Teacher;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const onAction = (action: ActionType) => {
    if (action === "view") {
      router.push(`/list/teachers/${item.id}`);
      return;
    }

    const q = new URLSearchParams(params.toString());
    q.set("action", action);
    q.set("id", String(item.id));
    router.push(`?${q.toString()}`);
  };

  return (
    <div className="relative bg-white border rounded-xl p-3 shadow-sm">
      {/* ===== RIGHT ACTIONS ===== */}
      {role === "admin" && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <ActionMenuClient
            onAction={onAction}
            actions={["view", "edit", "delete"]}
          />
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex items-center gap-3 pr-16">
        {/* Avatar */}
        <Image
          src={item.img || "/noAvatar.png"}
          alt={item.name}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />

        {/* Name + Email */}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{item.name}</h3>
          <p className="text-[11px] text-gray-500 truncate">
            {item.email}
          </p>
        </div>
      </div>
    </div>
  );
}