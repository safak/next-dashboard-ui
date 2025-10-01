// components/EventsList.tsx
"use client";
import { useState, useEffect } from "react";
import { 
  FaCalendar, 
  FaClock, 
  FaUser, 
  FaTools, 
  FaEdit, 
  FaTrash, 
  FaFilter,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUsers
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

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [page, typeFilter, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (typeFilter !== "all") filters.type = typeFilter;
      if (statusFilter !== "all") filters.status = statusFilter;

      const data = await eventsAPI.getAll(page, 10, filters);
      setEvents(data.events);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await eventsAPI.delete(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      alert('Failed to delete event');
      console.error('Error deleting event:', error);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'TECHNICIAN_VISIT': return <FaTools className="text-blue-500" />;
      case 'COMPLAINT_DEADLINE': return <FaExclamationTriangle className="text-red-500" />;
      case 'ADMIN_MEETING': return <FaUsers className="text-green-500" />;
      default: return <FaCalendar className="text-gray-500" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'TECHNICIAN_VISIT': return 'bg-blue-100 text-blue-800';
      case 'COMPLAINT_DEADLINE': return 'bg-red-100 text-red-800';
      case 'ADMIN_MEETING': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.technician?.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaCalendar />
              All Events
            </h2>
            <p className="text-gray-600">Manage and view all scheduled events</p>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <FaPlus /> Create Event
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by title, description, or technician..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="TECHNICIAN_VISIT">Technician Visit</option>
                <option value="COMPLAINT_DEADLINE">Complaint Deadline</option>
                <option value="ADMIN_MEETING">Admin Meeting</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="p-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                            {event.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status.replace('_', ' ')}
                          </span>
                        </div>

                        {event.description && (
                          <p className="text-gray-600 mb-3">{event.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaCalendar />
                            {formatDate(event.start)}
                          </div>
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
                          {event.participants.length > 0 && (
                            <div className="flex items-center gap-1">
                              <FaUsers />
                              {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-sm text-gray-500">
                          Created by: {event.createdBy.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 lg:flex-col">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-600">
                      {selectedEvent.description || 'No description provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Event Type
                    </label>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getEventTypeColor(selectedEvent.type)}`}>
                      {getEventTypeIcon(selectedEvent.type)}
                      {selectedEvent.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Timing and Participants */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <div className="text-gray-600">
                      <div>{formatDate(selectedEvent.start)}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <FaClock className="text-gray-400" />
                        {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                      </div>
                    </div>
                  </div>

                  {selectedEvent.technician && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Assigned Technician
                      </label>
                      <div className="text-gray-600">
                        <div className="font-medium">{selectedEvent.technician.user.name}</div>
                        <div className="text-sm">{selectedEvent.technician.user.email}</div>
                      </div>
                    </div>
                  )}

                  {selectedEvent.participants.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Participants ({selectedEvent.participants.length})
                      </label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {selectedEvent.participants.map(participant => (
                          <div key={participant.id} className="text-sm text-gray-600">
                            • {participant.name} ({participant.email})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Created by: {selectedEvent.createdBy.name}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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