import Image from "next/image"

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Search bar */}
      <div className="hidden md:flex gap-2 items-center rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src={"/search.png"} height={14} width={14} alt="search"/>
        <input type="" name="" id="" placeholder="search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>
      {/* User and icons */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center cursor-pointer justify-center">
          <Image src={"/message.png"} alt="" width={20} height={20}/>
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center cursor-pointer justify-center relative">
          <Image src={"/announcement.png"} alt="" width={20} height={20}/>
          <div className="absolute -top-3 -right-3 w-5 h-5 flex justify-center items-center bg-purple-500 text-white text-xs rounded-full">1</div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">Jhon</span>
          <span className="text-[10px] text-gray-500 text-right">Duran</span>
        </div>
        <Image src="/avatar.png" alt="avatar" height={36} width={36} className="rounded-full"/>
      </div>
    </div>
  )
}

export default Navbar