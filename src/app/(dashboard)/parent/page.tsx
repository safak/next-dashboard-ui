import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import LinkChildForm from "@/components/forms/LinkChildForm";
import OnlineClassesCard from "@/components/OnlineClassesCard";
import OverdueNotice from "@/components/fees/OverdueNotice";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";


const ParentPage = async () => {
  const { userId } = await auth();
  const currentUserId = userId;

  const [students, pending] = await Promise.all([
    prisma.student.findMany({
      where: {
        parentId: currentUserId!,
      },
    }),
    // Children who registered but haven't been approved yet
    prisma.studentRegistration.findMany({
      where: { parentId: currentUserId!, status: { not: "APPROVED" } },
      select: { id: true, name: true, surname: true, studentNumber: true, status: true },
    }),
  ]);

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <OverdueNotice role="parent" userId={currentUserId!} />
        {pending.map((r) => (
          <div key={r.id} className="card p-4 text-sm">
            <span className="font-semibold">
              {r.name} {r.surname}
            </span>{" "}
            <span className="font-mono text-gray-500">({r.studentNumber})</span>
            {r.status === "PENDING"
              ? " — registration is waiting for approval by the school. Their schedule will appear here once they are placed in a class."
              : " — registration was not approved. Please contact the school."}
          </div>
        ))}
        {students.length === 0 && pending.length === 0 && (
          <div className="card p-4 text-sm text-gray-600">
            No children are linked to your account yet. Use the form on this
            page with your child&apos;s student number and date of birth.
          </div>
        )}
        {students.map((student) => (
          <div className="w-full" key={student.id}>
            <div className="h-full card p-4">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + " " + student.surname})
              </h1>
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {students.length > 0 && (
          <OnlineClassesCard role="parent" userId={currentUserId!} />
        )}
        <div className="card p-4 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Link another child</h2>
          <p className="text-sm text-gray-500">
            Have more than one child at the school? Enter each child&apos;s
            student number and date of birth.
          </p>
          <LinkChildForm />
        </div>
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
