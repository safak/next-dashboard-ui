import EventCalendarContainer from "@/components/admin/dashboard/calendar/EventCalendarContainer";

import {
  EnrollmentOverviewCard,
  StudentDistributionCard,
} from "@/components/admin/dashboard/EnrollmentDistribution";

import StudentOverviewCard from "@/components/admin/dashboard/StudentOverviewCard";
import AttendanceSummaryCard from "@/components/admin/dashboard/AttendanceSummaryCard";
import FinanceSummaryCard from "@/components/admin/dashboard/FinanceSummaryCard";
import DashboardUpcomingEvents from "@/components/admin/dashboard/DashboardUpcomingEvents";

interface DashboardChartsProps {
  enrollmentOverview: {
    id: number;
    name: string;
    boys: number;
    girls: number;
    total: number;
  }[];

  financeSummary: {
    collected: number;
    pending: number;
    totalFee: number;
    collectionRate: number;
    chartData: {
      month: string;
      fees: number;
    }[];
  };

  studentOverview: {
    totalStudents: number;
    boys: number;
    girls: number;
    todayAdmissions: number;
  };

  attendance: {
    studentPresent: number;
    studentAbsent: number;
    teacherPresent: number;
    teacherAbsent: number;
    attendanceRate: number;
  };

  upcomingEvents: {
    id: number;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
  }[];
}

export default function DashboardCharts({
  enrollmentOverview,
  financeSummary,
  studentOverview,
  attendance,
  upcomingEvents,
}: DashboardChartsProps) {
  return (
    <section className="space-y-5">
      {/* MAIN DASHBOARD AREA */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* LEFT DASHBOARD AREA */}
        <div className="min-w-0 space-y-4">
          {/* ENROLLMENT + STUDENT DISTRIBUTION */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="h-[220px] min-w-0">
              <EnrollmentOverviewCard data={enrollmentOverview} />
            </div>

            <div className="h-[220px] min-w-0">
              <StudentDistributionCard data={enrollmentOverview} />
            </div>
          </div>

          {/* STUDENT + ATTENDANCE */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="min-w-0">
              <StudentOverviewCard
                totalStudents={studentOverview.totalStudents}
                boys={studentOverview.boys}
                girls={studentOverview.girls}
                todayAdmissions={studentOverview.todayAdmissions}
              />
            </div>

            <div className="min-w-0">
              <AttendanceSummaryCard
                studentPresent={attendance.studentPresent}
                studentAbsent={attendance.studentAbsent}
                teacherPresent={attendance.teacherPresent}
                teacherAbsent={attendance.teacherAbsent}
                attendanceRate={attendance.attendanceRate}
              />
            </div>
          </div>

          {/* FEE COLLECTION */}
          <div className="h-full min-h-[235px]">
            <FinanceSummaryCard
              collected={financeSummary.collected}
              pending={financeSummary.pending}
              totalFee={financeSummary.totalFee}
              collectionRate={financeSummary.collectionRate}
              chartData={financeSummary.chartData}
            />
          </div>
        </div>

        {/* RIGHT CALENDAR */}
        <div className="min-w-0 space-y-4">
          {/* SCHOOL CALENDAR */}
          <div className="h-[448px] min-w-0">
            <EventCalendarContainer />
          </div>

          {/* UPCOMING EVENTS */}
          <div className="min-w-0">
            <DashboardUpcomingEvents events={upcomingEvents} />
          </div>
        </div>
      </div>
    </section>
  );
}
