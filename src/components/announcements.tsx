const Announcements = () => {
  return (
    <div className='bg-white p-4 rounded-md shadow-md'>
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-700">Announcements</h1>
            <span className="text-xs text-gray-400">View All</span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
        <div className="bg-[#e1f5fe] rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Lorem ipsum dolor sit amet consectetur.</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">02-01-2025</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, quibusdam!</p>
        </div>
        <div className="bg-[#d1c4e9] rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Lorem ipsum dolor sit amet consectetur.</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">02-01-2025</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, quibusdam!</p>

        </div>
        <div className="bg-[#e1f5fe] rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Lorem ipsum dolor sit amet consectetur.</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">02-01-2025</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, quibusdam!</p>

        </div>
        </div>
     
        
    </div>
  )
}

export default Announcements