// components/StatusChanger.tsx
'use client'; // Mark as client component because it uses state and event handlers

import React, { useState, useTransition, useEffect, useRef } from 'react';
import { STATUSES, getStatusDefinition, StatusDefinition } from './Statuses'; // Adjust path

// --- Choose ONE way to call the backend ---
// Option A: For API Route
import { toast } from 'react-hot-toast'; // Example notification library

// Option B: For Server Action
import { updateItemStatus } from '@/app/actions/updateStatus'; // Adjust path
// ---

interface StatusChangerProps {
  itemId: string; // ID of the item in the DB
  currentStatusValue: string; // The status value fetched from the DB (e.g., 'NEW')
}

export default function StatusChanger({ itemId, currentStatusValue }: StatusChangerProps) {
  // Find the full definition for the current status
  const initialStatusDef = getStatusDefinition(currentStatusValue) || STATUSES[0]; // Fallback if needed

  const [selectedStatus, setSelectedStatus] = useState<StatusDefinition>(initialStatusDef);
  const [isLoading, setIsLoading] = useState(false); // Keep for API route example if used
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openAbove, setOpenAbove] = useState(false); // State to track dropdown direction
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for detecting outside clicks
  const buttonRef = useRef<HTMLButtonElement>(null); // Ref for the button

  // For Server Actions: useTransition helps manage pending states without blocking UI
  const [isPending, startTransition] = useTransition();

  // --- Refactored handler for custom dropdown ---
  const handleStatusSelect = (newStatusValue: string) => {
    const newStatusDef = STATUSES.find((s) => s.value === newStatusValue);

    if (!newStatusDef) return;

    // Close dropdown first
    setIsDropdownOpen(false);

    // Only proceed if the status is actually different
    if (newStatusValue === selectedStatus.value) return;

    setSelectedStatus(newStatusDef); // Optimistic UI update
    setError(null); // Clear previous errors

    // --- Choose ONE way to call the backend ---

    // Option A: Call API Route
    /*
    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatusValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update status (${response.status})`);
      }
      // Success! Optionally show a success message
      toast.success('Status updated!');
      // Data might be stale here. Consider re-fetching table data or using a state management library (like SWR/TanStack Query) which handles revalidation.

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred.');
      toast.error(err.message || 'Failed to update status.');
      // Revert optimistic update on failure
      setSelectedStatus(initialStatusDef);
    } finally {
      setIsLoading(false);
    }
    */

    // Option B: Call Server Action
    startTransition(async () => {
      const result = await updateItemStatus({ itemId, newStatus: newStatusValue });
      if (!result.success) {
        console.error(result.message);
        setError(result.message);
        toast.error(result.message);
        // Revert optimistic update on failure
        setSelectedStatus(initialStatusDef);
      } else {
        // Success! Server action should handle revalidation.
        toast.success('Status updated!');
        // The UI should update automatically if revalidatePath/Tag works correctly
        // If not, you might need to manually trigger a refresh depending on your data fetching setup
      }
    });
    // --- End choice ---
  };
  // --- End refactored handler ---

  const IconComponent = selectedStatus.icon;
  const effectiveIsLoading = isLoading || isPending; // Combine loading states

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeightEstimate = dropdownRef.current.offsetHeight || 150; // Estimate or measure actual height if possible
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      setOpenAbove(spaceBelow < dropdownHeightEstimate);
    }
  }, [isDropdownOpen]); // Re-run when dropdown opens/closes

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <button
        ref={buttonRef} // Add ref to the button
        type='button'
        onClick={() => !effectiveIsLoading && setIsDropdownOpen(!isDropdownOpen)} // Prevent opening when loading
        disabled={effectiveIsLoading}
        className={`inline-flex items-center justify-center w-full px-2.5 py-0.5 rounded-full text-xs font-medium border focus:outline-none ${selectedStatus.colorClasses} ${effectiveIsLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-85'}`}
        aria-haspopup='true'
        aria-expanded={isDropdownOpen}
      >
        <IconComponent className='w-[15px] h-[15px] mr-1.5' aria-hidden='true' />
        {selectedStatus.label}
      </button>

      {/* Custom Dropdown Menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef} // Add ref here too for height calculation
          className={`absolute left-0 p-2 w-auto bg-lightBgColor dark:bg-darkBgColor rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${
            openAbove ? 'bottom-full mb-1 origin-bottom-left' : 'mt-1 origin-top-left' // Conditional positioning
          }`}
          role='menu'
          aria-orientation='vertical'
          aria-labelledby='menu-button' // Link to the button if it had an ID
        >
          <div className='py-1' role='none'>
            {STATUSES.map((statusOpt) => {
              const OptionIcon = statusOpt.icon;
              return (
                <button
                  key={statusOpt.value}
                  onClick={() => handleStatusSelect(statusOpt.value)}
                  disabled={effectiveIsLoading} // Disable options while loading
                  className={`flex whitespace-nowrap items-center justify-center min-w-auto mb-2 px-2.5 py-0.5 rounded-full text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    statusOpt.colorClasses.replace('borde', '') // Use colors but not border initially
                  } ${statusOpt.colorClasses} ${
                    effectiveIsLoading
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:opacity-90 hover:border-gray-300' // Add subtle border on hover
                  } ${
                    selectedStatus.value === statusOpt.value ? '' : '' // Highlight selected
                  }`}
                  role='menuitem'
                >
                  <OptionIcon className='w-[15px] h-[15px] mr-1.5' aria-hidden='true' />
                  {statusOpt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional: Loading indicator - Position adjusted slightly if needed */}
      <div className='flex items-center ml-2'>
        {' '}
        {/* Wrapper for indicators */}
        {effectiveIsLoading && <span className='text-xs text-gray-500'>Saving...</span>}
        {error &&
          !effectiveIsLoading && ( // Show error only if not loading
            <span className='text-xs text-red-600' title={error}>
              Error!
            </span>
          )}
      </div>
    </div>
  );
}
