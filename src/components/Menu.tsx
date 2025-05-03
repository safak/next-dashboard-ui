const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "therapist", "patient", "user"],
      },
      {
        icon: "/teacher.png",
        label: "Therapists",
        href: "/list/therapists",
        visible: ["admin", "therapist", "patient"],
      },
      {
        icon: "/subject.png",
        label: "Appointments",
        href: "/list/appointments",
        visible: ["therapist"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Calendar",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

import { role } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Menu = () => {
  return (
    <div>
      {menuItems.map(i => 
        <div className='flex flex-col gap-2' key={i.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>{i.title}</span>
          {i.items.map(item => {
            if(item.visible.includes(role)) {
              return (
                <Link href={item.href} key={item.label} className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-upliftSkyLight'>
                  <Image src={item.icon} alt='' width={20} height={20}/>
                  <span className='hidden lg:block'>{item.label}</span>
                </Link>
              )
            }
          })}
        </div>
      )}
    </div>
  )
}

export default Menu