const SingleTeacherPage = () => {
  return (
    <div className='flex-1 p-4 flex-col gap-4 xl:flex-row'>
        {/* LEFT */}
        <div className='w-full xl:w-2/3'>
        {/* TOP */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Info Card */}
          <div className='bg-zeidSky py-6 px-4 rounded-md flex-1 flex gap-4'>
          </div>
          {/* Small Cards */}
          <div className='flex-1'>
          </div>
        </div>
        {/* BOTTOM */}
          <div className=''>
            Schedule
          </div>
        </div>
        {/* RIGHT */}
        <div className='w-full xl:w-1/3'>R</div>
    </div>
  )
}

export default SingleTeacherPage