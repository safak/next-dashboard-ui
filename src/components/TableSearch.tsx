'use client'; // Add this directive

import React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebouncedCallback } from 'use-debounce';

interface TableSearchProps {
  placeholder: string;
}

const TableSearch: React.FC<TableSearchProps> = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to first page on new search
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Debounce search input

  return (
    <div className='relative flex flex-1 flex-shrink-0'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        id='search'
        className='peer block w-full  py-[9px] pl-10 text-sm '
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <div className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:text-gray-400 dark:peer-focus:text-gray-300'>
        <Image src='/search.png' alt='Search Icon' width={18} height={18} />
      </div>
    </div>
  );
};

export default TableSearch;
