'use client';

import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import type { SentimentPoint } from '@/data/mockData';

type TableProps = {
  data: SentimentPoint[];
};

const ITEMS_PER_PAGE = 7;

const SentimentTable = ({ data }: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">Sentiment Breakdown</h3>
        <button className="flex items-center text-sm font-medium text-gray-600 border px-3 py-1.5 rounded-lg hover:bg-gray-50">
          Export Data
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">
              DATE <ChevronsUpDown className="inline w-4 h-4 ml-1" />
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              POSITIVE
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              NEUTRAL
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              NEGATIVE
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              TOTAL MENTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr key={row.date} className="border-t border-gray-200">
              <td className="p-4 font-medium">{row.date}, 2025</td>
              <td className="p-4 text-emerald-600">{row.Positive}</td>
              <td className="p-4 text-amber-600">{row.Neutral}</td>
              <td className="p-4 text-red-600">{row.Negative}</td>
              <td className="p-4 text-gray-800 font-medium">
                {row.Positive + row.Neutral + row.Negative}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{' '}
          {data.length} results
        </p>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          {/* You can add page number buttons here if desired */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentimentTable;
