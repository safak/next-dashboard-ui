import Image from "next/image";
import { signOut } from "@/lib/authActions";

const MenuLogout = () => {
  return (
    <form action={signOut}>
      <button
        type="submit"
        title="Logout"
        className="flex items-center justify-center lg:justify-start gap-3 text-gray-500 py-2 md:px-2 lg:px-3 rounded-lg transition-colors hover:bg-red-50 hover:text-red-600 w-full"
      >
        <Image src="/logout.png" alt="" width={20} height={20} />
        <span className="hidden lg:block">Logout</span>
      </button>
    </form>
  );
};

export default MenuLogout;
