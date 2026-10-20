import { auth, currentUser } from "@clerk/nextjs/server";

import { getGreeting } from "@/lib/getGreeting";
import { getDashboardData } from "@/services/dashboard.service";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardSummary from "@/components/admin/dashboard/DashboardSummary";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import DashboardSidebar from "@/components/admin/dashboard/DashboardSidebar";
import DashboardActivity from "@/components/admin/dashboard/DashboardActivity";
import AnnouncementBanner from "@/components/admin/dashboard/announcement/AnnouncementBanner";

const AdminPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  let adminName = "Admin";

  try {
    const user = await currentUser();

    if (user?.firstName) {
      adminName = user.firstName;
    }
  } catch (error) {
    console.error("Failed to load Clerk user:", error);
  }

  const greeting = `${getGreeting()}, ${adminName}`;

  const dashboard = await getDashboardData();

  return (
    <div className="w-full space-y-5 pb-6">
      <DashboardHeader greeting={greeting} />

      <DashboardSummary
        students={dashboard.summary.students}
        teachers={dashboard.summary.teachers}
        classes={dashboard.summary.classes}
        attendanceRate={dashboard.attendance.attendanceRate}
      />

      <DashboardCharts
        enrollmentOverview={dashboard.enrollmentOverview}
        studentOverview={dashboard.studentOverview}
        attendance={dashboard.attendance}
        financeSummary={dashboard.financeSummary}
        upcomingEvents={dashboard.upcomingEvents}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.45fr_1fr]">
        <DashboardActivity activities={dashboard.activities} />

        <DashboardSidebar />
      </div>
    </div>
  );
};

export default AdminPage;
