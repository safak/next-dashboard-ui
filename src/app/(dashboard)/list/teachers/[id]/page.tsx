import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

function SingleTeacherpage() {
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT  */}
      <div className="w-full xl:w-2/3">
        {/* TOP  */}
        <div className=" flex flex-col lg:flex-row gap-4 ">
          {/* USER INFO CARD  */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4 ">
            <div className=" w-1/3">
              <Image
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className=" w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold ">Leonard Snyder</h1>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </p>
              <div className=" flex items-center justify-between gap-2 flex-wrap text-xs font-medium ">
                <div className=" w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span className="">A+</span>
                </div>
                <div className=" w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span className="">January 2025</span>
                </div>
                <div className=" w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span className="">user@gmail.com</span>
                </div>
                <div className=" w-full md:w-1/3 flex items-center gap-2 lg:w-full 2xl:w-1/3 ">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span className="">+1 234 567 786</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS  */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD  */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%] 2xl-w[48%] ">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%] 2xl-w[48%] ">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%] 2xl-w[48%] ">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lesson</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] xl:w-[47%] 2xl-w[48%] ">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Clasess</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM  */}
        <div className="mt-4 bg-white rounded-md h-[800px] ">
          <h1>Teacher's Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT  */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4 ">
        <div className="p-4 rounded-md bg-white">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">
              Teacher's Classes
            </Link>
            <Link href="/" className="p-3 rounded-md bg-lamaPurpleLight">
              Teacher's Students
            </Link>
            <Link href="/" className="p-3 rounded-md bg-lamaYellowLight">
              Teacher's Lessons
            </Link>
            <Link href="/" className="p-3 rounded-md bg-pink-50">
              Teacher's Exams
            </Link>
            <Link href="/" className="p-3 rounded-md bg-lamaSkyLight">
              Teacher's Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
}

export default SingleTeacherpage;
