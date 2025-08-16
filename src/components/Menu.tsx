import Link from "next/link";
import Image from "next/image";
import { menuItems } from "@/constants/menuItems";
import { role } from "@/lib/data";

const Menu = () => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      {menuItems.map((i) => (
        <div
          key={i.title}
          className="flex flex-col gap-2 items-center lg:items-start w-full"
        >
          <span className="hidden md:block text-gray-400 font-light">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex w-full items-center justify-center rounded-md md:justify-start md:p-2 gap-4 py-2 hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block text-gray-400 font-light">
                    {item.label}
                  </span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
