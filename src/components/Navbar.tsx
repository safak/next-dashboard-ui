'use client'; // Required for using hooks like useSession

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import UserProfileModal from './UserProfileModal'; // Import the modal component
import { UserProfileModalProvider } from '@/lib/UserProfileModalContext'; // Import the provider
import { Role } from '@prisma/client'; // Import the Role enum

// Define a type for the local user state
type LocalUserState = {
  name: string | null;
  role: Role | null; // Use the Role enum type
  image: string | null;
  email: string | null; // Add email
} | null;

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  // Local state to manage displayed user info for immediate updates
  const [localUser, setLocalUser] = useState<LocalUserState>(null);

  // Effect to initialize local state when session loads or changes
  useEffect(() => {
    if (session?.user) {
      setLocalUser({
        name: session.user.name ?? null,
        role: session.user.role ?? null,
        image: session.user.image ?? null,
        email: session.user.email ?? null, // Initialize email
      });
    } else {
      setLocalUser(null);
    }
  }, [session]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Callback function to update local state from the modal
  const handleProfileUpdate = (updatedUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }) => {
    setLocalUser((prev) => {
      const base = prev ?? { name: null, role: null, image: null, email: null }; // Include email in fallback
      return {
        ...base,
        name: updatedUser.name ?? base.name,
        email: updatedUser.email ?? base.email, // Update email as well
        // Role is not updated here, keep existing role
        role: base.role,
        image: updatedUser.image ?? base.image,
      };
    });
    console.log('[Navbar] Local user state updated by modal callback.');
  };

  if (status === 'loading' || (status === 'authenticated' && !localUser)) {
    // Show loading state if session is loading OR if authenticated but localUser hasn't been set yet
    return (
      <div className='flex items-center justify-between p-4'>
        <div className='flex-1'></div>
        <div className='flex items-center gap-4'>
          <div className='animate-pulse flex flex-col gap-1'>
            <div className='h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded'></div>
            <div className='h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded'></div>
          </div>
          <div className='animate-pulse h-[35px] w-[35px] bg-gray-300 dark:bg-gray-700 rounded-full'></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    // Optional: Render something if user is not logged in, or null
    return null; // Or a login button, etc.
  }

  // Use localUser state for rendering
  const { name, role, image } = localUser || { name: null, role: null, image: null };

  return (
    <>
      {' '}
      {/* Use Fragment to wrap multiple elements */}
      <div className='flex items-center justify-between p-4'>
        {/* Placeholder or other content can go here if needed */}
        <div className='flex-1'></div> {/* Add a flexible div to push user info to the right */}
        {/*user*/}
        <div
          className='flex items-center gap-4 cursor-pointer'
          onClick={handleOpenModal} // Add onClick handler
        >
          <span className='flex flex-col'>
            <span className='text-xs leading-3 font-semibold text-lightTextColor dark:text-darkTextColor'>
              {name || 'User Name'} {/* Fallback if name is missing */}
            </span>
            <span className='text-xs leading-4 font-thin text-neutral-600 dark:text-neutral-500'>
              {role || 'User Role'} {/* Fallback if role is missing */}
            </span>
          </span>
          {/* Wrapper div for Navbar avatar */}
          <div className='relative w-[35px] h-[35px] rounded-full overflow-hidden'>
            <Image
              src={image || '/avatar.png'} // Use user image or fallback to default avatar
              alt={name ? `${name}'s avatar` : 'avatar'}
              fill // Use fill to cover the parent div
              style={{ objectFit: 'cover' }} // Apply object-cover directly
              onError={(e) => {
                if (e.currentTarget.src !== '/avatar.png') {
                  e.currentTarget.src = '/avatar.png';
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* Conditionally render the modal, pass merged user data and the callback */}
      {/* Conditionally render the modal, pass isOpen, merged user data and the callback */}
      {session?.user &&
        localUser && ( // Keep modal structure but control visibility with isOpen
          <UserProfileModalProvider>
            <UserProfileModal
              isOpen={isModalOpen} // Pass the state variable here
              // Construct the user prop carefully:
              // Start with session.user (guaranteed non-null ID and Role)
              // Override with updated name/image from localUser state
              user={{
                ...session.user, // Includes id, role, emailVerified etc.
                name: localUser.name, // Use updated name from local state
                image: localUser.image, // Use updated image from local state
                // Email might also be updated, let's use localUser's email if available
                email: localUser.email !== undefined ? localUser.email : session.user.email,
              }}
              onClose={handleCloseModal}
              onProfileUpdate={handleProfileUpdate} // Pass the callback function
            />
          </UserProfileModalProvider>
        )}
    </>
  );
};
export default Navbar;
