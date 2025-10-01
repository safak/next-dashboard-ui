"use client";

import { useState } from "react";
import Image from "next/image";
// import ThemeToggle from "./ThemeToggle";
import { FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";
import ThemeProvider from "@/app/providers/ThemeProvider";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Mock user data - in a real app, this would come from context/authentication
  const user = {
    name: "NegedeT",
    email: "negedet@example.com",
    avatar: "/avatar.png",
    role: "Admin"
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
    // Typically you would:
    // 1. Clear authentication tokens from storage
    // 2. Clear user data from context/state
    // 3. Redirect to login page
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const LogoutConfirmation = () => {
    if (!isLogoutModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Confirm Logout
            </h3>
            
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to logout from your admin account?
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-4">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-400 px-2">
          <Image src="/search.png" alt="Search" width={14} height={14}/>
          <input 
            type="text" 
            placeholder="Search..."  
            className="w-[200px] p-2 bg-transparent outline-none"
          />
        </div>

        {/* Icons and user */}
        <div className="flex items-center gap-6 justify-end w-full">
          {/* Theme Toggle */}
          <div className="bg-yellow-100 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
            
          </div>

          {/* Notifications */}
          <div className="bg-yellow-100 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
            <Image src="/bell.png" alt="Notifications" width={24} height={24}/>
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-400 text-white rounded-full text-xs">
              1
            </div>
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs leading-3 font-medium">{user.name}</span>
                <span className="text-[10px] text-gray-500">{user.role}</span>
              </div>
              <Image 
                src={user.avatar} 
                alt="User avatar" 
                width={34} 
                height={34} 
                className="rounded-full"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaUser className="mr-3 text-gray-400" size={14} />
                  Your Profile
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaCog className="mr-3 text-gray-400" size={14} />
                  Settings
                </a>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-3 text-red-400" size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation />

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;