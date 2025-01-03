'use client'; 

import { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { auth } from "@/app/firebase/firebaseConfig";

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const user = auth.currentUser;

    if (!user) {
      setError('You must be logged in to update your password.');
      setLoading(false);
      return;
    }

    const credential = EmailAuthProvider.credential(user.email!, currentPassword);

    try {
      // Re-authenticate the user with their current password
      await reauthenticateWithCredential(user, credential);

      // Update the password to the new one
      await updatePassword(user, newPassword);
      setSuccess('Password updated successfully!');
    } catch (err) {
      setError('Error updating password: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Settings</h1>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Email: test@example123.com</h3>

        <div className="mb-6">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;    