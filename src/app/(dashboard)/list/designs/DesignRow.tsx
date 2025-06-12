'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link'; // Import Link
import StatusChanger from '@/components/StatusChanger';
import CustomIcon from '@/components/CustomIcon';
import { format } from 'date-fns';
import { deleteDesign } from '@/app/actions/deleteDesign';
import ConfirmationModal from '@/components/ConfirmationModal'; // Import the custom modal

type Design = {
  id: number;
  status: string;
  designer?: string;
  partner?: string;
  createdAt: Date;
  updatedAt: Date;
  company: { name: string };
  user: { username: string } | null; // Changed from employee
  partners: string | null;
  companyId: number;
  userId: string | null; // Changed from employeeId: number
};

const STATUS_OPTIONS = {
  New: { label: 'New', value: 'New', icon: 'new', color: 'text-[#010101]' },
  Waiting: { label: 'Waiting', value: 'Waiting', icon: 'waiting', color: 'text-[#CC831F]' },
  'Not send': { label: 'Not send', value: 'Not send', icon: 'notSend', color: 'text-[#8369FF]' },
  Send: { label: 'Send', value: 'Send', icon: 'send', color: 'text-[#2058DC]' },
  Done: { label: 'Done', value: 'Done', icon: 'done', color: 'text-[#25A955]' },
};

const DesignRow = ({ item }: { item: Design }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [clientFormattedCreatedAt, setClientFormattedCreatedAt] = useState(''); // State for client-side formatted date
  const [clientFormattedUpdatedAt, setClientFormattedUpdatedAt] = useState(''); // State for client-side formatted date

  // Format dates only after component mounts on the client
  useEffect(() => {
    setClientFormattedCreatedAt(format(item.createdAt, 'dd.MM.yyyy'));
    setClientFormattedUpdatedAt(format(item.updatedAt, 'dd.MM.yyyy'));
  }, [item.createdAt, item.updatedAt]); // Re-run if item dates change

  const handleDeleteConfirm = async () => {
    const result = await deleteDesign(item.id);
    if (!result.success) {
      console.error(result.error);
      alert(`Error: ${result.error}`); // Keep simple alert for error feedback for now
    }
    // Modal is closed automatically by its own handleConfirm
  };

  return (
    <>
      {' '}
      {/* Wrap the entire return in a Fragment */}
      <tr
        key={item.id}
        className='border-lightEmphasisColor dark:border-darkEmphasisColor border-b text-sm hover:bg-lightEmphasisColor dark:hover:bg-darkEmphasisColor'
      >
        <td className='h-12 px-4'>{item.companyId}</td>
        <td className='hidden md:table-cell px-4'>{item.company.name}</td>
        <td className='px-4'>
          <StatusChanger
            itemId={item.id.toString()} // Convert number to string
            currentStatusValue={item.status} // Pass the current status from DB
          />
        </td>
        <td className='px-4'>
          <div className='flex flex-col'>
            <span className='font-semibold leading-3'>{item.user?.username ?? 'N/A'}</span>{' '}
            {/* Changed from item.employee */}
            <span className='text-xs font-thin'>{item.partners}</span>
          </div>
        </td>
        {/* Render formatted dates from state */}
        <td className='hidden md:table-cell px-4'>{clientFormattedCreatedAt || '...'}</td>
        <td className='hidden md:table-cell px-4'>{clientFormattedUpdatedAt || '...'}</td>
        <td className='px-4 pt-3 flex gap-4'>
          <button onClick={() => setIsModalOpen(true)}>
            {' '}
            {/* Open modal on click */}
            <CustomIcon name='delete' />
          </button>
          <Link href={`/list/designs/${item.id}`}>
            <button>
              <CustomIcon name='details' />
            </button>
          </Link>
        </td>
      </tr>
      {/* Render the modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Design'
        message={`Are you sure you want to delete design ID ${item.id}? This action cannot be undone.`}
      />
    </> // Close the Fragment
  );
};

export default DesignRow;
