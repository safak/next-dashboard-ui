import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import { role, subjectsData } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
type Subject = {
    id:number;
    name:string;
    teachers:string[];
}

const columns = [
    {
        header:"Subject Name", 
        accessor:"name"
    },
    {
        header:"Teachers",
        accessor:"teachers",
        className:"hidden md:table-cell"
    },     
    {
        header:"Actions",
        accessor:"actions",
    },    
    
]

const SubjectListPage = () => {
    const renderRow = (items:Subject)=> (
        <tr key={items.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">
            {items.name}
            </td>
            <td className="hidden md:table-cell">{items.teachers.join(",")}</td>
            <td>
                <div className='flex items-center gap-2'>
                        <Link href={'/list/teachers/${items.id}'}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                                    <Image src="/edit.png" alt="" width={16} height={16}/>
                            </button>
                        </Link>
                        {role === "admin" && (
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
                                    <Image src="/delete.png" alt="" width={16} height={16}/>
                            </button>
                        )}
                </div>
            </td>
        </tr>

                    );

    return(
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
                <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
                    <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                <Image src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                <Image src="/sort.png" alt="" width={14} height={14} />
                            </button>
                            {role === "admin" &&<button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                                <Image src="/plus.png" alt="" width={14} height={14} />
                            </button>}
                            
                        </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data = {subjectsData}/>
            {/* PAGINATION */}
            <Pagination />
        </div>
    )
    
}

export default SubjectListPage