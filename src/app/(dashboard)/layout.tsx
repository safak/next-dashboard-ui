'use client';
import { useState } from 'react';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="h-screen flex relative overflow-hidden">
      <div
        className="
            absolute -top-5 right-40 w-[500px] h-[500px] 
            bg-purple-300 rounded-full 
            blur-3xl opacity-40 z-[-1]
          "
      ></div>
      <div
        className={`
            bg-white border-r border-gray-200 flex flex-col h-full z-20
            transform transition-transform duration-300 ease-in-out
            fixed w-60 lg:relative lg:translate-x-0
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
      >
        <div className="flex justify-center h-14">
          <Link href="/overview">
            <Image src="/muiclogo.png" alt="logo" width={230} height={150} />
          </Link>
        </div>
        <Menu />
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="border-b border-gray-200 h-14 bg-white">
          <Navbar onMenuToggle={toggleMenu} />
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
