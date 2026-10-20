"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface TableSearchProps {
  placeholder?: string;
}

const TableSearch = ({ placeholder = "Search..." }: TableSearchProps) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;

    const params = new URLSearchParams(window.location.search);
    value ? params.set("search", value) : params.delete("search");
    params.set("page", "1");

    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex items-center gap-1.5
        rounded-full ring-1 ring-gray-300
        px-2 py-1
        w-[140px] sm:w-[180px] md:w-[220px]
        transition-all
      "
    >
      <Image
        src="/search.png"
        alt="Search"
        width={14}
        height={14}
        className="opacity-60"
      />

      <input
        type="text"
        placeholder={placeholder}
        className="
          w-full bg-transparent outline-none
          text-xs sm:text-sm
        "
      />
    </form>
  );
};

export default TableSearch;
