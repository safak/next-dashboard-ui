"use client";

import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaIdCard,
  FaSave,
  FaUpload,
  FaTimes
} from "react-icons/fa";

const AdminProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample admin data (in real app, this would come from context/API)
  const [adminData, setAdminData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@waterworks.com",
    phone: "+1 (555) 123-4567",
    department: "Complaint Management",
    position: "Senior Administrator",
    bio: "Dedicated to ensuring efficient water complaint resolution and customer satisfaction.",
    avatar: "/api/placeholder/100/100"
  });

  const [formData, setFormData] = useState({ ...adminData });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfile()) return;
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would update the backend
      setAdminData({ ...formData });
      
      if (avatarFile) {
        // Simulate avatar upload
        console.log("Uploading avatar:", avatarFile.name);
        // In real app, upload to cloud storage and get URL
      }
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({ ...adminData });
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-75 flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar Upload */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={avatarPreview || adminData.avatar || "/api/placeholder/150/150"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                          <FaUpload />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      )}
                    </div>
                    {avatarPreview && isEditing && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center"
                      >
                        <FaTimes className="mr-1" />
                        Remove Photo
                      </button>
                    )}
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      JPG, GIF or PNG. Max size of 5MB.
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.firstName ? "border-red-500" : "border-gray-300"
                        } ${!isEditing ? "bg-gray-100" : ""}`}
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        } ${!isEditing ? "bg-gray-100" : ""}`}
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } ${!isEditing ? "bg-gray-100" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } ${!isEditing ? "bg-gray-100" : ""}`}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBuilding className="text-gray-400" />
                        </div>
                        <select
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            !isEditing ? "bg-gray-100" : ""
                          }`}
                        >
                          <option value="Complaint Management">Complaint Management</option>
                          <option value="Technical Department">Technical Department</option>
                          <option value="Quality Control">Quality Control</option>
                          <option value="Customer Service">Customer Service</option>
                          <option value="Administration">Administration</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-gray-400" />
                        </div>
                        <select
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            !isEditing ? "bg-gray-100" : ""
                          }`}
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Senior Administrator">Senior Administrator</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Manager">Manager</option>
                          <option value="Director">Director</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        !isEditing ? "bg-gray-100" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;