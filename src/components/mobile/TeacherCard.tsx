import { Teacher } from "@prisma/client";
import TeacherCardClient from "./TeacherCardClient";
import FormContainer from "@/components/FormContainer";

export default function TeacherCard({
  item,
  role,
  action,
}: {
  item: Teacher;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <TeacherCardClient item={item} role={role} />

      {/* SERVER-SIDE MODALS (URL DRIVEN) */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="teacher"
          type="update"
          id={item.id}
          data={item}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="teacher"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}