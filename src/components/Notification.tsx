

const Notification = () => {
    return(
        <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between">
                <h1 className="text-xs font-semibold">Annoncment</h1>
                <span className="text-xs text-gray-500">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-NegeYellow rounded-md p-4">
                    <h2>Lorem ipsum dolor</h2>
                    <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
                </div> 
                <div className="bg-NegePurpleLight rounded-md p-4">
                    <h2>Lorem ipsum dolor</h2>
                    <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
                </div> 
                <div className="bg-NegeSkyLight rounded-md p-4">
                    <h2>Lorem ipsum dolor</h2>
                    <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-01-01</span>
                </div> 
          
            </div>
        </div>
    )
}
export default Notification