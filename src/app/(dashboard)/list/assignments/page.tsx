import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { assignmentsData, role, therapistsData } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Assignment = {
    id: number,
    specialization: string[],
    therapist: string,
    dueDate: string,
}

const columns = [
    {
        header: "Specialization Name",
        accessor: "specialization",
    },
    {
        header: "Therapist",
        accessor: "therapist",
        className: "hidden md:table-cell",
    },
    {
        header: "Due Date",
        accessor: "dueDate",
        className: "hidden md:table-cell"
    },
    {
        header: "Actions",
        accessor: "action",
    }
]

const AssignmentListPage = () => {

    const renderRow = (item: Assignment) => (
        <tr key={item.id} className='border-b border-x-gray-200 even:bg-slate-50 text-sm hover:bg-upliftPurpleLight'>
            <td className='flex items-center gap-4 p-4'>
                {item.specialization.join(",")}
            </td>
            <td className='hidden md:table-cell'>{item.therapist}</td>
            <td className='hidden md:table-cell'>{item.dueDate}</td>
            <td>
                <div className='flex flex-row items-center gap-2'>
                    <Link href={`/list/therapists/${item.id}`}>
                        <button className='w-7 h-7 flex items-center justify-center rounded-full bg-upliftSky'>
                            <Image src="/view.png" alt='' width={16} height={16} />
                        </button>
                    </Link>
                    {role === "admin" && (
                        <button className='w-7 h-7 flex items-center justify-center rounded-full bg-upliftPurple'>
                            <Image src="/edit.png" alt='' width={16} height={16} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    )

    return (
        <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
            {/** TOP */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>Assignments</h1>
                <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='flex items-center gap-4 self-end'>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-upliftYellow'>
                            <Image src="/filter.png" alt='' width={14} height={14} />
                        </button>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-upliftYellow'>
                            <Image src="/sort.png" alt='' width={14} height={14} />
                        </button>
                        <button className='w-8 h-8 flex items-center justify-center rounded-full bg-upliftYellow'>
                            <Image src="/plus.png" alt='' width={14} height={14} />
                        </button>
                    </div>
                </div>
            </div>
            {/** LIST */}
            <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
            {/** PAGINATION */}
            <Pagination />
        </div>
    )
}

export default AssignmentListPage