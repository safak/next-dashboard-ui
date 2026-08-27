"use client"

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { calendarEvents } from '@/lib/data'
// @ts-expect-error react-big-calendar does not provide CSS module declarations.
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from 'react'

const localizer = momentLocalizer(moment)

const BigCalendar = () => {
    const [view, setView] = useState<View>(Views.WORK_WEEK)
    
    // Automatically switch to Day view on mobile screens to prevent squished columns
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setView(Views.DAY)
            } else {
                setView(Views.WORK_WEEK)
            }
        }

        // Set initial view on load
        handleResize()

        // Listen for screen size changes
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView)
    }

  return (
    <div className="h-[98%] min-h-[800px] w-full">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        style={{ height: "100%" }}
        onView={handleOnChangeView}
        // min and max MUST have the exact same Year, Month, and Day to lock the grid mathematically
        min={new Date(2026, 7, 24, 8, 0, 0)}
        max={new Date(2026, 7, 24, 17, 0, 0)}
      />
    </div>
  )
}

export default BigCalendar