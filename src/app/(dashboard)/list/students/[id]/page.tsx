import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import Performance from '@/components/Performance'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SingleStudentPage = () => {
  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
        {/* Left side */}
        <div className='w-full xl:w-2/3'>
            {/* Top */}
            <div className='flex flex-col lg:flex-row gap-4'>
                {/* User Info Card */}
                <div className='bg-mySky py-6 px-4 rounded-md flex-1 flex gap-4'>
                    <div className='w-1/3'>
                    <Image src='https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200' alt='profile photo' width={144} height={144} className='w-36 h-36 rounded-full object-cover'/>
                    </div>
                    <div className='w-2/3 flex flex-col gap-4 justify-between'>
                        <h1 className='text-xl font-semibold'>Jane Doe</h1>
                        <p className='text-gray-500 text-sm'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe ducimus magni fuga, alias earum asperiores rerum.</p>
                        <div className='flex items-center justify-between gap-2 flex-wrap text-xs font-medium'>
                            <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                <Image src='/blood.png' alt='' width={14} height={14}/>
                                <span>AB+</span>
                            </div>
                            <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                <Image src='/date.png' alt='' width={14} height={14}/>
                                <span>January</span>
                            </div>
                            <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                <Image src='/mail.png' alt='' width={14} height={14}/>
                                <span>user@gmail.com+</span>
                            </div>
                            <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                                <Image src='/phone.png' alt='' width={14} height={14}/>
                                <span>1 234 567</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Small Cards */}
                <div className='flex-1 flex gap-4 justify-between flex-wrap'>
                    {/* Card */}
                    <div className='flex bg-white w-full rounded-md p-4 gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
                        <Image src='/singleAttendance.png' alt='' width={24} height={24} className='w-6 h-6'/>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-xl font-semibold'>90%</h1>
                            <span className='text-sm text-gray-400'>Attendance</span>
                        </div>
                    </div>
                    {/* Card */}
                    <div className='flex bg-white w-full rounded-md p-4 gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
                        <Image src='/singleBranch.png' alt='' width={24} height={24} className='w-6 h-6'/>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-xl font-semibold'>6th</h1>
                            <span className='text-sm text-gray-400'>Grade</span>
                        </div>
                    </div>
                    {/* Card */}
                    <div className='flex bg-white w-full rounded-md p-4 gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
                        <Image src='/singleLesson.png' alt='' width={24} height={24} className='w-6 h-6'/>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-xl font-semibold'>18</h1>
                            <span className='text-sm text-gray-400'>Lessons</span>
                        </div>
                    </div>
                    {/* Card */}
                    <div className='flex bg-white w-full rounded-md p-4 gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
                        <Image src='/singleClass.png' alt='' width={24} height={24} className='w-6 h-6'/>
                        <div className='flex flex-col gap-1'>
                            <h1 className='text-xl font-semibold'>6A</h1>
                            <span className='text-sm text-gray-400'>class</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom */}
            <div className='mt-4 bg-white rounded-md p-4 h-[800px]'>
                <h1>Student&apos;s schedule</h1>
                <BigCalendar />
            </div>
        </div>
        {/* Right side */}
        <div className='w-full xl:w-1/3 flex flex-col gap-4'>
            <div className='bg-white p-4 rounded-md'>
                <h1 className='text-xl font-semibold'>Shortcuts</h1>
                <div className='mt-4 flex gap-4 flex-wrap text-xs text-gray-500'>
                    <Link className='p-3 rounded-md bg-mySkyLight' href='/'>Student&apos;s Lessons</Link>
                    <Link className='p-3 rounded-md bg-myPurpleLight' href='/'>Student&apos;s Teachers</Link>
                    <Link className='p-3 rounded-md bg-pink-50' href='/'>Student&apos;s Exams</Link>
                    <Link className='p-3 rounded-md bg-mySkyLight' href='/'>Student&apos;s Assignments</Link>
                    <Link className='p-3 rounded-md bg-myYellowLight' href='/'>Student&apos;s Results</Link>
                </div>
            </div>
            <Performance />
            <Announcements />
        </div>
    </div>
  )
}

export default SingleStudentPage