import CountChart from "@/components/CountChart"
import UserCard from "@/components/UserCard"

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row '>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8 '>
        {/**USER CARDS */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type="students"/>
          <UserCard type="teachers"/>
          <UserCard type="parents"/>
          <UserCard type="stuff"/>
        </div>
        {/* MIDDLE SECTION */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* COUNT CHART */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className='w-full lg:w-2/3 h-[450px]'></div>
        </div>
        {/* Bottom Charts */}
        <div className=''></div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3'>R</div>
    </div>
    
  )
}

export default AdminPage