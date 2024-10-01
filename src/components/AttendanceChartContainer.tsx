import Image from "next/image"
import AttendandanceChart from "./AttendandanceChart"
import prisma from "@/lib/prisma"


const AttendanceChartContainer = async () => {
const today =new Date();
const dayOfWeek = today.getDay();
const daySinceMonday = dayOfWeek===0 ?6 : dayOfWeek - 1

const lastMonday=new Date(today)
lastMonday.setDate(today.getDate()-daySinceMonday);

console.log("dayofweek", dayOfWeek);

const respData= await prisma.attendance.findMany({
    where:{
      date:{
        gte: lastMonday,
       
      }
    }
  ,select:{
    date:true,
    present: true,
    //lessonId: true,
  }
});

//console.log("data", data);
const daysOfWeek=["Mon","Tue","Wed","Thu","Fri"];


const attendanceMap :{[key: string]: {present: number; absent: number}} ={
  Mon:{present:0, absent:0},
  Tue:{present:0, absent:0},
  Wed:{present:0, absent:0},
  Thu:{present:0, absent:0},
  Fri:{present:0, absent:0},
};

respData.forEach(item=>{
  const itemData=new Date(item.date);

  if(dayOfWeek >=1 && dayOfWeek<=5){
    const daysName = daysOfWeek[dayOfWeek -1];
    if(item.present){
      attendanceMap[daysName].present += 1;

    }else{
      attendanceMap[daysName].absent += 1;
    }
  }

})
//console.log("AttendaceMap", attendanceMap);
const data = daysOfWeek.map((day) =>({
  name: day,
  present: attendanceMap[day].present,
  absent: attendanceMap[day].absent,
}))

  return (
     <div className='bg-white rounded-lg p-4 h-full'>
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Attendance</h1>
            <Image src="/moreDark.png" width={20} height={20} alt='image'/>
        </div>
        <AttendandanceChart data={data}/>
        </div>
  );
}

export default AttendanceChartContainer