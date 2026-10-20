import { FaTrophy, FaBook, FaCalendarAlt, FaUsers, FaStar } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { IoFlag } from "react-icons/io5";
import { FaRegClock, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

export const categoryConfig: Record<
  string,
  { 
    color: string; 
    bg: string; 
    border: string;
    icon: JSX.Element;
  }
> = {
  holiday: {
    color: "#B91C1C",          // red-700
    bg: "#FEE2E2",             // red-100
    border: "#FCA5A5",         // red-300
    icon: <IoFlag size={12} />,
  },

  exam: {
    color: "#1D4ED8",          // blue-700
    bg: "#DBEAFE",             // blue-100
    border: "#93C5FD",         // blue-300
    icon: <FaBook size={12} />,
  },

  competition: {
    color: "#B45309",          // amber-700
    bg: "#FEF3C7",             // amber-100
    border: "#FCD34D",         // amber-300
    icon: <FaTrophy size={12} />,
  },

  meeting: {
    color: "#065F46",          // emerald-700
    bg: "#D1FAE5",             // emerald-100
    border: "#6EE7B7",         // emerald-300
    icon: <FaUsers size={12} />,
  },

  celebration: {
    color: "#7C3AED",          // violet-700
    bg: "#EDE9FE",             // violet-100
    border: "#C4B5FD",         // violet-300
    icon: <MdCelebration size={12} />,
  },

  default: {
    color: "#4B5563",          // gray-600
    bg: "#F3F4F6",             // gray-100
    border: "#D1D5DB",         // gray-300
    icon: <FaStar size={12} />,
  }
};

// TIME INDICATOR ICONS
export function getTimeIcon(date: string | Date) {
  const now = new Date();
  const eventDate = new Date(date);

  if (eventDate < now) {
    return <FaCheckCircle className="text-green-500" size={14} />;
  }

  if (eventDate.toDateString() === now.toDateString()) {
    return <FaHourglassHalf className="text-yellow-500" size={14} />;
  }

  return <FaRegClock className="text-blue-500" size={14} />;
}
