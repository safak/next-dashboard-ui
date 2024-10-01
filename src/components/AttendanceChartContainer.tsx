import Image from "next/image"
import AttendandanceChart from "./AttendandanceChart"
import prisma from "@/lib/prisma"


const AttendanceChartContainer = async () => {
const today =new Date();
const dayOfWeek = today.getDay()

console.log(dayOfWeek);

// const data= await prisma.attendance.findMany({
//     where
// })
  return (
     <div className='bg-white rounded-lg p-4 h-full'>
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Attendance</h1>
            <Image src="/moreDark.png" width={20} height={20} alt='image'/>
        </div>
        {/* <AttendandanceChart/> */}
        </div>
  )
}

export default AttendanceChartContainer