'use client';

import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addCompany, AddCompanyFormState } from '@/app/actions/addCompany'; // Import the new action
import UniversalModal from './UniversalModal';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper component for the submit button state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type='submit'
      disabled={pending}
      className='px-4 py-2 rounded-md bg-lightActiveColor text-lightTextColor dark:text-darkCardBgColor hover:bg-emerald-600 shadow disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? 'Adding...' : 'Add Company'}
    </button>
  );
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose }) => {
  const initialState: AddCompanyFormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(addCompany, initialState);
  const formRef = useRef<HTMLFormElement>(null); // Ref for the form

  useEffect(() => {
    // Close modal on successful submission and reset form
    if (state.message === 'Company added successfully!') {
      onClose();
      formRef.current?.reset(); // Reset form fields
    }
  }, [state.message, onClose]);

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title='Add New Company'
      maxWidth='max-w-md'
      footerContent={
        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            Cancel
          </button>
          <SubmitButton />
        </div>
      }
    >
      <form ref={formRef} action={dispatch}>
        {/* Display general form message/errors */}
        {state.message && !state.errors?.id && !state.errors?.name && !state.errors?.database && (
          <p
            className={`mb-4 text-sm ${state.message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
          >
            {state.message}
          </p>
        )}
        {state.errors?.database && (
          <p className='mb-4 text-sm text-red-600'>{state.errors.database.join(', ')}</p>
        )}

        {/* Company ID */}
        <div className='mb-4'>
          <label
            htmlFor='companyId'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Company ID
          </label>
          <input
            type='number' // Use number type for better input control
            id='companyId'
            name='companyId' // Ensure this matches formData.get in the action
            required
            aria-describedby='companyId-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.id && (
            <p id='companyId-error' className='mt-1 text-sm text-red-600'>
              {state.errors.id.join(', ')}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div className='mb-4'>
          <label
            htmlFor='companyName'
            className='block text-sm font-medium text-lightTextColor dark:text-darkTextColor mb-1'
          >
            Company Name
          </label>
          <input
            type='text'
            id='companyName'
            name='companyName' // Ensure this matches formData.get in the action
            required
            aria-describedby='companyName-error'
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-lightCardBgColor dark:bg-darkCardBgColor text-lightTextColor dark:text-darkTextColor'
          />
          {state.errors?.name && (
            <p id='companyName-error' className='mt-1 text-sm text-red-600'>
              {state.errors.name.join(', ')}
            </p>
          )}
        </div>

        {/* Add other company fields here if needed */}
      </form>
    </UniversalModal>
  );
};

export default AddCompanyModal;
