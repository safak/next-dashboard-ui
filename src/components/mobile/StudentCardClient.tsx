"use client";

import Image from "next/image";
import { Class, Student } from "@prisma/client";
import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { useRouter, useSearchParams } from "next/navigation";

type StudentWithExtras = Student & {
  class: Class;
  studentFees?: {
    totalAmount: number;
    paidAmount: number;
  }[];
  _count: {
    studentFees: number;
  };
};

export default function StudentCardClient({
  item,
  role,
}: {
  item: StudentWithExtras;
  role?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const onAction = (action: ActionType) => {
    if (action === "view") {
      router.push(`/list/students/${item.id}`);
      return;
    }

    const q = new URLSearchParams(params.toString());
    q.set("action", action);
    q.set("id", String(item.id));
    router.push(`?${q.toString()}`);
  };

  /* ===== FEE STATUS ===== */
  const hasFees = item.studentFees && item.studentFees.length > 0;

  return (
    <div className="relative bg-white border rounded-xl p-3 shadow-sm">
      {/* ===== RIGHT ACTIONS (FIXED) ===== */}
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

        {/* Name + Class */}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{item.name}</h3>
          <p className="text-[11px] text-gray-500 truncate">
            {item.class.name}
          </p>
        </div>
      </div>

      {/* ===== FEE BADGE ===== */}
      {role === "admin" && (
        <div className="mt-2 text-[11px]">
          {!hasFees && (
            <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-500">
              Fee: Not Assigned
            </span>
          )}
        </div>
      )}
    </div>
  );
}
