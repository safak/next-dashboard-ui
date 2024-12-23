import Link from "next/link";
import Image from "next/image";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard/student",
        visible: ["student"],
      },
      {
        icon: "/team-development.png",
        label: "Career Paths",
        href: "/dashboard/student/careerpath",
        visible: ["student"],
      },
      {
        icon: "/bot .png",
        label: "Chatbot",
        href: "/chatbot",
        visible: ["student"],
      },
      {
        icon: "/interviewers.png",
        label: "Mock Interview",
        href: "/mock-interview",
        visible: ["student"],
      },
      {
        icon: "/resume.png",
        label: "Resume Review",
        href: "/resume-review",
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
          {/* Title for the section */}
          <span className="text-gray-400 font-bold my-4">{section.title}</span>
          <div className="menu-items">
            {section.items
              .filter((item) => item.visible.includes(userType.toLowerCase()))
              .map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-start gap-4 text-white font-bold py-2 hover:text-blue-500"
                >
                  <div className="menu-item">
                    <Image src={item.icon} alt={item.label} width={20} height={20} />
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
