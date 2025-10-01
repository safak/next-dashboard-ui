import Image from "next/image";
import Link from "next/link";

// const menuItems = [
//   {
//     title: "MENU",
//     items: [
//       {
//         icon: "/home.png",
//         label: "Home",
//         href: "/",
//         visible: ["resident", "technician", "admin"],
//       },
     
      
//       {
//         icon: "/parent.png",
//         label: "Parents",
//         href: "/list/parents",
//         visible: ["admin", "teacher"],
//       },
//       {
//         icon: "/subject.png",
//         label: "Subjects",
//         href: "/list/subjects",
//         visible: ["admin"],
//       },
//       {
//         icon: "/class.png",
//         label: "Classes",
//         href: "/list/classes",
//         visible: ["admin", "teacher"],
//       },
//       {
//         icon: "/lesson.png",
//         label: "Lessons",
//         href: "/list/lessons",
//         visible: ["admin", "teacher"],
//       },
//       {
//         icon: "/exam.png",
//         label: "Exams",
//         href: "/list/exams",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/assignment.png",
//         label: "Assignments",
//         href: "/list/assignments",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/result.png",
//         label: "Results",
//         href: "/list/results",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/attendance.png",
//         label: "Attendance",
//         href: "/list/attendance",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/calendar.png",
//         label: "Events",
//         href: "/list/events",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/message.png",
//         label: "Messages",
//         href: "/list/messages",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/announcement.png",
//         label: "Announcements",
//         href: "/list/announcements",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//     ],
//   },
//   {
//     title: "OTHER",
//     items: [
//       {
//         icon: "/profile.png",
//         label: "Profile",
//         href: "/profile",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/setting.png",
//         label: "Settings",
//         href: "/settings",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//       {
//         icon: "/logout.png",
//         label: "Logout",
//         href: "/logout",
//         visible: ["admin", "teacher", "student", "parent"],
//       },
//     ],
//   },
// ];

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/admin",
        visible: ["admin"], // Admin overview with summary stats
      },
      {
        icon: "/lesson.svg",
        label: "Manage Complaints",
        href: "/compliants",
        visible: ["admin"], // List, filter, assign, and review complaints
      },
      {
        icon: "/analytics.svg",
        label: "Analytics",
        href: "/analytics",
        visible: ["admin"], // View charts (categories, resolution times)
      },
      {
        icon: "/report.svg",
        label: "Reports",
        href: "/reports",
        visible: ["admin"], // Generate and download CSV reports
      },
      {
        icon: "/parent.png",
        label: "Manage Technicians",
        href: "/technicians",
        visible: ["admin"], // List and manage residents/technicians
      },
      {
        icon: "/bell.png",
        label: "Notifications",
        href: "/notifications",
        visible: ["admin"], // Configure SMS/push notifications
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin"], // View/edit admin profile
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin"], // Admin-specific settings
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/",
        visible: ["admin"], // Logout action
      },
      {
        icon: "/logout.png",
        label: "NotificationList",
        href: "/NotificationsList",
        visible: ["admin"], // Logout action
      },
    ],
  },
];
const Menu = () => {
  return(
    <div className="mt-4 text-sm">
      {menuItems.map(i=>(
        <div className="flex flex-col gap-2 " key={i.title}>
          <span className="hidden lg:block text-gray-500 font-light my-4">{i.title}</span>
          {i.items.map(item=>(
            <Link 
            href={item.href} 
            key={item.label}
            className="flex items-center justify-center lg:justify-start gap-4 text-gray-600 py-2 md:px-2 rounded-md hover:bg-slate-400">
            <Image src={item.icon} alt="" width={20} height={20}/>
            <span className="hidden lg:block">{item.label}</span>
            </Link>
            
          ))}
        </div>
      ))}

    </div>
  )
}
export default Menu