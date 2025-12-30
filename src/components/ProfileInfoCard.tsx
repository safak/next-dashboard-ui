import React from 'react';

type CardProps = {
  title: string;
  children: React.ReactNode;
};

const ProfileInfoCard = ({ title, children }: CardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm h-full">
    <h3 className="text-lg font-bold border-b pb-3 mb-4">{title}</h3>
    {children}
  </div>
);

export default ProfileInfoCard;
