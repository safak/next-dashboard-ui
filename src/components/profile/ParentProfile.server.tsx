import FormContainer from "@/components/FormContainer";
import ParentProfileClient from "./ParentProfile.client";

type Parent = {
  id: string;
  name: string;
  surname: string;
  phone?: string | null;
  img?: string | null;
  lastActiveAt?: Date | null;
};

export default function ParentProfile({ parent }: { parent: Parent }) {
  return (
    <ParentProfileClient
      parent={parent}
      editSlot={
        <FormContainer
          table="profile"
          type="update"
          data={parent}
          id={parent.id}
        />
      }
    />
  );
}
