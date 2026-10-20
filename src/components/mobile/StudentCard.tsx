import { Class, Student } from "@prisma/client";
import StudentCardClient from "./StudentCardClient";
import FormContainer from "@/components/FormContainer";

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

export default function StudentCard({
  item,
  role,
  action,
}: {
  item: StudentWithExtras;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <StudentCardClient item={item} role={role} />

      {/* SERVER MODALS */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="student"
          type="update"
          id={item.id}
          data={item}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="student"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}