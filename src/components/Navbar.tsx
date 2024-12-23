import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* User Info & Profile Picture */}
      <div className="flex items-center ml-auto space-x-4">
        {/* User Info */}
        <div className="flex flex-col text-right">
          <span className="text-sm leading-3 font-medium">John Doe</span>
          <span className="text-xs text-gray-500">Scholar</span>
        </div>
        
        {/* Profile Picture */}
        <div className="relative">
          <Image
            src="/profile.png" 
            alt="Profile Picture"
            width={36}
            height={36}
            className="rounded-full border border-gray-300" 
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
