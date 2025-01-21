import Pagination from "@/components/pagination"
import Table from "@/components/table"
import Tablesearch from "@/components/tablesearch"
import { role, teachersData } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
type Teacher = {
    name: string;
    teacherid: string;
    email: string;
    photo: string;
    subjects: string[];
    classes: string[];
    phone: string;
    adress: string;
    action: string;
    id:number;
}

const columns = [
  {
    header: "Info", accessor: "info"
  },
  {
    header: "Teacher ID", accessor: "teacherid", className: "hidden md:table-cell"
  },
  {
    header: "Subjects", accessor: "subjects", className: "hidden md:table-cell"
  },
  {
    header: "Classes", accessor: "classes", className: "hidden md:table-cell"
  },
  {
    header: "Phone", accessor: "phone", className: "hidden lg:table-cell"
  },
  {
    header: "Adress", accessor: "adress", className: "hidden lg:table-cell"
  },
    {
        header: "Action", accessor: "action"
    }
]

const TeacherListPage = () => {

    const renderRow =(item:Teacher)=>(
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-100 text-sm hover:bg-[#d1c4e9]">
            <td>
            <Image src={item.photo} alt="" width={40} height={40} className="rounded-full md:hidden xl:block w-10 h-10 object cover"/>
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
            </td>
            <td className="hidden md:table-cell">{item.subjects.join(",")}</td>
            <td className="hidden md:table-cell">{item.teacherid}</td>
            <td className="hidden md:table-cell">{item.classes.join(",")}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.adress}</td>
            <td>
              <div className="flex items-center gap-2">
                <Link href={'/list/teachers/$(item.id)'}>
                <button className="w-8 h-8 flex items-center justify-center bg-[#80d8ff] rounded-full">
                  <Image src="/view.png" alt="" width={16} height={16} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <Tablesearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center bg-[#b388ff]  rounded-full">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#b388ff] rounded-full">
              <Image src="/sort.png" alt="Filter" width={14} height={14} />
            </button>
           {role ==="admin" && <button className="w-8 h-8 flex items-center justify-center bg-[#b388ff] rounded-full">
              <Image src="/plus.png" alt="Filter" width={14} height={14} />
            </button>}
          </div>
        </div>
      </div>
      {/* list */}
      <Table columns={columns} renderRow={renderRow} data={teachersData}/>
      {/* pagination */}
        <Pagination />
    </div>
  )
}

export default TeacherListPage
