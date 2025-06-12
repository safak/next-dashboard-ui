import React, { useState } from 'react';
import Image from 'next/image';
import { User } from 'next-auth';
import UniversalModal from './UniversalModal'; // Import the universal modal
import { useSession, signOut } from 'next-auth/react'; // Import signOut
import { useRouter } from 'next/navigation';

// Import server actions
import { updateUserProfile } from '@/app/actions/updateUserProfile';
import { changePassword } from '@/app/actions/changePassword'; // Import changePassword action

interface UserProfileModalProps {
  isOpen: boolean; // Add isOpen prop
  user: User & { id?: string };
  onClose: () => void;
  onProfileUpdate: (updatedUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }) => void; // Add callback prop
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onProfileUpdate,
}) => {
  const router = useRouter(); // Get router instance
  const { update: updateSession } = useSession(); // Get the update function again
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false); // State for toggling password fields
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    image: user.image || '',
  });
  // State for password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null); // Clear errors on input change
    setPasswordSuccess(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Optional: Preview image locally
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update formData image for preview, but keep selectedFile separate
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
      setSelectedFile(file); // Store the actual file object
      setError(null); // Clear previous errors
    } else {
      setSelectedFile(null);
      // Optionally reset preview to original image if file selection is cancelled
      // setFormData(prev => ({ ...prev, image: user.image || '' }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data and selected file if cancelling edit
      setFormData({
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
      });
      setSelectedFile(null);
      setError(null);
      // Reset password fields when cancelling edit
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError(null);
      setPasswordSuccess(null);
      setShowPasswordFields(false); // Hide password fields when cancelling edit
    }
    // Toggle edit state, clear fields and hide password section when entering edit mode
    if (!isEditing) {
      setSelectedFile(null);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError(null);
      setPasswordSuccess(null);
      setShowPasswordFields(false); // Ensure password fields are hidden initially
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    let imageUrl = formData.image; // Start with current image URL (could be preview or existing)

    // 1. Upload new avatar if selected
    if (selectedFile) {
      console.log('[UserProfileModal] New avatar file selected. Uploading...');
      const uploadFormData = new FormData();
      uploadFormData.append('avatar', selectedFile);

      try {
        const uploadResponse = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: uploadFormData,
        });
        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.success) {
          imageUrl = uploadResult.url; // Use the URL returned from the API
          console.log('[UserProfileModal] Avatar uploaded successfully. URL:', imageUrl);
          setSelectedFile(null); // Clear selected file state after successful upload
        } else {
          console.error('[UserProfileModal] Avatar upload failed:', uploadResult.error);
          setError(`Avatar upload failed: ${uploadResult.error || 'Server error'}`);
          setIsSaving(false);
          return; // Stop the save process if upload fails
        }
      } catch (uploadError) {
        console.error('[UserProfileModal] Error calling upload API:', uploadError);
        setError('Failed to connect to upload service.');
        setIsSaving(false);
        return; // Stop the save process
      }
    }

    // 2. Update profile with potentially new image URL
    console.log('[UserProfileModal] Attempting to save profile data...');
    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        image: imageUrl, // Use the potentially updated image URL
      };
      console.log('[UserProfileModal] Data being sent to server action:', dataToSend);

      const result = await updateUserProfile(dataToSend);
      console.log('[UserProfileModal] Server action result:', result);

      if (result.success && result.user) {
        console.log('[UserProfileModal] Profile updated successfully on server.');
        // Call the callback function passed from Navbar
        onProfileUpdate({
          name: result.user.name,
          email: result.user.email,
          image: result.user.image, // Use the final image URL from the successful update
        });
        // Also update the local form state to match the saved data
        setFormData({
          name: result.user.name || '',
          email: result.user.email || '',
          image: result.user.image || '', // Use the final image URL
        });

        // Re-adding explicit updateSession call as a final measure for client-side sync.
        try {
          console.log('[UserProfileModal] Attempting direct session update (again)...');
          await updateSession({
            ...user, // Spread existing session user data
            name: result.user.name,
            email: result.user.email,
            image: result.user.image,
          });
          console.log('[UserProfileModal] Direct session update attempted (again).');
        } catch (updateError) {
          console.error(
            '[UserProfileModal] Error during direct session update (again):',
            updateError
          );
          setError('Profile saved, UI might need refresh to fully update.');
        }

        // Keep router.refresh() for eventual consistency after session update attempt
        router.refresh();
        console.log('[UserProfileModal] router.refresh() called.');
        setIsEditing(false); // Exit edit mode
        onClose(); // Close the modal on successful save
      } else {
        const errorMessage = result.error || 'An unknown error occurred during save.';
        console.error('[UserProfileModal] Failed to update profile:', errorMessage);
        setError(errorMessage);
      }
    } catch (err: any) {
      // Catch specific error type if possible
      const errorMessage =
        err.message || 'An unexpected error occurred while calling the save action.';
      console.error('[UserProfileModal] Error calling updateUserProfile action:', err);
      setError(errorMessage);
    } finally {
      console.log('[UserProfileModal] Finished save attempt.');
      setIsSaving(false);
    }
  };

  // Handler for changing password
  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setPasswordSuccess(result.message || 'Password changed successfully!');
        // Clear fields after successful change
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordFields(false); // Hide the password section on success
      } else {
        setPasswordError(result.error || 'Failed to change password.');
      }
    } catch (err) {
      console.error('[UserProfileModal] Error calling changePassword action:', err);
      setPasswordError('An unexpected error occurred.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Use the UniversalModal component
  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title='User Profile'
      footerContent={
        <>
          {/* Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm'
            title='Logout'
          >
            Logout
          </button>
          {/* Edit/Save/Cancel Buttons */}
          <div className='flex gap-3'>
            {isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className='px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-lightTextColor dark:text-darkTextColor hover:bg-gray-300 dark:hover:bg-gray-500 text-sm'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className='px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm'
              >
                Edit Profile
              </button>
            )}
          </div>
        </>
      }
    >
      {/* Modal Content */}
      <>
        {/* Optional: Display Error Message */}
        {error && (
          <div className='mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded text-sm'>
            {error}
          </div>
        )}

        {/* Profile Info Section */}
        <div className='flex flex-col items-center gap-4 mb-6'>
          {/* Wrapper div to enforce shape and cropping */}
          <div className='relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600'>
            <Image
              src={formData.image || '/avatar.png'}
              alt={formData.name ? `${formData.name}'s avatar` : 'avatar'}
              fill
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                if (e.currentTarget.src !== '/avatar.png') {
                  e.currentTarget.src = '/avatar.png';
                }
              }}
            />
          </div>
          {isEditing ? (
            <input
              type='text'
              name='image'
              value={formData.image}
              onChange={handleInputChange}
              placeholder='Image URL'
              className='mt-2 w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor text-center text-sm'
            />
          ) : null}
          {isEditing && (
            <div className='w-full mt-2'>
              <label
                htmlFor='avatar-upload'
                className='block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1 text-center'
              >
                Change Avatar
              </label>
              <input
                id='avatar-upload'
                name='avatar'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800 cursor-pointer'
              />
            </div>
          )}
        </div>

        {/* User Details Section */}
        <div className='space-y-4'>
          {/* Name */}
          <div>
            <label className='block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
              Name
            </label>
            {isEditing ? (
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor'
              />
            ) : (
              <p className='text-lightTextColor dark:text-darkTextColor'>
                {formData.name || 'N/A'}
              </p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
              Email
            </label>
            {isEditing ? (
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor'
              />
            ) : (
              <p className='text-lightTextColor dark:text-darkTextColor'>
                {formData.email || 'N/A'}
              </p>
            )}
          </div>
          {/* Role */}
          <div>
            <label className='block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
              Role
            </label>
            <p className='text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded inline-block'>
              {user.role || 'N/A'}
            </p>
          </div>
        </div>

        {/* Password Change Section (Toggleable, only in edit mode) */}
        {isEditing && (
          <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <button
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className='text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-3 w-full text-left' // Make button full width and text left aligned
            >
              {showPasswordFields ? '▼ Hide Password Section' : '► Change Password'}
            </button>

            {/* Conditionally render password fields */}
            {showPasswordFields && (
              <div className='mt-2 space-y-3'>
                {' '}
                {/* Added margin-top */}
                {passwordError && (
                  <div className='mb-3 p-2 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded text-sm'>
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className='mb-3 p-2 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded text-sm'>
                    {passwordSuccess}
                  </div>
                )}
                <div>
                  <label className='block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
                    Current Password
                  </label>
                  <input
                    type='password'
                    name='currentPassword'
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className='w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
                    New Password
                  </label>
                  <input
                    type='password'
                    name='newPassword'
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className='w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
                    Confirm New Password
                  </label>
                  <input
                    type='password'
                    name='confirmPassword'
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className='w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-lightTextColor dark:text-darkTextColor'
                  />
                </div>
                <div className='flex justify-end'>
                  <button
                    onClick={handleChangePassword}
                    disabled={
                      isChangingPassword ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    className={`px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 text-sm ${isChangingPassword ? 'opacity-50 cursor-not-allowed' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isChangingPassword ? 'Changing...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    </UniversalModal>
  );
};

export default UserProfileModal;
