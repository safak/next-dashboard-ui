import FormContainer from "@/components/FormContainer";
import AttendanceCardClient from "./AttendanceCardClient";

type AttendanceItem = {
  id: number;
  student: string;
  class: string;
  date: string;
  status: "Present" | "Absent";
};

export default function AttendanceCard({
  item,
  role,
  action,
}: {
  item: AttendanceItem;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <AttendanceCardClient item={item} role={role} />

      {/* SERVER MODALS */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="attendance"
          type="update"
          data={item}
          id={item.id}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="attendance"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}