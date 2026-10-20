import { getAdmissionRegister } from "@/services/admissions.service";
import ApplicationsTableClient from "./ApplicationsTableClient";

export default async function ApplicationsPage() {
  const result = await getAdmissionRegister();

  return (
    <ApplicationsTableClient admissions={result.students} />
  );
}