import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Instructor, MartialArtsDiscipline } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { count } from "console";
import { kMaxLength } from "buffer";
import cuid from "cuid";


type InstsuctorList = Instructor & {disciplines:MartialArtsDiscipline[]}

const columns = [
  {
    header:"info", accessor:"info"
  },
  {
    header:"Disciplines",
    accessor:"disciplines",
    className:"hidden lg:table-cell"
  },
  {
    header:"Bloodtype",
    accessor:"bloodType",
    className:"hidden lg:table-cell"
  },
  {
    header:"Phone", 
    accessor:"phone", 
    className:"hidden lg:table-cell"
  },
  {
    header:"Address", 
    accessor:"address", 
    className:"hidden lg:table-cell"
  },
  {
    header:"Actions", 
    accessor:"actions", 
  },
];

const renderRow = (item:InstsuctorList)=>(
 <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-zeidPurpleLight">
    <td className="flex items-center gap-4 p-4">
      <Image 
        src={item.img || "/noAvatar.png"} 
        alt="" 
        width={40} 
        height={40} 
        className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className='flex flex-col'>
        <h3 className="font-semibold">{item.name} {item.surname}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    
    <td className="hidden md:table-cell">{item.disciplines.map(disc=>disc.artName).join(",")}</td>
    <td className="hidden md:table-cell">{item.bloodType}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item?.address}</td>
    <td>
      <div className='flex items-center gap-2'>
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-zeidSky">
            <Image src="/view.png" alt="" width={16} height={16}/>
          </button>
        </Link>
        {
          role==="admin" && 
          (
            <>
              <FormModal table="instructor" type="update" data={item}/>
              <FormModal table="instructor" type="delete" id={item.id}/>
            </>
            
          )
        }
      </div>
    </td>
 </tr>
);

const InstructorListPage = async ({searchParams}:
  {
    searchParams:{[key:string]:string | undefined}; 
  }
) => {

  //console.log(searchParams);

  const {page, ...queryParams} = await searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS Conditions

  const query = {}

  if(queryParams){
    for(const [key, value] of Object.entries(queryParams)){
      if (value!==undefined) {
        switch (key) {
          case "name": 
          {Instructor:{some:{name:value}}}
            
        }  
      }
    }
  }

  const [data, countItems] = await prisma.$transaction([
      prisma.instructor.findMany(
      {
        take:ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE *(p - 1),
        include:{
          disciplines:true,
        }
      }
    ),
    prisma.instructor.count(),
  ]);

  console.log("resolving " + countItems);
  console.log(cuid());

  
  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP SECTION*/}
      <div className='flex items-center justify-between'>
        <h1 className="hidden md:block text-lg font-semibold">Instructors (Δάσκαλοι) <p className="text-xs font-semibold">{countItems} total Teachers</p></h1>
        <div className='flex flex-col md:flex-row items-center gap-4  w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end '>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
              <Image src='/filter.png' alt="" width={14} height={14}/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
              <Image src='/sort.png' alt="" width={14} height={14}/>
            </button>
            {role === "admin" && (
            // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
            //   <Image src='/plus.png' alt="" width={14} height={14}/>
            // </button>
              <FormModal table="instructor" type="create" />
            )}
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

export default InstructorListPage