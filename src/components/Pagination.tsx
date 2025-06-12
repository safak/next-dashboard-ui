'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createPageURL = (pageNumber: number | string, perPage?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    if (perPage) {
      params.set('limit', perPage.toString());
    } else {
      params.set('limit', itemsPerPage.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageURL(page));
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(event.target.value);
    // Reset to page 1 when changing items per page
    router.push(createPageURL(1, newItemsPerPage));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Logic to render page numbers (e.g., first, last, current, ellipsis)
    // For simplicity, let's just show current and total for now
    pageNumbers.push(
      <span key='current' className='mx-1'>
        Page {currentPage} of {totalPages}
      </span>
    );
    return pageNumbers;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className='mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
      <div>
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
      <div className='flex items-center'>
        <label htmlFor='itemsPerPage' className='mr-2'>
          Items per page:
        </label>
        <select
          id='itemsPerPage'
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className='rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <div className='ml-4 flex items-center'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='mx-1 rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-gray-600'
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='mx-1 rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-gray-600'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
