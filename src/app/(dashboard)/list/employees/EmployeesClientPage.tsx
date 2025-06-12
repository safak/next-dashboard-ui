'use client';

'use client';

import React, { useState } from 'react';
import { type User as PrismaUser, Role } from '@prisma/client';
import AddUserModal from '@/components/AddUserModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import Table from '@/components/Table'; // Import the universal Table component
import TableSearch from '@/components/TableSearch'; // Import TableSearch
import { deleteUser } from '@/app/actions/deleteUser';
import CustomIcon from '@/components/CustomIcon'; // Import the delete action
// Define the type for the user data passed as props, selecting specific fields
type User = Pick<
  PrismaUser,
  'id' | 'username' | 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt'
>;

interface EmployeesClientPageProps {
  users: User[];
}

const EmployeesClientPage: React.FC<EmployeesClientPageProps> = ({ users }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null); // State for user being edited

  const openAddModal = () => {
    setSelectedUserForEdit(null); // Ensure we are adding, not editing
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (user: User) => {
    setSelectedUserForEdit(user);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedUserForEdit(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedUserId(null);
    setIsDeleteModalOpen(false);
  };

  const handleCreateUser = async (userData: any) => {
    // Placeholder for create user logic
    console.log('Creating user:', userData);
    // try {
    //   await createUser(userData); // Call server action
    //   closeAddModal();
    //   // Optionally: revalidate path or refresh data
    // } catch (error) {
    //   console.error('Failed to create user:', error);
    //   // Handle error display
    // }
    // This handler might not be strictly needed anymore if AddUserModal uses useFormState
    // for its submission logic and feedback. Keeping it as a placeholder.
    console.log('Creating user:', userData);
    // This handler is likely managed within AddUserModal via useFormState
    console.log('Handling create/update user:', userData);
    closeAddModal(); // Close add modal if it was open
    closeEditModal(); // Close edit modal if it was open
  };

  // Make the function async and return the structure expected by the modal
  const handleDeleteConfirm = async (): Promise<{ success: boolean; error?: string } | void> => {
    if (!selectedUserId) return { success: false, error: 'No user selected.' }; // Should not happen

    try {
      const result = await deleteUser(selectedUserId); // Call server action directly

      if (result.message === 'User deleted successfully.') {
        // No need to call closeDeleteModal here, modal closes itself on success
        return { success: true }; // Indicate success to the modal
      } else {
        // Extract error message from server action result
        const errorMsg =
          result.errors?.database?.join(', ') ||
          result.errors?.authorization?.join(', ') ||
          result.message ||
          'Failed to delete user.';
        console.error('Failed to delete user:', errorMsg);
        return { success: false, error: errorMsg }; // Return error to the modal
      }
    } catch (error) {
      console.error('Client-side error during delete:', error);
      // Return generic error for unexpected client issues
      return { success: false, error: 'An unexpected client-side error occurred.' };
    }
    // Note: We don't call closeDeleteModal() here anymore.
    // The ConfirmationModal handles closing itself based on the returned promise result.
  };

  // Define columns for the Table component
  const columns = [
    { header: 'Username', accessor: 'username' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Created At', accessor: 'createdAt' },
    { header: 'Actions', accessor: 'actions' },
  ];

  // Define the renderRow function for the Table component
  const renderRow = (user: User) => (
    <tr
      key={user.id}
      className='border-lightEmphasisColor dark:border-darkEmphasisColor border-b text-sm hover:bg-lightEmphasisColor dark:hover:bg-darkEmphasisColor'
    >
      <td className='px-4 h-12'>{user.username}</td>
      <td className='px-4'>{user.name || '-'}</td>
      <td className='px-4 '>{user.email || '-'}</td>
      <td className='px-4 '>{user.role}</td>
      <td className='px-4 '>
        {new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </td>
      <td className='px-4 gap-4 pt-3 flex'>
        <button
          onClick={() => openDeleteModal(user.id)}
          aria-label={`Delete user ${user.username}`}
        >
          <CustomIcon name='delete' />
        </button>
        <button onClick={() => openEditModal(user)} aria-label={`Edit user ${user.username}`}>
          <CustomIcon name='details' />
        </button>
      </td>
    </tr>
  );

  return (
    <div className=''>
      {/*top*/}
      <div className='flex items-center justify-between'>
        <h1>Employees</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end'>
          <TableSearch placeholder='Search employees...' />
          <div className='flex items-center gap-4'>
            {/* No filter component for employees yet */}
            <button
              onClick={openAddModal}
              className='bg-accent rounded-full shadow-md text-xl font-semibold px-4 py-2  text-accent-foreground hover:bg-accent-hover transition duration-200 ease-in-out'
            >
              +
            </button>
          </div>
        </div>
      </div>
      {/*list*/}
      <Table<User> columns={columns} data={users} renderRow={renderRow} />

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <AddUserModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={isEditModalOpen ? closeEditModal : closeAddModal}
          userToEdit={selectedUserForEdit} // Pass user data for editing
          // onSubmit logic is likely handled internally by AddUserModal
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUserId && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          title='Confirm Deletion'
          message={`Are you sure you want to delete user ${users.find((u) => u.id === selectedUserId)?.username ?? 'this user'}? This action cannot be undone.`}
          // Removed isPending and errorMessage props
        />
      )}
    </div>
  );
};

export default EmployeesClientPage;
