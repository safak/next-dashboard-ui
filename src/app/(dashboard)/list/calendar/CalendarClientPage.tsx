'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // For month, week, day, multi-month views
import timeGridPlugin from '@fullcalendar/timegrid'; // For time grid views
import listPlugin from '@fullcalendar/list'; // For list view
import interactionPlugin from '@fullcalendar/interaction'; // For dateClick, select, eventDrag, etc.
import { EventInput, DateSelectArg, EventClickArg, CalendarApi } from '@fullcalendar/core';
import { EventType } from '@prisma/client';

// Import existing components and actions
import EventModal from '@/components/EventModal';
import UpcomingEvents from '@/components/UpcomingEvents';
import {
  getCalendarEvents,
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getUserVacationDays,
} from '@/app/actions/calendarActions';

// FullCalendar CSS is imported globally in src/app/layout.tsx

// Define the structure for events used by FullCalendar
// We add custom properties via `extendedProps`
interface MyFullCalendarEvent extends EventInput {
  id: string; // FullCalendar uses string IDs internally
  title: string;
  start: Date | string;
  end?: Date | string; // Optional end date
  allDay?: boolean;
  color?: string; // Direct color property
  extendedProps: {
    description?: string;
    type?: 'holiday' | 'vacation' | 'meeting' | 'other'; // Keep our custom types
    originalId: number | string; // Store the original DB ID if needed
  };
}

// Define the structure for the data passed to the modal
interface ModalData {
  start?: Date;
  end?: Date;
  allDay?: boolean;
  event?: MyFullCalendarEvent; // Pass the whole event for editing
}

