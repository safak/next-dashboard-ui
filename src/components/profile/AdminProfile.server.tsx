import FormContainer from "@/components/FormContainer";
import AdminProfileClient from "./AdminProfile.client";

type Admin = {
  id: string;
  username: string;
  img: string | null;
  lastActiveAt: Date | null;
};

export default function AdminProfileServer({
  admin,
}: {
  admin: Admin;
}) {
  return (
    <AdminProfileClient
      admin={admin}
      editSlot={
        <FormContainer
          table="profile"
          type="update"
          data={admin}
          id={admin.id} 
        />
      }
    />
  );
}