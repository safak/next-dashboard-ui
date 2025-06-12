'use client';

import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addDesign, AddDesignFormState } from '@/app/actions/addDesign';
import { STATUS_OPTIONS } from '@/lib/constants'; // Use constant array
import UniversalModal from './UniversalModal';
// Removed Employee import

// Define the type for the user data passed for filters (should match parent)
type UserFilterData = { id: string; name: string | null; username: string };

interface AddDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserFilterData[]; // Changed from employees to users
}

// Helper component for the submit button state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      form='add-design-form' // Add form attribute
      disabled={pending}
      className='px-4 py-2 rounded-md bg-lightActiveColor text-lightTextColor dark:text-darkCardBgColor hover:bg-emerald-600 shadow disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? 'Adding...' : 'Add Design'}
    </button>
  );
}

const AddDesignModal: React.FC<AddDesignModalProps> = ({ isOpen, onClose, users }) => {
  // Changed prop name
  const initialState: AddDesignFormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addDesign, initialState);
  const formRef = useRef<HTMLFormElement>(null); // Ref for the form

  useEffect(() => {
    // Close modal on successful submission and reset form
    if (state.message === 'Design added successfully!') {
      onClose();
      formRef.current?.reset(); // Reset form fields
      // Consider resetting the form state as well if needed
    }
  }, [state.message, onClose]);

  if (!isOpen) return null;

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title='Add New Design'
      maxWidth='max-w-md' // Keep consistent width
      footerContent={
        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            Cancel
          </button>
          <SubmitButton /> {/* Use the helper component */}
        </div>
      }
    >
      {/* Add ref and id to form */}
      <form ref={formRef} id='add-design-form' action={dispatch}>
        {/* Display general form message/errors */}
        {state.message && !state.errors && (
          <p
            className={`mb-4 text-sm ${state.message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
          >
            {state.message}
          </p>
        )}
        {state.errors?.database && (
          <p className='mb-4 text-sm text-red-600'>{state.errors.database.join(', ')}</p>
        )}

        {/* Company Number */}
        <div className='mb-4'>
          <label
            htmlFor='companyNumber'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Company Number
          </label>
          <input
            type='number'
            id='companyNumber'
            name='companyNumber'
            required
            aria-describedby='companyNumber-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.companyNumber && (
            <p id='companyNumber-error' className='mt-1 text-sm text-red-600'>
              {state.errors.companyNumber.join(', ')}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div className='mb-4'>
          <label
            htmlFor='companyName'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Company Name (Required if new number)
          </label>
          <input
            type='text'
            id='companyName'
            name='companyName'
            required
            aria-describedby='companyName-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.companyName && (
            <p id='companyName-error' className='mt-1 text-sm text-red-600'>
              {state.errors.companyName.join(', ')}
            </p>
          )}
        </div>

        {/* Template Name */}
        <div className='mb-4'>
          <label
            htmlFor='templateName'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Template Name
          </label>
          <input
            type='text'
            id='templateName'
            name='templateName'
            required
            aria-describedby='templateName-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.templateName && (
            <p id='templateName-error' className='mt-1 text-sm text-red-600'>
              {state.errors.templateName.join(', ')}
            </p>
          )}
        </div>

        {/* User Dropdown */}
        <div className='mb-4'>
          <label
            htmlFor='userId'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Assign User {/* Changed label */}
          </label>
          <select
            id='userId' // Changed id
            name='userId' // Changed name
            required
            aria-describedby='userId-error' // Changed aria-describedby
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
            defaultValue=''
          >
            <option value='' disabled>
              Select a user
            </option>{' '}
            {/* Changed default text */}
            {users.map(
              (
                user // Changed array name
              ) => (
                <option key={user.id} value={user.id}>
                  {' '}
                  {/* Use user.id */}
                  {user.name || user.username} {/* Display name or username */}
                </option>
              )
            )}
          </select>
          {state.errors?.userId && ( // Changed error key
            <p id='userId-error' className='mt-1 text-sm text-red-600'>
              {' '}
              {/* Changed id */}
              {state.errors.userId.join(', ')} {/* Changed error key */}
            </p>
          )}
        </div>

        {/* Status Dropdown */}
        <div className='mb-4'>
          <label
            htmlFor='status'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Status
          </label>
          <select
            id='status'
            name='status'
            required
            defaultValue='NEW'
            aria-describedby='status-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          >
            {STATUS_OPTIONS.map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue}
              </option>
            ))}
          </select>
          {state.errors?.status && (
            <p id='status-error' className='mt-1 text-sm text-red-600'>
              {state.errors.status.join(', ')}
            </p>
          )}
        </div>

        {/* Partners Field */}
        <div className='mb-4'>
          <label
            htmlFor='partners'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Partners (Optional)
          </label>
          <input
            type='text'
            id='partners'
            name='partners'
            aria-describedby='partners-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.partners && (
            <p id='partners-error' className='mt-1 text-sm text-red-600'>
              {state.errors.partners.join(', ')}
            </p>
          )}
        </div>
      </form>
    </UniversalModal>
  );
};

export default AddDesignModal; // Ensure default export is present
