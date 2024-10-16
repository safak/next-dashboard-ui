import Announcements from "@/app/components/Announcements"
import AttendanceChart from "@/app/components/AttendanceChart"
import CountChart from "@/app/components/CountChart"
import EventCalendar from "@/app/components/EventCalendar"
import FinanceChart from "@/app/components/FinanceChart"
import UserCard from "@/app/components/UserCard"

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 fle-col md:flex-row'>
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARD */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student"></UserCard>
          <UserCard type="teacher"></UserCard>
          <UserCard type="parent"></UserCard>
          <UserCard type="staff"></UserCard>
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart></CountChart>
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
          <AttendanceChart></AttendanceChart>
          </div>
        </div>
        <div className="w-full h-[500px]"> 
          <FinanceChart></FinanceChart>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar></EventCalendar>
        <Announcements></Announcements>
      </div>
    </div>
  )
}

export default AdminPage