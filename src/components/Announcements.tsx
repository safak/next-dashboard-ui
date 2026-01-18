"use client";

const announcements =
[
    {
        id:1,
        title:"Lorem ipsum dolor sit",
        date:"08-10-2024",
        description:"Ducimus voluptates quasi, blanditiis alias fugiat, autem ea assumenda odio delectus"},  
    {
        id:2,
        title:"Lorem ipsum dolor sit",
        date:"09-10-2024",
        description:"Ducimus voluptates quasi, blanditiis alias fugiat.Quisquam reiciendis atque est quam quod natus minima numquam animi corporis"
    },
    {
        id:3,
        title:"Lorem ipsum dolor sit",
        date:"10-10-2024",
        description:"Autem ea assumenda odio delectus.Quisquam reiciendis atque est quam quod natus minima numquam animi corporis"
    },
    {
        id:4,
        title:"Lorem ipsum dolor sit",
        date:"11-10-2024",
        description:"Odio delectus.Quisquam reiciendis atque est quam quod natus minima numquam animi corporis"
    }
];

const Announcements = () => {
  return (
    <div className='bg-white p-4 rounded-md'>
        <div className='flex items-center justify-between'>
            <h1 className="text-xl font-semibold">Announcements</h1>
            <span className="text-xs text-gray-400">View all</span>
        </div>
        <div className='flex flex-col gap-4 mt-4 '>
           {
                announcements.map(announcement=>(
                    <div className='odd:bg-zeidSkyLight even: bg-zeidYellowLight rounded-md p-4' key={announcement.id}>
                        <div className='flex justify-between items-center'>
                            <h2 className="font-medium">{announcement.title}</h2>
                            <span className="text-xs text-gray-300 bg-white rounded-md px-1 py-1">{announcement.date}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            {announcement.description} 
                        </p>
                    </div>
                ))
            } 
        </div>
    </div>
  )
}

export default Announcements