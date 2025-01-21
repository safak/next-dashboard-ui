import Pagination from "@/components/pagination"
import Table from "@/components/table"
import Tablesearch from "@/components/tablesearch"
import { classesData, role } from "@/lib/data"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
type Classes = {
    name: string;
    id:number;
    capacity: number;
    grade: number;
    supervisor: string;
    
}

const columns = [
  {
    header: "Class Name", accessor: "name"
  },
  {
    header: "Capacity", accessor: "capacity", className: "hidden md:table-cell"
  },
  {
    header: "Grade", accessor: "grade", className: "hidden md:table-cell"
  },
  {
    header: "Supervisor", accessor: "supervisor"
  },
 
    {
        header: "Action", accessor: "action"
    }
]

const ClassesListPage = () => {

    const renderRow =(item:Classes)=>(
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-100 text-sm hover:bg-[#d1c4e9]">
           <td>{item.name}</td>
            <td className="hidden md:table-cell">{item.grade}</td>
            <td className="hidden md:table-cell">{item.capacity}</td>
            <td >{item.supervisor}</td>
         
            <td>
              <div className="flex items-center gap-2">
                <Link href={'/list/teachers/$(item.id)'}>
                <button className="w-8 h-8 flex items-center justify-center bg-[#80d8ff] rounded-full">
                  <Image src="/edit.png" alt="" width={16} height={16} />
                </button>
                {role=== "admin" &&
                <button className="w-8 h-8 flex items-center justify-center bg-[#b388ff] rounded-full">
                  <Image src="/delete.png" alt="" width={16} height={16} />
                </button>}
                
                </Link>
              </div>
            </td>
        </tr>
    );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Tablesearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center bg-[#b388ff]  rounded-full">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#b388ff] rounded-full">
              <Image src="/sort.png" alt="Filter" width={14} height={14} />
            </button>
            {role === "admin" && < button className="w-8 h-8 flex items-center justify-center bg-[#b388ff] rounded-full">
              <Image src="/plus.png" alt="Filter" width={14} height={14} />
            </button>}
          </div>
        </div>
      </div>
      {/* list */}
      <Table columns={columns} renderRow={renderRow} data={classesData}/>
      {/* pagination */}
        <Pagination />
    </div>
  )
}

export default  ClassesListPage
