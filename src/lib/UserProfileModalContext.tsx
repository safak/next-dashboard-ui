'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfileModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const UserProfileModalContext = createContext<UserProfileModalContextType | undefined>(undefined);

export const UserProfileModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <UserProfileModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </UserProfileModalContext.Provider>
  );
};

export const useUserProfileModal = () => {
  const context = useContext(UserProfileModalContext);
  if (context === undefined) {
    throw new Error('useUserProfileModal must be used within a UserProfileModalProvider');
  }
  return context;
};
