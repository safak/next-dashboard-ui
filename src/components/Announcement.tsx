import Image from "next/image";

const Announcement = () => {
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Announcement</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-5 mt-4">
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit amet.</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-06-30
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi, ea?
          </p>
        </div>
        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit amet.</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-06-30
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi, ea?
          </p>
        </div>
        <div className="bg-lamaYellowLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit amet.</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-06-30
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi, ea?
          </p>
        </div>
      </div>
    </div>
  );
};
export default Announcement;
