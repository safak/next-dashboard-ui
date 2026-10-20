import { Parent, Student } from "@prisma/client";
import ParentCardClient from "./ParentCardClient";
import FormContainer from "@/components/FormContainer";

type ParentWithStudents = Parent & { students: Student[] };

export default function ParentCard({
  parent,
  role,
  action,
}: {
  parent: ParentWithStudents;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <ParentCardClient parent={parent} role={role} />

      {/* SERVER MODALS (URL DRIVEN) */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${parent.id}`}
          table="parent"
          type="update"
          id={parent.id}
          data={parent}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${parent.id}`}
          table="parent"
          type="delete"
          id={parent.id}
          trigger={null}
        />
      )}
    </>
  );
}