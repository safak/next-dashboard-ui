import {
  CalendarDays,
  CalendarRange,
  Circle,
  Sun,
} from "lucide-react";

const legendItems = [
  {
    label: "Today",
    color: "bg-blue-500",
    icon: CalendarDays,
  },
  {
    label: "Holiday",
    color: "bg-red-500",
    icon: Circle,
  },
  {
    label: "Second Saturday",
    color: "bg-orange-500",
    icon: CalendarRange,
  },
  {
    label: "Event",
    color: "bg-green-500",
    icon: Sun,
  },
];

export default function CalendarLegend() {
  return (
    <div className="border-t border-gray-100 px-5 py-3">
      <div className="flex flex-wrap gap-5 text-[9px]">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-gray-600">Today</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-gray-600">Holiday</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="text-gray-600">
            2nd Saturday
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-gray-600">Event</span>
        </div>
      </div>
    </div>
  );
}