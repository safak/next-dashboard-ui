import FormContainer from "@/components/FormContainer";
import TeacherProfileClient from "./TeacherProfile.client";

type Teacher = {
  id: string;
  name: string;
  surname: string;
  phone?: string | null;
  img?: string | null;
  lastActiveAt?: Date | null;
};

export default function TeacherProfile({ teacher }: { teacher: Teacher }) {
  return (
    <TeacherProfileClient
      teacher={teacher}
      editSlot={
        <FormContainer
          table="profile"
          type="update"
          data={teacher}
          id={teacher.id}
        />
      }
    />
  );
}
