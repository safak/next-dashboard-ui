import prisma from "@/lib/prisma";
import { getSettings } from "@/lib/schoolSettings";
import Image from "next/image";
import Link from "next/link";

const listLinks: Record<"admin" | "teacher" | "student" | "parent", string> = {
  admin: "/admin",
  teacher: "/list/teachers",
  student: "/list/students",
  parent: "/list/parents",
};

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();
  const { academicYear } = await getSettings();

  return (
    <Link
      href={listLinks[type]}
      className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px] block transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {academicYear}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </Link>
  );
};

export default UserCard;
