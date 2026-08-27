import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import EventCalendar from "@/components/EventCalendar";

const StudentPage = () => {
  return (
    // Added overflow-hidden to prevent horizontal scrolling bugs on small devices
    <div className="p-4 flex gap-4 flex-col lg:flex-row overflow-hidden w-full">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        <div className="min-h-[800px] lg:h-full bg-white p-4 rounded-md flex flex-col">
          <h1 className="text-xl font-semibold mb-4">Schedule (4A)</h1>
          <div className="flex-1">
            <BigCalendar />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;