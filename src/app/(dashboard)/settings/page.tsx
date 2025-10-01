"use client";

import { useState } from "react";
import {
  FaSave,
  FaBell,
  FaUserShield,
  FaShieldAlt,
  FaCog,
  FaPalette,
  FaDatabase,
  FaEnvelope,
  FaKey,
  FaUserCog,
  FaLanguage,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const SettingsPage = () => {
  // State for form values
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    complaintAssignments: true,
    urgentComplaints: true,
    resolutionUpdates: true,
    weeklyReports: true,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    failedAttempts: 5,
    ipWhitelist: "",
    
    // System settings
    autoAssign: true,
    defaultUrgency: "medium",
    maxComplaintsPerTech: 5,
    autoArchive: 30,
    backupFrequency: "daily",
    
    // Appearance settings
    theme: "light",
    language: "en",
    dashboardLayout: "standard",
    density: "comfortable",
    
    // Account settings
    name: "Admin User",
    email: "admin@waterworks.com",
    phone: "+1 (555) 123-4567",
    department: "Complaint Management",
    position: "Senior Administrator",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [isSaving, setIsSaving] = useState(false);

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Settings saved:", settings);
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1500);
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    
    // Simulate password change
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Tabs configuration
  const tabs = [
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "system", label: "System", icon: <FaCog /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
    { id: "account", label: "Account", icon: <FaUserCog /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Admin Settings</h1>
          <p className="text-gray-600">Manage your account and system preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                        <p className="text-gray-500">Receive important updates via email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="pushNotifications"
                          name="pushNotifications"
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="pushNotifications" className="font-medium text-gray-700">Push Notifications</label>
                        <p className="text-gray-500">Receive browser notifications</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="complaintAssignments"
                          name="complaintAssignments"
                          type="checkbox"
                          checked={settings.complaintAssignments}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="complaintAssignments" className="font-medium text-gray-700">New Assignment Alerts</label>
                        <p className="text-gray-500">Get notified when assigned to new complaints</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="urgentComplaints"
                          name="urgentComplaints"
                          type="checkbox"
                          checked={settings.urgentComplaints}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="urgentComplaints" className="font-medium text-gray-700">Urgent Complaint Alerts</label>
                        <p className="text-gray-500">Receive immediate alerts for urgent complaints</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="resolutionUpdates"
                          name="resolutionUpdates"
                          type="checkbox"
                          checked={settings.resolutionUpdates}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="resolutionUpdates" className="font-medium text-gray-700">Resolution Updates</label>
                        <p className="text-gray-500">Get updates when complaints are resolved</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="weeklyReports"
                          name="weeklyReports"
                          type="checkbox"
                          checked={settings.weeklyReports}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="weeklyReports" className="font-medium text-gray-700">Weekly Reports</label>
                        <p className="text-gray-500">Receive weekly performance reports</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="twoFactorAuth"
                          name="twoFactorAuth"
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">Two-Factor Authentication</label>
                        <p className="text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <select
                        id="sessionTimeout"
                        name="sessionTimeout"
                        value={settings.sessionTimeout}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>60 minutes</option>
                        <option value={120}>2 hours</option>
                        <option value={0}>Never (not recommended)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <select
                        id="passwordExpiry"
                        name="passwordExpiry"
                        value={settings.passwordExpiry}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                        <option value={180}>180 days</option>
                        <option value={0}>Never (not recommended)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="failedAttempts" className="block text-sm font-medium text-gray-700 mb-2">
                        Failed Login Attempts Before Lockout
                      </label>
                      <select
                        id="failedAttempts"
                        name="failedAttempts"
                        value={settings.failedAttempts}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value={3}>3 attempts</option>
                        <option value={5}>5 attempts</option>
                        <option value={10}>10 attempts</option>
                        <option value={0}>No lockout</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="ipWhitelist" className="block text-sm font-medium text-gray-700 mb-2">
                        IP Whitelist (optional)
                      </label>
                      <textarea
                        id="ipWhitelist"
                        name="ipWhitelist"
                        value={settings.ipWhitelist}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter allowed IP addresses, one per line"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <p className="mt-2 text-sm text-gray-500">Restrict access to specific IP addresses for enhanced security</p>
                    </div>
                    
                    {/* Password Change Form */}
                    <div className="pt-4 border-t">
                      <h3 className="text-md font-medium text-gray-800 mb-4">Change Password</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="currentPassword"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="block w-full pr-10 pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <button
                            type="button"
                            onClick={handlePasswordChange}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaKey className="mr-2" />
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">System Settings</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="autoAssign"
                          name="autoAssign"
                          type="checkbox"
                          checked={settings.autoAssign}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="autoAssign" className="font-medium text-gray-700">Auto-Assign Complaints</label>
                        <p className="text-gray-500">Automatically assign new complaints to available technicians</p>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="defaultUrgency" className="block text-sm font-medium text-gray-700 mb-2">
                        Default Urgency Level
                      </label>
                      <select
                        id="defaultUrgency"
                        name="defaultUrgency"
                        value={settings.defaultUrgency}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="maxComplaintsPerTech" className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Complaints per Technician
                      </label>
                      <select
                        id="maxComplaintsPerTech"
                        name="maxComplaintsPerTech"
                        value={settings.maxComplaintsPerTech}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value={3}>3 complaints</option>
                        <option value={5}>5 complaints</option>
                        <option value={7}>7 complaints</option>
                        <option value={10}>10 complaints</option>
                        <option value={0}>No limit</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="autoArchive" className="block text-sm font-medium text-gray-700 mb-2">
                        Auto-Archive Resolved Complaints (days)
                      </label>
                      <select
                        id="autoArchive"
                        name="autoArchive"
                        value={settings.autoArchive}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value={7}>7 days</option>
                        <option value={15}>15 days</option>
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={0}>Never archive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                        Database Backup Frequency
                      </label>
                      <select
                        id="backupFrequency"
                        name="backupFrequency"
                        value={settings.backupFrequency}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Appearance Settings</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        id="theme"
                        name="theme"
                        value={settings.theme}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (system preference)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={settings.language}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="en">English</option>
                        <option value="es">Amharic</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="dashboardLayout" className="block text-sm font-medium text-gray-700 mb-2">
                        Dashboard Layout
                      </label>
                      <select
                        id="dashboardLayout"
                        name="dashboardLayout"
                        value={settings.dashboardLayout}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="standard">Standard</option>
                        <option value="compact">Compact</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="density" className="block text-sm font-medium text-gray-700 mb-2">
                        UI Density
                      </label>
                      <select
                        id="density"
                        name="density"
                        value={settings.density}
                        onChange={handleInputChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={settings.name}
                        onChange={handleInputChange}
                        className="block w-full pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={settings.email}
                        onChange={handleInputChange}
                        className="block w-full pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={settings.phone}
                        onChange={handleInputChange}
                        className="block w-full pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={settings.department}
                        onChange={handleInputChange}
                        className="block w-full pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={settings.position}
                        onChange={handleInputChange}
                        className="block w-full pl-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="px-6 py-4 bg-gray-50 text-right">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;