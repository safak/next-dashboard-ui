'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChartConfig } from '@/components/ui/chart';
import SentimentAreaChart from '@/components/SentimentAreaChart';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import { Loader2, User, ExternalLink, Wand2 } from 'lucide-react';
import type { Comment, Author } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// We no longer import categoryDetails from mockData

type CommentWithRelations = Comment & {
  author: Author | null;
  post: {
    id: string;
    permalink: string;
  };
};

type CommentTrendResponse = {
  trendData: any[];
  categoryData: any[];
  categoryConfig: ChartConfig;
  recentComments: CommentWithRelations[];
};

// --- 1. DEFINE THE CORRECT COMMENT CATEGORIES ---
const commentCategories = [
  'Suggestion',
  'Interest',
  'Informational',
  'Complaint',
  'Tagging',
  'Status Update',
  'Gratitude',
  'Inquiry',
];
// --- END ---

const SentimentTrendsPage = () => {
  const [data, setData] = useState<CommentTrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/comment-trends');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching comment trends:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredComments = useMemo(() => {
    if (!data) return [];
    return data.recentComments.filter((comment) => {
      const matchesSentiment =
        sentimentFilter === 'All' ||
        (comment.sentiment || 'Neutral') === sentimentFilter;
      const matchesCategory =
        categoryFilter === 'All' ||
        (comment.category || 'Uncategorized') === categoryFilter;
      return matchesSentiment && matchesCategory;
    });
  }, [data, sentimentFilter, categoryFilter]);

  const toggleComment = (id: string) => {
    setExpandedComments((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleExtractKeywords = (content: string, postId: string) => {
    const dataToStore = { content, postId };
    sessionStorage.setItem('textToExtract', JSON.stringify(dataToStore));
    router.push('/keyword-extractor');
  };

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  if (!data) return <div>No data available.</div>;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Comment Analysis</h1>
        <p className="text-gray-500 mt-1">
          Analyzing sentiment and categories from user comments.
        </p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SentimentAreaChart data={data.trendData} />
        </div>
        <div className="lg:col-span-1">
          <CategoryBreakdown
            chartData={data.categoryData}
            chartConfig={data.categoryConfig}
          />
        </div>
      </div>

      {/* Comments Table Row */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Recent Comments ({filteredComments.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="p-4 w-1/6">Author</th>
                <th className="p-4 w-2/6">Message</th>

                {/* Sentiment Filter Dropdown */}
                <th className="p-4 w-1/6">
                  <Select
                    value={sentimentFilter}
                    onValueChange={setSentimentFilter}
                  >
                    <SelectTrigger className="h-8 w-[130px] border-none bg-transparent p-0 font-semibold text-gray-600 shadow-none focus:ring-0 hover:text-gray-900">
                      <SelectValue placeholder="Sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Sentiments</SelectItem>
                      <SelectItem value="Positive">Positive</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </th>

                {/* 2. Updated Category Filter Dropdown */}
                <th className="p-4 w-1/6">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="h-8 w-[140px] border-none bg-transparent p-0 font-semibold text-gray-600 shadow-none focus:ring-0 hover:text-gray-900">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {/* Using the new commentCategories list */}
                      {commentCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="Uncategorized">
                        Uncategorized
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </th>

                <th className="p-4 w-1/12">Date</th>
                <th className="p-4 text-center w-1/12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComments.map((comment) => {
                const isExpanded = expandedComments.includes(comment.id);

                return (
                  <tr
                    key={comment.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 font-medium align-top">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 p-1.5 rounded-full flex-shrink-0">
                          <User size={14} className="text-gray-500" />
                        </div>
                        <span className="truncate">
                          {comment.author?.name || 'Unknown User'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <p
                        onClick={() => toggleComment(comment.id)}
                        className={`text-gray-600 cursor-pointer ${
                          isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'
                        }`}
                        title="Click to expand"
                      >
                        {comment.message || <em>No content</em>}
                      </p>
                    </td>

                    <td className="p-4 align-top">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${
                          comment.sentiment === 'Positive'
                            ? 'bg-green-100 text-green-700'
                            : comment.sentiment === 'Negative'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comment.sentiment || 'Neutral'}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 inline-block max-w-[150px] truncate">
                        {comment.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap align-top">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={comment.post.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          title="View Original Post"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() =>
                            handleExtractKeywords(
                              comment.message,
                              comment.post.id
                            )
                          }
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                          title="Extract Keywords"
                        >
                          <Wand2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredComments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No comments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrendsPage;
