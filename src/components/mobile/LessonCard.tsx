import { Class, Lesson, Subject, Teacher } from "@prisma/client";
import LessonCardClient from "./LessonCardClient";
import FormContainer from "@/components/FormContainer";

type LessonList = Lesson & {
  subject: Subject;
  class: Class;
  teacher: Teacher;
};

export default function LessonCard({
  item,
  role,
  action,
}: {
  item: LessonList;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <LessonCardClient item={item} role={role} />

      {/* SERVER-SIDE MODALS (URL DRIVEN) */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="lesson"
          type="update"
          id={item.id}
          data={item}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="lesson"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}