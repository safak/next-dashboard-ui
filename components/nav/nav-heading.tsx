"use client";

import { usePathname } from "next/navigation";

const NavHeading = () => {
  const pathname = usePathname();
  let path = pathname.split("/").at(-1);
  if (path && path.length > 12) path = pathname.split("/").at(-2);

  return (
    <h1 className="ms-10 text-3xl font-bold capitalize lg:ms-0">
      {path?.replace("-", " ")}
    </h1>
  );
};

export default NavHeading;