import AdmissionManagementContent from "./components/AdmissionManagementContent";
import { getAdmissionRegister } from "@/services/admissions.service";

export default async function AdmissionsPage() {
  const data = await getAdmissionRegister();

  return (
    <AdmissionManagementContent
      students={data.students}
      summary={data.summary}
      classes={data.classes}
      academicYear={data.academicYear}
    />
  );
}
