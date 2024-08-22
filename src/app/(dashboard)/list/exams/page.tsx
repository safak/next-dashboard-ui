import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import { examsData,role,  } from "@/lib/data"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
type Exam = {
    id:number;
    subject:string;
    class: string;
    teacher:string;
    date:string;
}

const columns = [
    {
        header:"Subject Name", 
        accessor:"name"
    },
    {
        header:"Class",
        accessor:"class",
        className: "hidden md:table-cell"
    },  
    {
        header:"Teacher",
        accessor:"teacher",
        className: "hidden md:table-cell"
    },
    {
        header:"Date",
        accessor:"date",
        className: "hidden md:table-cell"
    },
    {
        header:"Actions",
        accessor:"actions",
    },    
    
]

const ExamListPage = () => {
    const renderRow = (items:Exam)=> (
        <tr key={items.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">
            {items.subject}
            </td>
            <td className="hidden md:table-cell">{items.class}</td>
            <td className="hidden md:table-cell">{items.teacher}</td>
            <td className="hidden md:table-cell">{items.date}</td>
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
                <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
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
            <Table columns={columns} renderRow={renderRow} data = {examsData}/>
            {/* PAGINATION */}
            <Pagination />
        </div>
    )
    
}

export default ExamListPage