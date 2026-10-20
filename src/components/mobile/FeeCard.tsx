import FormContainer from "@/components/FormContainer";
import FeeCardClient from "./FeeCardClient";

type FeeItem = {
  id: number;
  title: string;
  amount: number;
  className: string;
  type: string;
  isActive: boolean;
};

export default function FeeCard({
  item,
  role,
  action,
}: {
  item: FeeItem;
  role?: string;
  action?: "edit" | "delete" | "assign";
}) {
  return (
    <>
      {/* CLIENT UI */}
      <FeeCardClient item={item} role={role} />

      {/* SERVER MODALS */}
      {action === "edit" && (
        <FormContainer
          key={`edit-${item.id}`}
          table="fee"
          type="update"
          data={item}
          id={item.id}
          trigger={null}
        />
      )}

      {action === "delete" && (
        <FormContainer
          key={`delete-${item.id}`}
          table="fee"
          type="delete"
          id={item.id}
          trigger={null}
        />
      )}

      {action === "assign" && (
        <FormContainer
          key={`assign-${item.id}`}
          table="fee"
          type="assign"
          data={item}
          id={item.id}
          trigger={null}
        />
      )}
    </>
  );
}
