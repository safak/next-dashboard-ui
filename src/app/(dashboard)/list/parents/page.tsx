import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, parentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Parent = {
  id:number;
  name:string;
  email?:string;
  students:string[];
  phone:string;
  address:string;

}


const columns = [
  {
    header:"info", accessor:"info"
  },
  {
    header:"Student Names", 
    accessor:"students", 
    className:"hidden md:table-cell"
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

const renderRow = (item:Parent)=>(
 <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-zeidPurpleLight">
    <td className="flex items-center gap-4 p-4">
      <div className='flex flex-col'>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.students.join(",")}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
    <td className="hidden md:table-cell">{item?.address}</td>
    <td>
      <div className='flex items-center gap-2'>
        {/* <Link href={`/list/students/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-zeidSky">
            <Image src="/view.png" alt="" width={16} height={16}/>
          </button>
        </Link> */}
        {
          role==="admin" && 
          (
           <>
            <FormModal table="parent" type="update" data={item} />
            <FormModal table="parent" type="delete" id={item.id}/>
           </>
          )
        }
      </div>
    </td>
 </tr>
);

const ParentsListPage = () => {
  return (

    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
      {/* TOP SECTION*/}
      <div className='flex items-center justify-between'>
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className='flex flex-col md:flex-row items-center gap-4  w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end '>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
              <Image src='/filter.png' alt="" width={14} height={14}/>
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-zeidYellow '>
              <Image src='/sort.png' alt="" width={14} height={14}/>
            </button>
            {
          role==="admin" && 
          (
           <>
            <FormModal table="parent" type="create"/>
           </>
          )
        }
          </div>
        </div>
      </div>
      {/* LIST SECTION*/}
        <Table columns={columns} renderRow={renderRow} data={parentsData}/>
      {/* PAGINATION SECTION*/}
        <Pagination/>
    </div>
  )
}

export default ParentsListPage