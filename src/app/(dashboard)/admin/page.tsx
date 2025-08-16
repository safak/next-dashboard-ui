import Announcements from "@/components/Announcements";
import Attendsance from "@/components/Attendsance";
import CountChart from "@/components/CountChart";
import EventCalender from "@/components/EventCalender";
import FinanaceChart from "@/components/FinanaceChart";
import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-2 flex-col md:flex-row md:h-[calc(100vh-64px)] overflow-hidden scrollbar-hide">
      {/* left side */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8 md:overflow-y-auto pr-2 h-full scrollbar-hide">
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <UserCard date="2024/25" counter="6,123" category="students" />
          <UserCard date="2024/25" counter={1234} category="parents" />
          <UserCard date="2024/25" counter="6,123" category="teachers" />
          <UserCard date="2024/25" counter="6,123" category="Staffs" />
        </div>
        {/* middle chart */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNTER CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <Attendsance />
          </div>
        </div>
        {/* bottom chart */}
        <div className="w-full h-[500px]">
          <FinanaceChart/>
        </div>
      </div>
      {/* right  */}
      <div className="w-full lg:w-1/3 flex flex-col md:overflow-y-auto h-full scrollbar-hide">
        <EventCalender/>
        <Announcements/>
      </div>
    </div>
  );
};

export default AdminPage;
