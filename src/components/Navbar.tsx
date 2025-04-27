import Image from "next/image"
const Navbar = () => {
  return (
    <div className="flec items-center justify-between p-4">Navbar
    {/* SEARCH BAR */}
    <div className="hidden md:flex">
       <Image src="/search.png" alt="search" width={14} height={14} /> 
       <input type="text" placeholder="Search...." className="bg-transparent border-none outline-none" />
    </div>
    {/* ICONS AND USER */}
    <div className="flex items-center gap-6">
      <div className="bg-white rounded-full h-7 w-7 flex items-center justify-center cursor-pointer">
        <Image src="/message.png" alt="message" width={20} height={20} />
      </div>
      <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
        <Image src="/announcement.png" alt="announcement" width={20} height={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs leading-3 font-medium">Douglas Boakye</span>
        <span className="text-[10px] text-gray-500 text-right">Admin</span>
        <Image src="/avastar.png" alt="avatar" width={20} height={20} className="rounded-full"/>
      </div>
    </div>
    divr
    
    </div>

  )
}

export default Navbar