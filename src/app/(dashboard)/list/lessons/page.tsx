import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { role } from "@/lib/utils";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type LessonList = Lesson & {subject: Subject} & {class: Class} & {teacher: Teacher}

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  ...(role==="admin" ? 
  [
    {
    header: "Actions",
    accessor: "action",
  }] : [])
];
const renderRow = (item: LessonList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lansSky"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">{item.teacher.name + " "+ item.teacher.surname}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="lesson" type="update" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
const LessonListPage =  async ({
  searchParams,
}: {searchParams:{[key:string]:string | undefined};
}) => {
  //console.log(searchParams)
  const {page, ...queryParams}=searchParams
  const p =page ? parseInt(page) : 1;
  //url params conditions

  const query: Prisma.LessonWhereInput ={}
  if(queryParams){
    for(const [key,value] of Object.entries(queryParams)){
      if(value !== undefined){

      
      switch(key){
      case "classId":
  query.classId=parseInt(value)
     break;
      case "teacherId":
        query.teacherId=value
        break;      
      case "search":
       query.OR=[
        {subject:{name: {contains: value, mode: 'insensitive'}}},
        {teacher:{name: {contains: value, mode: 'insensitive'}}},
       ]
        break;
        default:
          break
      }
      }
    }
    }
  
  const [data,count] =await prisma.$transaction([

prisma.lesson.findMany({
    where: query,
    include: {
      subject: {
    select: {name:true}},
      class:  {
        select: {name:true}},
      teacher:  {
        select: {name:true, surname: true}}
    },
    take:ITEM_PER_PAGE,
    skip: (p - 1) * ITEM_PER_PAGE,
    
  }),
  prisma.lesson.count({where:query}),
 ])
  

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lansYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lansYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="parent" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default LessonListPage;