'use client';

// 1. Import all necessary hooks and components
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ExternalLink, Wand2 } from 'lucide-react';
import type { Post, Comment, Author } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

// --- Define types for our data ---
type ScheduleData = {
  [key: string]: {
    posts: number;
    comments: number;
  };
};

// This type includes the 'author' relation for comments
type CommentWithAuthor = Comment & { author: Author | null };

type DayData = {
  posts: Post[];
  comments: CommentWithAuthor[];
};

const CollectionSchedule = () => {
  // State for the dots on the calendar
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  // State for the modal
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedData, setSelectedData] = useState<DayData | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const router = useRouter(); // Initialize the router

  // --- Fetch the schedule dots on load ---
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('/api/schedule');
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error('Failed to load schedule:', error);
      }
    };
    fetchSchedule();
  }, []); // Runs once on component mount

  // --- This function runs when a day is clicked ---
  const handleDateClick = async (day: number) => {
    // Set the date and loading state for the modal
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    // Format the date as 'YYYY-MM-DD' in UTC to match the API
    const dateString = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), day)
    )
      .toISOString()
      .split('T')[0];

    setSelectedDate(date);
    setIsModalLoading(true);

    try {
      // Fetch the detailed post/comment data for the clicked day
      const response = await fetch(`/api/schedule/${dateString}`);
      const data = await response.json();
      setSelectedData(data);
    } catch (error) {
      console.error('Failed to fetch day data:', error);
    } finally {
      setIsModalLoading(false);
    }
  };

  // --- THIS IS THE FIX (Part 1) ---
  // This function now accepts content AND the postId
  const handleExtractClick = (content: string, postId: string) => {
    const dataToStore = {
      content: content,
      postId: postId, // Now we have the post ID!
    };
    sessionStorage.setItem('textToExtract', JSON.stringify(dataToStore));
    router.push('/keyword-extractor');
  };
  // --- END FIX ---

  // --- Calendar Logic ---
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startDate = startOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = endOfMonth.getDate();

  const changeMonth = (offset: number) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );
  };
  // --- End Calendar Logic ---

  return (
    <Dialog>
      <div className="bg-white rounded-xl shadow-sm p-4">
        {/* Header with Month/Year and navigation */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {/* Day of Week Headers */}
          {daysOfWeek.map((day) => (
            <div key={day} className="font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for the start of the month */}
          {Array.from({ length: startDate }).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );

            // Format date as 'YYYY-MM-DD' (using UTC to prevent timezone bugs)
            const dateString = new Date(
              Date.UTC(date.getFullYear(), date.getMonth(), day)
            )
              .toISOString()
              .split('T')[0];
            const events = scheduleData[dateString];

            const today = new Date();
            const isToday =
              day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear();

            return (
              <DialogTrigger asChild key={day}>
                <button
                  onClick={() => handleDateClick(day)}
                  disabled={!events} // Disable button if there are no events
                  className="border-t py-2 flex flex-col items-center justify-start h-16 disabled:opacity-50"
                >
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      isToday ? 'bg-purple-600 text-white' : ''
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 flex justify-center space-x-1">
                    {events && (
                      <>
                        {events.posts > 0 && (
                          <div
                            className="w-2 h-2 rounded-full bg-purple-500"
                            title={`${events.posts} posts`}
                          ></div>
                        )}
                        {events.comments > 0 && (
                          <div
                            className="w-2 h-2 rounded-full bg-sky-500"
                            title={`${events.comments} comments`}
                          ></div>
                        )}
                      </>
                    )}
                  </div>
                </button>
              </DialogTrigger>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm">Posts</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-sky-500 mr-2"></div>
            <span className="text-sm">Comments</span>
          </div>
        </div>
      </div>

      {/* --- The Modal Content --- */}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Data Collected on{' '}
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
          </DialogTitle>
          <DialogDescription>
            Showing all posts and comments collected on this day.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
          {isModalLoading ? (
            <p>Loading data...</p>
          ) : !selectedData ||
            (selectedData.posts.length === 0 &&
              selectedData.comments.length === 0) ? (
            <p>No data found for this day.</p>
          ) : (
            <>
              {selectedData.posts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-purple-600">
                    Posts ({selectedData.posts.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedData.posts.map((post) => (
                      <div
                        key={post.id}
                        className="p-3 bg-gray-50 rounded-lg border"
                      >
                        <p className="text-gray-700 line-clamp-3">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <a
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-blue-500 hover:underline"
                          >
                            <ExternalLink size={14} className="mr-1" /> View
                            Post
                          </a>

                          {/* --- THIS IS THE FIX (Part 2) --- */}
                          <button
                            onClick={() =>
                              handleExtractClick(post.content, post.id)
                            }
                            className="flex items-center text-xs text-purple-600 hover:underline"
                          >
                            <Wand2 size={14} className="mr-1" /> Extract
                            Keywords
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedData.comments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sky-600">
                    Comments ({selectedData.comments.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedData.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 bg-gray-50 rounded-lg border"
                      >
                        <p className="font-semibold text-sm text-gray-800">
                          {comment.author?.name || 'Anonymous'}
                        </p>
                        <p className="text-gray-700">{comment.message}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {/* --- THIS IS THE FIX (Part 3) --- */}
                          <button
                            onClick={() =>
                              handleExtractClick(
                                comment.message,
                                comment.postId
                              )
                            }
                            className="flex items-center text-xs text-purple-600 hover:underline"
                          >
                            <Wand2 size={14} className="mr-1" /> Extract
                            Keywords
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionSchedule;
