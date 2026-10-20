import prisma from "@/lib/prisma";

import PromotionSummary from "./components/PromotionSummary";
import PromotionClient from "./PromotionClient";

export default async function PromotionPage() {
  const academicYears = await prisma.academicYear.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      label: true,
      isActive: true,
    },
  });

  return (
    <div className="space-y-6">
      <PromotionSummary />

      <PromotionClient academicYears={academicYears} />
    </div>
  );
}