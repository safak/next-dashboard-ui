import Menu from "@/components/Menu"; // Ensure the correct path to the `Menu` component
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
  userType, // Usertype should be students and students only
  // Menu icons aren't displaying due to this
}: Readonly<{
  children: React.ReactNode;
  userType: string; // Add userType prop to DashboardLayout
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[14%] xl:w-[14%] bg-red-200 p-4">
        <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">AspireAI</span>
        </Link>
        <Menu userType={userType} /> {/* Pass userType to Menu */}
      </div>

      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-blue-200">
        {children}
      </div>
    </div>
  );
}
