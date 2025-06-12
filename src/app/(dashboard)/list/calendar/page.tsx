import React from 'react'; // Explicitly import React
import CalendarClientPage from '@/app/(dashboard)/list/calendar/CalendarClientPage'; // Use path alias

// This page now simply renders the client component,
// which handles the internal layout (calendar + timeline)
const CalendarPage = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold mb-4'>Calendar & Events</h1>
      <CalendarClientPage />
    </div>
  );
};

export default CalendarPage;