const CalendarClientPage = () => {
  const [events, setEvents] = useState<MyFullCalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null); // Data for modal (slot or event)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vacationDays, setVacationDays] = useState<number>(0);
  const calendarRef = useRef<FullCalendar>(null); // Ref to access Calendar API

  // --- Fetch initial data ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedEvents, fetchedVacationDays] = await Promise.all([
          getCalendarEvents(),
          getUserVacationDays(),
        ]);

        // Process fetched events into FullCalendar format
        const processedEvents: MyFullCalendarEvent[] = (fetchedEvents as any[]).map((ev: any) => ({
          id: String(ev.id), // Use DB ID as FullCalendar ID (string)
          title: ev.title,
          start: new Date(ev.start),
          end: new Date(ev.end),
          allDay: ev.allDay ?? undefined,
          color: ev.color ?? undefined,
          extendedProps: {
            description: ev.description ?? undefined,
            type: ev.type.toLowerCase() as MyFullCalendarEvent['extendedProps']['type'],
            originalId: ev.id, // Keep original ID if needed elsewhere
          },
        }));

        setEvents(processedEvents);
        setVacationDays(fetchedVacationDays);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('Could not load calendar data. Please try again later.');
        setEvents([]);
        setVacationDays(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handler for selecting a date/time range ---
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setModalData({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
      event: undefined, // No existing event
    });
    setIsModalOpen(true);
    // Unselect the date range visually
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
  }, []);

  // --- Handler for clicking an existing event ---
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    // Prevent editing holidays (assuming type is stored in extendedProps)
    if (clickInfo.event.extendedProps.type === 'holiday') {
      console.log('Cannot edit holiday events.');
      // Optionally show a message to the user
      return;
    }

    setModalData({
      event: {
        // Pass the clicked event data to the modal
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.startStr, // Use string representations or Date objects
        end: clickInfo.event.endStr,
        allDay: clickInfo.event.allDay,
        color: clickInfo.event.backgroundColor || clickInfo.event.borderColor, // Get color
        extendedProps: clickInfo.event.extendedProps as MyFullCalendarEvent['extendedProps'],
      },
    });
    setIsModalOpen(true);
  }, []);

  // --- Handler to close the modal ---
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalData(null); // Clear modal data
  }, []);

  // --- Handler for saving (adding or updating) an event ---
  // Note: EventModal needs to be adapted to pass data in this format
  const handleSaveEvent = useCallback(
    async (
      eventData: Omit<MyFullCalendarEvent, 'id' | 'extendedProps'> & {
        id?: string;
        extendedProps?: Partial<MyFullCalendarEvent['extendedProps']>;
      }
    ) => {
      setError(null);
      const isUpdating = !!eventData.id;

      // Prepare data for server action (similar to before)
      const dataToSend = {
        title: eventData.title,
        startDate: new Date(eventData.start), // Ensure Date objects
        endDate: eventData.end ? new Date(eventData.end) : new Date(eventData.start), // Handle optional end
        allDay: eventData.allDay,
        color: eventData.color,
        description: eventData.extendedProps?.description,
        type: (eventData.extendedProps?.type?.toUpperCase() ?? 'OTHER') as EventType,
        id: isUpdating ? Number(eventData.extendedProps?.originalId) : undefined, // Use original ID for update
      };

      // Adjust end date for all-day events if necessary for server logic
      // (FullCalendar's end is exclusive, server might expect inclusive)
      // This depends on your backend implementation. Example:
      if (dataToSend.allDay && dataToSend.endDate) {
        // If backend expects inclusive end date for allDay events, adjust:
        // dataToSend.endDate.setDate(dataToSend.endDate.getDate() - 1);
      }

      type SavedEvent = {
        // Expected shape from server actions
        id: number;
        title: string;
        start: Date | string;
        end: Date | string;
        allDay: boolean | null;
        color: string | null;
        description: string | null;
        type: EventType;
        userId: string | null;
      };

      try {
        let savedEvent: SavedEvent;
        if (isUpdating && dataToSend.id) {
          savedEvent = await updateCalendarEvent(dataToSend);
        } else {
          savedEvent = await addCalendarEvent(dataToSend);
        }

        // Convert saved event back to FullCalendar format
        const calendarEvent: MyFullCalendarEvent = {
          id: String(savedEvent.id),
          title: savedEvent.title,
          start: new Date(savedEvent.start),
          end: new Date(savedEvent.end),
          allDay: savedEvent.allDay ?? undefined,
          color: savedEvent.color ?? undefined,
          extendedProps: {
            description: savedEvent.description ?? undefined,
            type: savedEvent.type.toLowerCase() as MyFullCalendarEvent['extendedProps']['type'],
            originalId: savedEvent.id,
          },
        };

        // Update local state
        if (isUpdating) {
          setEvents((prev) => prev.map((ev) => (ev.id === calendarEvent.id ? calendarEvent : ev)));
        } else {
          setEvents((prev) => [...prev, calendarEvent]);
        }

        console.log(isUpdating ? 'Updated event:' : 'Added new event:', savedEvent);

        // Re-fetch vacation days if necessary
        if (savedEvent.type === EventType.VACATION) {
          try {
            const updatedDays = await getUserVacationDays();
            setVacationDays(updatedDays);
          } catch (fetchErr) {
            console.error('Failed to re-fetch vacation days after save:', fetchErr);
          }
        }

        handleCloseModal();
      } catch (err: any) {
        console.error('Failed to save event:', err);
        setError(err.message || 'Could not save the event.');
      }
    },
    [handleCloseModal]
  );

  // --- Handler for deleting an event ---
  const handleDeleteEvent = useCallback(
    async (eventId: number | string) => {
      // Confirmation is now handled within the function
      if (!window.confirm('Are you sure you want to delete this event?')) {
        return;
      }
      setError(null);
      try {
        // Find the event in the current state to check its type before deleting
        const eventToDelete = events.find(
          (ev) => ev.id === String(eventId) || ev.extendedProps.originalId === eventId
        );
        const originalIdToDelete = eventToDelete?.extendedProps.originalId;

        // Ensure originalIdToDelete is a number before calling deleteCalendarEvent
        const idNum = Number(originalIdToDelete);
        if (isNaN(idNum)) {
          throw new Error('Invalid Event ID for deletion.');
        }

        await deleteCalendarEvent(idNum); // Pass the numeric ID

        // Remove from local state using FullCalendar's string ID
        setEvents((prev) => prev.filter((ev) => ev.id !== String(eventId)));

        console.log('Deleted event with original ID:', originalIdToDelete);

        // Re-fetch vacation days if necessary
        if (eventToDelete?.extendedProps?.type === 'vacation') {
          try {
            const updatedDays = await getUserVacationDays();
            setVacationDays(updatedDays);
          } catch (fetchErr) {
            console.error('Failed to re-fetch vacation days after delete:', fetchErr);
          }
        }

        handleCloseModal(); // Close modal if deletion was triggered from there
      } catch (err: any) {
        console.error('Failed to delete event:', err);
        setError(err.message || 'Could not delete the event.');
      }
    },
    [events, handleCloseModal]
  ); // Added events dependency

  // --- Handler for initiating edit from UpcomingEvents ---
  // Assumes UpcomingEvents passes the FullCalendar event ID (string)
  const handleEditFromUpcoming = useCallback(
    (eventId: string) => {
      const eventToEdit = events.find((ev) => ev.id === eventId);
      if (eventToEdit) {
        // Simulate an event click to open the modal
        handleEventClick({
          event: {
            id: eventToEdit.id,
            title: eventToEdit.title,
            start: eventToEdit.start ? new Date(eventToEdit.start) : null, // Need Date objects for click arg
            end: eventToEdit.end ? new Date(eventToEdit.end) : null,
            startStr: eventToEdit.start?.toString() ?? '', // Provide string versions
            endStr: eventToEdit.end?.toString() ?? '',
            allDay: eventToEdit.allDay ?? false,
            extendedProps: eventToEdit.extendedProps,
            // Mock other EventApi properties needed by handleEventClick if any
            // These might not be strictly necessary if handleEventClick only uses the above
            // Example mocks (adjust as needed):
            jsEvent: {} as MouseEvent,
            view: calendarRef.current?.getApi().view ?? ({} as any),
            el: {} as HTMLElement,
            source: undefined,
            backgroundColor: eventToEdit.color ?? '',
            borderColor: eventToEdit.color ?? '',
            textColor: '', // Add appropriate text color if needed
            // Add other methods like setProp, remove, etc., as empty functions if required by handleEventClick
            setProp: () => {},
            setExtendedProp: () => {},
            remove: () => {},
            // ... other EventApi methods
          } as any, // Use 'as any' carefully, ensure required props are present
          jsEvent: new MouseEvent('click'), // Mock JS event
          view: calendarRef.current?.getApi().view ?? ({} as any), // Mock view object
          el: document.createElement('div'), // Mock element
        });
      } else {
        console.error('Could not find event with ID:', eventId, 'to edit from upcoming list.');
        setError('Could not find the selected event to edit.');
      }
    },
    [events, handleEventClick]
  ); // Add dependencies

  // --- Custom Event Rendering/Styling (Example) ---
  // FullCalendar offers various ways: eventContent, eventClassNames, etc.
  const renderEventContent = (eventInfo: any) => {
    // Customize how event text/content appears
    const type = eventInfo.event.extendedProps.type;
    let icon = '';
    // Example: Add icons based on type
    if (type === 'meeting') icon = '👥 ';
    if (type === 'vacation') icon = '🏖️ ';
    if (type === 'holiday') icon = '🎉 ';

    return (
      <>
        <b>{eventInfo.timeText}</b> {/* Display time if applicable */}
        <i>
          {icon}
          {eventInfo.event.title}
        </i>{' '}
        {/* Display title */}
      </>
    );
  };

  // --- Custom Day Cell Styling (Example for weekends/holidays) ---
  // Note: Bulgarian holidays logic needs to be adapted if date-fns was removed
  // Re-implement isBulgarianHoliday if needed, or use a different method
  /*
  const getDayCellClassNames = (arg: any) => {
    const date = arg.date;
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    // const isHoliday = isBulgarianHoliday(date); // Re-implement this check

    let classNames = [];
    // if (isHoliday) {
    //   classNames.push('bg-orange-100', 'dark:bg-orange-900'); // Example Tailwind classes
    // } else
    if (isWeekend) {
      classNames.push('bg-gray-200', 'dark:bg-gray-700'); // Example Tailwind classes
    }
    return classNames;
  };
  */

  // Render Loading / Error / Calendar
  if (isLoading) {
    return <div className='p-4 text-center'>Loading Calendar...</div>;
  }

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className='mb-4 p-3 border border-red-400 bg-red-100 text-red-700 rounded'>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Top section for stats */}
      <div className='mb-4 p-4 border rounded bg-gray-100 dark:bg-gray-900 shadow-sm'>
        <h3 className='text-lg font-semibold'>Vacation Allowance</h3>
        <p>
          Remaining Days:{' '}
          <span className='font-bold text-blue-600 dark:text-blue-400'>{vacationDays}</span>
        </p>
      </div>

      {/* Main Calendar and Timeline Layout */}
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Calendar Section */}
        {/* Add a container div for better height control if needed */}
        <div className='flex-grow lg:w-2/3 h-[70vh] calendar-container'>
          {' '}
          {/* Added class */}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              // Add multiMonthYear for the year view
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,multiMonthYear',
            }}
            initialView='dayGridMonth'
            events={events}
            selectable={true}
            selectMirror={true} // Show placeholder event while selecting
            dayMaxEvents={true} // Allow "more" link when too many events
            weekends={true} // Show weekends
            select={handleDateSelect}
            eventClick={handleEventClick}
            // eventContent={renderEventContent} // Optional: Custom event rendering
            // dayCellClassNames={getDayCellClassNames} // Optional: Custom day cell styling
            firstDay={1} // Start week on Monday
            height='100%' // Make calendar fill container height
            // Add other FullCalendar options as needed
          />
        </div>

        {/* Upcoming Events Timeline Section */}
        <div className='lg:w-1/3'>
          <h2 className='text-xl font-semibold mb-4'>Upcoming Events</h2>
          <div className='border rounded p-4 bg-white dark:bg-gray-800 shadow h-[calc(70vh-48px)] overflow-y-auto'>
            {/* UpcomingEvents needs adaptation if it relies heavily on the old event structure */}
            <UpcomingEvents
              events={events} // Pass FullCalendar formatted events
              onEdit={handleEditFromUpcoming}
              onDelete={handleDeleteEvent} // Pass original ID or FullCalendar ID based on component needs
            />
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {/* EventModal needs significant adaptation to handle FullCalendar's event structure */}
      {/* and the new `modalData` prop */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent} // handleSaveEvent now expects FullCalendar-like structure
        onDelete={handleDeleteEvent} // Pass the ID (string or original number)
        // Adapt props based on EventModal's new requirements:
        // Pass either selected date info or the event being edited
        // Ensure start and end dates exist in modalData before passing
        slotInfo={
          modalData && !modalData.event && modalData.start && modalData.end
            ? { start: modalData.start, end: modalData.end, allDay: modalData.allDay }
            : undefined
        }
        eventToEdit={modalData?.event} // Pass the FullCalendar event object
      />

      {/* Add some basic styling for the container if needed */}
      <style jsx global>{`
        .calendar-container .fc {
          /* Target FullCalendar elements */
          height: 100%; /* Ensure FC takes full height */
        }
        /* Add any other custom styles needed for FullCalendar integration */
      `}</style>
    </>
  );
};

export default CalendarClientPage;
