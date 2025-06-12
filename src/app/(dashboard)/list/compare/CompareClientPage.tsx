'use client';

import React, { useState } from 'react';
import * as Diff from 'diff';

const CompareClientPage = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const differences = Diff.diffChars(text1, text2);
  const firstDiff = differences.length === 1 ? differences[0] : undefined;

  const handleClear = () => {
    setText1('');
    setText2('');
  };

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Compare Text</h1>
        <button
          onClick={handleClear}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
        >
          Clear
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder='Enter text 1 here...'
          rows={10}
          className='w-full p-2 border rounded bg-inputBgColor text-textColor border-borderColor focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder='Enter text 2 here...'
          rows={10}
          className='w-full p-2 border rounded bg-inputBgColor text-textColor border-borderColor focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <h2 className='text-xl font-semibold mb-2'>Differences</h2>
      <div className='p-2 border rounded bg-inputBgColor text-textColor border-borderColor whitespace-pre-wrap'>
        {differences.map((part, index) => {
          const color = part.added
            ? 'bg-green-200 dark:bg-green-800'
            : part.removed
              ? 'bg-red-200 dark:bg-red-800'
              : 'bg-transparent';
          const textDecoration = part.removed ? 'line-through' : 'none';
          return (
            <span key={index} className={`${color}`} style={{ textDecoration }}>
              {part.value}
            </span>
          );
        })}
        {firstDiff && typeof firstDiff.count === 'number' && firstDiff.count === 0 && (
          <span className='text-gray-500'>No differences found.</span>
        )}
        {firstDiff &&
          typeof firstDiff.count === 'number' &&
          firstDiff.count > 0 &&
          !firstDiff.added &&
          !firstDiff.removed &&
          text1.length > 0 && <span className='text-gray-500'>Texts are identical.</span>}
      </div>
    </div>
  );
};

export default CompareClientPage;
