import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";
import { UserSex } from "@/generated/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === UserSex.Male)?._count || 0;
  const girls = data.find((d) => d.sex === UserSex.Female)?._count || 0;

  return (
    <div className="relative w-full h-[85%] rounded-xl bg-white p-4">
          {/* TITLE */}
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Student</h1>
            <Image src="/uploads/moreDark.png" alt="" width={20} height={20} />
          </div>
      {/* CHART */}
      <CountChart boys={boys} girls={girls} />
      <Image
        src="/uploads/maleFemale.png"
        alt=""
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      {/* BOTTOM */}
<div className="flex justify-center gap-24">
        <div className="felx flex-col gap-1 text-center">
          <div className="w-5 h-5 bg-kalasaSky rounded-full">
            <h1 className="font-bold">{boys}</h1>
            <h2 className="text-xs text-gray-300"> Boys ({Math.round((boys / (boys + girls)) * 100)}%)</h2>
          </div>
        </div>
        <div className="felx flex-col gap-1 text-center">
          <div className="w-5 h-5 bg-kalasaYellow rounded-full">
            <h1 className="font-bold">{girls}</h1>
            <h2 className="text-xs text-gray-300">Girls ({Math.round((girls / (boys + girls)) * 100)}%)</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
