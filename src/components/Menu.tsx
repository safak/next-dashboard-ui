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
        icon: "/team-development.png",
        label: "Career Paths",
        href: "/",
        visible: ["student"],
      },
      {
        icon: "/bot .png",
        label: "Chatbot",
        href: "/",
        visible: ["student"],
      },
      {
        icon: "/interviewers.png",
        label: "Mock Interview",
        href: "/",
        visible: ["student"],
      },
      {
        icon: "/resume.png",
        label: "Resume Review",
        href: "/",
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
        visible: ["student"],
      },
      {
        icon: "/gear.png",
        label: "Settings",
        href: "/settings",
        visible: ["student"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["student"],
      },
    ],
  },
];

const Menu = ({ userType }: { userType: string }) => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="text-gray-400 font-light my-4">{section.title}</span>
          <div className="menu-items">
            {section.items
              .filter((item) => item.visible.includes(userType.toLowerCase()))
              .map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-start gap-4 text-gray-500 py-2"
                >
                  <div className="menu-item">
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span> {/* Show label on larger screens */}
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
