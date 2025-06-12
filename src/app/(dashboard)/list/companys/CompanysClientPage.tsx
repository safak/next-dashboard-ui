'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import AddCompanyModal from '@/components/AddCompanyModal'; // Import the modal
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Pagination from '@/components/Pagination';
import CompanyRow from './CompanyRow'; // Uncommented CompanyRow import
import { ITEMS_PER_PAGE } from '@/lib/constants';

// Company type based on Prisma schema
interface Company {
  id: number; // Changed from string to number
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add other fields if needed for display later
}

interface CompanysClientPageProps {
  initialCompanys: Company[];
  totalPages: number;
  totalItems: number; // Added totalItems
  // Add initial filter values if needed
}

// Placeholder Row component until CompanyRow is created - No longer needed
// const PlaceholderCompanyRow = ({ item }: { item: Company }) => (
//   <tr>
//     {/* <td>{item.id}</td>  Removed ID display from placeholder */}
//     <td>{item.name}</td>
//     <td>{item.createdAt.toLocaleDateString()}</td>
//     <td>{/* Actions */}</td>
//   </tr>
// );

export default function CompanysClientPage({
  initialCompanys,
  totalPages,
  totalItems, // Added totalItems
}: CompanysClientPageProps) {
  const [companys, setCompanys] = useState<Company[]>(initialCompanys);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Add useEffect to update state when initialCompanys prop changes
  useEffect(() => {
    setCompanys(initialCompanys);
  }, [initialCompanys]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
    // Note: In a real app, you'd likely re-fetch data here based on the new params
    // For now, this just updates the URL
  }, 300);

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = Number(searchParams.get('limit')) || ITEMS_PER_PAGE;

  // TODO: Add handlers for other filters if needed

  const columns = [
    { header: 'ID', accessor: 'id' }, // Added ID column
    { header: 'Name', accessor: 'name' },
    { header: 'Created At', accessor: 'createdAt' },
    { header: 'Updated At', accessor: 'updatedAt' }, // Added Updated At column
    // Add other relevant columns
    { header: 'Actions', accessor: 'actions' },
  ];

  return (
    <div className=''>
      {/*top*/}
      <div className='flex items-center justify-between'>
        <h1>Companies</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end'>
          <TableSearch placeholder='Search companies...' />
          <div className='flex items-center gap-4'>
            {/* No filter component for companies yet */}
            <button
              onClick={() => setIsModalOpen(true)}
              className='bg-accent rounded-full shadow-md text-xl font-semibold px-4 py-2  text-accent-foreground hover:bg-accent-hover transition duration-200 ease-in-out'
            >
              +
            </button>
          </div>
        </div>
      </div>
      {/*list*/}
      <Table<Company>
        columns={columns}
        data={companys}
        renderRow={(company) => <CompanyRow key={company.id} item={company} />} // Using CompanyRow
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems} // Added totalItems
      />
      {/* Render the modal */}
      <AddCompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
