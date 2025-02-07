"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  // Set default view to `WORK_WEEK`
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={{ work_week: true, day: true }} // Extend views to include "work_week"
      view={view} // Use state for dynamic view management
      style={{ height: "98%",  }} 
      onView={handleOnChangeView} // Update view on change
      min={new Date(2025,1,0,8,0,0)}
      max={new Date(2025,1,0,17,0,0)}


    />
  );
};

export default BigCalendar;
