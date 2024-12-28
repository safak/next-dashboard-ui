export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-screen flex">
    {/** Sidebar */}
    <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gray-800 text-white">
      Sidebar
    </div>
    {/** Content */}
    <div className="w-[86%] md:w-[92%] lg:[84%] xl:w-[86%] bg-gray-200">
      {children}
    </div>
  </div>
}
