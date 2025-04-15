'use client';

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import { calendarEvents } from '@/lib/data';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const localizer = momentLocalizer(moment);

const today = new Date();

const minTime = new Date(today);
minTime.setHours(8, 0, 0, 0); // 8:00 AM

const maxTime = new Date(today);
maxTime.setHours(17, 0, 0, 0); // 5:00 PM (17:00)

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      titleAccessor="title" // Make sure this matches your data property for event titles
      views={['work_week', 'day']}
      view={view}
      onView={setView}
      style={{ height: '98%' }}
      min={new Date(minTime.setHours(8, 0, 0, 0))}
      max={new Date(maxTime.setHours(17, 0, 0, 0))}
    />
  );
};

export default BigCalendar;
