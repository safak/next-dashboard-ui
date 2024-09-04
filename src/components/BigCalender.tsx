import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { View } from "react-big-calendar";

const BigCalender = () => {
  const localizer = momentLocalizer(moment);
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const handleViewChange = (view: View) => {
    setView(view);
  };
  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      onView={handleViewChange}
      min={new Date(2024, 1, 0, 8, 0, 0)}
      max={new Date(2024, 1, 0, 17, 0, 0)}
    />
  );
};

export default BigCalender;
