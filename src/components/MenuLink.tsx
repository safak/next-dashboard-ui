"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) => {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      title={label}
      aria-current={active ? "page" : undefined}
      className={`flex items-center justify-center lg:justify-start gap-3 py-2 md:px-2 lg:px-3 rounded-lg transition-colors ${
        active
          ? "bg-lamaSkyLight text-gray-900 font-medium"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      }`}
    >
      <Image src={icon} alt="" width={20} height={20} />
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
};

export default MenuLink;
