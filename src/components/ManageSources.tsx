'use client'; // This component now fetches data, so it must be a client component

import React, { useState, useEffect } from 'react';
import { Facebook } from 'lucide-react';
// We need to import the Post type to understand the data from the API
import type { Post } from '@prisma/client';

const ManageSources = () => {
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function fetches all posts to calculate the totals
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: Post[] = await response.json();

        // Calculate totals
        const postsCount = data.length;
        const commentsCount = data.reduce(
          (acc, post) => acc + post.commentsCount,
          0
        );

        setTotalPosts(postsCount);
        setTotalComments(commentsCount);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty array [] means this runs once when the component mounts

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">Data Sources</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-600">
              PLATFORM
            </th>
            {/* Updated Columns */}
            <th className="p-4 text-left font-semibold text-gray-600">
              TOTAL POSTS
            </th>
            <th className="p-4 text-left font-semibold text-gray-600">
              TOTAL COMMENTS
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-200">
            <td className="p-4 font-medium flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <Facebook className="w-4 h-4 mr-2 text-blue-500" />
              Facebook
            </td>
            {/* Show real data (or "Loading...") */}
            <td className="p-4 text-gray-600">
              {isLoading ? 'Loading...' : totalPosts.toLocaleString()}
            </td>
            <td className="p-4 text-gray-600">
              {isLoading ? 'Loading...' : totalComments.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageSources;
