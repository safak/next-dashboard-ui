import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, subjectsData } from "@/lib/data";
import { Class } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import prisma from "@/lib/prisma";


type ClassList = Class;

const columns = [
 {
    header:"Class Title", 
    accessor:"className", 
    className:"hidden md:table-cell"
  },
  {
    header:"Description", 
    accessor:"classDescription", 
    className:"hidden md:table-cell"
  },
  {
    header:"Capacity", 
    accessor:"capacity", 
    className:"hidden md:table-cell"
  },
  {
    header:"Scheduled", 
    accessor:"day", 
    className:"hidden md:table-cell"
  },
  {
    header:"Starting Time", 
    accessor:"startTime", 
    className:"hidden md:table-cell"
  },
  {
    header:"Ending Time", 
    accessor:"endTime", 
    className:"hidden md:table-cell"
  },
  {
    header:"Actions", 
    accessor:"actions", 
  },
];

const renderRow = (item:ClassList)=>(
 <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-zeidPurpleLight">
    <td className="flex items-center gap-4 p-4">
      <div className='flex flex-col'>
        <h3 className="font-semibold">{item.className}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.classDescription}</td>
    <td className="hidden md:table-cell">{item.capacity}</td>
    <td className="hidden md:table-cell">{item.day}</td>
    <td className="hidden md:table-cell">{item.startTime}</td>
    <td className="hidden md:table-cell">{item.endTime}</td>
    <td>
      <div className='flex items-center gap-2'>
        <Link href={`/list/students/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-zeidSky">
            <Image src="/view.png" alt="" width={16} height={16}/>
          </button>
        </Link>
        {
          role==="admin" && 
          (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-zeidPurple">
              <Image src="/delete.png" alt="" width={16} height={16}/>
            </button>
          )
        }
        
      </div>
    </td>
 </tr>
);

const ClassesListPage = async({searchParams}:
  {
    searchParams:{[key:string]:string | undefined};
  }) => {

  const {page, ...queryParams} = await searchParams;
  const p = page ? parseInt(page) : 1;

  const [data, countItems] = await prisma.$transaction([
    prisma.class.findMany(
      {
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE *(p-1),
      }
    ),
    prisma.class.count(),
  ]);

  console.log("resolving " + countItems);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP SECTION*/}
      <div className='flex items-center justify-between'>
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className='flex flex-col md:flex-row items-center gap-4  w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end '>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
              <Image src='/filter.png' alt="" width={14} height={14}/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
              <Image src='/sort.png' alt="" width={14} height={14}/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
              <Image src='/plus.png' alt="" width={14} height={14}/>
            </button>
          </div>
        </div>
      </div>
      {/* LIST SECTION*/}
        <Table columns={columns} renderRow={renderRow} data={data}/>
      {/* PAGINATION SECTION*/}
        <Pagination page={p} count={countItems} />
    </div>
  )
}

export default ClassesListPage