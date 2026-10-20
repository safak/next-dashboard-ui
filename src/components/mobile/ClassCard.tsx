import { Class, Teacher } from "@prisma/client";
import ClassCardClient from "./ClassCardClient";
import FormContainer from "@/components/FormContainer";

type ClassList = Class & { supervisor: Teacher | null };

export default function ClassCard({
  item,
  role,
  action,
}: {
  item: ClassList;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      <ClassCardClient item={item} role={role} />

      {/* SERVER-SIDE MODALS */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="class"
          type="update"
          id={item.id}
          data={item}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="class"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}
