import Link from "next/link";
import Image from "next/image";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["student"],
      },
      {
        icon: "/close.png",
        label: "Career Paths",
        href: "/list/teachers",
        visible: ["student"],
      },
      {
        icon: "/attendance.png",
        label: "Chatbot",
        href: "/list/students",
        visible: ["student"],
      },
      {
        icon: "/class.png",
        label: "Mock Interview",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/assignment.png",
        label: "Resume Review",
        href: "/list/assignments",
        visible: ["student"],
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

const Menu = ({ userType }: { userType: string }) => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="menu-flex flex=col gap=2" key={section.title}>
          <span className="hidden lg:block text-gray-400  fony-light my-4">{section.title}</span>
          <div className="menu-items">
            {section.items
              .filter((item) => item.visible.includes(userType.toLowerCase()))
              .map((item) => (
                <Link href={item.href} key={item.label} className="flex items-center justify-center lg:jutify-start gap-4 text-gray-500 py2">
                  <div className="menu-item">
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden">{item.label}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
