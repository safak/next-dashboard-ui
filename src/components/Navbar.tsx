'use client';
import Image from 'next/image';
import React from 'react';
import { Menu, Megaphone, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SearchBox from './SearchBox';
import { usePathname } from 'next/navigation';
type NavbarProps = {
  onMenuToggle: () => void;
};
const Navbar = ({ onMenuToggle }: NavbarProps) => {
  return (
    <div className="flex items-center justify-between p-4 h-full">
      {/*Search bar */}
      {/* <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div> */}
      {/* <SearchBox /> */}
      {/*Icon and User*/}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full flex items-center justify-center cursor-pointer">
          <Link
            href="https://newmy.muic.io/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">MUIC Portal</Button>
          </Link>
        </div>
        {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div> */}
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* This is the trigger: avatar and name */}
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/vza.jpg" // Use your actual avatar path
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm leading-4 font-medium">VZA</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex items-center cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              // Add your sign out logic here, e.g., onClick={() => handleSignOut()}
            >
              <Link href="/" className="flex items-center cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hamburger Menu Button */}
        <button onClick={onMenuToggle} className="text-gray-600 lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
