'use client';

import { useState } from 'react';
import CustomIcon from '@/components/CustomIcon';
import { format } from 'date-fns';
import { deleteCompany } from '@/app/actions/deleteCompany'; // Uncommented import
import ConfirmationModal from '@/components/ConfirmationModal'; // Import the custom modal

// Company type based on Prisma schema
interface Company {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add other fields if needed for display later
}

const CompanyRow = ({ item }: { item: Company }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  // Add state for edit modal if needed later

  const formattedCreatedAtDate = format(item.createdAt, 'dd.MM.yyyy');
  const formattedUpdatedAtDate = format(item.updatedAt, 'dd.MM.yyyy'); // Uncommented and used

  const handleDeleteConfirm = async () => {
    // console.log(`Attempting to delete company ID: ${item.id}`); // Placeholder action - Removed
    // Call the server action
    const result = await deleteCompany(item.id);
    if (!result.success) {
      console.error('Deletion failed:', result.error);
      // Optionally show an error message to the user (e.g., using a toast notification library)
      alert(`Error deleting company: ${result.error}`); // Simple alert for now
    }
    // No need to manually close modal here if ConfirmationModal handles it on confirm
    // setIsDeleteModalOpen(false); // Close modal after action - Assuming modal handles this
  };

  const handleEdit = () => {
    console.log(`Attempting to edit company ID: ${item.id}`); // Placeholder action
    // TODO: Implement edit logic (e.g., open an edit modal/form)
  };

  return (
    <>
      {' '}
      {/* Wrap the entire return in a Fragment */}
      <tr
        key={item.id}
        className='border-lightEmphasisColor dark:border-darkEmphasisColor border-b text-sm hover:bg-lightEmphasisColor dark:hover:bg-darkEmphasisColor'
      >
        <td className='h-12 px-4'>{item.id}</td> {/* Added ID cell */}
        <td className='h-12 px-4'>{item.name}</td>
        <td className='hidden md:table-cell px-4'>{formattedCreatedAtDate}</td>
        <td className='hidden md:table-cell px-4'>{formattedUpdatedAtDate}</td>{' '}
        {/* Added Updated At cell */}
        <td className='px-4 pt-3 flex gap-4'>
          <button onClick={() => setIsDeleteModalOpen(true)}>
            {' '}
            {/* Open delete modal */}
            <CustomIcon name='delete' />
          </button>
          <button onClick={handleEdit}>
            {' '}
            {/* Placeholder edit/details button */}
            <CustomIcon name='details' /> {/* Changed from 'edit' to 'details' */}
          </button>
          {/* Add view/details button if needed */}
          {/* <button>
            <CustomIcon name='details' />
          </button> */}
        </td>
      </tr>
      {/* Render the delete confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Company'
        message={`Are you sure you want to delete company "${item.name}" (ID: ${item.id})? This action cannot be undone.`}
      />
      {/* Add Edit Modal here if implementing */}
    </> // Close the Fragment
  );
};

export default CompanyRow;
