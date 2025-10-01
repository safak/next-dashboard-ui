"use client";

import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaBan,
  FaTimes,
  FaUser,
  FaInbox,
  FaUserCheck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTools,
} from "react-icons/fa";
import { complaintsAPI } from "@/lib/api";

// Update the interface to match backend
interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: "SUBMITTED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  task?: {
    technician: {
      id: number;
      name: string;
      email: string;
    };
    assignedAt: string;
  };
  location?: any;
  photos: string[];
}

interface Technician {
  id: number;
  name: string;
  email: string;
}

export default function ComplaintsAdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [assignModal, setAssignModal] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch complaints and technicians from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintsData, techniciansData] = await Promise.all([
          complaintsAPI.getAll(1, 50), // Get first 50 complaints
          fetchTechnicians(), // We'll create this function
        ]);
        
        setComplaints(complaintsData.complaints || []);
        setTechnicians(techniciansData || []);
      } catch (err) {
        setError('Failed to load complaints');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch technicians (you'll need to create this API)
  const fetchTechnicians = async (): Promise<Technician[]> => {
    try {
      const response = await fetch('http://localhost:3000/technicians', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch technicians');
      return await response.json();
    } catch (error) {
      console.error('Error fetching technicians:', error);
      return [];
    }
  };

  // --- Filter by search term ---
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFilteredComplaints(
      complaints.filter((c) =>
        [c.user.name, c.user.email, c.category, c.title, c.description]
          .join(" ")
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [searchTerm, complaints]);

  // --- CRUD Handlers ---
  const handleEdit = (c: Complaint) => {
    setSelectedComplaint({ ...c });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this complaint?")) {
      try {
        // You'll need to add a delete endpoint
        await fetch(`http://localhost:3000/complaints/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setComplaints((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        alert('Failed to delete complaint');
        console.error('Delete error:', error);
      }
    }
  };

  const handleBlock = (user: string, email: string) => {
    if (confirm(`Block ${user} (${email})?`)) {
      alert(`User ${user} has been blocked.`);
      // Implement block user functionality
    }
  };

  const handleSave = async (updated: Complaint) => {
    try {
      await complaintsAPI.updateStatus(updated.id, updated.status);
      setComplaints((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setShowModal(false);
      setSelectedComplaint(null);
    } catch (error) {
      alert('Failed to update complaint');
      console.error('Update error:', error);
    }
  };
  
  const handleAssign = (c: Complaint) => {
    setAssignModal(c);
  }
  
  const saveAssignment = async (c: Complaint, technicianId: number) => {
    try {
      await complaintsAPI.assignTechnician(c.id, technicianId);
      
      // Update local state
      const technician = technicians.find(t => t.id === technicianId);
      setComplaints(prev =>
        prev.map(x => 
          x.id === c.id ? { 
            ...x, 
            status: "ASSIGNED" as const,
            task: {
              technician: technician!,
              assignedAt: new Date().toISOString()
            }
          } : x
        )
      );
      setAssignModal(null);
    } catch (error) {
      alert('Failed to assign technician');
      console.error('Assignment error:', error);
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'SUBMITTED': { color: 'bg-gray-100 text-gray-800', icon: FaClock },
      'ASSIGNED': { color: 'bg-blue-100 text-blue-800', icon: FaUserCheck },
      'IN_PROGRESS': { color: 'bg-yellow-100 text-yellow-800', icon: FaTools },
      'RESOLVED': { color: 'bg-green-100 text-green-800', icon: FaCheckCircle },
      'REJECTED': { color: 'bg-red-100 text-red-800', icon: FaBan },
    };

    const config = statusConfig[status] || statusConfig.SUBMITTED;
    const IconComponent = config.icon;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <IconComponent className="text-xs" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Urgency badge styling
  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      'CRITICAL': 'bg-red-100 text-red-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800',
    };

    const colorClass = urgencyConfig[urgency] || urgencyConfig.MEDIUM;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {urgency}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error: </strong> {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Water Complaints Management</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((status) => {
          const count = complaints.filter(c => c.status === status).length;
          return (
            <div key={status} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status.toLowerCase().replace('_', ' ')}</div>
            </div>
          );
        })}
      </div>

      {/* Search and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            placeholder="Search complaints…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Urgency</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  <FaInbox className="mx-auto text-3xl mb-2" />
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium">{c.user.name}</div>
                        <div className="text-xs text-gray-500">{c.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3">{getUrgencyBadge(c.urgency)}</td>
                  <td className="p-3">{getStatusBadge(c.status)}</td>
                  <td className="p-3">
                    {c.task ? (
                      <div className="text-sm">
                        <div className="font-medium">{c.task.technician.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(c.task.assignedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAssign(c)}
                        className="text-green-600 hover:text-green-800 flex items-center text-sm"
                        title="Assign Technician"
                      >
                        <FaUserCheck className="mr-1" /> Assign
                      </button>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3 text-lg">
                      <button
                        onClick={() => handleEdit(c)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">Edit Complaint</h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <strong>User:</strong> {selectedComplaint.user.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedComplaint.user.email}
              </div>
              <div>
                <strong>Title:</strong> {selectedComplaint.title}
              </div>
              <div>
                <strong>Category:</strong> {selectedComplaint.category}
              </div>
              <div>
                <strong>Description:</strong> {selectedComplaint.description}
              </div>

              <label className="block text-sm">
                Status
                <select
                  className="mt-1 w-full border rounded-md p-2"
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    setSelectedComplaint({
                      ...selectedComplaint,
                      status: e.target.value as Complaint["status"],
                    })
                  }
                >
                  {["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </label>

              {selectedComplaint.photos && selectedComplaint.photos.length > 0 && (
                <div>
                  <strong>Photos:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedComplaint.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Complaint photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedComplaint && handleSave(selectedComplaint)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign Technician</h3>
              <button onClick={() => setAssignModal(null)}>
                <FaTimes className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="mb-4">
              <div><strong>Complaint:</strong> {assignModal.title}</div>
              <div><strong>User:</strong> {assignModal.user.name}</div>
              <div><strong>Category:</strong> {assignModal.category}</div>
            </div>
            <select
              className="w-full border p-2 rounded-md mb-4"
              onChange={(e) => {
                const technicianId = parseInt(e.target.value);
                if (technicianId) {
                  saveAssignment(assignModal, technicianId);
                }
              }}
            >
              <option value="">Select technician</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setAssignModal(null)}
                className="border px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}