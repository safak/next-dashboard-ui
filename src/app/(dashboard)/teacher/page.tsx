import Announcements from "@/components/Announcements";
import BigCalender from "@/components/BigCalender";

const TeacherPage = () => {
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/*LEFT*/}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalender />
        </div>
      </div>
      {/* right */}
      <div className="w-full flex flex-col xl:w-1/3 gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
