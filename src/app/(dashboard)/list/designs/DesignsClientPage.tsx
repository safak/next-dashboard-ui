'use client'; // Make this a Client Component

import { useState } from 'react';
import CustomIcon from '@/components/CustomIcon';
import DesignFilter from '@/components/DesignFilter'; // Keep this, it's interactive
import Pagination from '@/components/Pagination'; // Keep this
import AddDesignModal from '@/components/AddDesignModal'; // Keep this
import Table from '@/components/Table'; // Keep this
import TableSearch from '@/components/TableSearch'; // Keep this
import DesignRow from './DesignRow'; // Keep this
// Import User type
import { Company, Design, User } from '@prisma/client'; // Removed Employee import

// Update DesignList type to use User
type DesignList = Design & { company: Company; user: User | null };

// Define the type for the user data passed for filters
type UserFilterData = { id: string; name: string | null; username: string };

// Define props for the client component
interface DesignsClientPageProps {
  designs: DesignList[];
  users: UserFilterData[]; // Changed from employees to users
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  // Pass searchParams relevant to client-side components if needed,
  // or handle search/filter state internally if preferred
  searchParams: {
    // Pass relevant searchParams for client components like TableSearch/DesignFilter
    query?: string;
    status?: string;
    userId?: string; // Changed from employeeId to userId
    createdStart?: string;
    createdEnd?: string;
    updatedStart?: string;
    updatedEnd?: string;
    page?: string;
    limit?: string;
  };
}

const columns = [
  {
    header: 'Company Number',
    accessor: 'companyNumber',
    className: 'table-cell',
  },
  {
    header: 'Company Name',
    accessor: 'company.name',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Status',
    accessor: 'status',
    className: 'table-cell',
  },
  {
    header: 'Team',
    accessor: 'team',
    className: 'table-cell',
  },
  {
    header: 'Created',
    accessor: 'createdAt',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Updated',
    accessor: 'updatedAt',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'actions',
    className: 'table-cell',
  },
];

// This is now the Client Component
const DesignsClientPage: React.FC<DesignsClientPageProps> = ({
  designs,
  users, // Changed from employees
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  searchParams,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0); // Add key state for resetting modal

  const openModal = () => setIsModalOpen(true);

  // Increment key when closing to force modal reset on next open
  const closeModal = () => {
    setIsModalOpen(false);
    setModalKey((prevKey) => prevKey + 1);
  };

  // Data fetching is removed. Use props passed from the parent Server Component.

  // The renderRow function remains the same
  const renderRow = (item: DesignList) => <DesignRow item={item} />;

  return (
    <div className=''>
      {/*top*/}
      <div className='flex items-center justify-between'>
        <h1>Designs</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end'>
          {/* TableSearch might need access to searchParams or handle state internally */}
          <TableSearch placeholder='Search designs...' />
          <div className='flex items-center gap-4'>
            {/* DesignFilter needs users and potentially searchParams */}
            <DesignFilter users={users} />
            <button
              onClick={openModal}
              className='bg-accent rounded-full shadow-md text-xl font-semibold px-4 py-2  text-accent-foreground hover:bg-accent-hover transition duration-200 ease-in-out'
            >
              +
            </button>
          </div>
        </div>
      </div>
      {/*list*/}
      {/* Table uses designs prop */}
      <Table
        columns={columns}
        renderRow={renderRow}
        data={designs} // Use designs prop
      />
      {/* Pagination uses props */}
      <Pagination
        currentPage={currentPage} // Use prop
        totalPages={totalPages} // Use prop
        itemsPerPage={itemsPerPage} // Use prop
        totalItems={totalItems}
      />
      {/* Pass users and key to the modal */}
      <AddDesignModal
        key={modalKey} // Add the key prop
        isOpen={isModalOpen}
        onClose={closeModal}
        users={users} // Changed prop name
      />
    </div>
  );
};

export default DesignsClientPage; // Export the renamed component
