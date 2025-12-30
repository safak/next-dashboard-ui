import React from 'react';
import ProfileInfoCard from '@/components/ProfileInfoCard';
import InfoRow from '@/components/InfoRow';
import { userProfileData as user } from '@/data/mockData';

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Name Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
        <p className="text-gray-500">{user.thaiName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Study Information */}
        <ProfileInfoCard title="Study information">
          <InfoRow label="ID :" value={user.studyInfo.id} />
          <InfoRow
            label="Status :"
            value={user.studyInfo.status}
            valueClass="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"
          />
          <InfoRow label="Major :" value={user.studyInfo.major} />
          <InfoRow label="Intake Term :" value={user.studyInfo.intake} />
          <InfoRow label="Admission mail :" value={user.accounts.email} />
        </ProfileInfoCard>

        {/* Column 2: Account */}
        <ProfileInfoCard title="Account">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-sm text-gray-800">MUIC Account</h4>
              <p className="text-sm font-semibold mt-2">{user.accounts.muic}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-800">E-mail</h4>
              <p className="text-sm font-semibold mt-2">
                {user.accounts.email}
              </p>
            </div>
          </div>
        </ProfileInfoCard>

        {/* Column 3: Info & Emergency */}
        <div className="space-y-6">
          <ProfileInfoCard title="Info">
            <InfoRow label="Thai ID :" value={user.personalInfo.thaiId} />
            <InfoRow label="Birth Date :" value={user.personalInfo.birthDate} />
            <InfoRow label="Gender :" value={user.personalInfo.gender} />
            <div className="pt-2">
              <span className="text-gray-500 text-sm">Main Contact :</span>
              <div className="text-sm font-semibold text-right pl-10">
                <p>Tel : {user.personalInfo.phone}</p>
                <p>{user.personalInfo.address}</p>
              </div>
            </div>
          </ProfileInfoCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
