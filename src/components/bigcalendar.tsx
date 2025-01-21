"use client"
import { Calendar, momentLocalizer, View, Views, WorkWeek } from 'react-big-calendar'
import moment from 'moment'
import { calendarEvents } from '@/lib/data'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'

const localizer = momentLocalizer(moment)

const Bigcalendar = () => {
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView);
    }
    return (
        <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={["work_week","day"]}
        view={view}
        style={{ height: "98%" }}
        onView={handleOnChangeView}
        min={new Date(2025, 1, 10, 8, 0, 0)}
        max={new Date(2025, 1, 10, 17, 0, 0)}
      />
    );
};

export default Bigcalendar