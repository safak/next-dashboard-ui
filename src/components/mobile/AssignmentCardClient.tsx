"use client";

import ActionMenuClient, { ActionType } from "@/components/ui/ActionMenuClient";
import { Assignment, Class, Subject, Teacher } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

type AssignmentWithRelations = Assignment & {
  subject: Subject;
  class: Class;
  teacher: Teacher;
};

export default function AssignmentCardClient({
  item,
  role,
}: {
  item: AssignmentWithRelations;
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
    <div className="bg-white border rounded-xl p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {item.title}
          </h3>

          <p className="text-[11px] text-gray-500 truncate">
            {item.subject.name} • {item.class.name} • {item.teacher.name}{" "}
            {item.teacher.surname}
          </p>

          <p className="text-[11px] text-gray-600 mt-1">
            Due:{" "}
            {new Intl.DateTimeFormat("en-GB").format(new Date(item.dueDate))}
          </p>

          <p className="text-[11px] text-gray-600 mt-1">
            Total Marks: {item.totalMarks}
          </p>
        </div>

        {(role === "admin" || role === "teacher") && (
          <div className="shrink-0">
            <ActionMenuClient
              actions={["edit", "delete"]}
              onAction={onAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}
