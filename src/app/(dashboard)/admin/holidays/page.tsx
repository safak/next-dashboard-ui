import prisma from "@/lib/prisma";

import HolidaysDashboard from "./components/HolidaysDashboard";

export default async function HolidaysPage() {
  const holidays = await prisma.holiday.findMany({
    orderBy: {
      date: "desc",
    },
  });

  return <HolidaysDashboard holidays={holidays} />;
}