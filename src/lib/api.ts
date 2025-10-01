import { title } from "process";

// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const analyticsAPI = {
  getDashboardData: async (days: number = 30) => {
    const response = await fetch(`${API_BASE}/analytics/dashboard?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
  },

  getByCategory: async () => {
    const response = await fetch(`${API_BASE}/analytics/by-category`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch category data');
    return response.json();
  },

  getByStatus: async () => {
    const response = await fetch(`${API_BASE}/analytics/by-status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch status data');
    return response.json();
  },

  getTopTechnicians: async (limit: number = 3) => {
    const response = await fetch(`${API_BASE}/analytics/top-technicians?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch technicians data');
    return response.json();
  }

};
// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Generic fetch with auth
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const authAPI = {
  login: async (email: string, password: string) => {
    return authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async () => {
    return authFetch('/auth/profile');
  },

  forgotPassword: async (email: string) => {
    return authFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// lib/api.ts - Update techniciansAPI
export const techniciansAPI = {
  getAll: async (page: number = 1, limit: number = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    return authFetch(`/technicians?${params}`);
  },

  getAvailable: async () => {
    return authFetch('/technicians/available');
  },

  getStats: async () => {
    return authFetch('/technicians/stats');
  },

  getById: async (id: number) => {
    return authFetch(`/technicians/${id}`);
  },

  create: async (userId: number, speciality: string, status: string = 'ACTIVE') => {
    return authFetch('/technicians', {
      method: 'POST',
      body: JSON.stringify({ 
        userId, 
        speciality, 
        status 
      }),
    });
  },

  update: async (id: number, data: UpdateTechnicianDto) => {
    return authFetch(`/technicians/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return authFetch(`/technicians/${id}`, {
      method: 'DELETE',
    });
  },
};

// Add this interface for TypeScript
interface UpdateTechnicianDto {
  speciality?: string;
  status?: string;
}

export const notificationsAPI = {
  // Send brodcast notificatio
  broadcast: async (title: string, message: string, audience: string) => {
    return authFetch('/notifications', {
      method: 'POST',
      body: JSON.stringify({title, message, audience}),
    })
  },

  // get user notifications
  getUserNotifications: async(page: number = 1, limit: number = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return authFetch(`notifications/my?${params}`)
  },

  // mark as read
  markAsRead: async(notficationId: number) => {
    return authFetch(`/notifications/${notficationId}/read`, {
      method: 'PUT',
    })
  },

  // mark all as read
  markAllAsRead: async () => {
    return authFetch('/notificaions/read-all', {
      method: 'PUT',
    })
  },

  // get unred count
  getUnreadCount: async () => {
    return authFetch('notifications/unread-count')
  },

  // admin: get all notifications
  getAll: async (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return authFetch(`/notifications?${params}`)
  },

  // Admin get stats
  getStats: async () => {
    return authFetch('/notifications/stats')
  },
  // admin deleie notifications
  delete: async (id: number) => {
    return authFetch(`notifications/${id}`, {
      method: 'DELETE',

    })
  },
}

// lib/api.ts - Add events API
export const eventsAPI = {
  // Create event
  create: async (eventData: any) => {
    return authFetch('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Get all events
  getAll: async (page: number = 1, limit: number = 10, filters?: any) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return authFetch(`/events?${params}`);
  },

  // Get calendar events
  getCalendar: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return authFetch(`/events/calendar?${params}`);
  },

  // Get user events
  getMyEvents: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return authFetch(`/events/my?${params}`);
  },

  // Get event by ID
  getById: async (id: number) => {
    return authFetch(`/events/${id}`);
  },

  // Update event
  update: async (id: number, eventData: any) => {
    return authFetch(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Delete event
  delete: async (id: number) => {
    return authFetch(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Get stats
  getStats: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return authFetch(`/events/stats?${params}`);
  },

  // Get technician availability
  getTechnicianAvailability: async (technicianId: number, startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return authFetch(`/events/technician/${technicianId}/availability?${params}`);
  },
};

export const reporstAPI = { 
  // generate new report
  generate: async (reportData: {
    title: string
    type: string
    filters: any
  }) => {
     return authFetch('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },
  // Get analytics report
  getAnalytics: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return authFetch(`/reports/analytics?${params}`);
  },

  // Get technician report
  getTechnician: async (technicianId: number, startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return authFetch(`/reports/technician/${technicianId}?${params}`);
  },

  // Get saved reports
  getSaved: async (page: number = 1, limit: number = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return authFetch(`/reports?${params}`);
  },

  // Get report by ID
  getById: async (id: number) => {
    return authFetch(`/reports/${id}`);
  },

  // Delete report
  delete: async (id: number) => {
    return authFetch(`/reports/${id}`, {
      method: 'DELETE',
    });
  },
}