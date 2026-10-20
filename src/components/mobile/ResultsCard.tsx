import FormContainer from "@/components/FormContainer";
import ResultsCardClient from "./ResultsCardClient";

type ResultItem = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

export default function ResultsCard({
  item,
  role,
  action,
}: {
  item: ResultItem;
  role?: string;
  action?: "edit" | "delete";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <ResultsCardClient item={item} role={role} />

      {/* SERVER MODALS */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="result"
          type="update"
          data={item}
          id={item.id}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="result"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}