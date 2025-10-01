"use client";

import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFilter,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { techniciansAPI } from "@/lib/api";

// Update interface to match backend schema
interface Technician {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    lastLogin?: string;
    createdAt: string;
  };
  speciality: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  stats?: {
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    efficiency: number;
  };
  tasks?: Array<{
    complaint: {
      id: number;
      status: string;
      category: string;
      urgency: string;
    };
  }>;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

const TechniciansPage = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Technician | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTechnician, setNewTechnician] = useState({
    userId: "",
    speciality: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "ON_LEAVE",
  });

  // Fetch technicians and available users
  useEffect(() => {
    fetchTechnicians();
    fetchAvailableUsers();
  }, []);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await techniciansAPI.getAll(1, 50);
      setTechnicians(data.technicians || []);
    } catch (err) {
      setError('Failed to load technicians');
      console.error('Error fetching technicians:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // You'll need to create this endpoint to get users who aren't technicians
      const response = await fetch('http://localhost:3000/users/available', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const users = await response.json();
        setAvailableUsers(users);
      }
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  // Filter technicians based on search and status filter
  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch = 
      tech.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || tech.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle adding a new technician
  const handleAddTechnician = async () => {
    if (!newTechnician.userId || !newTechnician.speciality) {
      alert("User and specialization are required!");
      return;
    }

    try {
      await techniciansAPI.create(
        parseInt(newTechnician.userId),
        newTechnician.speciality,
        newTechnician.status
      );
      
      // Refresh the list
      await fetchTechnicians();
      await fetchAvailableUsers();
      
      setShowAddModal(false);
      setNewTechnician({
        userId: "",
        speciality: "",
        status: "ACTIVE",
      });
    } catch (error) {
      alert('Failed to create technician');
      console.error('Error creating technician:', error);
    }
  };

  // Handle editing a technician
  const handleEditTechnician = async () => {
    if (!showEditModal) return;
    
    try {
      await techniciansAPI.update(showEditModal.id, {
        speciality: showEditModal.speciality,
        status: showEditModal.status,
      });
      
      // Refresh the list
      await fetchTechnicians();
      setShowEditModal(null);
    } catch (error) {
      alert('Failed to update technician');
      console.error('Error updating technician:', error);
    }
  };

  // Handle deleting a technician
  const handleDeleteTechnician = async (id: number) => {
    try {
      await techniciansAPI.delete(id);
      // Refresh the list
      await fetchTechnicians();
      await fetchAvailableUsers();
      setShowDeleteConfirm(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete technician');
      console.error('Error deleting technician:', error);
    }
  };

  // Handle status change
  const handleStatusChange = async (id: number, newStatus: "ACTIVE" | "INACTIVE" | "ON_LEAVE") => {
    try {
      await techniciansAPI.update(id, { status: newStatus });
      // Refresh the list
      await fetchTechnicians();
    } catch (error) {
      alert('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  // Status display helper
  const getStatusDisplay = (status: string) => {
    const statusMap = {
      'ACTIVE': 'Active',
      'INACTIVE': 'Inactive', 
      'ON_LEAVE': 'On Leave'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading technicians...</p>
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
            onClick={fetchTechnicians}
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Technicians Management</h1>
            <p className="text-gray-600">Manage your team of water system technicians</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaUserPlus className="mr-2" /> Add New Technician
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Technicians</p>
                <p className="text-2xl font-bold">{technicians.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUserCheck className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Active Technicians</p>
                <p className="text-2xl font-bold">
                  {technicians.filter(t => t.status === "ACTIVE").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Assigned Tasks</p>
                <p className="text-2xl font-bold">
                  {technicians.reduce((sum, tech) => sum + (tech.stats?.activeTasks || 0), 0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaTasks className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Avg Efficiency</p>
                <p className="text-2xl font-bold">
                  {technicians.length > 0 
                    ? Math.round(technicians.reduce((sum, tech) => sum + (tech.stats?.efficiency || 0), 0) / technicians.length)
                    : 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaCheckCircle className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search technicians by name, email or specialization..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technicians Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTechnicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {tech.user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tech.user.name}</div>
                          <div className="text-sm text-gray-500">
                            Joined: {new Date(tech.user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2" /> {tech.user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FaPhone className="text-gray-400 mr-2" /> {tech.user.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900">{tech.speciality}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${tech.stats?.efficiency || 0}%` }}
                          ></div>
                        </div>
                        <div className="ml-2 text-xs text-gray-500">
                          {tech.stats?.efficiency || 0}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tech.stats && tech.stats.activeTasks > 0 ? (
                          <span className="text-yellow-600 flex items-center">
                            <FaClock className="mr-1" /> {tech.stats.activeTasks} pending
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center">
                            <FaCheckCircle className="mr-1" /> No pending tasks
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        className={`text-xs font-medium py-1 px-2 rounded-full focus:outline-none focus:ring-1 ${
                          tech.status === "ACTIVE" 
                            ? "bg-green-100 text-green-800 focus:ring-green-500" 
                            : tech.status === "ON_LEAVE"
                            ? "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                            : "bg-red-100 text-red-800 focus:ring-red-500"
                        }`}
                        value={tech.status}
                        onChange={(e) => handleStatusChange(tech.id, e.target.value as "ACTIVE" | "INACTIVE" | "ON_LEAVE")}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="ON_LEAVE">On Leave</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => setShowEditModal(tech)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => setShowDeleteConfirm(tech.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTechnicians.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FaUserTimes className="mx-auto text-3xl mb-2" />
                <p>No technicians found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Technician Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-lg font-semibold">Add New Technician</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User *</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newTechnician.userId}
                  onChange={(e) => setNewTechnician({...newTechnician, userId: e.target.value})}
                >
                  <option value="">Select a user</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {availableUsers.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No available users found</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={newTechnician.speciality}
                  onChange={(e) => setNewTechnician({...newTechnician, speciality: e.target.value})}
                  placeholder="Enter specialization"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newTechnician.status}
                  onChange={(e) => setNewTechnician({...newTechnician, status: e.target.value as "ACTIVE" | "INACTIVE" | "ON_LEAVE"})}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTechnician}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add Technician
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Technician Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-lg font-semibold">Edit Technician</h2>
              <button onClick={() => setShowEditModal(null)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 bg-gray-50"
                  value={showEditModal.user.name}
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-md p-2 bg-gray-50"
                  value={showEditModal.user.email}
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={showEditModal.speciality}
                  onChange={(e) => setShowEditModal({...showEditModal, speciality: e.target.value})}
                  placeholder="Enter specialization"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={showEditModal.status}
                  onChange={(e) => setShowEditModal({...showEditModal, status: e.target.value as "ACTIVE" | "INACTIVE" | "ON_LEAVE"})}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowEditModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTechnician}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            </div>
            
            <div className="p-4">
              <p>Are you sure you want to delete this technician? This action cannot be undone.</p>
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTechnician(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniciansPage;