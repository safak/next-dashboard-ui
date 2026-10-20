import { Subject, Teacher } from "@prisma/client";
import SubjectCardClient from "./SubjectCardClient";
import FormContainer from "@/components/FormContainer";

type SubjectList = Subject & { teachers: Teacher[] };

export default function SubjectCard({
  item,
  role,
  action,
}: {
  item: SubjectList;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <SubjectCardClient item={item} role={role} />

      {/* SERVER-SIDE MODALS */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="subject"
          type="update"
          id={item.id}
          data={item}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="subject"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}