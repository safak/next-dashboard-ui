import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";
import OnlineClassesCard from "@/components/OnlineClassesCard";
import OverdueNotice from "@/components/fees/OverdueNotice";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const StudentPage = async () => {
  const { userId } = await auth();

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
  });

  const studentClass = classItem[0];

  return (
    <div className="p-4 flex flex-col gap-4">
      <OverdueNotice role="student" userId={userId!} />
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          <div className="h-full card p-4">
            {studentClass ? (
              <>
                <h1 className="text-xl font-semibold">
                  Schedule ({studentClass.name})
                </h1>
                <BigCalendarContainer type="classId" id={studentClass.id} />
              </>
            ) : (
              <p className="text-gray-500">
                No class found for this student account.
              </p>
            )}
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <OnlineClassesCard role="student" userId={userId!} />
          <EventCalendar />
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;