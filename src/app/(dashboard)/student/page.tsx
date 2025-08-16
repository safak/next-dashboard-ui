const StudentPage = () => {
  return (
    <div className="p-4 flex gap-2 flex-col md:flex-row md:h-[calc(100vh-64px)] overflow-hidden scrollbar-hide">
      {/* left side */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8 md:overflow-y-auto pr-2 h-full scrollbar-hide">
        l
      </div>
      {/* right  */}
      <div className="w-full lg:w-1/3 flex flex-col md:overflow-y-auto h-full scrollbar-hide">
       r
      </div>
    </div>
  )
}

export default StudentPage