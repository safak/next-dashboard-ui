import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard =async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.user,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();
  return (
    <div className="rounded-2xl odd:bg-kalasaPurple even:bg-kalasaYellow p-4 flex-1 min-w-[130px]:">
       <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">2015/25</span>
        <Image src="/uploads/more.png" alt="" width={20} height={20}/>
       </div>
       <h1 className="text-2xl font-semibold my-4">1.234</h1>
       <h2 className="capitalize text-sm text-gray-500 font-medium">{type}s</h2>
    </div>
  )
}
export default UserCard