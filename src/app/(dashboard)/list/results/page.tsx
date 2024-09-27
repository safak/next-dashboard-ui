import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {
  resultsData,
  role,
} from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma } from "@prisma/client";
import Image from "next/image";

type ResultList={
  id:number;
  title:string;
  studentName:string;
  studentSurName:string;
  teacherName:string;
  teacherSurName:string;
  score:number;
  className:string;
  startTime:Date;
}

const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
 const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lansSky"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.studentName + " "+item.studentSurName}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.teacherName+ " " +item.teacherSurName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell"> {new Intl.DateTimeFormat('en-US').format(item.startTime)}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" || role === "teacher" && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
const ResultListPage = async ({
  searchParams,
}: {searchParams:{[key:string]:string | undefined};
}) => {
  //console.log(searchParams)
  const {page, ...queryParams}=searchParams
  const p =page ? parseInt(page) : 1;
  //url params conditions

  const query: Prisma.ResultWhereInput ={}
  if(queryParams){
    for(const [key,value] of Object.entries(queryParams)){
      if(value !== undefined){

      
      switch(key){
      case "studentId":
  query.studentId=value;
        break;      
      case "search":
       query.OR=[
        {exam:{title:{contains:value ,mode:"insensitive"}}},
        {student:{name:{contains:value ,mode:"insensitive"}}},
       ]
        
     break;
     default:
     break;
        
      }
      }
    }
    }
  
  const [dataResp,count] =await prisma.$transaction([

prisma.result.findMany({
   where: query,
    include: {
     student: {select: {name:true, surname:true}},
     exam:{
      include:{
        lesson:{
          select:{
            class:{select:{name:true}},
            teacher:{select:{name:true, surname:true}}
          }
        }
      }
     },
     assignment:{
      include:{
        lesson:{
          select:{
            class:{select:{name:true}},
            teacher:{select:{name:true, surname:true}}
          }
        }
      }
     }
    },
    take:ITEM_PER_PAGE,
    skip: (p - 1) * ITEM_PER_PAGE,
    
  }),
  prisma.result.count({where:query}),
 ])
 
const data=dataResp.map(item=>{
  const assignement=item.exam || item.assignment;
  if(!assignement) return null;

  const isExam ='startTime' in assignement

  return{
    id:item.id,
    title:assignement.title,
    studentName:item.student.name,
    studentSurName:item.student.surname,
    teacherName:assignement.lesson.teacher.name,
    teacherSurName:assignement.lesson.teacher.surname,
    score:item.score,
    className:assignement.lesson.class.name,
    startTime: isExam ? assignement.startTime : assignement.startDate
  }
})
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lansYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lansYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" || role === "teacher" && <FormModal table="result" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={p} />
    </div>
  );
};

export default ResultListPage;