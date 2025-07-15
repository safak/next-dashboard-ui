import prisma from "@/lib/prisma";
import { currentUserId, role } from "@/lib/utils";
import { Prisma } from "@prisma/client";

const Announcements =async () => {
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  }; 
  const where: Prisma.AnnouncementWhereInput={}
    role !== "admin"
      ? {
          OR: [
            { classId: { equals: null } },
            {
              class: roleConditions[role as keyof typeof roleConditions] ?? {},
            },
          ],
        }
      : {};

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where,
  });
  return <div className="bg-white p-4 rounded-md">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">Annoucements</h1>
      <span className="text-xs text-gray-400">View All</span>
    </div>
    <div className="flex flex-col gap-4 mt-4">
      {data[0] && (
      <div className="bg-kalasaSkyLight rounded-md p-4">
        <div className="flex items-center justify-between">
         <h2 className="font-medium">{data[0].title}</h2>
         <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
        {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
         </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
      </div>
       )}
        {data[1] && (
       <div className="bg-kalasaPurpleLight rounded-md p-4">
        <div className="flex items-center justify-between">
         <h2 className="font-medium">{data[1].title}</h2>
         <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
          {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
         </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
      </div>
       )}
        {data[2] && (
       <div className="bg-kalasaYellowLight rounded-md p-4">
        <div className="flex items-center justify-between">
         <h2 className="font-medium">{data[2].title}</h2>
         <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
        {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
         </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
      </div>
       )}
    </div>
    
  </div>
}

export default Announcements;