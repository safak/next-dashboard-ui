'use client';

import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { upsertUser, UserFormState } from '@/app/actions/addUser'; // Use renamed action and state type
import { Role, type User as PrismaUser } from '@prisma/client'; // Import Role enum and PrismaUser
import UniversalModal from './UniversalModal';

// Define the type for the user data passed for editing
// Ensure this matches the structure passed from EmployeesClientPage
type User = Pick<PrismaUser, 'id' | 'username' | 'name' | 'email' | 'role'>;

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null; // Optional user data for editing
}

// Define props for the helper button component separately
interface SubmitButtonProps {
  isEditMode: boolean;
} // <-- Close the interface definition here

// Helper component for the submit button state using arrow function syntax
const SubmitButton: React.FC<SubmitButtonProps> = ({ isEditMode }) => {
  const { pending } = useFormStatus();
  const buttonText = isEditMode ? 'Update User' : 'Add User';
  const pendingText = isEditMode ? 'Updating...' : 'Adding...';
  return (
    <button
      type='submit'
      disabled={pending}
      className='px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? pendingText : buttonText}
    </button>
  );
};

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const isEditMode = !!userToEdit;
  const initialState: UserFormState = { message: null, errors: {} }; // Use renamed state type
  // Pass userToEdit to the action if needed, or handle via hidden input
  const [state, dispatch] = useFormState(upsertUser, initialState); // Use renamed action
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log('[AddUserModal] Form state changed:', state);
    // Close modal on successful submission (handle both add/update messages)
    // Assuming the action returns a message containing "successfully" on success
    if (state.message?.includes('successfully!')) {
      console.log('[AddUserModal] Success detected, closing modal.');
      onClose();
      // Reset form only if NOT in edit mode, or if desired after edit
      if (!isEditMode) {
        formRef.current?.reset();
      }
      // Consider if form should reset after successful edit
    }
  }, [state.message, onClose, isEditMode]);

  // Reset form state when modal opens for ADD mode or when userToEdit changes
  useEffect(() => {
    if (isOpen && !isEditMode) {
      formRef.current?.reset();
      // Optionally reset the form state if useFormState doesn't handle it automatically
      // dispatch({ type: 'RESET_FORM_STATE' }); // Requires action modification
    }
    // If switching between users to edit, ensure form resets or updates correctly
    // This might require more complex state management if useFormState persists state across renders
  }, [isOpen, isEditMode, userToEdit]);

  if (!isOpen) return null;

  const modalTitle = isEditMode ? `Edit User: ${userToEdit.username}` : 'Add New User';

  return (
    <UniversalModal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth='max-w-md'>
      <form
        ref={formRef}
        action={dispatch}
        onSubmit={() =>
          console.log(`[AddUserModal] Form submitted (${isEditMode ? 'Edit' : 'Add'} mode).`)
        }
      >
        {/* Hidden input for user ID in edit mode */}
        {isEditMode && <input type='hidden' name='userId' value={userToEdit.id} />}

        {/* Display general form message/errors */}
        {state.message && !state.message.includes('successfully!') && !state.errors?.database && (
          <p className='mt-2 mb-4 text-sm text-red-600'>{state.message}</p>
        )}
        {state.errors?.database && (
          <p className='mb-4 text-sm text-red-600'>{state.errors.database.join(', ')}</p>
        )}

        {/* Username */}
        <div className='mb-4'>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Username <span className='text-red-500'>*</span>{' '}
            {isEditMode && <span className='text-xs text-gray-500'>(Cannot be changed)</span>}
          </label>
          <input
            type='text'
            id='username'
            name='username'
            required
            defaultValue={isEditMode ? userToEdit.username : ''}
            readOnly={isEditMode} // Make username read-only in edit mode
            aria-describedby='username-error'
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor ${isEditMode ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`} // Style read-only field
          />
          {state.errors?.username && (
            <p id='username-error' className='mt-1 text-sm text-red-600'>
              {state.errors.username.join(', ')}
            </p>
          )}
        </div>

        {/* Name (Optional) */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Full Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            defaultValue={isEditMode ? (userToEdit.name ?? '') : ''}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {/* Add error display if name validation is added */}
        </div>

        {/* Email (Optional) */}
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            defaultValue={isEditMode ? (userToEdit.email ?? '') : ''}
            aria-describedby='email-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.email && (
            <p id='email-error' className='mt-1 text-sm text-red-600'>
              {state.errors.email.join(', ')}
            </p>
          )}
        </div>

        {/* Password */}
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Password{' '}
            {isEditMode ? (
              <span className='text-xs text-gray-500'>(Leave blank to keep current)</span>
            ) : (
              <span className='text-red-500'>*</span>
            )}
          </label>
          <input
            type='password'
            id='password'
            name='password'
            required={!isEditMode} // Only required when adding
            minLength={isEditMode ? undefined : 6} // Only enforce minLength when adding or if password is provided
            placeholder={isEditMode ? 'Leave blank to keep current password' : ''}
            aria-describedby='password-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.password && (
            <p id='password-error' className='mt-1 text-sm text-red-600'>
              {state.errors.password.join(', ')}
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div className='mb-4'>
          <label
            htmlFor='role'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Role <span className='text-red-500'>*</span>
          </label>
          <select
            id='role'
            name='role'
            required
            defaultValue={isEditMode ? userToEdit.role : Role.EMPLOYEE}
            aria-describedby='role-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          >
            {/* Explicitly list roles */}
            <option value={Role.ADMIN}>Admin</option>
            <option value={Role.EMPLOYEE}>Employee</option>
            {/* Add other roles if they exist */}
          </select>
          {state.errors?.role && (
            <p id='role-error' className='mt-1 text-sm text-red-600'>
              {state.errors.role.join(', ')}
            </p>
          )}
        </div>

        {/* Buttons moved inside the form */}
        <div className='flex justify-end gap-3 mt-6'>
          {' '}
          {/* Added mt-6 for spacing */}
          <button
            type='button' // Important: Keep type="button" for cancel
            onClick={onClose}
            className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            Cancel
          </button>
          <SubmitButton isEditMode={isEditMode} /> {/* Pass mode to button */}
        </div>
      </form>
    </UniversalModal>
  );
};

export default AddUserModal;
