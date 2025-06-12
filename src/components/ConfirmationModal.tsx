'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import UniversalModal from './UniversalModal'; // Import the universal modal

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; error?: string } | void>; // Make onConfirm async and return potential error
  title?: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // modalContentRef and handleBackdropClick are no longer needed

  // Reset error when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  // handleBackdropClick is handled by UniversalModal

  const handleConfirm = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      const result = await onConfirm();
      // Check if the result indicates success (action might not return anything on success)
      // Or if it returns an object with a success flag
      if (!result || (typeof result === 'object' && result.success)) {
        onClose(); // Close only on success
      } else if (typeof result === 'object' && result.error) {
        setErrorMessage(result.error); // Set error message on failure
      } else {
        // Handle cases where onConfirm doesn't return the expected structure but doesn't throw
        setErrorMessage('An unexpected issue occurred.');
      }
    } catch (error) {
      console.error('Confirmation action failed:', error);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use UniversalModal
  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose} // Prevent closing while loading
      title={title}
      maxWidth='max-w-sm' // Match original styling
      footerContent={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-lightTextColor dark:text-darkTextColor hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className='px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Confirming...' : 'Confirm'}
          </button>
        </>
      }
    >
      {/* Modal Content */}
      <>
        <p className='mb-4 text-lightTextSecondary dark:text-darkTextSecondary'>{message}</p>

        {/* Display Error Message */}
        {errorMessage && (
          <p className='mt-2 text-sm text-red-600 dark:text-red-400 text-center'>{errorMessage}</p>
        )}
      </>
    </UniversalModal>
  );
};

export default ConfirmationModal;
