import React, { useState, useEffect } from 'react';

// Define the structure for FullCalendar events used within the modal
// This should match or be compatible with MyFullCalendarEvent in the parent
interface FullCalendarEventForModal {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  color?: string;
  extendedProps: {
    description?: string;
    type?: 'holiday' | 'vacation' | 'meeting' | 'other';
    originalId?: number | string; // Keep track of the original DB ID
  };
}

// Define the structure for slot info passed from FullCalendar's select callback
interface SlotInfoForModal {
  start: Date;
  end: Date;
  allDay?: boolean; // FullCalendar's select callback provides this
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave expects the structure defined in CalendarClientPage's handleSaveEvent
  onSave: (
    event: Omit<FullCalendarEventForModal, 'id' | 'extendedProps'> & {
      id?: string;
      extendedProps?: Partial<FullCalendarEventForModal['extendedProps']>;
    }
  ) => void;
  onDelete?: (eventId: string) => void; // Expects FullCalendar's string ID
  slotInfo?: SlotInfoForModal; // Use the updated SlotInfo structure
  eventToEdit?: FullCalendarEventForModal | null; // Expects FullCalendar event structure
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  slotInfo,
  eventToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [allDay, setAllDay] = useState(false);
  const [eventType, setEventType] = useState<'meeting' | 'vacation' | 'other'>('other');
  const [color, setColor] = useState<string>('#3174ad'); // Default FullCalendar blue-ish
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      // Pre-fill form if editing an existing event
      setTitle(eventToEdit.title);
      // Ensure start/end are Date objects
      setStartDate(eventToEdit.start ? new Date(eventToEdit.start) : null);
      setEndDate(eventToEdit.end ? new Date(eventToEdit.end) : null);
      setAllDay(eventToEdit.allDay ?? false);
      // Access type from extendedProps, handle 'holiday' case
      const currentType = eventToEdit.extendedProps?.type;
      setEventType(currentType === 'holiday' ? 'other' : (currentType ?? 'other'));
      setColor(eventToEdit.color ?? '#3174ad');
      setDescription(eventToEdit.extendedProps?.description ?? '');
    } else if (slotInfo) {
      // Pre-fill dates based on selected slot (for new event)
      setStartDate(slotInfo.start);
      // FullCalendar's select end date is exclusive for time slots, inclusive for all-day
      // For simplicity, we'll use the provided end date. Adjust if needed.
      setEndDate(slotInfo.end);
      setAllDay(slotInfo.allDay ?? false); // Use allDay from slotInfo

      // Reset other fields for new event
      setTitle('');
      setEventType('other');
      setColor('#3174ad');
      setDescription('');
    } else {
      // Reset form if opening without slot or event
      setTitle('');
      setStartDate(null);
      setEndDate(null);
      setAllDay(false);
      setEventType('other');
      setColor('#3174ad');
      setDescription('');
    }
    // Reset scroll position when modal opens/content changes
    const modalContent = document.querySelector('.modal-content-scroll');
    if (modalContent) modalContent.scrollTop = 0;
  }, [slotInfo, eventToEdit, isOpen]); // Dependencies

  const handleSave = () => {
    if (!title || !startDate) {
      // End date might be optional depending on logic
      alert('Please fill in Title and Start Date.');
      return;
    }

    // Ensure end date is valid, default to start date if null
    let finalEndDate = endDate ?? startDate;

    // FullCalendar's all-day end date is exclusive.
    // If your backend expects an inclusive end date for all-day events,
    // you might need to adjust `finalEndDate` before saving.
    // Example: If saving an all-day event for May 10th, FullCalendar might give
    // start: May 10, end: May 11. If backend needs end: May 10, adjust here.
    // For now, we pass the date as is.
    if (allDay && startDate.getTime() === finalEndDate.getTime()) {
      // If it's a single all-day event, FullCalendar might set end to the next day.
      // If the user didn't change the end date input, keep it same as start for clarity,
      // or adjust based on backend needs. Let's keep it simple for now.
      // finalEndDate = new Date(startDate); // Or adjust as needed
    }
    // Ensure end date is not before start date
    if (finalEndDate < startDate) {
      finalEndDate = startDate; // Set end date to start date if invalid
    }

    // Construct the event object in the format expected by the parent's onSave
    const eventData: Omit<FullCalendarEventForModal, 'id' | 'extendedProps'> & {
      id?: string;
      extendedProps?: Partial<FullCalendarEventForModal['extendedProps']>;
    } = {
      // id is omitted for new events, included for updates
      title,
      start: startDate,
      end: finalEndDate,
      allDay,
      color: color,
      // Pass custom data via extendedProps
      extendedProps: {
        description: description,
        type: eventType,
        // Include originalId only when updating
        originalId: eventToEdit ? eventToEdit.extendedProps?.originalId : undefined,
      },
    };

    // Include the FullCalendar string ID if we are editing
    if (eventToEdit) {
      eventData.id = eventToEdit.id;
    }

    onSave(eventData);
    onClose(); // Close modal after save
  };

  const handleDelete = () => {
    if (eventToEdit && onDelete) {
      onDelete(eventToEdit.id); // Pass the FullCalendar string ID
    }
    onClose(); // Close modal after delete attempt
  };

  if (!isOpen) return null;

  // Helper functions for date/time input formatting
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    try {
      // Adjust for timezone offset to get correct YYYY-MM-DD in local time
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return adjustedDate.toISOString().split('T')[0];
    } catch (e) {
      return '';
    } // Handle potential invalid date
  };

  const formatTimeForInput = (date: Date | null): string => {
    if (!date) return '';
    try {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  };

  // Handlers for date/time input changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const dateValue = e.target.value; // YYYY-MM-DD
    if (!dateValue) {
      // Handle empty input
      type === 'start' ? setStartDate(null) : setEndDate(null);
      return;
    }
    const currentTime = type === 'start' ? startDate : endDate;
    // Preserve time if it exists, otherwise default to midnight
    const timePart = currentTime ? formatTimeForInput(currentTime) : '00:00';
    try {
      // Combine date and time, parse as local time
      const newDate = new Date(`${dateValue}T${timePart}`);
      if (isNaN(newDate.getTime())) return; // Invalid date
      if (type === 'start') setStartDate(newDate);
      else setEndDate(newDate);
    } catch (e) {
      console.error('Error parsing date:', e);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const timeValue = e.target.value; // HH:MM
    if (!timeValue) return; // Handle empty input potentially

    const currentDate = type === 'start' ? startDate : endDate;
    // Need a valid date part to combine with time
    if (!currentDate) return; // Or default to today?

    const datePart = formatDateForInput(currentDate);
    try {
      const newDate = new Date(`${datePart}T${timeValue}`);
      if (isNaN(newDate.getTime())) return; // Invalid date
      if (type === 'start') setStartDate(newDate);
      else setEndDate(newDate);
    } catch (e) {
      console.error('Error parsing time:', e);
    }
  };

  const modalTitle = eventToEdit ? 'Edit Event' : 'Add Event';
  const saveButtonText = eventToEdit ? 'Update Event' : 'Save Event';
  const canDelete = eventToEdit && onDelete && eventToEdit.extendedProps?.type !== 'holiday'; // Can delete if editing, handler exists, and not a holiday

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto modal-content-scroll'>
        {' '}
        {/* Added class */}
        <h2 className='text-xl font-semibold mb-4'>{modalTitle}</h2>
        {/* Title Input */}
        <div className='mb-4'>
          <label htmlFor='title' className='block text-sm font-medium mb-1'>
            Title *
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            required
          />
        </div>
        {/* Description Textarea */}
        <div className='mb-4'>
          <label htmlFor='description' className='block text-sm font-medium mb-1'>
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
          />
        </div>
        {/* Start Date/Time */}
        <div className='mb-4'>
          <label htmlFor='startDate' className='block text-sm font-medium mb-1'>
            Start Date *
          </label>
          <input
            type='date'
            id='startDate'
            value={formatDateForInput(startDate)}
            onChange={(e) => handleDateChange(e, 'start')}
            className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            required
          />
        </div>
        {!allDay && (
          <div className='mb-4'>
            <label htmlFor='startTime' className='block text-sm font-medium mb-1'>
              Start Time
            </label>
            <input
              type='time'
              id='startTime'
              value={formatTimeForInput(startDate)}
              onChange={(e) => handleTimeChange(e, 'start')}
              className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
              // Not strictly required, but needed if not allDay
            />
          </div>
        )}
        {/* End Date/Time */}
        <div className='mb-4'>
          <label htmlFor='endDate' className='block text-sm font-medium mb-1'>
            End Date
          </label>
          <input
            type='date'
            id='endDate'
            value={formatDateForInput(endDate)}
            onChange={(e) => handleDateChange(e, 'end')}
            min={formatDateForInput(startDate)} // Prevent end date being before start date
            className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            required={!allDay} // Required if not all day
          />
        </div>
        {!allDay && (
          <div className='mb-4'>
            <label htmlFor='endTime' className='block text-sm font-medium mb-1'>
              End Time
            </label>
            <input
              type='time'
              id='endTime'
              value={formatTimeForInput(endDate)}
              onChange={(e) => handleTimeChange(e, 'end')}
              // Add min time validation if start/end dates are the same
              className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
              required={!allDay}
            />
          </div>
        )}
        {/* All Day Checkbox */}
        <div className='mb-4 flex items-center'>
          <input
            type='checkbox'
            id='allDay'
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className='mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label htmlFor='allDay' className='text-sm font-medium'>
            All-day Event
          </label>
        </div>
        {/* Event Type Select */}
        <div className='mb-4'>
          <label htmlFor='eventType' className='block text-sm font-medium mb-1'>
            Event Type
          </label>
          <select
            id='eventType'
            value={eventType}
            onChange={(e) => setEventType(e.target.value as 'meeting' | 'vacation' | 'other')}
            className='w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600'
            // Disable if editing a holiday? Or just default to 'other' as done in useEffect
          >
            <option value='meeting'>Meeting</option>
            <option value='vacation'>Vacation</option>
            <option value='other'>Other</option>
          </select>
        </div>
        {/* Color Picker */}
        <div className='mb-4'>
          <label htmlFor='eventColor' className='block text-sm font-medium mb-1'>
            Color
          </label>
          <input
            type='color'
            id='eventColor'
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className='w-full h-10 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 cursor-pointer'
          />
        </div>
        {/* Action Buttons */}
        <div className='flex justify-between items-center mt-6'>
          <div>
            {canDelete && (
              <button
                onClick={handleDelete}
                className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                type='button'
              >
                Delete
              </button>
            )}
          </div>

          <div className='flex gap-2'>
            <button
              onClick={onClose}
              type='button'
              className='px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type='button'
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              {saveButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
