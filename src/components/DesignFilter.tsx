'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CustomIcon from './CustomIcon';
import { Status } from '@prisma/client'; // Removed Employee import

// Define the type for the user data passed for filters (should match parent)
type UserFilterData = { id: string; name: string | null; username: string };

// Define the props for the component, including the users list
interface DesignFilterProps {
  users: UserFilterData[]; // Changed from employees to users
}

const DesignFilter: React.FC<DesignFilterProps> = ({ users }) => {
  // Changed prop name
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State for individual filter fields
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [userId, setUserId] = useState(searchParams.get('userId') || ''); // Changed state name and param name
  const [createdStart, setCreatedStart] = useState(searchParams.get('createdStart') || '');
  const [createdEnd, setCreatedEnd] = useState(searchParams.get('createdEnd') || '');
  const [updatedStart, setUpdatedStart] = useState(searchParams.get('updatedStart') || '');
  const [updatedEnd, setUpdatedEnd] = useState(searchParams.get('updatedEnd') || '');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset page on new filter application

    // Set or delete params based on input values
    if (status) params.set('status', status);
    else params.delete('status');
    if (userId) params.set('userId', userId);
    else params.delete('userId'); // Changed param name
    if (createdStart) params.set('createdStart', createdStart);
    else params.delete('createdStart');
    if (createdEnd) params.set('createdEnd', createdEnd);
    else params.delete('createdEnd');
    if (updatedStart) params.set('updatedStart', updatedStart);
    else params.delete('updatedStart');
    if (updatedEnd) params.set('updatedEnd', updatedEnd);
    else params.delete('updatedEnd');

    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false); // Close dropdown after applying
  };

  const handleClearFilters = () => {
    setStatus('');
    setUserId(''); // Changed state setter
    setCreatedStart('');
    setCreatedEnd('');
    setUpdatedStart('');
    setUpdatedEnd('');
    const params = new URLSearchParams(searchParams);
    params.delete('status');
    params.delete('userId'); // Changed param name
    params.delete('createdStart');
    params.delete('createdEnd');
    params.delete('updatedStart');
    params.delete('updatedEnd');
    params.set('page', '1'); // Reset page
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if any filters are active to change button appearance
  const filtersActive = !!(
    searchParams.get('status') ||
    searchParams.get('userId') || // Changed param name
    searchParams.get('createdStart') ||
    searchParams.get('createdEnd') ||
    searchParams.get('updatedStart') ||
    searchParams.get('updatedEnd')
  );

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`w-11 h-11 flex items-center justify-center rounded-full shadow-sm ${filtersActive ? 'bg-accent-hover text-primary-hover' : 'bg-input text-imput hover:bg-accent-hover'} text-lightCardBgColor  transition-colors`}
        aria-haspopup='true'
        aria-expanded={isOpen}
      >
        <CustomIcon name='filter' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-auto bg-popover text-popover-foreground origin-top-right rounded-md shadow-lg  ring-1 ring-black ring-opacity-5 focus:outline-none z-10 p-4'>
          <h3 className='border-b pb-2'>Filter</h3>
          <div className='space-y-4'>
            {/* Status Filter */}
            <div>
              <label htmlFor='status'>Status</label>
              <select id='status' value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value=''>All Statuses</option>
                <option value='NEW'>NEW</option>
                <option value='WAITING'>WAITING</option>
                <option value='NOT_SEND'>NOT_SEND</option>
                <option value='SEND'>SEND</option>
                <option value='DONE'>DONE</option>
              </select>
            </div>
            {/* User Filter */}
            <div>
              <label htmlFor='userId'>User</label> {/* Changed label */}
              <select
                id='userId' // Changed id
                value={userId} // Changed value binding
                onChange={(e) => setUserId(e.target.value)} // Changed state setter
              >
                <option value=''>All Users</option> {/* Changed default text */}
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
            </div>
            {/* Created At Filter */}
            <div>
              <label>Created Between</label>
              <div className='flex space-x-2 mt-1'>
                <input
                  type='date'
                  id='createdStart'
                  value={createdStart}
                  onChange={(e) => setCreatedStart(e.target.value)}
                />
                <input
                  type='date'
                  id='createdEnd'
                  value={createdEnd}
                  onChange={(e) => setCreatedEnd(e.target.value)}
                />
              </div>
            </div>
            {/* Updated At Filter */}
            <div>
              <label>Updated Between</label>
              <div className='flex space-x-2 mt-1'>
                <input
                  type='date'
                  id='updatedStart'
                  value={updatedStart}
                  onChange={(e) => setUpdatedStart(e.target.value)}
                />
                <input
                  type='date'
                  id='updatedEnd'
                  value={updatedEnd}
                  onChange={(e) => setUpdatedEnd(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='mt-6 flex justify-end space-x-3 text-sm'>
            <button
              type='button'
              onClick={handleClearFilters}
              className='inline-flex justify-center rounded-full px-4 py-2 bg-muted text-muted-foreground hover:bg-muted-hover transition-colors duration-200 ease-in-out'
            >
              Clear
            </button>
            <button
              type='button'
              onClick={handleApplyFilters}
              className='inline-flex justify-center rounded-full px-4 py-2 bg-accent text-accent-foreground hover:bg-accent-hover transition-colors duration-200 ease-in-out'
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignFilter;
