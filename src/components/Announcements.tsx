import { events } from "@/constants/events";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";


const Announcements = () => {
  return (
    <div className='bg-white rounded-lg p-4 mt-4'>
      <div className="flex flex-row justify-between">
        <h1 className="capitalize font-semibold">Announcements</h1>
        <Image
            src={getImagePath("/moreDark.png")}
            alt="menu options"
            width={20}
            height={20}
            className="cursor-pointer"
          />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium">
              Lorem ipsum dolor sit amet
           </h3>
           <span className="bg-white rounded-md p-1 text-xs text-gray-400">23/10/2000
           </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta pariatur dolores laboriosam doloremque eveniet.</p>
        </div>
        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium">
              Lorem ipsum dolor sit amet
           </h3>
           <span className="bg-white rounded-md p-1 text-xs text-gray-400">23/10/2000</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta pariatur dolores laboriosam doloremque eveniet.</p>
        </div>
        <div className="bg-lamaYellowLight rounded-md p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium">
              Lorem ipsum dolor sit amet
           </h3>
           <span className="bg-white rounded-md p-1 text-xs text-gray-400">23/10/2000</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta pariatur dolores laboriosam doloremque eveniet.</p>
        </div>
      </div>
    </div>
  )
}

export default Announcements