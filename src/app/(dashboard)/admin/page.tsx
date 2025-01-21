import Announcements from "@/components/announcements";
import Attendancechart from "@/components/attendancechart"
import Countchart from "@/components/countchart"
import Eventcalendar from "@/components/eventcalendar";
import Financechart from "@/components/financechart"
import Usercard from "@/components/usercard"


const AdminPage = () => {
  return (
    <div className="p-4 flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="flex flex-col gap-8 w-full lg:w-2/3">
        {/* USER CARDS */}
        <div className="flex flex-wrap justify-between gap-4">
          <Usercard type="student" />
          <Usercard type="teacher" />
          <Usercard type="parent" />
          <Usercard type="staff" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full h-[450px] lg:w-1/3">
            <Countchart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full h-[450px] lg:w-2/3">
            <Attendancechart />
          </div>
        </div>

        {/* BOTTOM CHARTS */}
        <div className="w-full h-[500px]">
          <Financechart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
      <Eventcalendar/>
      <Announcements/>
      </div>
    </div>
  );
};

export default AdminPage;
