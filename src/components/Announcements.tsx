import React from "react";
const announcements = [
  {
    id: 1,
    date: new Date(2023, 4, 10),
    title: "New Library Books",
    description: "We have added new books to the library. Check them out!",
  },
  {
    id: 2,
    date: new Date(2023, 4, 12),
    title: "School Picnic",
    description: "Join us for a fun-filled school picnic on May 12th.",
  },
  {
    id: 3,
    date: new Date(2023, 4, 15),
    title: "Parent-Teacher Meeting",
    description: "Parent-Teacher meeting will be held on May 15th.",
  },
];

const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md ">
      <div className=" flex items-center justify-between mb-4">
        <h1 className=" text-xl font-semibold">Announcements</h1>
        <span className=" text-sm text-gray-500">See More</span>
      </div>
      <div className=" flex flex-col gap-4">
        {announcements.map((e) => (
          <div className=" bg-gray-200 border p-4" key={e.id}>
            <div className=" flex items-center justify-between">
              <h1 className=" text-lg font-semibold">{e.title}</h1>
              <span className=" text-sm text-gray-500 bg-white px-2 py-1 rounded-md">
                {e.date.toLocaleDateString()}
              </span>
            </div>
            <p className=" text-sm text-gray-500 mt-2">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
