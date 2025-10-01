// components/Calendar.tsx
"use client";
import { useState, useEffect } from "react";
import { 
  FaCalendar, 
  FaPlus, 
  FaChevronLeft, 
  FaChevronRight,
  FaClock,
  FaUser,
  FaTools,
  FaMapMarkerAlt
} from "react-icons/fa";
import { eventsAPI } from "@/lib/api";

interface Event {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'TECHNICIAN_VISIT' | 'COMPLAINT_DEADLINE' | 'ADMIN_MEETING' | 'OTHER';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  technician?: {
    user: {
      name: string;
      email: string;
    };
  };
  participants: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  createdBy: {
    name: string;
  };
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [currentDate, view]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);

      if (view === 'month') {
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
      } else if (view === 'week') {
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - day);
        endDate.setDate(startDate.getDate() + 6);
      }
      // For day view, use the current date

      const data = await eventsAPI.getCalendar(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'TECHNICIAN_VISIT': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'COMPLAINT_DEADLINE': return 'bg-red-100 border-red-500 text-red-800';
      case 'ADMIN_MEETING': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border p-2 bg-gray-50"></div>);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() && 
                     new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div 
          key={day} 
          className={`h-32 border p-2 ${isToday ? 'bg-blue-50' : ''} hover:bg-gray-50 cursor-pointer`}
          onClick={() => setView('day')}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border-l-2 ${getEventColor(event.type)} truncate`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                }}
              >
                {formatTime(event.start)} {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center font-semibold">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const DayView = () => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === currentDate.getDate() && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear();
    });

    return (
      <div className="space-y-4">
        <div className="text-lg font-semibold text-center">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="space-y-2">
          {dayEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No events scheduled for today
            </div>
          ) : (
            dayEvents.map(event => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaClock />
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      {event.technician && (
                        <div className="flex items-center gap-1">
                          <FaUser />
                          {event.technician.user.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    event.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Calendar Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaCalendar />
              Calendar
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 border rounded hover:bg-gray-50"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FaChevronRight />
              </button>
              <span className="text-lg font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={view}
              onChange={(e) => setView(e.target.value as any)}
              className="border rounded px-3 py-1"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaPlus /> New Event
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : view === 'month' ? (
          <MonthView />
        ) : (
          <DayView />
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="font-semibold">Description</label>
                  <p className="text-gray-600">{selectedEvent.description || 'No description'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Start Time</label>
                    <p className="text-gray-600">
                      {new Date(selectedEvent.start).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="font-semibold">End Time</label>
                    <p className="text-gray-600">
                      {new Date(selectedEvent.end).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">Type</label>
                    <p className="text-gray-600">{selectedEvent.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="font-semibold">Status</label>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      selectedEvent.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      selectedEvent.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      selectedEvent.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedEvent.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {selectedEvent.technician && (
                  <div>
                    <label className="font-semibold">Assigned Technician</label>
                    <p className="text-gray-600">{selectedEvent.technician.user.name}</p>
                    <p className="text-gray-500 text-sm">{selectedEvent.technician.user.email}</p>
                  </div>
                )}

                {selectedEvent.participants.length > 0 && (
                  <div>
                    <label className="font-semibold">Participants</label>
                    <div className="space-y-1">
                      {selectedEvent.participants.map(participant => (
                        <p key={participant.id} className="text-gray-600">
                          {participant.name} ({participant.email})
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-semibold">Created By</label>
                  <p className="text-gray-600">{selectedEvent.createdBy.name}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}