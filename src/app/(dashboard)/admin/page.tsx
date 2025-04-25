import FinanceChart from "@/components/FinanceChart";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import UserCard from "@/components/UserCard";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";

export default function AdminPage() {
  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT  */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS  */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>

        {/* MIDDLE CHART  */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART  */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>

          {/* ATTENTANCE CHART  */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>

        {/* BOTTOM CHART  */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT  */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}
