"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = (e.currentTarget[0] as HTMLInputElement).value;

    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    params.delete("page"); // a new search starts on page 1
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full bg-white ring-1 ring-gray-300 px-3 transition focus-within:ring-2 focus-within:ring-lamaPurple"
    >
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        type="search"
        aria-label="Search"
        defaultValue={searchParams.get("search") ?? ""}
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;
