import AttendanceChart from '@/components/AttendanceChart'
import CountChart from '@/components/CountChart'
import UserCard from '@/components/UserCard'
import React from 'react'

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* Left side */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student"/>
          <UserCard type="teacher"/>
          <UserCard type="parent"/>
          <UserCard type="staff"/>
        </div>
        {/* Middle Chart */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Count Chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* Attendance Chart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* Bottom Chart */}
        <div></div>
      </div>
      {/* Right side */}
      <div className="w-full lg:w-1/3">
        <div className='bg-white rounded-lg shadow-md p-4'>
          <h2 className='text-lg font-semibold'>Admin Sidebar</h2>
          <p className='text-gray-500'>This is the admin sidebar</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage