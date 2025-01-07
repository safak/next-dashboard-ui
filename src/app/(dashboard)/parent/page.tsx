import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import React from 'react'

const ParentPage = () => {
  return (
    <div className='flex-1 p-4 flex gap-4 flex-col xl:flex-row'>
      {/* Left side */}
      <div className='w-full xl:2/3'>
        <div className='h-full bg-white p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Schedule (John Doe)</h1>
          <BigCalendar />
        </div>
      </div>
      {/* Right side */}
      <div className='w-full xl:1/3'>
        <Announcements />
      </div>
    </div>
  )
}

export default ParentPage