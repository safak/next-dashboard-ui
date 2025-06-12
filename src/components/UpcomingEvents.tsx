import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons

// Define the expected event structure based on FullCalendar's format passed from the parent
interface FullCalendarEventForList {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  extendedProps: {
    type?: 'holiday' | 'vacation' | 'meeting' | 'other';
    // Include other extendedProps if needed by this component
  };
}

interface UpcomingEventsProps {
  events: FullCalendarEventForList[];
  onEdit?: (eventId: string) => void; // Expects string ID from FullCalendar
  onDelete?: (eventId: string) => void; // Expects string ID from FullCalendar
}

// Helper function to check if two dates are the same day (replaces date-fns)
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper function for formatting dates (replaces date-fns format)
const formatDate = (date: Date, options: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, onEdit, onDelete }) => {
  const now = new Date();

  // Filter for events starting from today onwards and sort them
  const upcoming = events
    .map((event) => ({
      // Ensure start/end are Date objects for comparison
      ...event,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : new Date(event.start), // Handle optional end
    }))
    .filter((event) => event.start >= now || (event.end >= now && event.start < now)) // Include ongoing events
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div>
      {upcoming.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400'>No upcoming events.</p>
      ) : (
        <ul className='space-y-3'>
          {upcoming.map((event) => {
            const startDate = event.start;
            // FullCalendar's end date for all-day events is exclusive, adjust if needed for display
            // For simplicity here, we'll use the provided end date directly.
            // If the end date needs adjustment for display (e.g., show 'May 5' instead of 'May 6' for a 1-day all-day event ending on May 6),
            // you might need to subtract a day before formatting.
            const endDate = event.end ?? startDate; // Use start if end is missing
            const type = event.extendedProps.type;

            return (
              <li
                key={event.id}
                className='p-3 border rounded bg-gray-50 dark:bg-gray-700 shadow-sm flex justify-between items-start'
              >
                <div>
                  {' '}
                  {/* Container for event details */}
                  <p className='font-semibold text-gray-800 dark:text-gray-100'>{event.title}</p>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {formatDate(startDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                    {event.allDay
                      ? ''
                      : ` ${formatDate(startDate, { hour: 'numeric', minute: 'numeric' })}`}
                    {!isSameDay(startDate, endDate) && // Show end date only if different day
                      ` - ${formatDate(endDate, { month: 'short', day: 'numeric', year: 'numeric' })}${event.allDay ? '' : ` ${formatDate(endDate, { hour: 'numeric', minute: 'numeric' })}`}`}
                  </p>
                  {type && type !== 'other' && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded capitalize ${
                        type === 'vacation'
                          ? 'bg-blue-200 text-blue-800'
                          : type === 'meeting'
                            ? 'bg-green-200 text-green-800'
                            : type === 'holiday'
                              ? 'bg-orange-200 text-orange-800'
                              : 'bg-gray-200 text-gray-800' // Fallback
                      }`}
                    >
                      {type}
                    </span>
                  )}
                </div>
                {(onEdit || onDelete) && (
                  <div className='flex space-x-2 ml-2 flex-shrink-0'>
                    {' '}
                    {/* Container for buttons */}
                    {/* Prevent editing/deleting holidays */}
                    {type !== 'holiday' && onEdit && (
                      <button
                        onClick={() => onEdit(event.id)} // Pass string ID
                        className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                        aria-label='Edit event'
                      >
                        <PencilIcon className='h-4 w-4' />
                      </button>
                    )}
                    {type !== 'holiday' && onDelete && (
                      <button
                        onClick={() => onDelete(event.id)} // Pass string ID
                        className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                        aria-label='Delete event'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UpcomingEvents;
