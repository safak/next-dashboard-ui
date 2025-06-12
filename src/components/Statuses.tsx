// lib/statuses.ts (or utils/statuses.ts)
import React from 'react';
// Example using heroicons, install with: npm install @heroicons/react
import CustomIcon from './CustomIcon';

export interface StatusDefinition {
  value: string; // The value stored in the DB (e.g., 'NEW', 'IN_PROGRESS')
  label: string; // User-friendly text (e.g., 'New', 'In Progress')
  colorClasses: string; // Tailwind classes for text/background/border
  icon: React.ComponentType<{ className?: string }>; // Type for the icon component
}

// Define your statuses here
export const STATUSES: StatusDefinition[] = [
  {
    value: 'NEW',
    label: 'New',
    icon: (props) => <CustomIcon name={{ category: 'status', icon: 'new' }} {...props} />,
    colorClasses: 'text-blue-700 bg-blue-100 border-blue-300',
  },
  {
    value: 'WAITING',
    label: 'Waiting',
    icon: (props) => <CustomIcon name={{ category: 'status', icon: 'waiting' }} {...props} />,
    colorClasses: 'text-yellow-700 bg-yellow-100 border-yellow-300',
  },
  {
    value: 'NOT_SEND',
    label: 'Not Send',
    icon: (props) => <CustomIcon name={{ category: 'status', icon: 'notSend' }} {...props} />,
    colorClasses: 'text-red-700 bg-red-100 border-red-300',
  },
  {
    value: 'SEND',
    label: 'Send',
    icon: (props) => <CustomIcon name={{ category: 'status', icon: 'send' }} {...props} />,
    colorClasses: 'text-green-700 bg-green-100 border-green-300',
  },
  {
    value: 'DONE',
    label: 'Done',
    icon: (props) => <CustomIcon name={{ category: 'status', icon: 'done' }} {...props} />,
    colorClasses: 'text-green-700 bg-green-100 border-green-300',
  },

  // Add more statuses as needed
];

// Helper function to get status definition by value
export const getStatusDefinition = (
  value: string | null | undefined
): StatusDefinition | undefined => {
  if (!value) return STATUSES.find((s) => s.value === 'NEW'); // Default to 'NEW' if null/undefined
  return STATUSES.find((s) => s.value.toUpperCase() === value.toUpperCase());
};
