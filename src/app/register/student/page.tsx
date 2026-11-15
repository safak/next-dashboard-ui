import StudentRegistrationForm from "@/components/forms/StudentRegistrationForm";
import { getContractTerms } from "@/lib/contract";
import prisma from "@/lib/prisma";
import { getSettings } from "@/lib/schoolSettings";

const StudentRegisterPage = async () => {
  const [grades, subjects, { schoolName }] = await Promise.all([
    prisma.grade.findMany({ orderBy: { level: "asc" }, select: { id: true, level: true } }),
    prisma.subject.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    getSettings(),
  ]);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Student registration</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in every section. The school reviews each registration before
          your account is activated.
        </p>
      </div>
      <StudentRegistrationForm
        grades={grades}
        subjects={subjects}
        schoolName={schoolName}
        terms={getContractTerms(schoolName)}
      />
    </>
  );
};

export default StudentRegisterPage;
