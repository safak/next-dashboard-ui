'use client';

import React, { useState } from 'react';
import CollectionSchedule from '@/components/CollectionSchedule';
// We'll create these components next
import ManageSources from '@/components/ManageSources';
import DatabaseTable from '@/components/DatabaseTable';

const DataCollectionPage = () => {
  const [activeTab, setActiveTab] = useState('Manage');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Data Collection</h1>
        <p className="text-gray-500 mt-1">
          Manage sources and view collection schedules.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('Manage')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'Manage'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Manage Sources
          </button>
          <button
            onClick={() => setActiveTab('Schedule')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'Schedule'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Collection Schedule
          </button>
          <button
            onClick={() => setActiveTab('Database')}
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'Database'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-600'
            }`}
          >
            Database
          </button>
        </div>
      </div>

      {/* This now shows the correct component based on the active tab */}
      <div>
        {activeTab === 'Manage' && <ManageSources />}
        {activeTab === 'Schedule' && <CollectionSchedule />}
        {activeTab === 'Database' && <DatabaseTable />}
      </div>
    </div>
  );
};

export default DataCollectionPage;
